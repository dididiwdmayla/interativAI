// Sincronia tripla: árvore -> código e tela; código -> árvore e tela; HTML quebrado sem erro.
import { abrir, conferir, errosRelevantes } from "./util.mjs";

const PROGRESSO = {
  versao: 1,
  fasesConcluidas: [],
  estrelasPorFase: {},
  fasesEmAndamento: { "sites-elementos-1": { objetivoAtual: 1, htmlAtual: null, estrelas: 3, introducaoVista: true } },
  tema: "doce",
  temasDesbloqueados: ["doce", "fliperama"],
  som: false,
  missoesDeCampo: {},
  apresentacoesVistas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editar-duplo-clique", "editor", "sincronia"],
};

const { navegador, pagina, erros } = await abrir({ progresso: PROGRESSO });
await pagina.waitForSelector('[role=treeitem][data-chave="1"]');

const rotuloRealce = () => pagina.locator("[data-realce-rotulo]").first().textContent().catch(() => null);
const trecho = () => pagina.locator(".cm-trecho-selecionado").allTextContents().then((partes) => partes.join(""));

// Árvore -> código e tela.
await pagina.locator('[role=treeitem][data-chave="1"]').click();
await pagina.waitForTimeout(250);
conferir((await trecho()).startsWith("<h1>") && (await trecho()).endsWith("</h1>"), "árvore acende o trecho inteiro do h1 no código");
await pagina.mouse.move(5, 5);
await pagina.waitForTimeout(100);
conferir((await rotuloRealce())?.startsWith("h1"), "seleção mostra a sobreposição do h1 na tela");

// Código -> árvore e tela.
const linhaLi = pagina.locator(".cm-line", { hasText: "Pão de queijo" });
await linhaLi.click({ position: { x: 90, y: 5 } });
await pagina.waitForTimeout(400);
const selecionado = await pagina.locator('[role=treeitem][aria-selected=true]').getAttribute("data-chave");
conferir(selecionado === "5.1", `cursor no li seleciona o li na árvore (${selecionado})`);
conferir((await rotuloRealce())?.startsWith("li"), "cursor no código mostra a sobreposição do li");
conferir((await trecho()).includes("Pão de queijo"), "trecho do li fica aceso no editor");

// HTML quebrado enquanto digita.
await pagina.locator(".cm-line", { hasText: "Bolo de cenoura" }).click();
await pagina.keyboard.press("End");
await pagina.keyboard.type("<div><span class=");
await pagina.waitForTimeout(500);
await pagina.keyboard.press("ArrowLeft");
await pagina.keyboard.press("ArrowLeft");
await pagina.waitForTimeout(700);
await pagina.keyboard.type("></p></li></zz>");
await pagina.waitForTimeout(800);
await pagina.keyboard.press("Home");
await pagina.waitForTimeout(400);
conferir(errosRelevantes(erros).length === 0, `HTML quebrado não gera erro ${JSON.stringify(errosRelevantes(erros))}`);

// Hover na árvore troca a caixa sem mudar a seleção.
const antes = await pagina.locator('[role=treeitem][aria-selected=true]').getAttribute("data-chave");
await pagina.locator('[role=treeitem][data-chave="3"]').hover();
await pagina.waitForTimeout(150);
conferir((await rotuloRealce())?.startsWith("button"), "hover na árvore mostra a caixa do elemento");
const depois = await pagina.locator('[role=treeitem][aria-selected=true]').getAttribute("data-chave");
conferir(antes === depois, "hover não muda a seleção");

await navegador.close();
