// O mundo no celular (e nos outros layouts): as ilhas cabem na altura com
// margens equilibradas, Frameworks e as plaquinhas aparecem inteiras, e, rolando
// o mundo de ponta a ponta e de volta, toda ilha que aparece na tela tem a arte
// desenhada e o nome legível. Também confere a causa do sumiço visto num
// Android: nada animado pode obrigar o Chrome a repintar o mapa inteiro a cada
// quadro (as ondas e os brilhos andam pelo compositor; fora da tela, parado).
// Uso: node testes/mundo.mjs [desktop|retrato|paisagem]
import { readFileSync } from "node:fs";
import { obrigatoriasProntasDaIlha, PUBLICADAS } from "./curriculo.mjs";
import { corEmRgb, lerPng } from "./png.mjs";
import { abrir, conferir, doisQuadros, errosRelevantes, URL_JOGO } from "./util.mjs";

const MODO = process.argv[2] ?? "retrato";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { largura, altura, toque } = TAMANHOS[MODO];

// Quem está no meio da Lógica (como no celular em que o sumiço apareceu), com o Porto da revisão no mapa.
const prontas = [...obrigatoriasProntasDaIlha("sites"), ...obrigatoriasProntasDaIlha("logica")]
  .map((unidade) => unidade.id)
  .filter((id) => !["logica-depuracao-u5", "logica-depuracao-u6", "logica-programa-de-verdade-u1"].includes(id));
const ferramentas = [...readFileSync(new URL("../src/ferramentas/ids.ts", import.meta.url), "utf8").matchAll(/^ {2}"([a-z-]+)",$/gm)].map((m) => m[1]);
const hoje = new Date().toISOString().slice(0, 10);
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
  revisao: { conceitos: { tag: { nivel: 2, proxima: hoje, vezes: 1, ultima: null } }, sequencia: { atual: 0, melhor: 0, ultimoDia: null } },
};

const { navegador, contexto, pagina, erros } = await abrir({ largura, altura, toque, progresso, rota: "/", esperar: "[data-mapa=mundo]" });
const area = pagina.getByRole("region", { name: /Mapa do mundo/ });
await pagina.locator("[data-mascote-no-mapa=logica]").waitFor();
await pagina.evaluate(() => document.fonts.ready);
await doisQuadros(pagina);

// ------------------------------------------------ cabe na altura, centralizado
const medidas = await area.evaluate((el) => {
  const caixa = el.getBoundingClientRect();
  const sobrando = [...el.querySelectorAll("*")]
    .filter((filho) => filho.getBoundingClientRect().bottom > caixa.bottom + 1)
    .map((filho) => `${filho.tagName.toLowerCase()}${[...filho.attributes].filter((a) => a.name.startsWith("data-")).map((a) => `[${a.name}=${a.value}]`).join("")}`);
  return { sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight, sobrando: sobrando.slice(0, 4) };
});
conferir(medidas.sh <= medidas.ch + 1, `${MODO}: o mundo cabe na altura, sem rolar para baixo (${medidas.sh} <= ${medidas.ch}) ${medidas.sobrando.join(" ")}`);
if (MODO !== "desktop") conferir(medidas.sw > medidas.cw, `${MODO}: e rola de lado (${medidas.sw} > ${medidas.cw})`);

/** Topo e base do que está desenhado (artes e etiquetas de todas as ilhas e do Porto), relativos à área. */
const limites = await area.evaluate((el) => {
  const caixa = el.getBoundingClientRect();
  const partes = [...el.querySelectorAll("[data-ilha-arte], [data-etiqueta-ilha], [data-porto] > span, [data-porto-arte]")];
  const caixas = partes.map((parte) => parte.getBoundingClientRect()).filter((r) => r.height > 0);
  return { topo: Math.min(...caixas.map((r) => r.top)) - caixa.top, base: caixa.bottom - Math.max(...caixas.map((r) => r.bottom)), altura: caixa.height };
});
conferir(limites.topo >= 6 && limites.base >= 6, `${MODO}: nada encosta nas bordas (margem em cima ${limites.topo.toFixed(0)} px, embaixo ${limites.base.toFixed(0)} px)`);
conferir(
  Math.abs(limites.topo - limites.base) <= Math.max(40, limites.altura * 0.08),
  `${MODO}: margens equilibradas em cima e embaixo (${limites.topo.toFixed(0)} e ${limites.base.toFixed(0)} px)`,
);

// Frameworks e as plaquinhas dela ("Opcional" e o estado) inteiras na tela, depois de rolar até ela.
await area.evaluate((el) => {
  const ilha = el.querySelector('[data-ilha="frameworks"]').getBoundingClientRect();
  const caixa = el.getBoundingClientRect();
  el.scrollTo({ left: el.scrollLeft + ilha.left + ilha.width / 2 - caixa.left - caixa.width / 2, top: 0 });
});
await doisQuadros(pagina);
const frameworks = await area.evaluate((el) => {
  const caixa = el.getBoundingClientRect();
  const dentro = (r) => r.top >= caixa.top - 0.5 && r.bottom <= caixa.bottom + 0.5 && r.left >= caixa.left - 0.5 && r.right <= caixa.right + 0.5;
  const etiqueta = el.querySelector('[data-etiqueta-ilha="frameworks"]');
  const plaquinhas = [...etiqueta.querySelectorAll("span")];
  const arte = el.querySelector('[data-ilha-arte="frameworks"]').getBoundingClientRect();
  return { arte: dentro(arte), etiqueta: dentro(etiqueta.getBoundingClientRect()), plaquinhas: plaquinhas.every((p) => dentro(p.getBoundingClientRect())), texto: etiqueta.textContent };
});
conferir(frameworks.texto.includes("Opcional"), `${MODO}: Frameworks com a plaquinha Opcional`);
conferir(frameworks.arte && frameworks.etiqueta && frameworks.plaquinhas, `${MODO}: Frameworks, o nome e as plaquinhas cabem inteiros na tela (${JSON.stringify(frameworks)})`);

// ------------------------------------------------ rolar e conferir cada ilha visível
const estilo = await pagina.evaluate(() => {
  const css = getComputedStyle(document.querySelector("[data-mapa=mundo]"));
  return { mar: css.backgroundColor, onda: getComputedStyle(document.documentElement).getPropertyValue("--cor-onda") };
});
const MAR = corEmRgb(estilo.mar);
const ONDA = corEmRgb(estilo.onda);
const perto = (a, b, folga = 40) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) <= folga;
/** Parte dos pixels do recorte que não são mar nem onda (nem a mistura dos dois). */
async function desenhado(recorte) {
  const png = lerPng(await pagina.screenshot({ clip: recorte }));
  let fora = 0;
  let total = 0;
  for (let y = 0; y < png.altura; y += 2) {
    for (let x = 0; x < png.largura; x += 2) {
      const cor = png.pixel(x, y);
      const mistura = [0, 1, 2].map((i) => (MAR[i] + ONDA[i]) / 2);
      if (!perto(cor, MAR) && !perto(cor, ONDA) && !perto(cor, mistura)) fora++;
      total++;
    }
  }
  return total ? fora / total : 0;
}

const passo = Math.max(120, Math.round(medidas.cw * 0.45));
const posicoes = [];
for (let x = 0; x < medidas.sw - medidas.cw; x += passo) posicoes.push(x);
posicoes.push(medidas.sw - medidas.cw);
// De ponta a ponta e de volta (o sumiço aparecia ao voltar para uma ilha).
const vistas = new Set();
for (const x of [...posicoes, ...posicoes.slice(0, -1).reverse()]) {
  await area.evaluate((el, esquerda) => el.scrollTo(esquerda, 0), x);
  await doisQuadros(pagina);
  const ilhas = await area.evaluate((el) => {
    const caixa = el.getBoundingClientRect();
    return [...el.querySelectorAll("[data-ilha]")].flatMap((link) => {
      const id = link.getAttribute("data-ilha");
      const arte = el.querySelector(`[data-ilha-arte="${id}"]`).getBoundingClientRect();
      const nome = el.querySelector(`[data-nome-ilha="${id}"]`);
      const n = nome.getBoundingClientRect();
      // Só as ilhas com o nome inteiro na tela (as cortadas na borda são conferidas em outro passo).
      if (n.left < caixa.left || n.right > caixa.right) return [];
      const recorte = {
        x: Math.max(arte.left, caixa.left),
        y: Math.max(arte.top, caixa.top),
        width: Math.min(arte.right, caixa.right) - Math.max(arte.left, caixa.left),
        height: Math.min(arte.bottom, caixa.bottom) - Math.max(arte.top, caixa.top),
      };
      const visivel = (elemento) => getComputedStyle(elemento).visibility !== "hidden" && Number(getComputedStyle(elemento).opacity) > 0;
      const dentro = n.top >= caixa.top && n.bottom <= caixa.bottom && n.left >= caixa.left && n.right <= caixa.right;
      return [
        {
          id,
          recorte,
          nome: dentro && visivel(nome) ? { x: n.left, y: n.top, width: n.width, height: n.height } : null,
          fundoDoNome: getComputedStyle(nome).backgroundColor,
          corDoNome: getComputedStyle(nome).color,
          texto: nome.textContent.trim(),
        },
      ];
    });
  });
  for (const ilha of ilhas) {
    vistas.add(ilha.id);
    // O nome: a plaquinha clara com as letras escuras, desenhadas na tela (não só no DOM).
    let legivel = false;
    if (ilha.nome) {
      const png = lerPng(await pagina.screenshot({ clip: ilha.nome }));
      const fundo = corEmRgb(ilha.fundoDoNome);
      const letra = corEmRgb(ilha.corDoNome);
      let deFundo = 0;
      let deLetra = 0;
      for (let y = 0; y < png.altura; y++) {
        for (let xx = 0; xx < png.largura; xx++) {
          const cor = png.pixel(xx, y);
          if (perto(cor, fundo, 30)) deFundo++;
          else if (perto(cor, letra, 90)) deLetra++;
        }
      }
      const total = png.largura * png.altura;
      legivel = deFundo / total > 0.35 && deLetra / total > 0.03;
    }
    conferir(legivel && ilha.texto.length > 0, `${MODO}: rolando (${x} px), a ilha ${ilha.id} mostra o nome "${ilha.texto}" na tela`);
    conferir(ilha.recorte.width > 40 && ilha.recorte.height > 40, `${MODO}: rolando (${x} px), a arte da ilha ${ilha.id} está na tela`);
    const parte = await desenhado(ilha.recorte);
    // A arte inteira e a metade de cima (o que fica em cima do chão: prédios, engrenagens, andaimes).
    const cima = await desenhado({ ...ilha.recorte, height: ilha.recorte.height / 2 });
    conferir(parte > 0.3 && cima > 0.12, `${MODO}: rolando (${x} px), a ilha ${ilha.id} tem a arte desenhada (${(parte * 100).toFixed(0)}% e ${(cima * 100).toFixed(0)}% em cima não são mar)`);
  }
}
const todas = await area.evaluate((el) => [...el.querySelectorAll("[data-ilha]")].map((link) => link.getAttribute("data-ilha")));
conferir(todas.every((id) => vistas.has(id)), `${MODO}: todas as ilhas apareceram ao rolar (${[...vistas].length} de ${todas.length})`);

// ------------------------------------------------ a causa: nada repinta o mapa inteiro
// Parado na ilha atual, depois de assentar: as pinturas do Chrome ficam pequenas
// (antes, as ondas do SVG faziam cada quadro repintar quase a tela toda).
await area.evaluate((el) => {
  const ilha = el.querySelector('[data-ilha="logica"]').getBoundingClientRect();
  const caixa = el.getBoundingClientRect();
  el.scrollTo({ left: el.scrollLeft + ilha.left + ilha.width / 2 - caixa.left - caixa.width / 2, top: 0 });
});
await pagina.waitForTimeout(1500);
const cdp = await contexto.newCDPSession(pagina);
await cdp.send("LayerTree.enable");
const pinturas = [];
cdp.on("LayerTree.layerPainted", ({ clip }) => pinturas.push(clip.width * clip.height));
await pagina.waitForTimeout(500);
pinturas.length = 0;
await pagina.waitForTimeout(2000);
await cdp.send("LayerTree.disable");
const tela = medidas.cw * medidas.ch;
const maior = Math.max(0, ...pinturas);
const porSegundo = pinturas.reduce((soma, a) => soma + a, 0) / 2;
if (process.env.MEDIR) console.log(`${MODO}: maior ${((maior / tela) * 100).toFixed(0)}%, ${(porSegundo / tela).toFixed(1)} telas/s, ${pinturas.length} pinturas`);
conferir(maior <= tela * 0.3, `${MODO}: parado, nenhuma pintura cobre mais de 30% do mapa (a maior: ${((maior / tela) * 100).toFixed(0)}%)`);
conferir(porSegundo <= tela * 8, `${MODO}: parado, o Chrome repinta menos de 8 telas de mapa por segundo (${(porSegundo / tela).toFixed(1)})`);

// Com menos movimento, nada se mexe sozinho: parado, quase nada é repintado.
await pagina.emulateMedia({ reducedMotion: "reduce" });
await cdp.send("LayerTree.enable");
// A troca em si repinta (as animações voltam ao lugar e as camadas mudam): conta depois de assentar.
await pagina.waitForTimeout(1500);
pinturas.length = 0;
await pagina.waitForTimeout(1500);
const reduzido = pinturas.reduce((soma, a) => soma + a, 0) / 1.5;
if (process.env.MEDIR) console.log(`${MODO}: com menos movimento, ${(reduzido / tela).toFixed(1)} telas/s`);
conferir(reduzido <= tela * 1, `${MODO}: com menos movimento, o mapa quase não repinta (${(reduzido / tela).toFixed(1)} telas por segundo)`);

// ------------------------------------------------ o interior das ilhas
// Sites e Lógica: as zonas ficam recortadas pela grama, nenhuma placa, nome,
// ponto ou o computadorzinho encosta em outro, e parado nada repinta a ilha inteira.
await pagina.emulateMedia({ reducedMotion: "no-preference" });
for (const ilhaId of ["sites", "logica"]) {
  await pagina.goto(`${URL_JOGO}/ilha/${ilhaId}`);
  await pagina.locator(`[data-mapa=ilha][data-ilha=${ilhaId}]`).waitFor();
  await pagina.locator("[data-mascote-no-ponto]").waitFor();
  await pagina.waitForTimeout(2200); // o computadorzinho termina de andar até o ponto atual
  const ilha = await pagina.evaluate(() => {
    const desenho = document.querySelector("[data-ilha-desenho]");
    const regioes = [...desenho.querySelectorAll("[data-regiao-zona]")];
    const recortadas = regioes.every((regiao) => regiao.parentElement?.getAttribute("clip-path")?.startsWith("url(#grama-"));
    const caixas = [
      ...[...desenho.querySelectorAll("[data-placa-zona]")].map((el) => ({ id: `placa ${el.getAttribute("data-zona")}`, el })),
      ...[...desenho.querySelectorAll("[data-unidade]")].map((el) => ({ id: `ponto ${el.getAttribute("data-unidade")}`, el })),
      ...[...desenho.querySelectorAll("[data-nome-unidade]")].map((el) => ({ id: `nome ${el.getAttribute("data-nome-unidade")}`, el })),
      ...[...desenho.querySelectorAll("[data-mascote-no-ponto] > *")].map((el) => ({ id: "computadorzinho", el })),
    ].map(({ id, el }) => ({ id, r: el.getBoundingClientRect() }));
    const encostam = [];
    for (const [i, a] of caixas.entries()) {
      for (const b of caixas.slice(i + 1)) {
        // O nome é colado ao ponto dele (é o rótulo do ponto): esse par não conta.
        if (a.id.split(" ")[1] && a.id.split(" ")[1] === b.id.split(" ")[1]) continue;
        const folga = 1;
        if (a.r.left < b.r.right - folga && b.r.left < a.r.right - folga && a.r.top < b.r.bottom - folga && b.r.top < a.r.bottom - folga) encostam.push(`${a.id} x ${b.id}`);
      }
    }
    return { regioes: regioes.length, recortadas, encostam, placas: caixas.filter((c) => c.id.startsWith("placa")).length };
  });
  conferir(ilha.regioes > 1 && ilha.recortadas, `${MODO}: ${ilhaId}: as ${ilha.regioes} zonas ficam recortadas pela grama (não vazam para a areia)`);
  conferir(ilha.placas === ilha.regioes, `${MODO}: ${ilhaId}: uma placa por zona`);
  conferir(ilha.encostam.length === 0, `${MODO}: ${ilhaId}: placas, pontos, nomes e o computadorzinho não se encostam ${JSON.stringify(ilha.encostam.slice(0, 4))}`);
  const telaIlha = await pagina.getByRole("region", { name: /Mapa da ilha/ }).evaluate((el) => el.clientWidth * el.clientHeight);
  pinturas.length = 0;
  await cdp.send("LayerTree.enable");
  await pagina.waitForTimeout(500);
  pinturas.length = 0;
  await pagina.waitForTimeout(2000);
  await cdp.send("LayerTree.disable");
  const maiorIlha = Math.max(0, ...pinturas);
  const porSegundoIlha = pinturas.reduce((soma, a) => soma + a, 0) / 2;
  if (process.env.MEDIR) console.log(`${MODO}: ${ilhaId}: maior ${((maiorIlha / telaIlha) * 100).toFixed(0)}%, ${(porSegundoIlha / telaIlha).toFixed(1)} telas/s`);
  conferir(maiorIlha <= telaIlha * 0.3 && porSegundoIlha <= telaIlha * 8, `${MODO}: ${ilhaId}: parado, a ilha repinta pouco (maior ${((maiorIlha / telaIlha) * 100).toFixed(0)}%, ${(porSegundoIlha / telaIlha).toFixed(1)} telas/s)`);
}

conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
