// Celular: prévia visível ao editar, teclado virtual simulado, giro sem perder nada
// e spotlight posicionado nos dois modos.
import { abrir, conferir, errosRelevantes } from "./util.mjs";

const TODAS = ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editar-duplo-clique"];
const PROGRESSO = {
  versao: 1,
  fasesConcluidas: [],
  estrelasPorFase: {},
  fasesEmAndamento: { "sites-elementos-1": { objetivoAtual: 3, htmlAtual: null, estrelas: 3, introducaoVista: true } },
  tema: "doce",
  temasDesbloqueados: ["doce", "fliperama"],
  som: false,
  missoesDeCampo: {},
  apresentacoesVistas: [...TODAS, "editor", "sincronia"],
};

const { navegador, pagina, erros } = await abrir({ largura: 390, altura: 844, toque: true, progresso: PROGRESSO });
const previa = pagina.locator("[data-previa]");
const alturaPrevia = async () => (await previa.boundingBox())?.height ?? 0;
const visivel = async (localizador) => {
  const caixa = await localizador.boundingBox();
  const tela = pagina.viewportSize();
  return Boolean(caixa && caixa.height > 40 && caixa.y >= 0 && caixa.y + caixa.height <= tela.height + 1);
};

await pagina.getByRole("button", { name: /Fechar a conversa/ }).tap();
await pagina.getByRole("tab", { name: "Código", exact: true }).tap();
await pagina.locator(".cm-line", { hasText: "Bolo de cenoura" }).tap();
await pagina.keyboard.press("End");
for (let i = 0; i < "</li>".length; i++) await pagina.keyboard.press("ArrowLeft");
await pagina.keyboard.type(" quentinho");
await pagina.waitForTimeout(700);
conferir(await visivel(previa), "retrato: a prévia fica visível enquanto se edita");
const textoNaTela = await pagina.frameLocator("iframe").locator("li").nth(2).textContent();
conferir(textoNaTela.includes("quentinho"), "retrato: a tela muda enquanto se digita");

// Teclado virtual: a janela encolhe com o editor focado.
const antes = await alturaPrevia();
await pagina.setViewportSize({ width: 390, height: 480 });
await pagina.waitForTimeout(500);
const depois = await alturaPrevia();
const main = await pagina.locator("main").boundingBox();
conferir(depois < antes, `teclado: a prévia encolhe (${Math.round(antes)} -> ${Math.round(depois)} px)`);
conferir(depois >= main.height * 0.24 && (await visivel(previa)), "teclado: a prévia não some (mínimo 25%)");
conferir(await visivel(pagina.locator(".cm-editor")), "teclado: o editor ocupa o resto");
await pagina.setViewportSize({ width: 390, height: 844 });
await pagina.waitForTimeout(400);

// Alça: arrastar muda a proporção, com mínimo e máximo, e fica salva.
const alca = pagina.getByRole("separator", { name: /tamanho da tela do site/ });
const caixaAlca = await alca.boundingBox();
await pagina.mouse.move(caixaAlca.x + caixaAlca.width / 2, caixaAlca.y + 5);
await pagina.mouse.down();
await pagina.mouse.move(caixaAlca.x + caixaAlca.width / 2, 790, { steps: 5 });
await pagina.mouse.up();
await pagina.waitForTimeout(300);
const proporcao = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")).proporcaoPrevia);
conferir(Math.abs(proporcao - 0.6) < 0.001, `alça respeita o máximo de 60% e salva (${proporcao})`);

// Girar no meio da fase não perde nada.
await pagina.getByRole("tab", { name: "Árvore", exact: true }).tap();
await pagina.locator('[role=treeitem][data-chave="1"]').tap();
await pagina.getByRole("button", { name: /Abrir a conversa/ }).tap();
await pagina.getByPlaceholder("Pergunte ao computadorzinho...").fill("uma dúvida");
const estadoAtual = async () => ({
  layout: await pagina.locator("[data-layout]").getAttribute("data-layout"),
  selecionado: await pagina.locator("[role=treeitem][aria-selected=true]").getAttribute("data-chave"),
  codigo: await pagina.evaluate(() => document.querySelector(".cm-content")?.textContent ?? ""),
  rascunho: await pagina.getByPlaceholder("Pergunte ao computadorzinho...").inputValue(),
  balao: await pagina.locator("[data-balao-mascote]").count(),
  objetivo: await pagina.locator("[data-balao-mascote]").textContent(),
});
const emPe = await estadoAtual();
for (const [largura, altura, nome] of [
  [844, 390, "paisagem"],
  [390, 844, "retrato"],
]) {
  await pagina.setViewportSize({ width: largura, height: altura });
  await pagina.waitForTimeout(500);
  const depois = await estadoAtual();
  conferir(depois.layout === nome, `girou para ${nome}`);
  conferir(depois.selecionado === emPe.selecionado, `${nome}: seleção mantida (${depois.selecionado})`);
  conferir(depois.codigo === emPe.codigo && depois.codigo.includes("quentinho"), `${nome}: código do editor mantido`);
  conferir(depois.rascunho === "uma dúvida" && depois.balao === 1, `${nome}: balão e rascunho mantidos`);
  conferir(depois.objetivo.includes("Objetivo 4 de 4"), `${nome}: objetivo mantido`);
}

// Spotlight nos dois modos: o recorte fica na tela e o cartão não cobre o alvo.
for (const [largura, altura, nome] of [
  [390, 844, "retrato"],
  [844, 390, "paisagem"],
]) {
  await pagina.setViewportSize({ width: largura, height: altura });
  await pagina.waitForTimeout(400);
  for (const id of ["arvore", "inspecionar", "tutor"]) {
    const fechar = pagina.getByRole("button", { name: /Fechar a conversa/ });
    if (await fechar.isVisible().catch(() => false)) await fechar.tap();
    await pagina.getByRole("button", { name: "Mais opções" }).tap();
    await pagina.getByRole("button", { name: "Abrir a Caixa de Ferramentas" }).tap();
    const caixa = pagina.getByRole("dialog", { name: "Caixa de Ferramentas" });
    await caixa.locator(`[data-card="${id}"]`).getByRole("button", { name: "Rever apresentação" }).tap();
    await pagina.locator(`[data-apresentacao="${id}"]`).waitFor();
    await pagina.waitForTimeout(700);
    const recorte = await pagina.locator(".contorno-apresentacao").first().boundingBox();
    const cartao = await pagina.locator("[data-apresentacao] [role=dialog]").boundingBox();
    const dentro = (r) => r.x >= -1 && r.y >= -1 && r.x + r.width <= largura + 1 && r.y + r.height <= altura + 1;
    const sobrepoe =
      Math.max(0, Math.min(recorte.x + recorte.width, cartao.x + cartao.width) - Math.max(recorte.x, cartao.x)) *
      Math.max(0, Math.min(recorte.y + recorte.height, cartao.y + cartao.height) - Math.max(recorte.y, cartao.y));
    conferir(dentro(recorte) && dentro(cartao), `${nome}/${id}: recorte e cartão dentro da tela`);
    conferir(sobrepoe === 0, `${nome}/${id}: cartão não cobre o alvo`);
    await pagina.getByRole("button", { name: "Pular" }).tap();
    await pagina.locator("[data-apresentacao]").waitFor({ state: "detached" });
  }
}

// Deitado, focar o editor mostra a dica de virar o celular (sem bloquear).
await pagina.getByRole("tab", { name: "Código", exact: true }).tap();
await pagina.locator(".cm-line", { hasText: "Pão francês" }).tap();
await pagina.getByText("Pra digitar, fica mais confortável com o celular em pé").waitFor({ timeout: 3000 });
await pagina.keyboard.type("x");
conferir((await pagina.locator(".cm-content").textContent()).includes("x"), "paisagem: dica aparece e a digitação segue");

conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
