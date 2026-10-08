// O desempenho do mundo como num celular intermediário: tela 390 x 844, toque
// e o processador limitado pelo Chrome DevTools Protocol
// (Emulation.setCPUThrottlingRate, 4x e 6x). Rola o mundo com o dedo (toques
// de verdade, arrastos rápidos que soltam no embalo) de ponta a ponta, ida e
// volta, de dia e de noite (?hora=22), e mede durante a rolagem:
// - quadros por segundo (requestAnimationFrame) e quadros longos (acima de 50 ms);
// - tarefas longas (PerformanceObserver "longtask");
// - o tempo de JavaScript por quadro nos callbacks de animação (o Framer e os
//   ganchos do mundo rodam ali);
// - quantas animações estão rodando ao mesmo tempo e quantos nós o SVG tem;
// - quantas vezes a árvore de camadas muda com o mundo parado (antes da rodada
//   40, o mapa era recomposto a cada quadro mesmo sem ninguém rolar).
// As animações no automático (como chega quem nunca mexeu no menu): uma
// rolagem de aquecimento ("os primeiros segundos") decide, e se a rolagem não
// aguenta, o modo leve liga sozinho antes da medida. Em 4x, o automático
// mantém as completas; num aparelho bem mais fraco (12x, só de dia), liga o
// leve.
// E as ilhas não somem (rodada 40; o sumiço visto num Android): em pé, com o
// processador em 6x, de noite, a tela de 3x e a memória de vídeo de um
// celular de entrada (--force-gpu-mem-available-mb), arrastos rápidos ida e
// volta, três vezes; a cada parada, toda ilha com o nome na tela tem o nome e
// a arte desenhados e o mar não tem buraco. O sumiço era isso: camadas do
// tamanho do mundo (as ondas, os grupos) gastavam a memória de vídeo, e o que
// ficava sem memória (os nomes, a arte) não era pintado.
// Uso: node testes/desempenho-mundo.mjs            (confere os limites)
//      MEDIR=1 node testes/desempenho-mundo.mjs    (só imprime os números)
//      RITMOS=4 HORAS=12 ANIMACOES=leves ...       (um cenário só, sem as paradas)
//      PARADAS=1 node testes/desempenho-mundo.mjs  (só as paradas)
import { readFileSync } from "node:fs";
import { obrigatoriasProntasDaIlha, PUBLICADAS } from "./curriculo.mjs";
import { corEmRgb, lerPng } from "./png.mjs";
import { abrir, arrastarComODedo, conferir, errosRelevantes } from "./util.mjs";

const SO_MEDIR = Boolean(process.env.MEDIR);
const ANIMACOES = process.env.ANIMACOES ?? "auto";
const SO_PARADAS = Boolean(process.env.PARADAS);
// Os cenários: 4x e 6x, de dia e de noite; e o aparelho bem mais fraco (12x, de dia), só no automático.
const CENARIOS = (process.env.RITMOS ?? "4,6")
  .split(",")
  .map(Number)
  .flatMap((ritmo) => (process.env.HORAS ?? "12,22").split(",").map((hora) => [ritmo, Number(hora)]));
if (!process.env.RITMOS && ANIMACOES === "auto") CENARIOS.push([12, 12]);
if (SO_PARADAS) CENARIOS.length = 0;

// Quem está no meio da Lógica (o mesmo progresso do mundo.mjs): ilhas abertas, em obra e bloqueadas.
const prontas = [...obrigatoriasProntasDaIlha("sites"), ...obrigatoriasProntasDaIlha("logica")]
  .map((unidade) => unidade.id)
  .filter((id) => !["logica-depuracao-u5", "logica-depuracao-u6", "logica-programa-de-verdade-u1"].includes(id));
const ferramentas = [...readFileSync(new URL("../src/ferramentas/ids.ts", import.meta.url), "utf8").matchAll(/^ {2}"([a-z-]+)",$/gm)].map((m) => m[1]);
const temas = [...readFileSync(new URL("../src/curriculo/temas.ts", import.meta.url), "utf8").matchAll(/id: "([a-z-]+)"/g)].map((m) => m[1]);
const progresso = {
  versao: 2,
  fasesConcluidas: prontas.flatMap((id) => PUBLICADAS[id] ?? []),
  estrelasPorFase: {},
  fasesEmAndamento: {},
  faseAtual: "logica-depuracao-u5-f1",
  tema: "doce",
  temasDesbloqueados: ["doce"],
  som: false,
  missoesDeCampo: {},
  apresentacoesVistas: ferramentas,
  metasVistas: prontas,
  unidadesComemoradas: prontas,
  ilhasComemoradas: ["sites"],
  posicaoNoMapa: {},
  mapaDesbloqueado: false,
  proporcaoPrevia: 0.4,
  marcosInsignias: Object.fromEntries(temas.map((tema) => [tema, 100])),
};

/** O que roda dentro da página: o relógio dos quadros, as tarefas longas e o tempo de JS nos callbacks de animação. */
function instrumentar() {
  if (window !== window.top) return;
  const estado = { gravando: false, quadros: [], js: [], longas: [], ultimo: 0 };
  window.__desempenho = estado;
  // Embrulha o requestAnimationFrame: soma o tempo de cada callback (o Framer, os ganchos) por quadro.
  const original = window.requestAnimationFrame.bind(window);
  let jsDoQuadro = 0;
  window.requestAnimationFrame = (callback) =>
    original((tempo) => {
      const inicio = performance.now();
      try {
        callback(tempo);
      } finally {
        jsDoQuadro += performance.now() - inicio;
      }
    });
  const relogio = (tempo) => {
    if (estado.gravando) {
      if (estado.ultimo) estado.quadros.push(tempo - estado.ultimo);
      estado.js.push(jsDoQuadro);
    }
    jsDoQuadro = 0;
    estado.ultimo = tempo;
    original(relogio);
  };
  original(relogio);
  try {
    new PerformanceObserver((lista) => {
      if (estado.gravando) for (const entrada of lista.getEntries()) estado.longas.push(entrada.duration);
    }).observe({ type: "longtask", buffered: false });
  } catch {
    // Sem a API de tarefas longas: conta só os quadros.
  }
}

/**
 * Uma passada de rolagem com o dedo: do começo ao fim e de volta, duas vezes
 * (ou `voltas`), em arrastos rápidos que soltam no embalo, um atrás do outro,
 * como quem procura uma ilha. Devolve quantos px rolou.
 */
async function rolar(cdp, pagina, voltas = 2) {
  const area = pagina.locator("[data-area-arrastavel]");
  const caixa = await area.boundingBox();
  const fim = await area.evaluate((el) => el.scrollWidth - el.clientWidth);
  const y = Math.round(caixa.y + caixa.height / 2);
  let rolado = 0;
  let posicao = await area.evaluate((el) => el.scrollLeft);
  for (let volta = 0; volta < voltas; volta++) {
    for (const sentido of [1, -1]) {
      // Para a direita (sentido 1), o dedo anda para a esquerda.
      for (let arrasto = 0; arrasto < 30; arrasto++) {
        if (sentido === 1 ? posicao >= fim - 2 : posicao <= 2) break;
        await arrastarComODedo(cdp, { x: sentido === 1 ? caixa.x + caixa.width - 40 : caixa.x + 40, y, dx: -sentido * (caixa.width - 120) });
        await pagina.waitForTimeout(260);
        const agora = await area.evaluate((el) => el.scrollLeft);
        rolado += Math.abs(agora - posicao);
        posicao = agora;
      }
    }
  }
  return rolado;
}

/** Quantas vezes a árvore de camadas muda em `ms` (o mundo parado). */
async function mudancasDeCamadas(cdp, pagina, ms) {
  let mudancas = 0;
  const contar = () => mudancas++;
  cdp.on("LayerTree.layerTreeDidChange", contar);
  await cdp.send("LayerTree.enable");
  await pagina.waitForTimeout(300);
  mudancas = 0;
  await pagina.waitForTimeout(ms);
  const total = mudancas;
  await cdp.send("LayerTree.disable");
  cdp.off("LayerTree.layerTreeDidChange", contar);
  return total;
}

/** Um cenário: o ritmo do processador, a hora e as animações. Devolve os números. */
async function medir(ritmo, hora, animacoes) {
  const extra = { animacoes };
  const { navegador, contexto, pagina, erros } = await abrir({
    largura: 390,
    altura: 844,
    toque: true,
    escala: 2,
    progresso: { ...progresso, ...extra },
    rota: `/?hora=${hora}`,
    esperar: "[data-mapa=mundo]",
  });
  // A instrumentação entra antes dos scripts do jogo (o Framer guarda o requestAnimationFrame ao carregar).
  await contexto.addInitScript(instrumentar);
  await pagina.reload();
  await pagina.locator("[data-mascote-no-mapa]").waitFor();
  const cdp = await contexto.newCDPSession(pagina);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: ritmo });
  // Assenta (o aceno, as primeiras animações) e mede o mundo parado.
  await pagina.waitForTimeout(4500);
  const mudancasParado = await mudancasDeCamadas(cdp, pagina, 3000);
  // Os primeiros segundos rolando: no automático, o modo leve decide aqui.
  await rolar(cdp, pagina, 1);
  await pagina.waitForTimeout(800);
  await pagina.evaluate(() => {
    const estado = window.__desempenho;
    estado.gravando = true;
    estado.quadros = [];
    estado.js = [];
    estado.longas = [];
  });
  const inicio = Date.now();
  const rolado = await rolar(cdp, pagina);
  const duracao = Date.now() - inicio;
  // No meio de um arrasto, as animações do mundo param (data-rolando); sobram o barquinho e o logo da barra.
  const caixa = await pagina.locator("[data-area-arrastavel]").boundingBox();
  await arrastarComODedo(cdp, { x: caixa.x + caixa.width - 40, y: Math.round(caixa.y + caixa.height / 2), dx: -120, passos: 6 });
  const rodandoRolando = await pagina.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
  const percurso = await pagina.locator("[data-area-arrastavel]").evaluate((el) => el.scrollWidth - el.clientWidth);
  const numeros = await pagina.evaluate(() => {
    const estado = window.__desempenho;
    estado.gravando = false;
    const quadros = estado.quadros;
    const soma = quadros.reduce((a, b) => a + b, 0);
    const ordenados = [...quadros].sort((a, b) => a - b);
    const js = [...estado.js].sort((a, b) => a - b);
    const desenho = document.querySelector("[data-mundo-desenho]");
    return {
      fps: soma ? (quadros.length / soma) * 1000 : 0,
      p95: ordenados[Math.floor(ordenados.length * 0.95)] ?? 0,
      longos: quadros.filter((q) => q > 50).length,
      acima20: quadros.filter((q) => q > 20).length / Math.max(1, quadros.length),
      tarefasLongas: estado.longas.length,
      tempoTarefasLongas: estado.longas.reduce((a, b) => a + b, 0),
      jsPorQuadro: js.length ? js.reduce((a, b) => a + b, 0) / js.length : 0,
      jsP95: js[Math.floor(js.length * 0.95)] ?? 0,
      animando: document.getAnimations().filter((a) => a.playState === "running").length,
      nosSvg: desenho ? desenho.querySelectorAll("svg *").length : 0,
      nos: desenho ? desenho.querySelectorAll("*").length : 0,
      modo: document.querySelector("[data-mapa=mundo]")?.getAttribute("data-animacoes") ?? "?",
    };
  });
  const camadas = await (async () => {
    try {
      let total = 0;
      cdp.on("LayerTree.layerTreeDidChange", ({ layers }) => (total = layers?.length ?? total));
      await cdp.send("LayerTree.enable");
      await pagina.waitForTimeout(300);
      await cdp.send("LayerTree.disable");
      return total;
    } catch {
      return -1;
    }
  })();
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  const relevantes = errosRelevantes(erros);
  await navegador.close();
  return { ritmo, hora, animacoes, duracao, rolado, percurso, rodandoRolando, camadas, mudancasParado, erros: relevantes, ...numeros };
}

/** Duas cores parecidas (soma das diferenças dos canais). */
const perto = (a, b, folga) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) <= folga;

/** Numa captura (png), a parte dos pixels do retângulo (px da página) que passa no teste. */
function parteDosPixels(png, escala, retangulo, teste) {
  let sim = 0;
  let total = 0;
  for (let y = Math.round(retangulo.y * escala); y < (retangulo.y + retangulo.height) * escala; y += 2) {
    for (let x = Math.round(retangulo.x * escala); x < (retangulo.x + retangulo.width) * escala; x += 2) {
      if (x < 0 || y < 0 || x >= png.largura || y >= png.altura) continue;
      total++;
      if (teste(png.pixel(x, y))) sim++;
    }
  }
  return total ? sim / total : 0;
}

/** Memória de vídeo de um celular de entrada (MB), onde a versão antiga perdia os nomes. */
const MEMORIA_DE_VIDEO = 40;

/**
 * As ilhas não somem: em pé, de noite, processador em 6x, tela de 3x e a
 * memória de vídeo de um celular de entrada. Arrastos rápidos que soltam no
 * embalo, ida e volta, três vezes; a cada parada, uma captura. Depois, um
 * navegador sem limites e sem movimento tira a mesma cena em cada parada,
 * com e sem a arte das ilhas: onde as duas diferem, a captura tem que
 * parecer a com arte.
 */
async function paradas() {
  const escala = 3;
  const cena = { largura: 390, altura: 844, toque: true, escala, progresso: { ...progresso, animacoes: "completas" }, rota: "/?hora=22", esperar: "[data-mapa=mundo]" };
  const { navegador, contexto, pagina, erros } = await abrir({ ...cena, argumentos: [`--force-gpu-mem-available-mb=${MEMORIA_DE_VIDEO}`] });
  await pagina.locator("[data-mascote-no-mapa]").waitFor();
  const cdp = await contexto.newCDPSession(pagina);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 6 });
  await pagina.waitForTimeout(3000);
  const area = pagina.locator("[data-area-arrastavel]");
  const caixa = await area.boundingBox();
  const fim = await area.evaluate((el) => el.scrollWidth - el.clientWidth);
  const y = Math.round(caixa.y + caixa.height / 2);
  const MAR = corEmRgb(await pagina.evaluate(() => getComputedStyle(document.querySelector("[data-mapa=mundo]")).backgroundColor));
  const capturas = [];
  for (let volta = 0; volta < 3; volta++) {
    for (const sentido of [1, -1]) {
      for (let arrasto = 0; arrasto < 12; arrasto++) {
        const antes = await area.evaluate((el) => el.scrollLeft);
        if (sentido === 1 ? antes >= fim - 2 : antes <= 2) break;
        await arrastarComODedo(cdp, { x: sentido === 1 ? caixa.x + caixa.width - 40 : caixa.x + 40, y, dx: -sentido * (caixa.width - 120) });
        // A parada: o embalo acabou (a posição parou de mudar); a captura é na hora.
        let anterior = -1;
        let posicao = await area.evaluate((el) => el.scrollLeft);
        while (posicao !== anterior) {
          anterior = posicao;
          await pagina.waitForTimeout(100);
          posicao = await area.evaluate((el) => el.scrollLeft);
        }
        const cenaNaTela = await area.evaluate((el) => {
          const tela = el.getBoundingClientRect();
          const desenho = el.querySelector("[data-mundo-desenho]").getBoundingClientRect();
          const ilhas = [...el.querySelectorAll("[data-ilha]")].flatMap((link) => {
            const id = link.getAttribute("data-ilha");
            const nome = el.querySelector(`[data-nome-ilha="${id}"]`);
            const n = nome.getBoundingClientRect();
            const a = el.querySelector(`[data-ilha-arte="${id}"]`).getBoundingClientRect();
            // Só as ilhas com o nome inteiro na tela e a arte quase toda.
            if (n.left < tela.left || n.right > tela.right) return [];
            if (Math.min(a.right, tela.right) - Math.max(a.left, tela.left) < a.width * 0.6) return [];
            return [
              {
                id,
                nome: { x: n.left, y: n.top, width: n.width, height: n.height },
                fundoDoNome: getComputedStyle(nome).backgroundColor,
                // O miolo da arte (sem as bordas, onde fica o mar).
                arte: { x: a.left + a.width * 0.2, y: a.top + a.height * 0.15, width: a.width * 0.6, height: a.height * 0.55 },
              },
            ];
          });
          return { tela: { x: Math.max(desenho.left, tela.left), y: tela.top, width: Math.min(desenho.right, tela.right) - Math.max(desenho.left, tela.left), height: tela.height }, ilhas };
        });
        capturas.push({ posicao, ...cenaNaTela, png: lerPng(await pagina.screenshot()) });
      }
    }
  }
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  const relevantes = errosRelevantes(erros);
  await navegador.close();

  // As referências: a mesma cena com e sem a arte das ilhas (sem movimento), num navegador sem limites.
  // Cada captura espera o Chrome terminar de pintar (logo depois de rolar ou mudar o estilo, ela pode vir atrasada).
  const referencia = await abrir(cena);
  await referencia.pagina.emulateMedia({ reducedMotion: "reduce" });
  await referencia.pagina.locator("[data-mascote-no-mapa]").waitFor();
  const posicoes = [...new Set(capturas.map((captura) => captura.posicao))];
  const capturarReferencias = async () => {
    const porPosicao = new Map();
    for (const posicao of posicoes) {
      await referencia.pagina.locator("[data-area-arrastavel]").evaluate((el, x) => el.scrollTo(x, 0), posicao);
      await referencia.pagina.waitForTimeout(400);
      porPosicao.set(posicao, lerPng(await referencia.pagina.screenshot()));
    }
    return porPosicao;
  };
  const comArteEm = await capturarReferencias();
  await referencia.pagina.addStyleTag({ content: "[data-ilha-arte], [data-porto-arte] { visibility: hidden !important; }" });
  await referencia.pagina.waitForTimeout(400);
  const semArteEm = await capturarReferencias();
  await referencia.navegador.close();
  const distancia = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  const sumidas = [];
  let conferidas = 0;
  let buracos = 0;
  for (const captura of capturas) {
    const comArte = comArteEm.get(captura.posicao);
    const semArte = semArteEm.get(captura.posicao);
    // Buraco: um pedaço do mar sem pintar mostra o azul de fundo, que de noite nunca aparece.
    if (parteDosPixels(captura.png, escala, captura.tela, (cor) => perto(cor, MAR, 24)) > 0.01) buracos++;
    for (const ilha of captura.ilhas) {
      conferidas++;
      const fundo = corEmRgb(ilha.fundoDoNome);
      const nome = parteDosPixels(captura.png, escala, ilha.nome, (cor) => perto(cor, fundo, 40));
      // A arte: onde a cena com arte e a sem arte diferem, a captura tem que parecer a com arte.
      let comparados = 0;
      let parecidos = 0;
      for (let yy = Math.round(ilha.arte.y * escala); yy < (ilha.arte.y + ilha.arte.height) * escala; yy += 3) {
        for (let xx = Math.round(ilha.arte.x * escala); xx < (ilha.arte.x + ilha.arte.width) * escala; xx += 3) {
          if (xx < 0 || yy < 0 || xx >= captura.png.largura || yy >= captura.png.altura) continue;
          const [r1, r2, cor] = [comArte.pixel(xx, yy), semArte.pixel(xx, yy), captura.png.pixel(xx, yy)];
          if (distancia(r1, r2) <= 60) continue;
          comparados++;
          if (distancia(cor, r1) < distancia(cor, r2)) parecidos++;
        }
      }
      const arte = comparados ? parecidos / comparados : 0;
      if (nome < 0.35 || arte < 0.6) sumidas.push(`${ilha.id} em ${captura.posicao} px (nome ${(nome * 100).toFixed(0)}%, arte ${(arte * 100).toFixed(0)}%)`);
    }
  }
  return { paradas: capturas.length, conferidas, sumidas, buracos, erros: relevantes };
}

const fmt = (n) => (Number.isInteger(n) ? n : n.toFixed(1));
const resultados = [];
for (const [ritmo, hora] of CENARIOS) {
  const r = await medir(ritmo, hora, ANIMACOES);
  resultados.push(r);
  console.log(
    `${ritmo}x ${hora === 22 ? "noite" : "dia"} (${r.animacoes}, rolou ${r.rolado} px em ${(r.duracao / 1000).toFixed(1)} s): ${fmt(r.fps)} qps, p95 ${fmt(r.p95)} ms, ${r.longos} quadros > 50 ms, ${fmt(r.acima20 * 100)}% > 20 ms, ` +
      `${r.tarefasLongas} tarefas longas (${fmt(r.tempoTarefasLongas)} ms), JS ${fmt(r.jsPorQuadro)} ms/quadro (p95 ${fmt(r.jsP95)}), ` +
      `${r.animando} animações rodando, ${r.nosSvg} nós no SVG (${r.nos} no desenho), ${r.camadas} camadas, ` +
      `${r.mudancasParado} mudanças de camadas em 3 s parado, ${r.rodandoRolando} animações rodando no meio de um arrasto, modo ${r.modo}`,
  );
}

const semSumir = process.env.RITMOS ? null : await paradas();
if (semSumir) {
  console.log(
    `paradas (6x, noite, tela de 3x, ${MEMORIA_DE_VIDEO} MB de vídeo): ${semSumir.paradas} paradas, ${semSumir.conferidas} ilhas conferidas, ` +
      `${semSumir.sumidas.length} sem arte ou nome${semSumir.sumidas.length ? ` (${semSumir.sumidas.slice(0, 4).join("; ")})` : ""}, ${semSumir.buracos} paradas com buraco no mar`,
  );
}

if (!SO_MEDIR) {
  if (semSumir) {
    conferir(semSumir.erros.length === 0, `paradas: console limpo ${JSON.stringify(semSumir.erros)}`);
    conferir(semSumir.paradas >= 12 && semSumir.conferidas >= 12, `paradas: rolou de verdade, ida e volta (${semSumir.paradas} paradas, ${semSumir.conferidas} ilhas conferidas)`);
    conferir(semSumir.sumidas.length === 0, `paradas: a cada parada, toda ilha na tela tem arte e nome ${semSumir.sumidas.slice(0, 4).join("; ")}`);
    conferir(semSumir.buracos === 0, `paradas: o mar não tem buraco (${semSumir.buracos} paradas com o fundo aparecendo)`);
  }
  for (const r of resultados) {
    const nome = `${r.ritmo}x ${r.hora === 22 ? "noite" : "dia"}`;
    conferir(r.erros.length === 0, `${nome}: console limpo ${JSON.stringify(r.erros)}`);
    // A medida só vale rolando de verdade: duas idas e voltas de ponta a ponta.
    conferir(r.rolado >= r.percurso * 3.5, `${nome}: o dedo rolou o mundo de ponta a ponta, ida e volta (${r.rolado} px)`);
    // Rolando, o mundo para de se mexer (cada animação custa um recálculo por quadro); uma classe animada nova fora das listas do globals.css apareceria aqui.
    conferir(r.rodandoRolando <= 3, `${nome}: no meio de um arrasto, as animações do mundo param (${r.rodandoRolando} rodando)`);
    // Parado, nada obriga o Chrome a recompor as camadas a cada quadro (antes: uma vez por quadro, 40 por segundo).
    conferir(r.mudancasParado <= 45, `${nome}: parado, a árvore de camadas quase não muda (${r.mudancasParado} vezes em 3 s)`);
    if (r.animacoes !== "auto") conferir(r.modo === r.animacoes, `${nome}: as animações escolhidas valem (${r.modo})`);
    if (r.ritmo === 4) {
      // Perto de 60 quadros por segundo na maior parte do tempo, sem travadas visíveis.
      conferir(r.fps >= 50, `${nome}: a rolagem fica perto de 60 quadros por segundo (${fmt(r.fps)})`);
      conferir(r.acima20 <= 0.2, `${nome}: a maior parte dos quadros dentro do tempo (${fmt(r.acima20 * 100)}% acima de 20 ms)`);
      conferir(r.longos <= 2, `${nome}: sem travadas visíveis (${r.longos} quadros acima de 50 ms)`);
      // Num celular intermediário, o automático não tira a riqueza do mundo.
      if (r.animacoes === "auto") conferir(r.modo === "completas", `${nome}: o automático mantém as animações completas (${r.modo})`);
    } else if (r.ritmo === 6) {
      // Em 6x, jogável: o modo leve liga sozinho se precisar.
      conferir(r.fps >= 40, `${nome}: a rolagem fica jogável (${fmt(r.fps)} quadros por segundo, modo ${r.modo})`);
      conferir(r.longos <= 6, `${nome}: poucas travadas (${r.longos} quadros acima de 50 ms)`);
    } else if (r.animacoes === "auto") {
      // Num aparelho bem mais fraco, a rolagem trava nos primeiros segundos e o modo leve liga sozinho.
      conferir(r.modo === "leves", `${nome}: num aparelho bem mais fraco, o modo leve liga sozinho (${r.modo})`);
    }
  }
}
