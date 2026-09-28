// A aba Lighthouse (auditoria simplificada) na Bancada do Lighthouse
// (/lab/fases?fase=lab-motor-u1-f5): a aba de cima liberada, o aviso de
// versão simplificada, o Analisar com as três notas no anel (e a faixa),
// a lista de problemas por categoria, um problema levando à peça na árvore
// com a explicação do computadorzinho, a análise ficando "velha" quando a
// página muda e a nota subindo depois do conserto. No celular: o Analisar e
// as peças com 44 px.
// Uso: node testes/lighthouse.mjs [desktop|retrato|paisagem]
import { abrir, conferir, errosRelevantes, esperarPronto, fecharBalao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: "/lab/fases?fase=lab-motor-u1-f5", esperar: "section[data-previa] iframe" });
if (toque) {
  const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
  if (await recolher.isVisible().catch(() => false)) await recolher.tap();
}
await esperarPronto(pagina);

async function tocar(localizador) {
  if (toque) await fecharBalao(pagina);
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
  await esperarPronto(pagina);
}

const nota = (categoria) => pagina.locator(`[data-nota-auditoria="${categoria}"]`).getAttribute("data-nota").then(Number);

// ---------------------------------------------------------------- a aba e o Analisar
const aba = pagina.getByRole("tab", { name: "Lighthouse", exact: true });
conferir((await aba.getAttribute("aria-disabled")) === "false", `${MODO}: a aba Lighthouse está liberada nesta fase`);
await tocar(aba);
const painel = pagina.locator("[data-painel-lighthouse]");
await painel.waitFor();
conferir((await painel.textContent()).includes("Versão simplificada do Lighthouse"), `${MODO}: com o aviso de versão simplificada`);
const analisar = pagina.locator("[data-analisar-auditoria]");
if (toque) {
  const caixa = await analisar.boundingBox();
  conferir(caixa.height >= 44, `${MODO}: o Analisar tem 44 px de altura no toque`);
}
await tocar(analisar);
await pagina.locator("[data-notas-auditoria]").waitFor();
const acessibilidade = await nota("acessibilidade");
conferir(acessibilidade === 26 && (await nota("boas-praticas")) === 63 && (await nota("seo")) === 25, `${MODO}: as notas batem com o testar:conteudo (26, 63, 25)`);
conferir((await pagina.locator('[data-nota-auditoria="acessibilidade"]').getAttribute("data-faixa")) === "ruim", `${MODO}: abaixo de 50, a faixa ruim`);
conferir((await pagina.locator('[data-nota-auditoria="boas-praticas"]').getAttribute("data-faixa")) === "media", `${MODO}: de 50 a 89, a média`);
const problemas = await pagina.locator('[data-categoria-auditoria="acessibilidade"] [data-problema-auditoria]').evaluateAll((lista) => lista.map((el) => el.getAttribute("data-problema-auditoria")));
conferir(
  ["imagem-sem-alt", "contraste", "titulos-pulando-nivel", "link-sem-texto", "botao-sem-texto", "sem-main"].every((regra) => problemas.includes(regra)),
  `${MODO}: a Acessibilidade lista os problemas reais (${problemas.join(", ")})`,
);

// ---------------------------------------------------------------- um problema leva à peça e explica
// O Analisar cumpriu o objetivo 1: segue para o 2 (a conversa livre deixa o computadorzinho explicar).
if (!toque) {
  await pagina.getByRole("button", { name: "Próximo objetivo" }).click();
  await esperarPronto(pagina);
  await tocar(aba);
}
const imagem = pagina.locator('[data-categoria-auditoria="acessibilidade"] [data-problema-auditoria="imagem-sem-alt"]');
await tocar(imagem.getByRole("button").first());
conferir((await imagem.textContent()).includes("leitor de tela"), `${MODO}: abrir o problema explica por que importa`);
const peca = imagem.locator("[data-peca-auditoria]").first();
if (toque) {
  const caixa = await peca.boundingBox();
  conferir(caixa.height >= 44, `${MODO}: a peça do problema tem 44 px no toque`);
}
await tocar(peca);
await pagina.locator('[role="treeitem"][aria-selected="true"]').first().waitFor();
const selecionada = await pagina.locator('[role="treeitem"][aria-selected="true"]').first().textContent();
conferir(/img/.test(selecionada) && /foto/.test(selecionada), `${MODO}: a peça abre a aba Elementos com a imagem selecionada na árvore (${selecionada.trim().slice(0, 40)})`);
if (!toque) {
  conferir(await pagina.evaluate(() => document.body.innerText.includes("Quem usa leitor de tela")), `${MODO}: e o computadorzinho explica em linguagem de leigo`);
}

// ---------------------------------------------------------------- consertar (pelas soluções do lab) e analisar de novo
if (!toque) {
  // No 2 e no 3, a solução do lab conserta a página.
  await pagina.getByRole("button", { name: "Aplicar solução do objetivo atual" }).click();
  await esperarPronto(pagina);
  await pagina.getByRole("button", { name: "Próximo objetivo" }).click();
  await esperarPronto(pagina);
  await pagina.getByRole("button", { name: "Aplicar solução do objetivo atual" }).click();
  await esperarPronto(pagina);
  await tocar(aba);
  await pagina.locator("[data-auditoria-desatualizada]").waitFor();
  conferir(true, `${MODO}: a página mudou: a análise avisa que está velha`);
  await tocar(analisar);
  await pagina.locator("[data-auditoria-desatualizada]").waitFor({ state: "detached" });
  conferir((await nota("acessibilidade")) >= 90, `${MODO}: depois do conserto, a Acessibilidade passa de 90 (${await nota("acessibilidade")})`);
  conferir((await pagina.locator('[data-nota-auditoria="acessibilidade"]').getAttribute("data-faixa")) === "boa", `${MODO}: na faixa boa`);
}

conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
