// Gravador das tomadas: abre o jogo (build de produção em URL_JOGO), grava a
// tela pelo screencast do Chrome (CDP) e registra num take.json, com tempo
// relativo ao início da tomada, tudo o que o vídeo precisa desenhar depois:
// cada movimento do mouse, clique, toque, tecla, marcas e caixas de elementos.
// O screencast não mostra o ponteiro; quem desenha o cursor é o Remotion.
import { execSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { PASTA_VIDEO, util } from "./jogo.mjs";

const exigir = createRequire(import.meta.url);
function carregarPlaywright() {
  try {
    return exigir("playwright");
  } catch {
    return exigir(path.join(execSync("npm root -g").toString().trim(), "playwright"));
  }
}
const { chromium } = carregarPlaywright();

export const FORMATOS = {
  /** Computador, como o briefing pede: 1920 x 1080, escala 1. */
  computador: { largura: 1920, altura: 1080, escala: 1, toque: false, saida: [1920, 1080] },
  /** Computador de perto: a mesma tela de 1920 x 1080 no arquivo, com a interface 1,5x maior (1280 x 720 de página). */
  perto: { largura: 1280, altura: 720, escala: 1.5, toque: false, saida: [1920, 1080] },
  /** Meio-termo para telas com muitos painéis: 1600 x 900 de página, interface 1,2x maior. */
  medio: { largura: 1600, altura: 900, escala: 1.2, toque: false, saida: [1920, 1080] },
  /** Celular em pé, 9:16. */
  celular: { largura: 412, altura: 732, escala: 2.625, toque: true, saida: [1080, 1920] },
};

/** Navegadores abertos: se uma tomada falha no meio, o gravar.mjs fecha o que sobrou (um navegador esquecido rouba processador da próxima). */
const abertos = new Set();
export async function fecharNavegadores() {
  for (const navegador of abertos) await navegador.close().catch(() => {});
  abertos.clear();
}

export const PASTA_BRUTOS = path.join(PASTA_VIDEO, "captura", "brutos");
const espera = (ms) => new Promise((resolver) => setTimeout(resolver, ms));
const suave = (p) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

/**
 * Abre o jogo para uma tomada. `progresso` é injetado como nos testes
 * (testes/util.mjs); `armazenamento` são outras chaves do localStorage.
 */
export async function abrirTomada({ id, formato = "computador", progresso, rota, esperar = "body", armazenamento = {}, descricao = "" }) {
  const f = FORMATOS[formato];
  const navegador = await chromium.launch({ args: ["--force-color-profile=srgb", "--hide-scrollbars"] });
  abertos.add(navegador);
  const contexto = await navegador.newContext({
    viewport: { width: f.largura, height: f.altura },
    deviceScaleFactor: f.escala,
    hasTouch: f.toque,
    isMobile: f.toque,
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
  });
  // O mesmo preparo dos testes: os workers do executor em modo determinístico.
  await contexto.addInitScript(() => {
    const WorkerReal = window.Worker;
    window.Worker = class extends WorkerReal {
      constructor(url, opcoes) {
        const alvo = new URL(url, location.href);
        alvo.searchParams.set("executor-teste", "1");
        super(alvo, opcoes);
      }
    };
  });
  const pagina = await contexto.newPage();
  const erros = [];
  pagina.on("pageerror", (erro) => erros.push(String(erro)));
  await pagina.addInitScript(
    ({ valor, extras }) => {
      try {
        if (window !== window.top) return;
        if (sessionStorage.getItem("video:iniciado")) return;
        sessionStorage.setItem("video:iniciado", "1");
        localStorage.clear();
        if (valor) localStorage.setItem("ilha-sites:progresso:v2", JSON.stringify(valor));
        for (const [chave, texto] of Object.entries(extras)) localStorage.setItem(chave, texto);
      } catch {
        // Sem armazenamento neste frame.
      }
    },
    { valor: progresso ?? null, extras: armazenamento },
  );
  await pagina.goto(`${util.URL_JOGO}${rota}`);
  await pagina.waitForSelector(esperar, { timeout: 30000 });
  await pagina.evaluate(() => document.fonts.ready);
  const cdp = await contexto.newCDPSession(pagina);
  if (f.toque) await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 2 });

  const pasta = path.join(PASTA_BRUTOS, id);
  let t0 = 0;
  let gravando = false;
  let numero = 0;
  const quadros = [];
  const eventos = [];
  let mouse = { x: f.largura / 2, y: f.altura / 2 };
  /** A janela aproximada da tomada (px da página), quando há uma: ver tomada.janela(). */
  let janela = null;
  const agora = () => Date.now() / 1000 - t0;
  const registrar = (evento) => {
    if (gravando) eventos.push({ t: Number(agora().toFixed(3)), ...evento });
  };

  cdp.on("Page.screencastFrame", ({ data, metadata, sessionId }) => {
    cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
    if (!gravando) return;
    numero += 1;
    const arquivo = `q-${String(numero).padStart(5, "0")}.jpg`;
    writeFileSync(path.join(pasta, arquivo), Buffer.from(data, "base64"));
    quadros.push({ t: Number((metadata.timestamp - t0).toFixed(4)), arquivo });
  });

  async function centro(alvo) {
    if (typeof alvo.x === "number") return alvo;
    const caixa = await alvo.boundingBox();
    if (!caixa) throw new Error(`${id}: o alvo não está na tela`);
    return { x: caixa.x + caixa.width * (alvo.fx ?? 0.5), y: caixa.y + caixa.height * (alvo.fy ?? 0.5) };
  }

  const tomada = {
    id,
    formato: f,
    pagina,
    cdp,
    contexto,
    erros,
    agora,
    /** Começa a gravar. Tudo o que vier depois entra no take.json. */
    async iniciar() {
      rmSync(pasta, { recursive: true, force: true });
      mkdirSync(pasta, { recursive: true });
      await pagina.mouse.move(mouse.x, mouse.y);
      t0 = Date.now() / 1000;
      gravando = true;
      registrar({ tipo: "mover", x: mouse.x, y: mouse.y });
      await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, everyNthFrame: 1, maxWidth: f.saida[0], maxHeight: f.saida[1] });
    },
    esperar: espera,
    /**
     * Grava só uma janela da página, aproximada e nítida (como quem abre os dedos na tela): o Chrome desenha
     * a área pedida no tamanho inteiro do quadro, sem a página perceber (o layout não muda). Serve para o
     * que é pequeno demais no celular, como a tela de um aparelho da cena. Chamar antes de iniciar().
     * `area` em px da página; a janela tem a largura de `area` mais a folga, a proporção do formato e o
     * centro de `area` (ou `centroY`). No take.json, as medidas da página e os pontos passam a ser os da janela.
     * Depois disto, toque só com `tocarPorDentro` (o Chrome não converte os toques para a janela).
     */
    async janela(area, { folga = 0.1, centroY } = {}) {
      const largura = Math.min(f.largura, area.width * (1 + folga * 2));
      const altura = (largura * f.altura) / f.largura;
      const x = Math.min(f.largura - largura, Math.max(0, area.x + area.width / 2 - largura / 2));
      const y = Math.min(f.altura - altura, Math.max(0, (centroY ?? area.y + area.height / 2) - altura / 2));
      janela = { x, y, largura, altura, fator: f.largura / largura };
      await cdp.send("Emulation.setDeviceMetricsOverride", { width: f.largura, height: f.altura, deviceScaleFactor: f.escala, mobile: f.toque, viewport: { x, y, width: largura, height: altura, scale: janela.fator } });
      await espera(300);
      return janela;
    },
    /** Aciona um elemento sem passar pelo ponteiro (para as tomadas com janela): o clique do próprio elemento. */
    async tocarPorDentro(localizador) {
      const caixa = await localizador.first().boundingBox().catch(() => null);
      if (caixa) registrar({ tipo: "toque", x: Math.round(caixa.x + caixa.width / 2), y: Math.round(caixa.y + caixa.height / 2) });
      await localizador.first().evaluate((el) => el.click());
    },
    /** Uma marca com nome (o roteiro do vídeo acha o momento por ela). */
    marcar(nome, dados = {}) {
      registrar({ tipo: "marca", nome, ...dados });
    },
    /** A caixa (em px da página) de um elemento agora, com nome. */
    async caixa(nome, localizador) {
      const caixa = await localizador.first().boundingBox().catch(() => null);
      if (caixa) registrar({ tipo: "caixa", nome, x: Math.round(caixa.x), y: Math.round(caixa.y), l: Math.round(caixa.width), a: Math.round(caixa.height) });
      return caixa;
    },
    /** Move o mouse até o ponto em vários passos, com aceleração e freio. */
    async moverSuave(alvo, ms = 600) {
      const destino = await centro(alvo);
      const origem = { ...mouse };
      const passos = Math.max(2, Math.round(ms / 16));
      const inicio = Date.now();
      for (let passo = 1; passo <= passos; passo++) {
        const p = suave(passo / passos);
        mouse = { x: origem.x + (destino.x - origem.x) * p, y: origem.y + (destino.y - origem.y) * p };
        await pagina.mouse.move(mouse.x, mouse.y);
        registrar({ tipo: "mover", x: Math.round(mouse.x), y: Math.round(mouse.y) });
        const falta = inicio + (ms * passo) / passos - Date.now();
        if (falta > 0) await espera(falta);
      }
    },
    /** Vai até o alvo e clica (ou dá dois cliques). */
    async clicar(alvo, { ms = 600, duplo = false, pausa = 120 } = {}) {
      await tomada.moverSuave(alvo, ms);
      await espera(pausa);
      registrar({ tipo: duplo ? "duplo-clique" : "clique", x: Math.round(mouse.x), y: Math.round(mouse.y) });
      if (duplo) await pagina.mouse.dblclick(mouse.x, mouse.y);
      else await pagina.mouse.click(mouse.x, mouse.y);
    },
    /** Digita com ritmo de gente (60 a 110 ms por tecla, determinístico). */
    async digitar(texto, { semente = 7 } = {}) {
      let estado = semente;
      for (const letra of texto) {
        estado = (estado * 1103515245 + 12345) % 2147483648;
        registrar({ tipo: "tecla", letra });
        await pagina.keyboard.type(letra);
        await espera(60 + (estado % 51));
      }
    },
    async tecla(nome) {
      registrar({ tipo: "tecla", letra: nome });
      await pagina.keyboard.press(nome);
    },
    /** Toque do dedo num alvo (celular). */
    async tocar(alvo, { pausa = 0 } = {}) {
      const ponto = await centro(alvo);
      registrar({ tipo: "toque", x: Math.round(ponto.x), y: Math.round(ponto.y) });
      if (pausa) await espera(pausa);
      await pagina.touchscreen.tap(ponto.x, ponto.y);
    },
    /** Arrasto do dedo (celular), com eventos de toque de verdade pelo CDP. */
    async arrastarDedo(de, ate, ms = 600) {
      const passos = Math.max(4, Math.round(ms / 16));
      let tempo = Date.now() / 1000;
      const carimbo = () => (tempo += 0.016);
      registrar({ tipo: "dedo-desce", x: Math.round(de.x), y: Math.round(de.y) });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: de.x, y: de.y }], timestamp: carimbo() });
      for (let passo = 1; passo <= passos; passo++) {
        await espera(16);
        const p = passo / passos;
        const ponto = { x: Math.round(de.x + (ate.x - de.x) * p), y: Math.round(de.y + (ate.y - de.y) * p) };
        registrar({ tipo: "dedo-move", ...ponto });
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [ponto], timestamp: carimbo() });
      }
      registrar({ tipo: "dedo-sobe", x: Math.round(ate.x), y: Math.round(ate.y) });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [], timestamp: carimbo() });
    },
    /** Rola um elemento (ou a página) devagar e sem trancos, quadro a quadro, do jeito que o dedo ou a rodinha fariam. */
    async rolarSuave(seletor, { dx = 0, dy = 0, ms = 4000, linear = true } = {}) {
      registrar({ tipo: "rolagem", dx, dy, ms });
      await pagina.evaluate(
        ({ seletor, dx, dy, ms, linear }) =>
          new Promise((resolver) => {
            const el = seletor ? document.querySelector(seletor) : document.scrollingElement;
            const x0 = el.scrollLeft;
            const y0 = el.scrollTop;
            const inicio = performance.now();
            const passo = (agora) => {
              const p = Math.min(1, (agora - inicio) / ms);
              const s = linear ? p : p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
              el.scrollLeft = x0 + dx * s;
              el.scrollTop = y0 + dy * s;
              if (p < 1) requestAnimationFrame(passo);
              else resolver(null);
            };
            requestAnimationFrame(passo);
          }),
        { seletor, dx, dy, ms, linear },
      );
    },
    /** Para de gravar e escreve o take.json. Fecha o navegador. */
    async terminar(extra = {}) {
      const duracao = Number(agora().toFixed(3));
      gravando = false;
      await cdp.send("Page.stopScreencast").catch(() => {});
      // Com janela, o registro fala a língua da janela: a "página" é a área gravada e os pontos são relativos a ela.
      const naJanela = (evento) => (janela && typeof evento.x === "number" ? { ...evento, x: Math.round(evento.x - janela.x), y: Math.round(evento.y - janela.y) } : evento);
      const take = {
        id,
        descricao,
        formato,
        pagina: janela ? { largura: Number(janela.largura.toFixed(2)), altura: Number(janela.altura.toFixed(2)), escala: Number((f.escala * janela.fator).toFixed(3)) } : { largura: f.largura, altura: f.altura, escala: f.escala },
        ...(janela ? { janela: { x: Number(janela.x.toFixed(2)), y: Number(janela.y.toFixed(2)), largura: Number(janela.largura.toFixed(2)), altura: Number(janela.altura.toFixed(2)) } } : {}),
        saida: { largura: f.saida[0], altura: f.saida[1] },
        duracao,
        quadrosGravados: quadros.length,
        rota,
        ...extra,
        eventos: eventos.map(naJanela),
        quadros,
      };
      writeFileSync(path.join(pasta, "take.json"), JSON.stringify(take));
      await navegador.close();
      abertos.delete(navegador);
      return take;
    },
  };
  return tomada;
}
