// O depurador da aba Fontes, na demonstração (/lab/fases?fase=lab-logica-u1-f4):
// ponto de parada clicando (ou tocando) no número da linha, Executar pausando
// ANTES da linha (aviso "Pausado no depurador", linha acesa e o palco do
// momento), o Observar com o valor de cada pausa, Passar por cima, Entrar na
// função com a Pilha de chamadas, o Escopo batendo com o palco, o valor no
// hover do código, o Console respondendo no momento pausado e Sair + Retomar
// até o fim. No celular: os painéis em abas e os controles na barra de baixo.
// Uso: node testes/depurador.mjs [desktop|retrato|paisagem]
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, opcaoDaPrevisao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: "/lab/fases?fase=lab-logica-u1-f4", esperar: "[data-jogo-fase]" });
const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
if (await recolher.isVisible().catch(() => false)) await (toque ? recolher.tap() : recolher.click());
await esperarPronto(pagina, 30000);

async function tocar(localizador) {
  if (movel) await fecharBalao(pagina);
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
  await esperarPronto(pagina);
}
async function naConversa(nome) {
  if (movel) await abrirBalao(pagina);
  const botao = pagina.getByRole("button", { name: nome }).first();
  await botao.waitFor({ timeout: 10000 });
  if (toque) await botao.tap();
  else await botao.click();
  await esperarPronto(pagina);
}
const esperarObjetivo = (id) =>
  pagina.waitForFunction((alvo) => document.querySelector("[data-jogo-fase]")?.getAttribute("data-objetivo-atual") === alvo, id, { timeout: 10000 });
const objetivoConcluido = async () => {
  if (movel) await abrirBalao(pagina);
  return pagina.getByRole("button", { name: /Próximo objetivo|Ver resultado/ }).first().isVisible();
};
/** No celular, o botão da aba Fontes (Snippet | Depurador | Console). */
async function mostrarNaFontes(nome) {
  if (!movel) return;
  await tocar(pagina.getByRole("tablist", { name: "Mostrar na aba Fontes" }).getByRole("tab", { name: nome }));
}
/** No celular, a aba do depurador (Escopo | Observar | Pilha | Pontos). */
async function abaDoDepurador(nome) {
  if (!movel) return;
  await mostrarNaFontes("Depurador");
  await tocar(pagina.getByRole("tablist", { name: "Painéis do depurador" }).getByRole("tab", { name: nome }));
}
async function controle(nome) {
  const barra = pagina.locator(`[data-controle-depurador="${nome}"]:visible`).first();
  await tocar(barra);
}
const valorObservado = (expressao) => pagina.locator(`[data-observacao="${expressao}"] [data-valor-observado]`).first().innerText();
const caixinha = (nome) => pagina.locator(`[data-palco] [data-caixinha='${nome}']`).first();

for (let i = 0; i < 4; i++) {
  if (movel) await abrirBalao(pagina);
  const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!)$/ }).first();
  if (!(await botao.isVisible().catch(() => false))) break;
  await naConversa(/^(Continuar|Vamos lá!)$/);
}
await tocar(pagina.getByRole("tablist", { name: "Painéis do DevTools" }).getByRole("tab", { name: "Fontes", exact: true }));

// ---------------------------------------------------------------- 1. ponto de parada no número da linha
await esperarObjetivo("ponto");
await mostrarNaFontes("Snippet");
await tocar(pagina.locator("[data-editor-snippet] .cm-lineNumbers .cm-gutterElement", { hasText: /^8$/ }));
conferir((await pagina.locator("[data-editor-snippet] .cm-gutterElement.cm-ponto-de-parada").count()) === 1, `${MODO}: o número 8 ganha a etiqueta do ponto de parada`);
conferir(await objetivoConcluido(), `${MODO}: pontoDeParada passa`);
await naConversa(/Próximo objetivo/);

// ---------------------------------------------------------------- 2. pausar
await esperarObjetivo("pausar");
if (movel) await abrirBalao(pagina);
const opcao = await opcaoDaPrevisao(pagina);
if (toque) await opcao.tap();
else await opcao.click();
await esperarPronto(pagina);
await tocar(pagina.locator("[data-executar-snippet]"));
await pagina.locator("[data-aviso-pausado]").waitFor({ timeout: 8000 });
conferir(await pagina.locator("[data-aviso-pausado]").isVisible(), `${MODO}: o aviso "Pausado no depurador" aparece`);
await mostrarNaFontes("Snippet");
const linhaPausada = await pagina.locator("[data-editor-snippet] .cm-linha-pausada").innerText();
conferir(linhaPausada.includes("total = total + comDesconto(preco)"), `${MODO}: a linha 8 fica acesa (${linhaPausada.trim()})`);
conferir((await caixinha("total").getAttribute("data-valor")) === "0" || (await caixinha("total").innerText()).includes("0"), `${MODO}: o palco mostra total = 0 (antes da linha rodar)`);
conferir(!(await pagina.locator("[data-linha-do-tempo]").isVisible().catch(() => false)), `${MODO}: pausado, a linha do tempo sai de cena`);
await abaDoDepurador("Escopo");
const escopoTotal = await pagina.locator("[data-painel-escopo] [data-variavel-escopo='total']").first().innerText();
conferir(escopoTotal.replace(/\s+/g, "") === "total:0", `${MODO}: o Escopo bate com o palco (${escopoTotal})`);
conferir(await objetivoConcluido(), `${MODO}: pausouNaLinha passa`);
await naConversa(/Próximo objetivo/);

// ---------------------------------------------------------------- 3. Observar
await esperarObjetivo("observar");
await abaDoDepurador("Observar");
const campo = pagina.locator("[data-campo-observar]:visible").first();
if (movel) await fecharBalao(pagina);
await campo.click();
await pagina.keyboard.type("total");
if (toque) await tocar(pagina.locator("[data-adicionar-observacao]:visible").first());
else {
  await pagina.keyboard.press("Enter");
  await esperarPronto(pagina);
}
await pagina.waitForFunction(() => document.querySelector('[data-observacao="total"] [data-valor-observado="valor"]'), null, { timeout: 8000 }).catch(() => {});
conferir((await valorObservado("total")).trim() === "0", `${MODO}: o Observar mostra total = 0`);
conferir(await objetivoConcluido(), `${MODO}: observou passa`);
await naConversa(/Próximo objetivo/);

// ---------------------------------------------------------------- 4. Passar por cima
await esperarObjetivo("passar-por-cima");
if (MODO === "desktop") {
  await pagina.locator("[data-editor-snippet] .cm-content").click();
  await pagina.keyboard.press("F10");
  await esperarPronto(pagina);
} else await controle("passar-por-cima");
await abaDoDepurador("Observar");
await pagina.waitForFunction(() => document.querySelector('[data-observacao="total"] [data-valor-observado="valor"]')?.textContent?.trim() === "18", null, { timeout: 8000 }).catch(() => {});
conferir((await valorObservado("total")).trim() === "18", `${MODO}: depois de Passar por cima, o Observar mostra 18`);
conferir((await caixinha("total").innerText()).includes("18"), `${MODO}: o palco também mostra 18`);
conferir(await objetivoConcluido(), `${MODO}: usouControle + observou com valor passam`);
await naConversa(/Próximo objetivo/);

// ---------------------------------------------------------------- 5. Entrar na função e a Pilha de chamadas
await esperarObjetivo("entrar");
await controle("entrar");
await abaDoDepurador("Pilha");
const pilha = await pagina.locator("[data-painel-pilha] [data-quadro-pilha]").evaluateAll((els) => els.map((e) => e.getAttribute("data-quadro-pilha")));
conferir(JSON.stringify(pilha) === JSON.stringify(["comDesconto", "(anônima)"]), `${MODO}: a pilha tem comDesconto em cima (${pilha})`);
conferir((await pagina.locator("[data-palco] [data-quadro='comDesconto']").count()) === 1, `${MODO}: o palco abre o quadro de comDesconto`);
await abaDoDepurador("Escopo");
const local = await pagina.locator("[data-painel-escopo] [data-secao-escopo='Local'] [data-variavel-escopo='preco']").first().innerText();
conferir(local.replace(/\s+/g, "") === "preco:30", `${MODO}: o Escopo Local mostra preco = 30 (${local})`);
if (MODO === "desktop") {
  // O valor no hover do código, pausado.
  await mostrarNaFontes("Snippet");
  // As coordenadas do "preco" da linha 2, pelo próprio CodeMirror.
  const ponto = await pagina.locator("[data-editor-snippet] .cm-content").evaluate((no) => {
    const view = no.cmTile?.view ?? no.cmView?.view;
    const linha = view.state.doc.line(2);
    const pos = linha.from + linha.text.indexOf("preco") + 2;
    const c = view.coordsAtPos(pos);
    return { x: (c.left + c.right) / 2, y: (c.top + c.bottom) / 2 };
  });
  await pagina.mouse.move(ponto.x - 20, ponto.y);
  await pagina.mouse.move(ponto.x, ponto.y, { steps: 4 });
  await pagina.locator("[data-valor-hover]").waitFor({ timeout: 4000 }).catch(() => {});
  const hover = await pagina.locator("[data-valor-hover]").first().innerText().catch(() => "");
  conferir(hover.replace(/\s+/g, "") === "preco:30", `${MODO}: passar o mouse em preco mostra 30 (${hover})`);
  // O Console responde no momento pausado.
  const gaveta = pagina.locator("[data-fontes] [data-console]").first();
  await gaveta.locator("[data-entrada-console]").click();
  await pagina.keyboard.insertText("preco * 2");
  await pagina.keyboard.press("Enter");
  await esperarPronto(pagina);
  const resposta = await gaveta.locator("[data-linha-console]").last().innerText();
  conferir(resposta.trim() === "60", `${MODO}: pausado, o Console responde no momento da pausa (${resposta.trim()})`);
}
conferir(await objetivoConcluido(), `${MODO}: entrar + pausouNaLinha 2 passam`);
await naConversa(/Próximo objetivo/);

// ---------------------------------------------------------------- 6. Sair e Retomar até o fim (sozinho)
await esperarObjetivo("terminar");
await controle("sair");
conferir((await pagina.locator("[data-palco] [data-quadro='comDesconto']").count()) === 0, `${MODO}: depois de Sair, o quadro da função some`);
await controle("retomar");
await pagina.locator("[data-aviso-pausado]").waitFor({ state: "detached", timeout: 8000 }).catch(() => {});
conferir((await pagina.locator("[data-aviso-pausado]").count()) === 0, `${MODO}: retomado até o fim, o aviso some`);
await mostrarNaFontes("Console");
const saida = pagina.locator("[data-fontes] [data-linha-console='saida-log']").last();
conferir((await saida.getAttribute("data-texto")) === "90", `${MODO}: o console mostra 90 no fim`);
conferir(await objetivoConcluido(), `${MODO}: o último objetivo conclui`);

const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo (${relevantes.join(" | ")})`);
await navegador.close();
console.log(`depurador.mjs ${MODO}: ok`);
