// O desempenho do mundo como num celular intermediário: tela 390 x 844, toque
// e o processador limitado pelo Chrome DevTools Protocol
// (Emulation.setCPUThrottlingRate, 4x e 6x). Rola o mundo com o dedo (o gesto
// de rolagem do próprio Chrome, pelo compositor) de ponta a ponta, ida e volta,
// de dia e de noite (?hora=22), e mede durante a rolagem:
// - quadros por segundo (requestAnimationFrame) e quadros longos (acima de 50 ms);
// - tarefas longas (PerformanceObserver "longtask");
// - o tempo de JavaScript por quadro nos callbacks de animação (o Framer e os
//   ganchos do mundo rodam ali);
// - quantas animações estão rodando ao mesmo tempo e quantos nós o SVG tem.
// Também confere o modo leve: em 6x, ele liga sozinho se a rolagem não aguenta.
// Uso: node testes/desempenho-mundo.mjs            (confere os limites)
//      MEDIR=1 node testes/desempenho-mundo.mjs    (só imprime os números)
import { readFileSync } from "node:fs";
import { obrigatoriasProntasDaIlha, PUBLICADAS } from "./curriculo.mjs";
import { abrir, conferir, errosRelevantes } from "./util.mjs";

const SO_MEDIR = Boolean(process.env.MEDIR);
const RITMOS = (process.env.RITMOS ?? "4,6").split(",").map(Number);
const HORAS = (process.env.HORAS ?? "12,22").split(",").map(Number);

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

/** Uma passada de rolagem com o dedo: do começo ao fim e de volta, duas vezes. */
async function rolar(cdp, pagina) {
  const area = await pagina.locator("[data-area-arrastavel]").boundingBox();
  const largura = await pagina.locator("[data-area-arrastavel]").evaluate((el) => el.scrollWidth - el.clientWidth);
  const meio = { x: Math.round(area.x + area.width / 2), y: Math.round(area.y + area.height / 2) };
  for (let volta = 0; volta < 2; volta++) {
    for (const sentido of [-1, 1]) {
      await cdp.send("Input.synthesizeScrollGesture", {
        x: meio.x,
        y: meio.y,
        xDistance: sentido * (largura + 200),
        yDistance: 0,
        speed: 1600,
        gestureSourceType: "touch",
        repeatCount: 1,
        preventFling: true,
      });
    }
  }
}

/** Um cenário: o ritmo do processador e a hora. Devolve os números. */
async function medir(ritmo, hora, { leve = null } = {}) {
  const extra = leve === null ? {} : { animacoes: leve ? "leves" : "completas" };
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
  // Assenta (o aceno, as primeiras animações e, se for o caso, o modo leve decidindo sozinho).
  await pagina.waitForTimeout(4500);
  await pagina.evaluate(() => {
    const estado = window.__desempenho;
    estado.gravando = true;
    estado.quadros = [];
    estado.js = [];
    estado.longas = [];
  });
  const inicio = Date.now();
  await rolar(cdp, pagina);
  const duracao = Date.now() - inicio;
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
  return { ritmo, hora, duracao, camadas, erros: relevantes, ...numeros };
}

const fmt = (n) => (Number.isInteger(n) ? n : n.toFixed(1));
const resultados = [];
for (const ritmo of RITMOS) {
  for (const hora of HORAS) {
    const r = await medir(ritmo, hora);
    resultados.push(r);
    console.log(
      `${ritmo}x ${hora === 22 ? "noite" : "dia"}: ${fmt(r.fps)} qps, p95 ${fmt(r.p95)} ms, ${r.longos} quadros > 50 ms, ${fmt(r.acima20 * 100)}% > 20 ms, ` +
        `${r.tarefasLongas} tarefas longas (${fmt(r.tempoTarefasLongas)} ms), JS ${fmt(r.jsPorQuadro)} ms/quadro (p95 ${fmt(r.jsP95)}), ` +
        `${r.animando} animações rodando, ${r.nosSvg} nós no SVG (${r.nos} no desenho), ${r.camadas} camadas, modo ${r.modo}`,
    );
  }
}

if (!SO_MEDIR) {
  for (const r of resultados) {
    const nome = `${r.ritmo}x ${r.hora === 22 ? "noite" : "dia"}`;
    conferir(r.erros.length === 0, `${nome}: console limpo ${JSON.stringify(r.erros)}`);
    if (r.ritmo === 4) {
      // Perto de 60 quadros por segundo na maior parte do tempo, sem travadas visíveis.
      conferir(r.fps >= 50, `${nome}: a rolagem fica perto de 60 quadros por segundo (${fmt(r.fps)})`);
      conferir(r.acima20 <= 0.2, `${nome}: a maior parte dos quadros dentro do tempo (${fmt(r.acima20 * 100)}% acima de 20 ms)`);
      conferir(r.longos <= 2, `${nome}: sem travadas visíveis (${r.longos} quadros acima de 50 ms)`);
    } else {
      // Em 6x, jogável: o modo leve liga sozinho se precisar.
      conferir(r.fps >= 40, `${nome}: a rolagem fica jogável (${fmt(r.fps)} quadros por segundo, modo ${r.modo})`);
      conferir(r.longos <= 6, `${nome}: poucas travadas (${r.longos} quadros acima de 50 ms)`);
    }
  }
}
