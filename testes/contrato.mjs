// O formato contrato no /lab (lab-contrato-u1-f1, em modo jogo), nos três
// layouts: o briefing do cliente (as falas aparecendo e o documento), a etapa
// de requisitos (uma distração na lista dá o aviso do colega; a lista certa,
// com as lacunas, começa o trabalho), o checklist ao vivo, a mudança de pedido
// no meio (a mensagem do cliente, o selo Novo e o adendo no documento), o
// código do antes caindo na parte nova, o do depois passando em tudo, a
// entrega com o relatório e a reação do cliente, até a conclusão.
// Uso: node testes/contrato.mjs [desktop|retrato|paisagem]
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";

const ANTES = ["for (let vez = 1; vez <= 2; vez++) {", "  lampada.ligar();", "  esperar(500);", "  lampada.desligar();", "  esperar(500);", "}", "ventilador.velocidade = 1;"].join("\n");
const DEPOIS = ["for (let vez = 1; vez <= 2; vez++) {", "  lampada.ligar();", "  esperar(500);", "  lampada.desligar();", "  esperar(500);", "}", "lampada.brilho = 30;", "lampada.ligar();", "ventilador.velocidade = 1;"].join("\n");

const { pagina, navegador, erros } = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: "/lab/fases?fase=lab-contrato-u1-f1&modo=jogo", esperar: "[data-jogo-fase]" });
const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
if (await recolher.isVisible().catch(() => false)) await (toque ? recolher.tap() : recolher.click());
await esperarPronto(pagina, 30000);

const tocar = async (localizador) => {
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
  await esperarPronto(pagina);
};
const objetivoAtual = () => pagina.locator("[data-jogo-fase]").getAttribute("data-objetivo-atual");
const modalAssentado = () => pagina.waitForSelector('[data-modal-assentado="sim"]');

// ---------------------------------------------------------------- a introdução do colega
for (let i = 0; i < 4; i++) {
  if (await pagina.locator("[data-conversa-cliente]").isVisible().catch(() => false)) break;
  if (movel) await abrirBalao(pagina);
  const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
  if (!(await botao.isVisible().catch(() => false))) break;
  await tocar(botao);
}

// ---------------------------------------------------------------- o briefing
await pagina.locator("[data-conversa-cliente]").waitFor();
await modalAssentado();
conferir((await objetivoAtual()) === "contrato-briefing", `${MODO}: o contrato começa no briefing`);
conferir((await pagina.locator("[data-checklist-vazio]").count()) > 0 || movel, `${MODO}: antes dos requisitos, o checklist não entrega a lista`);
// O cliente fala: a boca mexe enquanto o texto aparece, com o rosto da expressão da fala.
const retrato = pagina.locator("[data-conversa-cliente] [data-cliente]");
conferir((await retrato.getAttribute("data-cliente")) === "rafa-estudio", `${MODO}: o cliente do contrato aparece no briefing`);
conferir((await retrato.getAttribute("data-expressao")) === "preocupado", `${MODO}: o rosto do cliente segue a expressão da fala`);
// Continuar no meio da fala completa a fala; depois passa para a próxima.
await tocar(pagina.locator("[data-conversa-continuar]"));
conferir((await retrato.getAttribute("data-falando")) === "nao", `${MODO}: com a fala completa, a boca para de mexer`);
conferir((await pagina.locator("[data-conversa-cliente]").getAttribute("data-fala-completa")) === "sim", `${MODO}: Continuar no meio completa a fala do cliente`);
for (let i = 0; i < 10; i++) {
  if (await pagina.locator("[data-conversa-fim]").isVisible().catch(() => false)) break;
  await tocar(pagina.locator("[data-conversa-continuar]"));
}
conferir(await pagina.locator("[data-documento-cliente]").isVisible(), `${MODO}: depois das falas, o pedido por escrito`);
await tocar(pagina.locator("[data-conversa-fim]"));

// ---------------------------------------------------------------- os requisitos
await pagina.locator("[data-requisitos]").waitFor();
await modalAssentado();
conferir((await objetivoAtual()) === "contrato-requisitos", `${MODO}: depois do briefing, a etapa de requisitos`);
const cartao = (id) => pagina.locator(`[data-cartao-requisito="${id}"]`);
await tocar(cartao("pisca").locator("button").first());
await tocar(cartao("pisca").locator('[data-opcao="2"]'));
await tocar(cartao("ventilador").locator("button").first());
await tocar(cartao("ventilador").locator('[data-opcao="1"]'));
await tocar(cartao("roxa").locator("button").first());
await tocar(pagina.locator("[data-conferir-requisitos]"));
conferir(/só comentou/.test((await pagina.locator("[data-fala-requisitos]").textContent()) ?? ""), `${MODO}: com uma distração, o colega avisa sem dizer qual`);
conferir((await cartao("roxa").getAttribute("data-situacao")) === "", `${MODO}: na primeira vez, o cartão errado não é apontado`);
await tocar(pagina.locator("[data-conferir-requisitos]"));
conferir((await cartao("roxa").getAttribute("data-situacao")) === "sobrou", `${MODO}: na segunda, o cartão que sobrou aparece com o porquê`);
await tocar(cartao("roxa").locator("button").first());
await tocar(pagina.locator("[data-conferir-requisitos]"));
await pagina.locator("[data-requisitos]").waitFor({ state: "detached" });
await esperarPronto(pagina);
conferir((await objetivoAtual()) === "contrato-trabalho", `${MODO}: a lista certa começa o trabalho`);

// ---------------------------------------------------------------- o trabalho
const area = async (id) => {
  if (!movel) return;
  await fecharBalao(pagina);
  const aba = pagina.locator(`[data-abas-composicao] [data-segmento="${id}"]`);
  if (!(await aba.count())) return;
  if ((await aba.getAttribute("aria-selected")) !== "true") await tocar(aba);
};
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
  await pagina.keyboard.insertText(codigo);
  await esperarPronto(pagina);
};
const executar = async () => {
  await area("snippet");
  await tocar(pagina.locator("[data-executar-snippet]"));
};
/** Põe o checklist à vista: deitado, no balão; em pé, na barra de cima (que abre a lista). */
const verChecklist = async () => {
  if (MODO === "paisagem") await abrirBalao(pagina);
  if (MODO === "retrato") {
    await fecharBalao(pagina);
    const barra = pagina.locator('button[aria-expanded]:has-text("Requisitos do cliente")').first();
    if ((await barra.getAttribute("aria-expanded")) !== "true") await tocar(barra);
  }
  await pagina.locator("[data-checklist]").first().waitFor();
};
const esconderChecklist = async () => {
  if (MODO === "paisagem") await fecharBalao(pagina);
  if (MODO === "retrato") {
    const barra = pagina.locator('button[aria-expanded="true"]:has-text("Requisitos do cliente")').first();
    if (await barra.count()) await tocar(barra);
  }
};
const feita = (id) => pagina.locator(`[data-checklist] [data-parte="${id}"]`).first().getAttribute("data-feita");

// A ficha do ventilador (o item do processo).
if (movel) await fecharBalao(pagina);
await verCena();
await tocar(pagina.locator('[data-dispositivo="ventilador"]'));
await modalAssentado();
await pagina.keyboard.press("Escape");
await pagina.waitForSelector("[data-ficha-dispositivo]", { state: "detached" });
await esperarPronto(pagina);

// O código do antes: o pisca-pisca pronto faz a mensagem do cliente chegar.
await escrever(ANTES);
await executar();
await pagina.locator("[data-conversa-cliente]").waitFor({ timeout: 15000 });
await modalAssentado();
conferir(((await pagina.locator("[data-conversa-cliente]").textContent()) ?? "").includes("Mensagem nova"), `${MODO}: a mensagem de mudança do cliente aparece`);
for (let i = 0; i < 6; i++) {
  const continuar = pagina.locator("[data-conversa-continuar]");
  if (!(await continuar.isVisible().catch(() => false))) break;
  await tocar(continuar);
}
await pagina.locator("[data-conversa-cliente]").waitFor({ state: "detached" });
await esperarPronto(pagina);
if (movel) await abrirBalao(pagina);
const voltar = pagina.getByRole("button", { name: "Voltar ao trabalho" });
if (await voltar.isVisible().catch(() => false)) await tocar(voltar);
if (movel) await fecharBalao(pagina);

// O checklist mudou: a parte nova (com o selo) no lugar do pisca-pisca, e o código do antes não passa nela.
await verChecklist();
conferir((await pagina.locator("[data-checklist] [data-parte-nova]").count()) > 0, `${MODO}: a parte nova aparece com o selo Novo`);
conferir((await feita("pisca-e-fica")) !== "true", `${MODO}: com o código do antes, a parte nova não passa (a mudança pede ajuste)`);
conferir((await feita("ventilador")) === "true", `${MODO}: o que não mudou continua marcado`);

// O pedido mudou também no documento (o botão Pedido fica em cima do checklist).
{
  await tocar(pagina.locator("[data-checklist] [data-abrir-documento]").first());
  await modalAssentado();
  conferir((await pagina.locator("[data-documento-cliente]").getAttribute("data-com-adendo")) === "sim", `${MODO}: o documento do cliente ganha a mensagem da mudança`);
  await pagina.keyboard.press("Escape");
  await pagina.waitForSelector("[data-documento-cliente]", { state: "detached" });
  await esperarPronto(pagina);
  await esconderChecklist();
}

// O código do depois: tudo passa, a entrega abre.
await escrever(DEPOIS);
await executar();
if (movel) await abrirBalao(pagina);
const resultado = pagina.getByRole("button", { name: "Ver resultado" });
await resultado.waitFor({ timeout: 15000 });
await tocar(resultado);

// ---------------------------------------------------------------- a entrega
await pagina.locator("[data-relatorio]").waitFor();
await modalAssentado();
conferir((await objetivoAtual()) === "contrato-entrega", `${MODO}: todos os requisitos abrem a entrega`);
const requisitos = await pagina.locator("[data-relatorio-requisitos] li").count();
conferir(requisitos === 2, `${MODO}: o relatório lista os 2 pedidos do cliente (${requisitos})`);
conferir(((await pagina.locator("[data-relatorio]").textContent()) ?? "").includes("Pedido novo"), `${MODO}: o relatório marca o pedido que mudou`);
await tocar(pagina.locator("[data-enviar-relatorio]"));
for (let i = 0; i < 6; i++) {
  const continuar = pagina.locator("[data-reacao-continuar]");
  if (!(await continuar.isVisible().catch(() => false))) break;
  await tocar(continuar);
}
await pagina.locator("[data-comemoracao-ilha]").waitFor();
conferir(await pagina.locator("[data-comemoracao-ilha] [data-cliente]").isVisible(), `${MODO}: a comemoração de fim de ilha, com o cliente satisfeito`);
await tocar(pagina.locator("[data-fim-entrega]"));
await pagina.locator("[data-conclusao]").waitFor({ timeout: 15000 });
conferir(((await pagina.locator("[data-conclusao]").textContent()) ?? "").includes("Trabalho entregue!"), `${MODO}: a conclusão é a do trabalho entregue`);

// ---------------------------------------------------------------- levar pro mundo
for (let i = 0; i < 4; i++) {
  if (await pagina.locator("[data-levar-programa]").isVisible().catch(() => false)) break;
  await tocar(pagina.getByRole("dialog").getByRole("button", { name: "Continuar" }));
}
await tocar(pagina.locator("[data-levar-programa]"));
await pagina.locator("[data-levar-pro-mundo-js]").waitFor();
conferir(((await pagina.locator("[data-previa-programa]").textContent()) ?? "").includes("lampada.brilho = 30;"), `${MODO}: a prévia mostra o código do aluno`);
const [download] = await Promise.all([pagina.waitForEvent("download"), tocar(pagina.locator("[data-baixar-programa]"))]);
conferir(download.suggestedFilename() === "estudio-do-rafa.js", `${MODO}: baixa o estudio-do-rafa.js (${download.suggestedFilename()})`);
const { readFileSync } = await import("node:fs");
const { execFileSync } = await import("node:child_process");
const caminho = await download.path();
const texto = readFileSync(caminho, "utf8");
const noNode = execFileSync(process.execPath, [caminho], { encoding: "utf8" });
conferir(noNode.includes("[2,0 s] Lâmpada: brilho 30") && noNode.includes("Fim da simulação."), `${MODO}: o .js roda no Node e mostra as ações`);
// No Console de um navegador: uma página qualquer, o arquivo colado inteiro.
const outra = await pagina.context().newPage();
const linhasNoConsole = [];
outra.on("console", (mensagem) => linhasNoConsole.push(mensagem.text()));
await outra.goto("about:blank");
await outra.evaluate(texto);
conferir(linhasNoConsole.includes("[0,5 s] Lâmpada: desligada") && linhasNoConsole.some((linha) => linha.includes("Fim da simulação")), `${MODO}: o .js roda no Console de um navegador (${linhasNoConsole.length} linhas)`);
await outra.close();

conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo (${errosRelevantes(erros).join(" | ")})`);
await navegador.close();
