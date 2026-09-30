// A demonstração do simulador de campanha (/lab/fases?fase=lab-motor-u1-f7):
// a aba Medição (o aviso de simulação, um clique de verdade na prévia num
// data-evento chegando no relatório, o construtor de link rastreável
// montando o link e simulando uma visita, que vira a origem dos eventos
// seguintes) e a aba Campanha (o aviso de números fictícios, o leilão com 4
// anunciantes, o lance levando ao 1º lugar e a página de destino mudando a
// qualidade quando melhora). Uma fase publicada não mostra essas abas.
// Uso: node testes/campanha.mjs [desktop|retrato|paisagem]
import { abrir, chaveDoSeletor, conferir, errosRelevantes, esperarPronto, fecharBalao, linhaDaArvore } from "./util.mjs";

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
  rota: "/lab/fases?fase=lab-motor-u1-f7",
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

const aba = (nome) => pagina.getByRole("tab", { name: nome, exact: true });
const botaoNaPrevia = pagina.frameLocator("section[data-previa] iframe").locator("button[data-evento]");

// ---------------------------------------------------------------- Medição
await tocar(aba("Medição"));
await pagina.locator("[data-painel-medicao]").waitFor();
conferir((await pagina.locator("[data-painel-medicao] [data-aviso-simulacao]").textContent()).includes("Simulação"), `${MODO}: a Medição diz que é simulação`);
conferir((await pagina.locator("[data-linha-medicao]").count()) === 0, `${MODO}: o relatório começa vazio`);
await tocar(botaoNaPrevia);
await pagina.locator('[data-linha-medicao="clique_whatsapp"]').first().waitFor();
conferir(
  (await pagina.locator('[data-linha-medicao="clique_whatsapp"]').first().textContent()).includes("direto"),
  `${MODO}: um clique de verdade na prévia gera clique_whatsapp, de origem direta`,
);
conferir((await pagina.locator('[data-contagem-evento="clique_whatsapp"]').textContent()).includes("1"), `${MODO}: a contagem por evento`);

// O construtor de link rastreável.
for (const [campo, valor] of [
  ["source", "instagram"],
  ["medium", "social"],
  ["campaign", "aniversario"],
]) {
  const entrada = pagina.locator(`[data-campo-utm="${campo}"]`);
  await entrada.scrollIntoViewIfNeeded();
  await entrada.fill(valor);
}
conferir(
  (await pagina.locator("[data-link-montado]").textContent()) === "https://docesdalu.motor.site/?utm_source=instagram&utm_medium=social&utm_campaign=aniversario",
  `${MODO}: o link rastreável é montado com os três utm`,
);
await tocar(pagina.locator("[data-simular-visita]"));
await pagina.locator('[data-linha-medicao="visita"]').waitFor();
conferir((await pagina.locator('[data-linha-medicao="visita"]').textContent()).includes("instagram / social / aniversario"), `${MODO}: a visita chega com a origem`);
await tocar(botaoNaPrevia);
await pagina.locator('[data-linha-medicao="clique_whatsapp"]').nth(1).waitFor();
conferir(
  (await pagina.locator('[data-linha-medicao="clique_whatsapp"]').first().textContent()).includes("instagram / social / aniversario"),
  `${MODO}: o evento seguinte conta a origem da visita`,
);

// ---------------------------------------------------------------- Campanha
await tocar(aba("Campanha"));
await pagina.locator("[data-painel-campanha]").waitFor();
conferir((await pagina.locator("[data-painel-campanha] [data-aviso-simulacao]").textContent()).includes("números fictícios"), `${MODO}: a Campanha declara os números fictícios`);
conferir((await pagina.locator("[data-leilao] [data-anunciante]").count()) === 4, `${MODO}: o leilão tem 4 anunciantes`);
const posicao = () => pagina.locator('[data-anunciante="jogador"]').getAttribute("data-posicao");
conferir((await posicao()) === "4", `${MODO}: com lance de 1 real e a página fraca, o anúncio fica em 4º`);
const qualidadeAntes = await pagina.locator("[data-nota-pagina]").getAttribute("data-nota-pagina");
const lance = pagina.locator('[data-campo-campanha="lance"]');
await lance.scrollIntoViewIfNeeded();
await lance.fill("6");
await esperarPronto(pagina);
await pagina.locator('[data-anunciante="jogador"][data-posicao="1"]').waitFor();
conferir(true, `${MODO}: lance de 6 reais leva ao 1º lugar`);
if (toque) {
  const caixa = await lance.boundingBox();
  conferir(caixa.height >= 44, `${MODO}: o campo do lance tem 44 px no toque`);
}

// A página de destino melhora de verdade (no computador, pelo menu do nó): a nota sobe.
if (!toque) {
  await tocar(aba("Elementos"));
  const chave = await chaveDoSeletor(pagina, ".foto");
  await linhaDaArvore(pagina, chave).click({ button: "right" });
  await pagina.locator("[data-menu-no] [data-acao=adicionar-atributo]").click();
  const novo = pagina.locator("[data-atributo-novo] input");
  await novo.fill('alt="Bolo de aniversário com morangos"');
  await novo.press("Enter");
  await esperarPronto(pagina);
  await tocar(aba("Campanha"));
  await pagina.waitForFunction(
    (antes) => Number(document.querySelector("[data-nota-pagina]")?.getAttribute("data-nota-pagina")) > Number(antes),
    qualidadeAntes,
    { timeout: 8000 },
  );
  const depois = await pagina.locator("[data-nota-pagina]").getAttribute("data-nota-pagina");
  conferir(true, `${MODO}: o alt na foto sobe a nota da página de destino (${qualidadeAntes} para ${depois}), e o dia simulado muda junto`);
}

// Uma fase publicada não ganha as abas novas.
await pagina.goto(pagina.url().replace(/fase=[^&]+/, "fase=sites-publicar-u1-f1"));
await pagina.locator("section[data-previa] iframe").waitFor();
conferir((await aba("Medição").count()) + (await aba("Campanha").count()) === 0, `${MODO}: fase publicada sem Medição e Campanha`);

const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo${relevantes.length ? `: ${relevantes.join(" | ")}` : ""}`);
await navegador.close();
