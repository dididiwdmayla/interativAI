// Joga a Fase 1 do zero passando por todas as apresentações, na ordem.
// Uso: node testes/fase-completa.mjs [desktop|retrato|paisagem]
import { abrir, conferir, errosRelevantes } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: null });
const toque = TAMANHOS[MODO].toque;
const ORDEM = ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editar-duplo-clique", "editor", "sincronia"];
const vistas = [];

async function tocar(localizador, opcoes) {
  if (toque) await localizador.tap(opcoes);
  else await localizador.click(opcoes);
}

/** Espera a apresentação, lê as 3 falas e faz a ação do "Experimente". */
async function apresentacao(id, experimentar) {
  const camada = pagina.locator(`[data-apresentacao="${id}"]`);
  await camada.waitFor({ timeout: 8000 });
  vistas.push(id);
  for (let i = 0; i < 3; i++) {
    await tocar(pagina.getByRole("button", { name: /Continuar|Quero tentar/ }).first());
    await pagina.waitForTimeout(120);
  }
  await pagina.waitForTimeout(350);
  await experimentar();
  try {
    await camada.waitFor({ state: "detached", timeout: 6000 });
  } catch (erro) {
    await pagina.screenshot({ path: `testes-falha-${MODO}-${id}.png` });
    throw erro;
  }
  conferir(true, `apresentação ${id} fechou depois do uso`);
}

async function continuarConversa() {
  for (let i = 0; i < 6; i++) {
    if ((await pagina.locator("[data-apresentacao]").count()) > 0) return;
    const botao = pagina.getByRole("button", { name: /^(Continuar|Vamos lá!|Próximo objetivo)$/ }).first();
    if (!(await botao.isVisible().catch(() => false))) return;
    await tocar(botao);
    await pagina.waitForTimeout(200);
  }
}

async function mostrarPainel(segmento) {
  const vistaPainel = pagina.getByRole("tab", { name: "Painel" });
  if (await vistaPainel.isVisible().catch(() => false)) await tocar(vistaPainel);
  if (segmento) {
    const aba = pagina.getByRole("tab", { name: segmento, exact: true });
    const visivel = await aba.isVisible().catch(() => false);
    if (visivel && (await aba.getAttribute("aria-selected")) !== "true") await tocar(aba);
  }
}

const arvore = (chave) => pagina.locator(`[role=treeitem][data-chave="${chave}"]`).first();
const iframe = pagina.frameLocator("iframe").first();

await continuarConversa();

await apresentacao("painel", () => tocar(pagina.getByRole("tab", { name: "Elementos" }).first()));
await apresentacao("previa", async () => {
  if (toque) await iframe.locator("h2").tap();
  else {
    await pagina.locator('[data-ferramenta~="previa"]').first().hover();
    await pagina.mouse.wheel(0, 200);
  }
});
await apresentacao("me-ajuda", () => tocar(pagina.getByRole("button", { name: /Me ajuda/ }).first()));
await apresentacao("tutor", async () => {
  const campo = pagina.getByPlaceholder("Pergunte ao computadorzinho...").first();
  await campo.fill("o que é uma tag?");
  await campo.press("Enter");
});
await pagina.waitForTimeout(600);

// Objetivo 1
await apresentacao("arvore", async () => {
  await mostrarPainel("Árvore");
  if (toque) await arvore("0").tap();
  else await arvore("0").hover();
});
await mostrarPainel("Árvore");
await tocar(arvore("1"));
await pagina.getByRole("button", { name: /Próximo objetivo/ }).first().waitFor({ timeout: 5000 });
conferir(true, "objetivo 1 concluído");
await continuarConversa();

// Objetivo 2: o "Experimente" do inspecionar já cumpre o objetivo.
await apresentacao("inspecionar", async () => {
  await tocar(pagina.getByRole("button", { name: /Modo inspecionar/ }).first());
  await pagina.waitForTimeout(300);
  const botao = iframe.locator("button");
  const caixa = await botao.boundingBox();
  if (toque) await pagina.touchscreen.tap(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
  else await pagina.mouse.click(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
});
await pagina.getByRole("button", { name: /Próximo objetivo/ }).first().waitFor({ timeout: 5000 });
conferir(true, "objetivo 2 concluído pelo Experimente");
await continuarConversa();

// Objetivo 3
await apresentacao("editar-duplo-clique", async () => {
  await mostrarPainel("Árvore");
  if (toque) {
    await arvore("1").tap();
    await arvore("1").getByRole("button", { name: "Editar" }).tap();
  } else {
    await arvore("1").locator("[title='Dois cliques para editar']").first().dblclick();
  }
});
const campoEdicao = pagina.locator("[role=tree] input").first();
await campoEdicao.fill("Minha padaria favorita");
await campoEdicao.press("Enter");
await pagina.getByRole("button", { name: /Próximo objetivo/ }).first().waitFor({ timeout: 5000 });
conferir((await iframe.locator("h1").textContent()) === "Minha padaria favorita", "objetivo 3 trocou a manchete");
await continuarConversa();

// Objetivo 4
await apresentacao("editor", async () => {
  await mostrarPainel("Código");
  await tocar(pagina.locator(".cm-line", { hasText: "Bolo de cenoura" }).first());
});
await apresentacao("sincronia", async () => {
  await mostrarPainel("Código");
  await tocar(pagina.locator(".cm-line", { hasText: "Pão francês" }).first(), { position: { x: 60, y: 5 } });
});
await mostrarPainel("Código");
await tocar(pagina.locator(".cm-line", { hasText: "Bolo de cenoura" }).first());
await pagina.keyboard.press("End");
await pagina.keyboard.press("Enter");
await pagina.keyboard.type("<li>Sonho");
await pagina.getByRole("button", { name: /Ver resultado/ }).first().waitFor({ timeout: 6000 });
conferir(true, "objetivo 4 concluído");

conferir(JSON.stringify(vistas) === JSON.stringify(ORDEM), `apresentações na ordem certa: ${vistas.join(", ")}`);

// Recarregar não repete as vistas.
await pagina.reload();
await pagina.waitForSelector("iframe");
await pagina.waitForTimeout(1500);
conferir((await pagina.locator("[data-apresentacao]").count()) === 0, "recarregar não repete apresentações");

conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
