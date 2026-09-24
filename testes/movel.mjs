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
const proporcao = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v1")).proporcaoPrevia);
conferir(Math.abs(proporcao - 0.6) < 0.001, `alça respeita o máximo de 60% e salva (${proporcao})`);

conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
