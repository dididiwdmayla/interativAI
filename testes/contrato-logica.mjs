// Jornada real pelo mapa da unidade publicada "O contrato da padaria"
// (logica-programa-de-verdade-u1), nos três layouts: a fase 1 (a vitrine,
// o relógio, a campainha e o loop de controle) e o contrato inteiro, do
// briefing da Dona Celeste ao Levar pro mundo, com a mudança de pedido no
// meio. As soluções vêm de testes/contrato-jornadas.json (o teste de
// conteúdo confere que ele acompanha o TS).
// Uso: node testes/contrato-logica.mjs [desktop|retrato|paisagem]
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, opcaoDaPrevisao } from "./util.mjs";
import { obrigatoriasProntasDaIlha, PUBLICADAS } from "./curriculo.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = { desktop: [1440, 900], retrato: [390, 844], paisagem: [844, 390] };
const [largura, altura] = TAMANHOS[MODO];
const toque = MODO !== "desktop";
const UNIDADE = "logica-programa-de-verdade-u1";
const JORNADA = JSON.parse(readFileSync(new URL("./contrato-jornadas.json", import.meta.url)));

const prontas = [...obrigatoriasProntasDaIlha("sites"), ...obrigatoriasProntasDaIlha("logica")].map((u) => u.id).filter((id) => id !== UNIDADE);
const ferramentas = [...readFileSync(new URL("../src/ferramentas/ids.ts", import.meta.url), "utf8").matchAll(/^ {2}"([a-z-]+)",$/gm)].map((m) => m[1]);
const progresso = {
  versao: 2,
  fasesConcluidas: prontas.flatMap((u) => PUBLICADAS[u] ?? []),
  estrelasPorFase: {},
  fasesEmAndamento: {},
  faseAtual: null,
  tema: "doce",
  temasDesbloqueados: ["doce", "fliperama"],
  som: false,
  missoesDeCampo: {},
  apresentacoesVistas: ferramentas,
  metasVistas: prontas,
  unidadesComemoradas: prontas,
  ilhasComemoradas: ["sites"],
  posicaoNoMapa: {},
  mapaDesbloqueado: false,
  proporcaoPrevia: 0.4,
};

const { pagina, navegador, erros } = await abrir({ largura, altura, toque, progresso, rota: "/ilha/logica", esperar: "[data-mapa=ilha]" });
const pronto = () => esperarPronto(pagina, 30000);
async function tocar(alvo) {
  await alvo.scrollIntoViewIfNeeded();
  await (toque ? alvo.tap() : alvo.click());
  await pronto();
}
const objetivoAtual = () => pagina.locator("[data-jogo-fase]").getAttribute("data-objetivo-atual");
const modalAssentado = () => pagina.waitForSelector('[data-modal-assentado="sim"]');
async function area(id) {
  if (!toque) return;
  await fecharBalao(pagina);
  const aba = pagina.locator(`[data-abas-composicao] [data-segmento="${id}"]`);
  if ((await aba.count()) && (await aba.getAttribute("aria-selected")) !== "true") await tocar(aba);
}
async function verCena() {
  if (MODO === "paisagem") await area("cena");
  if (MODO === "retrato" && !(await pagina.locator('[data-area-trabalho="cena"]').isVisible())) {
    await fecharBalao(pagina);
    await tocar(pagina.locator("[data-alternar-cena]"));
  }
}
async function botaoDoBalao(nome) {
  if (toque) await abrirBalao(pagina);
  const botao = pagina.getByRole("button", { name: nome }).first();
  await botao.waitFor({ timeout: 15000 });
  await tocar(botao);
}
async function introducao() {
  for (let i = 0; i < 6; i++) {
    if (await pagina.locator("[data-conversa-cliente]").isVisible().catch(() => false)) return;
    if (toque) await abrirBalao(pagina);
    const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
    if (!(await botao.isVisible().catch(() => false))) return;
    await tocar(botao);
  }
}
/** Em pé, a cena aberta em cima aperta o código (no celular de verdade, ela recolhe sozinha com o teclado). */
async function recolherCena() {
  if (MODO !== "retrato" || !(await pagina.locator('[data-area-trabalho="cena"]').isVisible())) return;
  await fecharBalao(pagina);
  await tocar(pagina.locator("[data-alternar-cena]"));
}
async function escrever(codigo) {
  await recolherCena();
  await area("snippet");
  const aba = pagina.getByRole("tab", { name: "Snippet", exact: true });
  if (await aba.isVisible().catch(() => false)) await tocar(aba);
  if (toque) await fecharBalao(pagina);
  await pagina.locator("[data-editor-snippet] .cm-content").click();
  await pagina.keyboard.press("ControlOrMeta+A");
  await pagina.keyboard.press("Delete");
  await pagina.keyboard.insertText(codigo);
  await pronto();
}
async function noConsole(codigo) {
  await recolherCena();
  await area("snippet");
  if (toque) {
    const consoleAba = pagina.locator('[data-segmento="baixo"]:visible').first();
    if ((await consoleAba.count()) && (await consoleAba.getAttribute("aria-selected")) !== "true") await tocar(consoleAba);
    await fecharBalao(pagina);
  }
  await pagina.locator("[data-console]:visible [data-entrada-console]").first().click();
  await pagina.keyboard.insertText(codigo);
  if (toque) await tocar(pagina.locator("[data-console]:visible [data-rodar-console]").first());
  else await pagina.keyboard.press("Enter");
  await pronto();
}
/** Passa pela conversa de um cliente aberta (briefing ou mensagem de mudança). */
async function ouvirCliente() {
  await pagina.locator("[data-conversa-cliente]").waitFor();
  await modalAssentado();
  for (let i = 0; i < 12; i++) {
    const fim = pagina.locator("[data-conversa-fim]");
    if (await fim.isVisible().catch(() => false)) {
      await tocar(fim);
      break;
    }
    const continuar = pagina.locator("[data-conversa-continuar]");
    if (!(await continuar.isVisible().catch(() => false))) break;
    await tocar(continuar);
  }
  await pagina.locator("[data-conversa-cliente]").waitFor({ state: "detached" });
  await pronto();
}
async function acoes(lista) {
  for (const acao of lista) {
    if (acao.tipo === "abrirFicha") {
      await verCena();
      if (toque) await fecharBalao(pagina);
      await tocar(pagina.locator(`[data-dispositivo="${acao.dispositivo}"]`));
      await modalAssentado();
      await pagina.keyboard.press("Escape");
      await pagina.waitForSelector("[data-ficha-dispositivo]", { state: "detached" });
      await pronto();
    } else if (acao.tipo === "responderPrevisao") {
      if (toque) await abrirBalao(pagina);
      await tocar(await opcaoDaPrevisao(pagina));
    } else if (acao.tipo === "executarNoConsole") await noConsole(acao.codigo);
    else if (acao.tipo === "definirSnippet") await escrever(acao.codigo);
    else if (acao.tipo === "executarSnippet") {
      await area("snippet");
      await tocar(pagina.locator("[data-executar-snippet]"));
    } else if (acao.tipo === "porPasso") {
      await area("plano");
      await tocar(pagina.locator(`[data-escolher-passo="${acao.passo}"]`).first());
      await tocar(pagina.locator('[data-por-aqui="plano:fim"]'));
    } else if (acao.tipo === "levarPlanoProCodigo") {
      await area("plano");
      await tocar(pagina.locator("[data-levar-plano]"));
    } else if (acao.tipo === "escreverCaso") {
      await area("testes");
      await pagina.locator("[data-entrada-nova]").fill(acao.entrada);
      await pagina.locator("[data-esperado-novo]").fill(acao.esperado);
      await tocar(pagina.locator("[data-adicionar-caso]"));
    } else if (acao.tipo === "rodarCasos") {
      await area("testes");
      await tocar(pagina.locator("[data-rodar-casos]"));
    } else throw new Error(`Ação sem UI: ${acao.tipo}`);
  }
}

// ---------------------------------------------------------------- pelo mapa
const ponto = pagina.locator(`[data-unidade="${UNIDADE}"]`);
conferir((await ponto.getAttribute("data-estado")) === "disponivel", `${MODO}: o contrato está disponível no fim da Ilha Lógica`);
await tocar(ponto);
await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Jogar", exact: true }));

// ---------------------------------------------------------------- fase 1: a vitrine às seis da manhã
await pagina.locator(`[data-jogo-fase="${JORNADA.pratica.id}"]`).waitFor();
await pronto();
const meta = pagina.locator("[data-meta]");
if (await meta.isVisible().catch(() => false)) {
  await pagina.locator("[data-mini-cena]").first().waitFor();
  conferir((await pagina.locator("[data-mini-codigo]").count()) === 0, `${MODO}: a meta do contrato mostra a cena antes e depois, sem entregar o código`);
  await tocar(pagina.getByRole("button", { name: "Bora!" }));
}
await introducao();
for (const objetivo of JORNADA.pratica.objetivos) {
  await pagina.waitForFunction((alvo) => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === alvo, objetivo.id);
  await acoes(objetivo.solucaoDeTeste);
  await botaoDoBalao(/^(Próximo objetivo|Ver resultado)$/);
}
await pagina.locator("[data-conclusao]").waitFor();
await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Continuar" }).first()).catch(() => {});
for (let i = 0; i < 4; i++) {
  const proxima = pagina.getByRole("dialog").getByRole("button", { name: "Próxima fase" });
  if (await proxima.isVisible().catch(() => false)) {
    await tocar(proxima);
    break;
  }
  await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Continuar" }).first());
}
conferir(true, `${MODO}: a fase 1 (a vitrine, o relógio, a campainha e o loop de controle) concluída`);

// ---------------------------------------------------------------- o contrato
await pagina.locator(`[data-jogo-fase="${JORNADA.contrato.id}"]`).waitFor();
await pronto();
await introducao();
await ouvirCliente();
conferir((await objetivoAtual()) === "contrato-requisitos", `${MODO}: depois da Dona Celeste falar, a etapa de requisitos`);
for (const id of JORNADA.contrato.escolha.cartoes) {
  const cartao = pagina.locator(`[data-cartao-requisito="${id}"]`);
  await tocar(cartao.locator("button").first());
  const respostas = JORNADA.contrato.escolha.lacunas[id] ?? [];
  for (const [lacuna, opcao] of respostas.entries()) await tocar(cartao.locator(`[data-lacuna="${lacuna}"]`).nth(opcao));
}
await tocar(pagina.locator("[data-conferir-requisitos]"));
await pagina.locator("[data-requisitos]").waitFor({ state: "detached" });
await pronto();
conferir((await objetivoAtual()) === "contrato-trabalho", `${MODO}: a lista certa, com as lacunas do documento, começa o trabalho`);

let mudou = false;
for (const parte of JORNADA.contrato.partes) {
  await acoes(parte.solucaoDeTeste);
  if (!mudou && (await pagina.locator("[data-conversa-cliente]").isVisible().catch(() => false))) {
    mudou = true;
    conferir(JORNADA.contrato.depoisDe.every((id) => JORNADA.contrato.partes.findIndex((p) => p.id === id) <= JORNADA.contrato.partes.indexOf(parte)), `${MODO}: a mensagem de mudança chega depois da luz e do letreiro prontos`);
    await ouvirCliente();
  }
}
conferir(mudou, `${MODO}: a Dona Celeste mudou o pedido no meio do trabalho`);
await botaoDoBalao("Ver resultado");

// ---------------------------------------------------------------- a entrega e o Levar pro mundo
await pagina.locator("[data-relatorio]").waitFor();
await modalAssentado();
const relatorio = (await pagina.locator("[data-relatorio]").textContent()) ?? "";
conferir(relatorio.includes("Requisitos atendidos: 4 de 4") && relatorio.includes("Pedido novo"), `${MODO}: o relatório mostra os 4 pedidos, com o que mudou`);
conferir((await pagina.locator("[data-relatorio-casos]").textContent())?.includes("4 de 4"), `${MODO}: o relatório conta os casos de teste do aluno passando`);
await tocar(pagina.locator("[data-enviar-relatorio]"));
for (let i = 0; i < 6; i++) {
  const continuar = pagina.locator("[data-reacao-continuar]");
  if (!(await continuar.isVisible().catch(() => false))) break;
  await tocar(continuar);
}
await pagina.locator("[data-comemoracao-ilha]").waitFor();
conferir(((await pagina.locator("[data-comemoracao-ilha]").textContent()) ?? "").includes("Ilha Lógica"), `${MODO}: a comemoração de fim da Ilha Lógica`);
await tocar(pagina.locator("[data-fim-entrega]"));
await pagina.locator("[data-conclusao]").waitFor();
for (let i = 0; i < 4; i++) {
  if (await pagina.locator("[data-levar-programa]").isVisible().catch(() => false)) break;
  await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Continuar" }));
}
await tocar(pagina.locator("[data-levar-programa]"));
await pagina.locator("[data-levar-pro-mundo-js]").waitFor();
const [download] = await Promise.all([pagina.waitForEvent("download"), tocar(pagina.locator("[data-baixar-programa]"))]);
conferir(download.suggestedFilename() === JORNADA.contrato.arquivo, `${MODO}: baixa o ${JORNADA.contrato.arquivo}`);
const saida = execFileSync(process.execPath, [await download.path()], { encoding: "utf8" });
conferir(saida.includes("[07:00] Luz da vitrine: ligada") && saida.includes('Letreiro: "CLIENTES: 4"') && saida.includes("Campainha do forno: plim!"), `${MODO}: o .js da vitrine roda no Node e mostra as ações`);

conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo (${errosRelevantes(erros).join(" | ")})`);
await navegador.close();
