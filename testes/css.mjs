// CSS editável na Bancada de estilos (/lab/fases?fase=lab-motor-u1-f1):
// abas HTML e CSS do editor, digitar no CSS muda a prévia SEM recarregar,
// cursor numa regra acende todas as peças que ela pega, desfazer do painel
// volta o CSS (e o editor), a solução do Me ajuda (definirPropriedade,
// alternarDeclaracao, adicionarRegra) passa pelas mesmas funções e
// conclui cada objetivo.
// Uso: node testes/css.mjs
import { abrir, conferir, errosRelevantes } from "./util.mjs";

const ROTA = "/lab/fases?fase=lab-motor-u1-f1";

const { navegador, pagina, erros } = await abrir({ rota: ROTA, esperar: "section[data-previa] iframe" });
const iframe = pagina.locator("section[data-previa] iframe");
await pagina.waitForFunction(() => {
  const documento = document.querySelector("section[data-previa] iframe")?.contentDocument;
  return Boolean(documento?.querySelector("style[data-folha-jogo]") && documento.querySelector("h1"));
});

const estiloDe = (seletor, propriedade) =>
  iframe.evaluate(
    (el, [s, p]) => el.contentWindow.getComputedStyle(el.contentDocument.querySelector(s)).getPropertyValue(p),
    [seletor, propriedade],
  );
const cssNaTela = () => iframe.evaluate((el) => el.contentDocument.querySelector("style[data-folha-jogo]").textContent);
const textoDoEditorCss = () => pagina.locator("[data-editor-css] .cm-content").innerText();

// Abas do editor.
conferir((await pagina.locator("[data-aba-editor]").count()) === 2, "o editor tem as abas HTML e CSS");
conferir(await pagina.locator("[data-editor-css]").isHidden(), "começa na aba HTML (o CSS fica montado, escondido)");
await pagina.locator('[data-aba-editor="css"]').click();
conferir(await pagina.locator("[data-editor-css]").isVisible(), "a aba CSS mostra o estilo.css");
conferir((await pagina.getByText("estilo.css").count()) > 0, "o nome da folha aparece no cabeçalho");

// Digitar no CSS muda a prévia sem recarregar.
await iframe.evaluate((el) => {
  el.contentWindow.__marcaDoTeste = "viva";
});
const antes = await estiloDe("h1", "color");
await pagina.locator("[data-editor-css] .cm-line", { hasText: "font-size: 32px" }).click();
await pagina.keyboard.press("End");
await pagina.keyboard.type("\ncolor: gold;");
await pagina.waitForFunction(() => {
  const el = document.querySelector("section[data-previa] iframe");
  const h1 = el?.contentDocument?.querySelector("h1");
  return Boolean(h1) && el.contentWindow.getComputedStyle(h1).color === "rgb(255, 215, 0)";
});
conferir(antes !== (await estiloDe("h1", "color")), "digitar color: gold no CSS muda a cor do título na hora");
conferir((await iframe.evaluate((el) => el.contentWindow.__marcaDoTeste)) === "viva", "a prévia NÃO recarregou (o <style> mudou no lugar)");
await pagina.getByRole("button", { name: "Próximo objetivo" }).waitFor({ timeout: 5000 });
conferir(true, "o validador valorEfetivo conclui o objetivo 1 pelo que foi digitado");

// Cursor numa regra acende todas as peças que ela pega.
await pagina.locator("[data-editor-css] .cm-line", { hasText: ".prato {" }).click();
await pagina.waitForFunction(() => document.querySelectorAll("[data-realce-regra]").length === 2);
conferir(true, "cursor na regra .prato acende os 2 pratos na prévia");
await pagina.locator("[data-editor-css] .cm-line", { hasText: "h1 {" }).click();
await pagina.waitForFunction(() => document.querySelectorAll("[data-realce-regra]").length === 1);
conferir(true, "cursor na regra h1 acende só o título");

// Desfazer do painel volta o CSS inteiro (editor e prévia).
await pagina.getByRole("button", { name: /^Desfazer/ }).first().click();
await pagina.waitForFunction(() => {
  const el = document.querySelector("section[data-previa] iframe");
  const estilo = el?.contentDocument?.querySelector("style[data-folha-jogo]");
  return Boolean(estilo) && !estilo.textContent.includes("gold");
});
conferir(!(await textoDoEditorCss()).includes("gold"), "o desfazer do painel tira o color: gold do editor CSS");
conferir(!(await cssNaTela()).includes("gold"), "e da prévia");
await pagina.getByRole("button", { name: /^Refazer/ }).first().click();
await pagina.waitForFunction(() =>
  document.querySelector("section[data-previa] iframe")?.contentDocument?.querySelector("style[data-folha-jogo]")?.textContent?.includes("gold"),
);
conferir((await textoDoEditorCss()).includes("gold"), "o refazer devolve o color: gold");

// As outras soluções (pelo lab) passam pelas mesmas funções do painel.
await pagina.getByRole("button", { name: "Próximo objetivo" }).click();
await pagina.getByRole("button", { name: "Aplicar solução do objetivo atual" }).click();
await pagina.waitForFunction(() =>
  document.querySelector("section[data-previa] iframe")?.contentDocument?.querySelector("style[data-folha-jogo]")?.textContent?.includes("  color: #ffd9a0;"),
);
conferir((await textoDoEditorCss()).includes("color: #ffd9a0;") && !(await textoDoEditorCss()).includes("/* color: #ffd9a0; */"), "alternarDeclaracao liga a cor do slogan (tira o comentário) no editor");
conferir((await estiloDe(".slogan", "color")) === "rgb(255, 217, 160)", "e a prévia pinta o slogan");
await pagina.getByRole("button", { name: "Próximo objetivo" }).waitFor({ timeout: 5000 });
await pagina.getByRole("button", { name: "Próximo objetivo" }).click();
await pagina.getByRole("button", { name: "Aplicar solução do objetivo atual" }).click();
await pagina.waitForFunction(() => {
  const el = document.querySelector("section[data-previa] iframe");
  const alvo = el?.contentDocument?.querySelector(".rodape p");
  return Boolean(alvo) && el.contentWindow.getComputedStyle(alvo).color === "rgb(128, 128, 128)";
});
// O CodeMirror só desenha as linhas perto da rolagem: vai ao fim antes de ler.
await pagina.locator("[data-editor-css] .cm-content").click();
await pagina.keyboard.press("Control+End");
await pagina.waitForTimeout(200);
conferir((await textoDoEditorCss()).includes(".rodape p {"), "editarCss escreve a regra nova no fim do editor");

// A aba HTML continua funcionando e o CSS sobrevive a uma recarga do HTML.
await pagina.locator('[data-aba-editor="html"]').click();
await pagina.locator(".cm-line", { hasText: "Pergunte ao garçom." }).first().click();
await pagina.keyboard.press("End");
await pagina.keyboard.type(" Hoje tem moqueca.");
await pagina.waitForFunction(() =>
  document.querySelector("section[data-previa] iframe")?.contentDocument?.body?.textContent?.includes("moqueca"),
);
conferir((await estiloDe("h1", "color")) === "rgb(255, 215, 0)", "depois de recarregar pelo HTML, o CSS editado continua valendo");

conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
