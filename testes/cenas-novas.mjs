// Quatro missões: soluções, atores, temas, fichas, rebobinagem e capturas reais.
// Uso: CAPTURAS=1 node testes/cenas-novas.mjs retrato (AMBIENTE=estufa filtra).
import { mkdirSync, readFileSync } from "node:fs";
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";

async function abrirFase(id) {
  const aberto = await abrir({ ...TAMANHOS[MODO], escala: process.env.CAPTURAS === "1" ? 3 : 1, progresso: null, rota: `/lab/fases?fase=${id}`, esperar: "[data-composicao]" });
  const { pagina } = aberto;
  const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
  if (await recolher.isVisible().catch(() => false)) await (toque ? recolher.tap() : recolher.click());
  await esperarPronto(pagina, 30000);
  for (let i = 0; i < 4; i++) {
    if (movel) await abrirBalao(pagina);
    const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
    if (!(await botao.isVisible().catch(() => false))) break;
    if (toque) await botao.tap();
    else await botao.click();
    await esperarPronto(pagina);
  }
  return aberto;
}

function ferramentas({ pagina }) {
  const tocar = async (localizador) => {
    if (movel) await fecharBalao(pagina);
    await localizador.scrollIntoViewIfNeeded();
    if (toque) await localizador.tap();
    else await localizador.click();
    await esperarPronto(pagina);
  };
  /** No celular, troca a aba das áreas (em pé: Código | Palco; deitado: Cena | Palco). */
  const area = async (id) => {
    if (!movel) return;
    const aba = pagina.locator(`[data-abas-composicao] [data-segmento="${id}"]`);
    if (!(await aba.count())) return;
    if ((await aba.getAttribute("aria-selected")) !== "true") await tocar(aba);
  };
  /** A cena à vista: em pé ela mora em cima (aberta); deitado, é a aba Cena. */
  const verCena = async () => {
    if (MODO === "paisagem") await area("cena");
    if (MODO === "retrato" && !(await pagina.locator('[data-area-trabalho="cena"]').isVisible())) await tocar(pagina.locator("[data-alternar-cena]"));
  };
  const escrever = async (codigo) => {
    await area("snippet");
    if (movel) {
      const snippetAba = pagina.getByRole("tab", { name: "Snippet", exact: true });
      if (await snippetAba.isVisible().catch(() => false)) await tocar(snippetAba);
      await fecharBalao(pagina);
    }
    const editor = pagina.locator("[data-editor-snippet] .cm-content");
    await editor.click();
    await pagina.keyboard.press("ControlOrMeta+A");
    await pagina.keyboard.press("Delete");
    // O código entra colado, inteiro (as chaves já vêm fechadas).
    await pagina.keyboard.insertText(codigo);
    await esperarPronto(pagina);
  };
  const executar = async () => {
    await area("snippet");
    await tocar(pagina.locator("[data-executar-snippet]"));
  };
  /** Pausa a cena e vai para o instante, pela barra de tempo dela. */
  const irPara = async (ms) => {
    await verCena();
    await pagina.evaluate((valor) => {
      const barra = document.querySelector("[data-barra-cena]");
      const definir = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      definir.call(barra, String(valor));
      barra.dispatchEvent(new Event("input", { bubbles: true }));
    }, ms);
    await pagina.waitForFunction((valor) => document.querySelector("[data-cena]")?.getAttribute("data-tempo") === String(valor), ms);
  };
  const atributo = (dispositivo, nome) => pagina.locator(`[data-dispositivo="${dispositivo}"]`).getAttribute(`data-${nome}`);
  const esperarCenaParar = () => pagina.waitForFunction(() => document.querySelector("[data-area-cena]")?.getAttribute("data-tocando") === "nao", null, { timeout: 30000 });
  /** O objetivo de agora passou: aparece o Próximo objetivo (ou o Ver resultado), que é tocado. */
  const proximo = async () => {
    if (movel) await abrirBalao(pagina);
    const botao = pagina.getByRole("button", { name: /Próximo objetivo|Ver resultado/ }).first();
    const passou = await botao.waitFor({ timeout: 10000 }).then(() => true).catch(() => false);
    if (passou && (await botao.textContent())?.includes("Próximo")) {
      if (toque) await botao.tap();
      else await botao.click();
      await esperarPronto(pagina);
    }
    if (movel) await fecharBalao(pagina);
    return passou;
  };
  return { tocar, verCena, escrever, executar, irPara, atributo, esperarCenaParar, proximo };
}

const solucoes = JSON.parse(readFileSync(new URL("./cenas-novas-solucoes.json", import.meta.url), "utf8"));
const ambientes = ["garagem", "cozinha", "esquina", "estufa"];
const instantes = [[0, 2600, 5000], [0, 4200, 7000], [0, 3700, 5500], [0, 4800, 8000]];
const fichas = [["sensorCarro", "portao", "luz"], ["geladeira", "alarme", "forno"], ["semaforo", "botao"], ["aspersor", "sensorUmidade", "sensorDia"]];
const capturar = process.env.CAPTURAS === "1";
const pasta = "docs/capturas/cenas-novas";
if (capturar) mkdirSync(pasta, { recursive: true });
for (let i = 0; i < 4; i++) {
  if (process.env.AMBIENTE && process.env.AMBIENTE !== ambientes[i]) continue;
  const aberto = await abrirFase(`lab-cenas-novas-u1-f${i + 1}`);
  const { pagina, navegador, erros } = aberto;
  const f = ferramentas(aberto);
  try {
    await f.escrever(solucoes[i]);
    await f.executar();
    await f.verCena();
    await f.tocar(pagina.locator('[data-velocidade="4"]'));
    await f.esperarCenaParar();
    conferir(await f.proximo(), `${MODO}: ${ambientes[i]} passou nos três cenários`);
    await f.verCena();
    if (i === 0) {
      await f.irPara(2100);
      conferir(await pagina.locator('[data-ator="carro"]').getAttribute("data-progresso") === "0.000", "carro espera o portão abrir inteiro");
      await f.irPara(2600);
      conferir(await pagina.locator('[data-ator="carro"]').getAttribute("data-progresso") === "0.400", "carro entrando");
      await f.irPara(3300);
      conferir(await f.atributo("portao", "aberto") === "false", "portão fecha após a passagem");
    } else if (i === 1) {
      await f.irPara(3000);
      conferir(await f.atributo("alarme", "tocando") === "false", "dois segundos exatos ainda não tocam");
      await f.irPara(4200);
      conferir(await f.atributo("alarme", "tocando") === "true" && await f.atributo("forno", "ligado") === "false", "alarme toca e timer do forno terminou");
    } else if (i === 2) {
      await f.irPara(2400);
      conferir(await pagina.locator('[data-ator="pedestre"]').getAttribute("data-progresso") === "0.000", "pedestre espera o sinal");
      await f.irPara(3700);
      conferir(Number(await pagina.locator('[data-ator="pedestre"]').getAttribute("data-progresso")) > 0, "pedestre atravessa com carros parados");
    } else {
      await f.irPara(4800);
      conferir(await f.atributo("aspersor", "ligado") === "true", "terra seca recebe água de dia");
      await f.irPara(8000);
      conferir(await f.atributo("aspersor", "ligado") === "false" && await pagina.locator("[data-cena]").getAttribute("data-periodo") === "noite", "anoiteceu: sem rega e ambiente escuro");
    }
    for (const tema of ["doce", "fliperama", "segredo"]) {
      await pagina.evaluate(t => document.documentElement.setAttribute("data-theme", t), tema);
      for (const [j, ms] of instantes[i].entries()) {
        await f.irPara(ms);
        conferir(await pagina.locator("[data-cena]").isVisible(), `${MODO}: ${ambientes[i]}, ${tema}, estado ${j + 1}`);
        if (capturar) {
          // Recorta a área realmente desenhada, sem as faixas laterais do SVG.
          const caixa = await pagina.locator("[data-cena]").boundingBox();
          const escala = Math.min(caixa.width / 320, caixa.height / 200);
          const width = 320 * escala, height = 200 * escala;
          await pagina.screenshot({ path: `${pasta}/${ambientes[i]}-${tema}-${["antes", "durante", "depois"][j]}.png`, clip: { x: caixa.x + (caixa.width - width) / 2, y: caixa.y + (caixa.height - height) / 2, width, height } });
        }
      }
    }
    if (process.env.SOMENTE_CAPTURAS === "1") continue;
    // Todos os dispositivos novos abrem uma ficha e um Por dentro real.
    for (const id of fichas[i]) {
      await f.tocar(pagina.locator(`[data-dispositivo="${id}"]`));
      await pagina.locator(`[data-ficha-dispositivo="${id}"]`).waitFor();
      await f.tocar(pagina.locator("[data-ver-por-dentro]"));
      conferir((await pagina.locator("[data-por-dentro]").count()) > 0, `${id}: Por dentro disponível`);
      await pagina.keyboard.press("Escape");
      await pagina.locator("[data-ficha-dispositivo]").waitFor({ state: "detached" });
    }
    await pagina.emulateMedia({ reducedMotion: "reduce" });
    await f.irPara(instantes[i][1]);
    conferir(await pagina.locator("[data-cena]").isVisible(), `${MODO}: movimento reduzido mantém o estado legível`);
    // As linhas alternativas continuam selecionáveis e rebobináveis.
    for (const variante of await pagina.locator("[data-variante]").evaluateAll(es => es.map(e => e.getAttribute("data-variante")))) {
      await f.tocar(pagina.locator(`[data-variante="${variante}"]`));
      await f.esperarCenaParar();
      await f.irPara(0);
    }
    conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo em ${ambientes[i]} (${errosRelevantes(erros).join(" | ")})`);
  } finally { await navegador.close(); }
}
