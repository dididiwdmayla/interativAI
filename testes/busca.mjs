// A aba Busca na Bancada da Busca (/lab/fases?fase=lab-motor-u1-f6): só
// aparece nas fases que a usam, o aviso de simulação aproximada, a página
// fora da busca com o noindex e de volta sem ele (pela árvore), o título
// cortado, o Celular cortando antes, o teste de dados estruturados com a
// linha do erro de JSON e, no computador, o cartão do negócio no mapa depois
// do conserto (pela solução do lab). Uma fase publicada não mostra a aba.
// Uso: node testes/busca.mjs [desktop|retrato|paisagem]
import { abrir, acaoDaBarra, chaveDoSeletor, conferir, errosRelevantes, esperarPronto, fecharBalao, mostrarArvore } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;

const { navegador, pagina, erros } = await abrir({
  ...TAMANHOS[MODO],
  progresso: null,
  rota: "/lab/fases?fase=lab-motor-u1-f6",
  esperar: "section[data-previa] iframe",
});
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

const abaBusca = pagina.getByRole("tab", { name: "Busca", exact: true });
const abaElementos = pagina.getByRole("tab", { name: "Elementos", exact: true });
await tocar(abaBusca);
await pagina.locator("[data-painel-busca]").waitFor();
conferir((await pagina.locator("[data-aviso-simulacao]").textContent()).includes("Simulação aproximada"), `${MODO}: o painel diz que é simulação aproximada`);
conferir((await pagina.locator("[data-resultado-busca]").getAttribute("data-indexavel")) === "nao", `${MODO}: com noindex, a página some da busca`);

// Tira o noindex pela árvore.
await tocar(abaElementos);
const chave = await chaveDoSeletor(pagina, 'meta[name="robots"]');
if (toque) {
  await mostrarArvore(pagina);
  await acaoDaBarra(pagina, chave, "apagar");
} else {
  await pagina.locator(`[role=treeitem][data-chave="${chave}"] > div`).first().click({ button: "right" });
  await pagina.locator("[data-menu-no] [data-acao=apagar]").click();
}
await esperarPronto(pagina);
await tocar(abaBusca);
const resultado = pagina.locator("[data-resultado-busca]");
conferir((await resultado.getAttribute("data-indexavel")) === "sim", `${MODO}: sem o noindex, a página volta à busca`);
conferir((await resultado.getAttribute("data-titulo-cortado")) === "sim", `${MODO}: o título longo aparece cortado`);
conferir((await pagina.locator("[data-titulo-busca]").textContent()).endsWith("..."), `${MODO}: com reticências no fim`);
conferir((await pagina.locator("[data-descricao-busca]").textContent()).includes("Pão francês"), `${MODO}: sem description, a busca usa o primeiro parágrafo`);
conferir((await pagina.getByText("Sem meta description").count()) === 1, `${MODO}: e avisa que inventou`);
conferir((await pagina.locator("[data-endereco-busca]").textContent()) === "padariaestrela.motor.site", `${MODO}: o endereço do site`);
await tocar(pagina.getByRole("tab", { name: "Celular", exact: true }));
conferir((await pagina.getByRole("tab", { name: "Celular", exact: true }).getAttribute("aria-selected")) === "true", `${MODO}: dá para ver como no celular`);

// Dados estruturados: a linha do erro.
await tocar(pagina.getByRole("tab", { name: "Dados estruturados", exact: true }));
const erro = pagina.locator("[data-erro-json]");
await erro.waitFor();
conferir((await erro.getAttribute("data-erro-linha")) === "6", `${MODO}: aponta a linha do erro de JSON (a vírgula que falta, linha 6)`);
conferir((await erro.textContent()).includes("vírgula"), `${MODO}: e explica em português`);
if (toque) {
  const caixa = await pagina.getByRole("tab", { name: "Resultado", exact: true }).boundingBox();
  conferir(caixa.height >= 40, `${MODO}: os botões da aba têm altura de toque`);
}

if (!toque) {
  // No computador: as soluções do lab até o JSON certo; aparece o cartão no mapa.
  const aplicar = pagina.getByRole("button", { name: "Aplicar solução do objetivo atual" });
  const proximo = pagina.getByRole("button", { name: /Próximo objetivo/ }).first();
  for (let vez = 0; vez < 3; vez++) {
    await proximo.waitFor({ timeout: 8000 });
    await proximo.click();
    await esperarPronto(pagina);
    await aplicar.click();
    await esperarPronto(pagina);
    // Atrito conhecido do lab (ATRITOS, rodada 5, item 7): depois da ação sintética, o
    // objetivo só confere de novo com uma interação de verdade. Um clique na árvore basta.
    await tocar(abaElementos);
    await pagina.locator("[role=treeitem] > div").first().click();
    await esperarPronto(pagina);
  }
  await pagina.getByRole("button", { name: "Ver resultado" }).first().waitFor({ timeout: 8000 });
  conferir(true, `${MODO}: os quatro objetivos da bancada (indexavel, resultadoBusca, dadosEstruturados) passam`);
  await tocar(abaBusca);
  await tocar(pagina.getByRole("tab", { name: "Dados estruturados", exact: true }));
  await pagina.locator('[data-item-estruturado="Bakery"][data-valido="sim"]').waitFor();
  conferir(true, `${MODO}: o bloco consertado fica válido (Bakery)`);
  await tocar(pagina.getByRole("tab", { name: "Resultado", exact: true }));
  const cartao = pagina.locator("[data-cartao-negocio]");
  await cartao.waitFor();
  conferir((await pagina.locator("[data-negocio-nome]").textContent()) === "Padaria Estrela", `${MODO}: o cartão do negócio no mapa aparece`);
  conferir((await resultado.getAttribute("data-titulo-cortado")) === "nao", `${MODO}: o título curto cabe`);
}

// Uma fase publicada não ganha a aba Busca.
await pagina.goto(pagina.url().replace(/fase=[^&]+/, "fase=sites-publicar-u1-f1"));
await pagina.locator("section[data-previa] iframe").waitFor();
conferir((await pagina.getByRole("tab", { name: "Busca", exact: true }).count()) === 0, `${MODO}: fase publicada sem a aba Busca`);

const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo${relevantes.length ? `: ${relevantes.join(" | ")}` : ""}`);
await navegador.close();
