// O Console, o Snippet e os validadores de código na Bancada da Lógica
// (/lab/fases?fase=lab-logica-u1-f1): a previsão e a resposta do Console,
// o undefined depois de let, o histórico com a seta para cima, Shift+Enter
// para várias linhas, o erro com a explicação, o loop infinito parado sem
// travar a aba, o isolamento (sem localStorage, document, rede nem
// mensagens para a página), a aba Fontes com o Snippet (Executar e
// Ctrl+Enter) e o funcaoPassa. No toque: o botão Rodar e a barra de símbolos.
// Uso: node testes/console.mjs [desktop|retrato|paisagem]
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";

const { navegador, pagina, erros } = await abrir({
  ...TAMANHOS[MODO],
  progresso: null,
  rota: "/lab/fases?fase=lab-logica-u1-f1",
  esperar: "[data-jogo-fase]",
});
if (toque) {
  const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
  if (await recolher.isVisible().catch(() => false)) await recolher.tap();
}
await esperarPronto(pagina, 30000);

async function tocar(localizador) {
  if (movel) await fecharBalao(pagina);
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
  await esperarPronto(pagina);
}

const consoleVisivel = pagina.locator("[data-console]:visible").first();
const entrada = consoleVisivel.locator("[data-entrada-console]");
const linhas = consoleVisivel.locator("[data-linha-console]");
const objetivoAtual = () => pagina.locator("[data-jogo-fase]").getAttribute("data-objetivo-atual");
const esperarObjetivo = (id) =>
  pagina.waitForFunction((alvo) => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === alvo, id, { timeout: 10000 });

/** Escreve e roda no Console: Enter no teclado ou, no toque, o botão Rodar. */
async function rodar(codigo) {
  if (movel) await fecharBalao(pagina);
  await entrada.click();
  await pagina.keyboard.insertText(codigo);
  if (toque) await consoleVisivel.locator("[data-rodar-console]").tap();
  else await pagina.keyboard.press("Enter");
  await esperarPronto(pagina);
}

const ultimaLinha = async () => {
  const todas = await linhas.evaluateAll((els) => els.map((e) => ({ tipo: e.dataset.linhaConsole, texto: e.innerText.trim() })));
  return todas[todas.length - 1];
};

/** Os botões da conversa moram no balão: no celular, abre e toca sem fechar. */
async function naConversa(nome) {
  if (movel) await abrirBalao(pagina);
  const botao = pagina.getByRole("button", { name: nome }).first();
  await botao.waitFor({ timeout: 10000 });
  if (toque) await botao.tap();
  else await botao.click();
  await esperarPronto(pagina);
}

const seguir = () => naConversa(/Próximo objetivo|Ver resultado/);

// Introdução até a previsão.
for (let i = 0; i < 4 && (await pagina.locator("[data-previsao]").count()) === 0; i++) {
  if (movel) await abrirBalao(pagina);
  const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
  if (!(await botao.isVisible().catch(() => false))) break;
  await naConversa(/^(Continuar|Vamos lá!)$/);
}

// ---------------------------------------------------------------- 1. previsão e resposta do Console
conferir((await objetivoAtual()) === "conta", `${MODO}: começa na previsão da conta`);
// A previsão mora no balão (no celular, com ele aberto).
if (movel) await abrirBalao(pagina);
await pagina.locator("[data-previsao]").waitFor();
const opcao = pagina.locator("[data-previsao] button").nth(1);
if (toque) await opcao.tap();
else await opcao.click();
await esperarPronto(pagina);
await rodar("2 + 3 * 4");
conferir((await ultimaLinha()).tipo === "resposta" && (await ultimaLinha()).texto === "14", `${MODO}: o Console responde 14`);
await esperarObjetivo("conta").catch(() => {});
await seguir();

// ---------------------------------------------------------------- 2. let, undefined, histórico e Shift+Enter
await esperarObjetivo("variavel");
await rodar("let total = 15");
conferir((await ultimaLinha()).texto === "undefined", `${MODO}: depois de let, o Console responde undefined`);
conferir((await pagina.locator("[data-palco] [data-caixinha='total']").count()) === 1, `${MODO}: a caixinha total aparece no palco`);
await seguir();
await esperarObjetivo("erro-da-const");
if (!toque) {
  await entrada.click();
  await pagina.keyboard.press("ArrowUp");
  const trazido = await entrada.innerText();
  conferir(trazido.trim() === "let total = 15", `${MODO}: a seta para cima traz o comando anterior (veio "${trazido.trim()}")`);
  await pagina.keyboard.press("ControlOrMeta+A");
  await pagina.keyboard.press("Backspace");
  await pagina.keyboard.type("let a = 1");
  await pagina.keyboard.press("Shift+Enter");
  await pagina.keyboard.type("a + 1");
  await pagina.keyboard.press("Enter");
  await esperarPronto(pagina);
  const entradas = await linhas.evaluateAll((els) => els.filter((e) => e.dataset.linhaConsole === "entrada").map((e) => e.innerText));
  conferir(entradas[entradas.length - 1].includes("let a = 1\na + 1"), `${MODO}: Shift+Enter pula linha e roda as duas juntas`);
  conferir((await ultimaLinha()).texto === "2", `${MODO}: a entrada de duas linhas responde 2`);
}

// ---------------------------------------------------------------- 3. erro explicado, loop infinito e isolamento
await rodar("taxa = 3");
const erro = consoleVisivel.locator("[data-linha-console='erro']").last();
conferir((await erro.getAttribute("data-erro")) === "TypeError", `${MODO}: trocar a const dá TypeError`);
conferir((await erro.innerText()).includes("Uncaught TypeError: Assignment to constant variable."), `${MODO}: a mensagem original do navegador aparece`);
conferir((await erro.locator("[data-explicacao-erro]").innerText()).includes("const não troca de valor"), `${MODO}: com a explicação de leigo embaixo`);
await seguir();
await esperarObjetivo("funcao");

const inicio = Date.now();
await rodar("let i = 0; while (true) { i = i + 1 }");
conferir(Date.now() - inicio < 8000, `${MODO}: o loop infinito não trava a aba (${Date.now() - inicio} ms)`);
conferir((await consoleVisivel.locator("[data-linha-console='erro']").last().innerText()).includes("Loop que nunca termina"), `${MODO}: o loop infinito vira uma parada explicada`);
await rodar("[typeof localStorage, typeof document, typeof window, typeof fetch, typeof postMessage, typeof importScripts].join(',')");
conferir(
  (await ultimaLinha()).texto === "'undefined,undefined,undefined,undefined,undefined,undefined'",
  `${MODO}: o código não alcança armazenamento, página, rede nem o canal com o jogo (${(await ultimaLinha()).texto})`,
);
await rodar("1 + 1");
conferir((await ultimaLinha()).texto === "2", `${MODO}: o Console continua funcionando depois da parada`);

// ---------------------------------------------------------------- 4. Snippet (aba Fontes) e funcaoPassa
await tocar(pagina.getByRole("tab", { name: "Fontes", exact: true }));
const editor = pagina.locator("[data-editor-snippet] .cm-content");
if (movel) await fecharBalao(pagina);
await editor.click();
await pagina.keyboard.press("ControlOrMeta+A");
await pagina.keyboard.insertText("function dobro(n) {\n  console.log(n * 2);\n}");
if (toque) await tocar(pagina.locator("[data-executar-snippet]"));
else {
  await pagina.keyboard.press("ControlOrMeta+Enter");
  await esperarPronto(pagina);
}
conferir((await objetivoAtual()) === "funcao", `${MODO}: console.log no lugar do return não passa no funcaoPassa`);
if (movel) await fecharBalao(pagina);
if (movel) await tocar(pagina.getByRole("tab", { name: "Snippet", exact: true }));
await editor.click();
await pagina.keyboard.press("ControlOrMeta+A");
await pagina.keyboard.insertText("function dobro(n) {\n  return n * 2;\n}");
if (toque) {
  // A barra de símbolos escreve no Snippet sem fechar o teclado.
  await pagina.keyboard.press("ControlOrMeta+End");
  await pagina.locator("[data-editor-snippet] [data-barra-simbolos] button", { hasText: ";" }).tap();
  const texto = await editor.evaluate((no) => no.cmTile?.view?.state.doc.toString() ?? no.innerText);
  conferir(texto.trimEnd().endsWith(";"), `${MODO}: a barra de símbolos escreve no Snippet`);
}
await tocar(pagina.locator("[data-executar-snippet]"));
await pagina.waitForFunction(() => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === "funcao", null, { timeout: 5000 }).catch(() => {});
if (movel) await abrirBalao(pagina);
conferir(await pagina.getByRole("button", { name: /Próximo objetivo/ }).first().isVisible(), `${MODO}: com return, o funcaoPassa passa e o objetivo conclui`);
await seguir();

// ---------------------------------------------------------------- 5. saída exata
await esperarObjetivo("mensagem");
await tocar(pagina.getByRole("tablist", { name: "Painéis do DevTools" }).getByRole("tab", { name: "Console", exact: true }));
await rodar("console.log('Pronto!')");
const saida = consoleVisivel.locator("[data-linha-console='saida-log']").last();
conferir((await saida.getAttribute("data-texto")) === "Pronto!", `${MODO}: console.log mostra o texto sem aspas`);
if (movel) await abrirBalao(pagina);
await pagina.getByRole("button", { name: /Ver resultado|Próximo objetivo/ }).first().waitFor({ timeout: 8000 });
conferir(true, `${MODO}: saida + semErro concluem o último objetivo`);

const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo (${relevantes.join(" | ")})`);
await navegador.close();
console.log(`console.mjs ${MODO}: ok`);
