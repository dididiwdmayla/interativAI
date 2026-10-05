// Jornada pelo mapa das unidades da zona Funções (Ilha Lógica): Console real,
// previsões por dados, negativas pedagógicas, palco, meta e desafio.
// Uso: node testes/funcoes.mjs [layout] [unidade]
import { readFileSync } from "node:fs";
import { PUBLICADAS, obrigatoriasProntasDaIlha } from "./curriculo.mjs";
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, opcaoDaPrevisao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";
const UNIDADE = process.argv[3] ?? "logica-funcoes-u1";
const numero = Number(UNIDADE.at(-1));
if (![1, 2, 3, 4].includes(numero)) throw new Error("Informe U1, U2, U3 ou U4 da Funções");

const sites = obrigatoriasProntasDaIlha("sites").map((unidade) => unidade.id);
const IDS_FERRAMENTAS = [...readFileSync(new URL("../src/ferramentas/ids.ts", import.meta.url), "utf8").matchAll(/^ {2}"([a-z-]+)",$/gm)].map((m) => m[1]);
const anteriores = obrigatoriasProntasDaIlha("logica").map((u) => u.id).filter((id) => !id.startsWith("logica-funcoes-") || Number(id.at(-1)) < numero);
const prontas = [...sites, ...anteriores];
const NOVAS = [];
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
const J = JSON.parse(readFileSync(new URL("./funcoes-jornadas.json", import.meta.url), "utf8"))[numero];
const { passos: PASSOS, desafio: DESAFIO, negativas: NEGATIVAS = {}, caixinhas: CAIXINHAS = {}, caixaDepois: CAIXA_DEPOIS, linhaDoTempo: TEMPO = {}, molduras: MOLDURAS = {} } = J;

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso, rota: "/", esperar: "[data-mapa=mundo]" });
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

/** Edita o Snippet pela UI; o Console fica para entradas curtas. */
async function rodar(codigo) {
  if (movel) await fecharBalao(pagina);
  const abas = pagina.getByRole("tablist", { name: "Painéis do DevTools" });
  if (codigo.includes("\n")) {
    await tocar(abas.getByRole("tab", { name: "Fontes", exact: true }));
    if (movel) await tocar(pagina.getByRole("tab", { name: "Snippet", exact: true }));
    const editor = pagina.locator("[data-editor-snippet] .cm-content");
    // No celular, a lista de autocompletar pode cobrir o centro do editor.
    if (movel) await editor.focus();
    else await editor.click();
    await pagina.keyboard.press("ControlOrMeta+A");
    await pagina.keyboard.insertText(codigo);
    await tocar(pagina.locator("[data-executar-snippet]"));
  } else {
    await tocar(abas.getByRole("tab", { name: "Console", exact: true }));
    const entrada = pagina.locator("[data-console]:visible [data-entrada-console]").first();
    await entrada.click();
    await pagina.keyboard.insertText(codigo);
    if (toque) await tocar(pagina.locator("[data-console]:visible [data-rodar-console]").first());
    else { await pagina.keyboard.press("Enter"); await assentar(); }
  }
}
/** Percorre o rastro pelos botões reais e lê os valores nas caixinhas. */
async function conferirTempo({ variavel, valores }) {
  if (movel) await fecharBalao(pagina);
  const tempo = pagina.locator("[data-linha-do-tempo]");
  const total = Number(await tempo.getAttribute("data-total-passos"));
  conferir(total > 2, `${MODO}: rastro disponível`);
  const encontrados = new Set();
  for (let i = total - 1; i >= 0; i--) {
    const valor = caixinha(variavel).locator("[data-valor-palco]");
    if (await valor.count()) encontrados.add(await valor.first().innerText());
    if (i > 0) await tocar(tempo.locator("[data-passo-anterior]"));
  }
  for (const valor of valores) conferir(encontrados.has(valor), `${MODO}: ${variavel} vale ${valor} numa volta`);
  for (let i = 1; i < total; i++) await tocar(tempo.locator("[data-passo-proximo]"));
  conferir((await tempo.getAttribute("data-passo-atual")) === String(total - 1), `${MODO}: rastro voltou ao fim`);
}
/** Vai para dentro da chamada e volta ao fim pelos controles reais. */
async function conferirMoldura({ funcao, parametros, retorno, bloco = {} }) {
  if (movel) await fecharBalao(pagina);
  const tempo = pagina.locator("[data-linha-do-tempo]");
  const total = Number(await tempo.getAttribute("data-total-passos"));
  conferir(total > 2, `${MODO}: rastro de ${funcao}`);
  const quadro = pagina.locator(`[data-palco] [data-quadro="${funcao}"]`);
  conferir(await quadro.count() === 0, `${MODO}: moldura some ao terminar ${funcao}`);
  let entrou = false;
  let devolveu = retorno === null;
  const encontrados = new Set();
  const blocosEncontrados = new Set();
  for (let i = total - 1; i >= 0; i--) {
    if (await quadro.count()) {
      entrou = true;
      for (const [nome, valor] of Object.entries(parametros)) {
        const caixa = quadro.locator(`[data-caixinha="${nome}"] [data-valor-palco]`);
        if (await caixa.count() && (await caixa.first().innerText()) === valor) encontrados.add(nome);
      }
      for (const [nome, valor] of Object.entries(bloco)) {
        const caixa = quadro.locator(`[data-bloco-palco] [data-caixinha="${nome}"] [data-valor-palco]`);
        if (await caixa.count() && (await caixa.first().innerText()) === valor) blocosEncontrados.add(nome);
      }
      const faixa = quadro.locator('[data-faixa-quadro="retorno"]');
      if (await faixa.count() && (await faixa.innerText()).includes(`devolve ${retorno}`)) {
        devolveu = true;
        for (const nome of Object.keys(bloco)) conferir(await quadro.locator(`[data-caixinha="${nome}"]`).count() === 0, `${MODO}: ${nome} some ao sair do bloco`);
      }
    }
    if (i > 0) await tocar(tempo.locator('[data-passo-anterior]'));
  }
  conferir(entrou, `${MODO}: entrada na moldura ${funcao}`);
  for (const nome of Object.keys(parametros)) conferir(encontrados.has(nome), `${MODO}: ${nome} dentro da moldura`);
  for (const nome of Object.keys(bloco)) conferir(blocosEncontrados.has(nome), `${MODO}: ${nome} dentro do bloco da moldura`);
  conferir(devolveu, `${MODO}: retorno ${retorno} no rastro`);
  for (let i = 1; i < total; i++) await tocar(tempo.locator('[data-passo-proximo]'));
  conferir(await quadro.count() === 0, `${MODO}: voltou ao Global`);
}
const rodarTudo = async (codigo) => {
  
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
    if (TEMPO[id]) await conferirTempo(TEMPO[id]);
    if (MOLDURAS[id]) await conferirMoldura(MOLDURAS[id]);
    if (id === "protecao-guiado") {
      conferir((await pagina.locator("[data-palco-erro]").innerText()).includes("Parada do jogo"), `${MODO}: proteção aparece no palco`);
    }
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
const tempoDesafio = pagina.locator("[data-linha-do-tempo]");
conferir(Number(await tempoDesafio.getAttribute("data-total-passos")) > 2, `${MODO}: desafio tem linha do tempo`);
await conclusao("Voltar pra ilha");
await pagina.locator("[data-mapa=ilha][data-ilha=logica]").waitFor();
conferir((await pagina.locator(`[data-unidade="${UNIDADE}"]`).getAttribute("data-estado")) === "concluida", `${MODO}: unidade concluída na ilha`);
const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo (${relevantes.join(" | ")})`);
await navegador.close();
console.log(`funcoes.mjs ${MODO} ${UNIDADE}: ok`);
