// Jornada pelo mapa das unidades da zona Decisões (Ilha Lógica): Console real,
// previsões por dados, negativas pedagógicas, palco, meta e desafio.
// Uso: node testes/decisoes.mjs [layout] [unidade]
import { readFileSync } from "node:fs";
import { PUBLICADAS, obrigatoriasProntasDaIlha } from "./curriculo.mjs";
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, opcaoDaPrevisao, passarApresentacao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";
const UNIDADE = process.argv[3] ?? "logica-decisoes-u1";
const numero = Number(UNIDADE.at(-1));
if (![1, 2, 3, 4].includes(numero)) throw new Error("Informe U1, U2, U3 ou U4 da Decisões");

const sites = obrigatoriasProntasDaIlha("sites").map((unidade) => unidade.id);
const IDS_FERRAMENTAS = [...readFileSync(new URL("../src/ferramentas/ids.ts", import.meta.url), "utf8").matchAll(/^ {2}"([a-z-]+)",$/gm)].map((m) => m[1]);
const anteriores = [1, 2, 3].map((i) => `logica-primeiros-comandos-u${i}`).concat(Array.from({ length: numero - 1 }, (_, i) => `logica-decisoes-u${i + 1}`));
const prontas = [...sites, ...anteriores];
const NOVAS = numero === 2 ? ["circuito", "tabela-verdade"] : [];
const progresso = {
  versao: 2,
  fasesConcluidas: prontas.flatMap((id) => PUBLICADAS[id]),
  estrelasPorFase: {},
  fasesEmAndamento: {},
  faseAtual: null,
  tema: "doce",
  temasDesbloqueados: ["doce", "fliperama"],
  som: false,
  missoesDeCampo: {},
  apresentacoesVistas: IDS_FERRAMENTAS.filter((id) => !NOVAS.includes(id)),
  metasVistas: prontas,
  unidadesComemoradas: prontas,
  ilhasComemoradas: ["sites"],
  posicaoNoMapa: {},
  mapaDesbloqueado: false,
  proporcaoPrevia: 0.4,
};

// Cada passo: [id do objetivo, código ou lista de entradas]. `negativa`: código que NÃO pode concluir o objetivo.
const J = JSON.parse(readFileSync(new URL("./decisoes-jornadas.json", import.meta.url), "utf8"))[numero];
const { passos: PASSOS, desafio: DESAFIO, negativas: NEGATIVAS = {}, caixinhas: CAIXINHAS = {}, caixaDepois: CAIXA_DEPOIS, apresentacoes: APRESENTACOES = {} } = J;

const { navegador, contexto, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso, rota: "/", esperar: "[data-mapa=mundo]" });
const assentar = () => esperarPronto(pagina, 20000);
async function tocar(localizador) {
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
  await assentar();
}
async function naConversa(nome) {
  if (movel) await abrirBalao(pagina);
  else await assentar();
  const botao = pagina.getByRole("button", { name: nome }).first();
  await botao.waitFor({ timeout: 10000 });
  await tocar(botao);
}
async function introducao() {
  for (let i = 0; i < 6; i++) {
    if ((await pagina.locator("[data-apresentacao]").count()) > 0) return;
    if ((await pagina.locator("[data-previsao]").count()) > 0) return;
    if (movel) await abrirBalao(pagina);
    const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
    if (!(await botao.isVisible().catch(() => false))) return;
    await tocar(botao);
  }
}
const esperarObjetivo = (id) =>
  pagina.waitForFunction((alvo) => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === alvo, id, { timeout: 10000 });
const caixinha = (nome) => pagina.locator(`[data-palco] [data-caixinha="${nome}"]`);

/** Escreve e roda no Console (no toque, o botão Rodar). */
async function rodar(codigo) {
  if (movel) await fecharBalao(pagina);
  const entrada = pagina.locator("[data-console]:visible [data-entrada-console]").first();
  await entrada.click();
  // Várias linhas entram como texto colado: o editor fecha chaves sozinho quando se digita "{" (como o Chrome).
  await pagina.keyboard.insertText(codigo);
  if (toque) await pagina.locator("[data-console]:visible [data-rodar-console]").first().tap();
  else await pagina.keyboard.press("Enter");
  await assentar();
}
const rodarTudo = async (codigo) => {
  if (codigo?.ops) return fazerOps(codigo.ops);
  for (const c of [].concat(codigo)) await rodar(c);
};
async function conclusao(botao) {
  await naConversa("Ver resultado");
  await pagina.locator("[data-conclusao]").waitFor();
  for (let i = 0; i < 5; i++) {
    const continuar = pagina.getByRole("dialog").getByRole("button", { name: "Continuar", exact: true });
    if (!(await continuar.isVisible().catch(() => false))) break;
    await tocar(continuar);
  }
  await tocar(pagina.getByRole("button", { name: botao }));
}
const concluiu = async () => {
  if (movel) await abrirBalao(pagina);
  return pagina.getByRole("button", { name: /^(Próximo objetivo|Ver resultado)$/ }).first().isVisible().catch(() => false);
};


// ---------------------------------------------------------------- circuito (fases circuito-logico)
const cdpToque = toque ? await contexto.newCDPSession(pagina) : null;
if (cdpToque) await cdpToque.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 2 });
const peca = (id) => pagina.locator(`[data-peca="${id}"]`);
const acesa = async (id) => (await peca(id).getAttribute("data-acesa")) === "sim";
/** No toque, mantém a escala inicial e arrasta com dois dedos até a peça caber. */
async function tocarCirc(localizador, opcoes = {}) {
  if (movel) await fecharBalao(pagina);
  await localizador.scrollIntoViewIfNeeded();
  if (toque && (await localizador.evaluate((el) => el instanceof SVGElement))) {
    const area = pagina.getByRole("application", { name: "Bancada do circuito" });
    for (let i = 0; i < 20; i++) {
      const a = await area.boundingBox();
      const caixa = await localizador.boundingBox();
      const pos = opcoes.position ?? { x: caixa.width / 2, y: caixa.height / 2 };
      const x = caixa.x + pos.x, y = caixa.y + pos.y;
      if (x > a.x + 25 && x < a.x + a.width - 25 && y > a.y + 25 && y < a.y + a.height - 25) {
        await pagina.touchscreen.tap(x, y);
        break;
      }
      const mx = a.x + a.width / 2, my = a.y + a.height / 2;
      const dx = Math.max(-a.width / 4, Math.min(a.width / 4, mx - x));
      const dy = Math.max(-a.height / 4, Math.min(a.height / 4, my - y));
      const dedos = [{ x: mx - 20, y: my, id: 1 }, { x: mx + 20, y: my, id: 2 }];
      await cdpToque.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: dedos });
      await cdpToque.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: dedos.map((p) => ({ ...p, x: p.x + dx, y: p.y + dy })) });
      await cdpToque.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await assentar();
    }
  } else if (toque) await localizador.tap(opcoes);
  else await localizador.click(opcoes);
  await assentar();
}
async function ligar(de, para, porta) {
  await tocarCirc(pagina.locator(`[data-porta-saida="${de}"]`));
  conferir((await pagina.locator("svg[data-puxando]").getAttribute("data-puxando")) === de, `${MODO}: tocar na saída de ${de} puxa um fio`);
  if (toque) {
    const corpo = pagina.locator(`[data-corpo-peca="${para}"]`);
    const caixa = await corpo.boundingBox();
    await tocarCirc(corpo, { position: { x: caixa.width * 0.35, y: porta === 0 ? caixa.height * 0.25 : caixa.height * 0.75 } });
  } else await tocarCirc(pagina.locator(`[data-porta-entrada="${para}:${porta}"]`));
}
async function fazerOps(ops) {
  for (const [op, ...a] of ops) {
    if (op === "portao") await tocarCirc(pagina.locator(`[data-portao-paleta='${a[0]}']`));
    else if (op === "fio") await ligar(...a);
    else if (op === "chave") await tocarCirc(pagina.locator(`[data-corpo-peca="${a[0]}"]`));
    else if (op === "ajustar") { if ((await acesa(a[0])) !== a[1]) await tocarCirc(pagina.locator(`[data-corpo-peca="${a[0]}"]`)); }
    else if (op === "acesa") conferir((await acesa(a[0])) === a[1], `${MODO}: ${a[0]} ${a[1] ? "acesa" : "apagada"}`);
    else if (op === "codigo") {
      // O botão alterna: se o código já está aberto (da apresentação, por exemplo), fecha e abre de novo.
      if ((await pagina.locator("[data-codigo-circuito]").count()) > 0) await tocarCirc(pagina.locator("[data-ver-como-codigo]"));
      await tocarCirc(pagina.locator("[data-ver-como-codigo]"));
    }
    else if (op === "codigoContem") conferir((await pagina.locator("[data-codigo-circuito] pre").innerText()).includes(a[0]), `${MODO}: o código do circuito tem ${a[0]}`);
    else throw new Error(`op desconhecida: ${op}`);
  }
}

const ilha = pagina.locator('[data-ilha="logica"]').first();
conferir((await ilha.getAttribute("data-estado")) === "disponivel", `${MODO}: Lógica disponível`);
await tocar(ilha);
await pagina.goto(new URL("/ilha/logica", pagina.url()).toString());
await pagina.locator("[data-mapa=ilha][data-ilha=logica]").waitFor();
const ponto = pagina.locator(`[data-unidade="${UNIDADE}"]`);
conferir((await ponto.getAttribute("data-estado")) === "disponivel", `${MODO}: unidade disponível na ordem curricular`);
await tocar(ponto);
await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Jogar", exact: true }));
await pagina.locator(`[data-jogo-fase="${UNIDADE}-f1"]`).waitFor({ state: "attached" });
await pagina.locator("[data-meta]").waitFor();
if (CAIXA_DEPOIS) await pagina.locator(`[data-mini-palco="Depois"] [data-caixinha="${CAIXA_DEPOIS}"]`).waitFor({ timeout: 15000 });
await tocar(pagina.getByRole("button", { name: "Bora!" }));

for (const [f, passos] of PASSOS.entries()) {
  await pagina.locator(`[data-jogo-fase="${UNIDADE}-f${f + 1}"]`).waitFor();
  await introducao();
  for (const [ferramenta, ops] of APRESENTACOES[f + 1] ?? []) await passarApresentacao(pagina, ferramenta, () => fazerOps(ops));
  for (const [i, [id, codigo]] of passos.entries()) {
    await esperarObjetivo(id);
    if (movel) await abrirBalao(pagina);
    if ((await pagina.locator("[data-previsao]").count()) > 0) {
      await tocar(await opcaoDaPrevisao(pagina));
      await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
    }
    if (NEGATIVAS[id]) {
      await rodarTudo(NEGATIVAS[id]);
      conferir(!(await concluiu()), `${MODO}: ${id} não passa com o código errado`);
    }
    await rodarTudo(codigo);
    for (const [nome, [atributo, valor]] of Object.entries(CAIXINHAS[id] ?? {})) {
      conferir((await caixinha(nome).getAttribute(atributo)) === valor, `${MODO}: ${id}: ${nome} com ${atributo}=${valor} no palco`);
    }
    if (i < passos.length - 1) await naConversa("Próximo objetivo");
  }
  await conclusao("Próxima fase");
}
await pagina.locator(`[data-jogo-fase="${UNIDADE}-f${PASSOS.length + 1}"]`).waitFor();
await pagina.locator("[data-meta]").waitFor();
await tocar(pagina.getByRole("button", { name: "Começar o desafio" }));
await introducao();
for (const codigo of DESAFIO) await rodarTudo(codigo);
await conclusao("Voltar pra ilha");
await pagina.locator("[data-mapa=ilha][data-ilha=logica]").waitFor();
conferir((await pagina.locator(`[data-unidade="${UNIDADE}"]`).getAttribute("data-estado")) === "concluida", `${MODO}: unidade concluída na ilha`);
const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo (${relevantes.join(" | ")})`);
await navegador.close();
console.log(`decisoes.mjs ${MODO} ${UNIDADE}: ok`);
