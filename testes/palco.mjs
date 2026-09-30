// O palco da memória e a linha do tempo, na Bancada da Lógica
// (/lab/fases?fase=lab-logica-u1-f1): caixinha nova surge, valor novo
// pisca, vagões numerados, ficha, seta de referência (a mesma lista em duas
// variáveis), a moldura da função só enquanto ela roda, e a linha do tempo
// voltando e avançando (a memória do passo e a linha do Snippet acesa).
// Uso: node testes/palco.mjs [desktop|retrato|paisagem]
import { abrir, conferir, errosRelevantes, esperarPronto, fecharBalao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: "/lab/fases?fase=lab-logica-u1-f1", esperar: "[data-jogo-fase]" });
// O painel do lab cobre o canto da tela: recolhido.
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

const palco = pagina.locator("[data-palco]");
const caixinha = (nome) => palco.locator(`[data-caixinha="${nome}"]`);
const entrada = pagina.locator("[data-console]:visible [data-entrada-console]").first();
async function rodar(codigo) {
  if (movel) await fecharBalao(pagina);
  await entrada.click();
  await pagina.keyboard.insertText(codigo);
  if (toque) await pagina.locator("[data-console]:visible [data-rodar-console]").first().tap();
  else await pagina.keyboard.press("Enter");
  await esperarPronto(pagina);
}

// ---------------------------------------------------------------- Console: surgir, piscar, referência
await rodar("let total = 10");
conferir((await caixinha("total").getAttribute("data-mudou")) === "nova", `${MODO}: a caixinha nova surge`);
conferir((await caixinha("total").getAttribute("data-tipo")) === "numero", `${MODO}: o tipo número (cor e plaquinha)`);
conferir((await caixinha("total").innerText()).includes("10"), `${MODO}: a caixinha mostra o valor`);
await rodar("total = total + 5");
conferir((await caixinha("total").getAttribute("data-mudou")) === "mudou", `${MODO}: o valor novo pisca`);
conferir((await caixinha("total").innerText()).includes("15"), `${MODO}: e troca para 15`);
await rodar("let a = ['pão', 'bolo']; let b = a");
conferir((await caixinha("a").locator("[data-vagao]").count()) === 2, `${MODO}: a lista vira dois vagões numerados`);
conferir((await caixinha("b").locator("[data-ponteiro]").count()) === 1, `${MODO}: b não ganha cópia: aponta para a lista de a`);
conferir(Number(await palco.getAttribute("data-setas")) === 1, `${MODO}: uma seta desenhada`);
await rodar("b.push('café')");
conferir((await caixinha("a").locator("[data-vagao]").count()) === 3, `${MODO}: mexer por b muda a lista de a (a mesma lista)`);
await rodar("let loja = { nome: 'Pão de Mel', aberta: true }");
conferir((await caixinha("loja").locator("[data-campo-palco]").count()) === 2, `${MODO}: o objeto vira uma ficha com dois campos`);

// ---------------------------------------------------------------- Snippet e linha do tempo
await tocar(pagina.getByRole("tablist", { name: "Painéis do DevTools" }).getByRole("tab", { name: "Fontes", exact: true }));
if (movel) await tocar(pagina.getByRole("tab", { name: "Snippet", exact: true }));
const editor = pagina.locator("[data-editor-snippet] .cm-content");
if (movel) await fecharBalao(pagina);
await editor.click();
await pagina.keyboard.press("ControlOrMeta+A");
await pagina.keyboard.insertText("function dobro(n) {\n  const d = n * 2;\n  return d;\n}\nconst x = dobro(4);");
await tocar(pagina.locator("[data-executar-snippet]"));
const tempo = pagina.locator("[data-linha-do-tempo]");
const total = Number(await tempo.getAttribute("data-total-passos"));
conferir(total === 5, `${MODO}: a linha do tempo tem um ponto por passo (${total})`);
conferir((await pagina.locator("[data-quadro]").count()) === 1, `${MODO}: no fim, só a memória global`);
await tocar(tempo.locator("[data-passo-anterior]"));
conferir((await tempo.getAttribute("data-passo-atual")) === "3", `${MODO}: o passo anterior volta um passo`);
conferir((await pagina.locator('[data-quadro="dobro"]').count()) === 1, `${MODO}: dentro da função, a moldura dela aparece`);
conferir((await pagina.locator('[data-quadro="dobro"] [data-faixa-quadro="retorno"]').innerText()).includes("devolve 8"), `${MODO}: no retorno, a moldura diz o que a função devolve`);
conferir((await pagina.locator('[data-quadro="dobro"] [data-caixinha="d"]').innerText()).includes("8"), `${MODO}: a variável de dentro da função, com o valor daquele momento`);
if (!movel) {
  const acesas = await pagina.locator("[data-editor-snippet] .cm-linha-destacada").count();
  conferir(acesas === 1, `${MODO}: a linha do passo acende no Snippet`);
}
await tocar(tempo.locator("[data-passo-anterior]"));
await tocar(tempo.locator("[data-passo-anterior]"));
await tocar(tempo.locator("[data-passo-anterior]"));
conferir((await tempo.getAttribute("data-passo-atual")) === "0", `${MODO}: volta até o primeiro passo`);
conferir((await pagina.locator("[data-quadro]").count()) === 1 && (await palco.locator('[data-caixinha="x"]').count()) === 0, `${MODO}: no começo, x ainda não existe`);
await tocar(tempo.locator("[data-passo-proximo]"));
conferir((await tempo.getAttribute("data-passo-atual")) === "1", `${MODO}: o próximo passo avança`);
conferir((await tempo.locator("[data-descricao-passo]").innerText()).includes("linha 2"), `${MODO}: a descrição diz a linha do passo`);

const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo (${relevantes.join(" | ")})`);
await navegador.close();
console.log(`palco.mjs ${MODO}: ok`);
