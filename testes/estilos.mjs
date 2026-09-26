// O painel Estilos dentro de Elementos, na Bancada de estilos
// (/lab/fases?fase=lab-motor-u1-f1): abas de cima sem "Estilos", as
// regras do elemento na ordem do Chrome (element.style, regras, folha do
// navegador, "Herdado de"), riscadas, edição de valor e nome (clique,
// Enter, Esc, Tab), setas nos números, caixinha que comenta no CSS,
// amostra de cor, regra nova com o seletor do Chrome, "+ declaração",
// hover no seletor acendendo as peças, link "estilo.css:N" abrindo o
// editor CSS, estilo inline e desfazer. Tudo atualiza CSS, editor e
// prévia sem recarregar. No celular: "Árvore | Estilos | Código" em
// retrato, lado a lado deitado, alvos de 44px e botões de seta.
// Uso: node testes/estilos.mjs
import { abrir, conferir, errosRelevantes, selecionarNo } from "./util.mjs";

const { navegador, pagina, erros } = await abrir({ rota: "/lab/fases?fase=lab-motor-u1-f1", esperar: "[data-painel-estilos]" });
await pagina.getByRole("button", { name: "Recolher o lab" }).click();
const iframe = pagina.locator("section[data-previa] iframe");
const estiloDe = (seletor, propriedade) =>
  iframe.evaluate((el, [s, p]) => el.contentWindow.getComputedStyle(el.contentDocument.querySelector(s)).getPropertyValue(p), [seletor, propriedade]);
const cssNaTela = () => iframe.evaluate((el) => el.contentDocument.querySelector("style[data-folha-jogo]")?.textContent ?? "");
const blocoDoSeletor = (seletor) =>
  seletor === "element.style"
    ? pagina.locator('[data-lista-estilos] > section[aria-label="element.style"]')
    : pagina.locator(`[data-lista-estilos] > section[aria-label="Regra ${seletor}"]`).first();
const declaracao = (seletor, propriedade) => blocoDoSeletor(seletor).locator(`[data-declaracao="${propriedade}"]`).first();
await iframe.evaluate((el) => {
  el.contentWindow.__marcaDoTeste = "viva";
});

// Abas de cima: Estilos saiu (é sub-painel de Elementos, como no Chrome).
const abasDeCima = await pagina.getByRole("tablist", { name: "Painéis do DevTools" }).getByRole("tab").allInnerTexts();
conferir(!abasDeCima.some((texto) => texto.includes("Estilos")), `as abas de cima não têm Estilos (${abasDeCima.join(", ").replace(/\n/g, " ")})`);
conferir(abasDeCima.some((texto) => texto.includes("Fontes")), "e ganharam Fontes, na ordem do Chrome");

// Nada selecionado: o painel explica.
conferir((await pagina.locator("[data-painel-estilos]").innerText()).includes("Selecione uma peça"), "sem seleção, o painel pede para selecionar");

// Seleção: a ordem do Chrome.
await selecionarNo(pagina, "#do-dia .preco");
const rotulos = await pagina.locator("[data-lista-estilos] > section").evaluateAll((lista) => lista.map((el) => el.getAttribute("aria-label")));
conferir(rotulos[0] === "element.style", "element.style fica em cima");
conferir(rotulos.slice(1, 4).join("|") === "Regra #do-dia .preco|Regra .prato .preco|Regra .preco", `depois as regras, da que ganha para a que perde (${rotulos.slice(1, 4).join(", ")})`);
const herdados = await pagina.locator("[data-herdado-de]").evaluateAll((lista) => lista.map((el) => el.getAttribute("data-herdado-de")));
conferir(herdados.join("|") === "body", `e a seção Herdado de body (article e main não têm nada herdável, então ficam de fora, como no Chrome: ${herdados.join(", ")})`);
conferir((await declaracao(".prato .preco", "color").getAttribute("data-situacao")) === "perdeu", "a cor de .prato .preco aparece riscada (perdeu para o !important)");
conferir((await declaracao("#do-dia .preco", "color").getAttribute("data-situacao")) === "vence", "a do #do-dia .preco vence");
const herdadoBody = pagina.locator('[data-herdado-de="body"] [data-declaracao]');
conferir((await herdadoBody.evaluateAll((lista) => lista.map((el) => el.getAttribute("data-declaracao")))).every((nome) => ["font-family", "color"].includes(nome)), "no Herdado de body só aparecem as herdáveis (font-family e color)");
conferir((await pagina.locator('[data-herdado-de="body"] [data-declaracao="color"]').getAttribute("data-situacao")) === "perdeu", "e a cor herdada do body fica riscada");

// Hover no seletor acende todas as peças dele.
await blocoDoSeletor(".preco").locator("[data-seletor-regra]").hover();
await pagina.waitForFunction(() => document.querySelectorAll("[data-realce-regra]").length === 2);
conferir(true, "passar o mouse no seletor .preco acende os 2 preços na prévia");
await pagina.mouse.move(5, 5);

// Editar valor: clique, digita, Enter. O CSS, o editor e a prévia mudam juntos.
await selecionarNo(pagina, "h1");
await declaracao("h1", "font-size").locator("[data-valor-propriedade]").click();
const campo = pagina.locator("[data-campo-estilo=valor]");
await campo.fill("40px");
await campo.press("Enter");
await pagina.waitForFunction(() => document.querySelector("section[data-previa] iframe")?.contentDocument?.querySelector("style[data-folha-jogo]")?.textContent.includes("font-size: 40px"));
conferir((await estiloDe("h1", "font-size")) === "40px", "Enter confirma: o h1 fica com 40px na prévia");
conferir((await iframe.evaluate((el) => el.contentWindow.__marcaDoTeste)) === "viva", "sem recarregar a prévia");

// Esc desiste (a prévia provisória volta).
await declaracao("h1", "font-size").locator("[data-valor-propriedade]").click();
await campo.fill("90px");
await pagina.waitForFunction(() => {
  const el = document.querySelector("section[data-previa] iframe");
  return el.contentWindow.getComputedStyle(el.contentDocument.querySelector("h1")).fontSize === "90px";
});
conferir(true, "enquanto digita, a prévia mostra o valor novo");
await campo.press("Escape");
await pagina.waitForTimeout(200);
conferir((await estiloDe("h1", "font-size")) === "40px" && (await cssNaTela()).includes("font-size: 40px"), "Esc desiste e volta os 40px");

// Setas: 1, Shift 10, Alt 0,1.
await declaracao("h1", "font-size").locator("[data-valor-propriedade]").click();
await campo.press("ArrowUp");
conferir((await campo.inputValue()) === "41px", "seta para cima: 40px vira 41px");
await campo.press("Shift+ArrowUp");
conferir((await campo.inputValue()) === "51px", "Shift + seta: soma 10");
await campo.press("Alt+ArrowDown");
conferir((await campo.inputValue()) === "50.9px", "Alt + seta: tira 0,1");
await campo.press("Enter");
await pagina.waitForTimeout(200);
conferir((await estiloDe("h1", "font-size")) === "50.9px", "o valor das setas vale na prévia");

// Tab: do nome vai para o valor; do valor, para a próxima declaração.
await declaracao("h1", "font-size").locator("[data-nome-propriedade]").click();
await pagina.locator("[data-campo-estilo=nome]").press("Tab");
conferir((await pagina.locator("[data-campo-estilo=valor]").count()) === 1, "Tab no nome vai para o valor");
await pagina.locator("[data-campo-estilo=valor]").press("Tab");
conferir((await pagina.locator("[data-campo-estilo=nome]").inputValue()) === "margin", "Tab no valor vai para o nome da próxima (margin)");
await pagina.locator("[data-campo-estilo=nome]").press("Escape");

// + declaração: nome, Tab, valor, Enter.
await blocoDoSeletor("h1").hover();
await blocoDoSeletor("h1").locator("[data-adicionar-declaracao]").click();
await pagina.locator("[data-campo-estilo=nome]").fill("letter-spacing");
await pagina.locator("[data-campo-estilo=nome]").press("Tab");
await pagina.locator("[data-campo-estilo=valor]").fill("2px");
await pagina.locator("[data-campo-estilo=valor]").press("Enter");
await pagina.waitForTimeout(250);
conferir((await estiloDe("h1", "letter-spacing")) === "2px", "+ declaração acrescenta letter-spacing: 2px no h1");
conferir((await cssNaTela()).includes("  letter-spacing: 2px;\n}"), "com o recuo da regra, no CSS");

// Caixinha: desliga (vira comentário) e liga de novo.
await selecionarNo(pagina, ".slogan");
const caixinha = declaracao(".slogan", "font-style").locator("[data-alternar-declaracao]");
await blocoDoSeletor(".slogan").hover();
await caixinha.click();
await pagina.waitForTimeout(200);
conferir((await cssNaTela()).includes("/* font-style: italic; */"), "desmarcar a caixinha comenta a declaração no CSS");
conferir((await declaracao(".slogan", "font-style").getAttribute("data-situacao")) === "desligada", "e ela aparece desligada (riscada)");
conferir((await estiloDe(".slogan", "font-style")) === "normal", "a prévia perde o itálico");
await caixinha.click();
await pagina.waitForTimeout(200);
conferir((await estiloDe(".slogan", "font-style")) === "italic", "marcar de novo volta o itálico");

// Amostra de cor: o seletor de cor troca o valor.
await selecionarNo(pagina, "header");
await blocoDoSeletor("header").locator("[data-seletor-cor]").first().fill("#123456");
await pagina.waitForTimeout(250);
conferir((await cssNaTela()).includes("background: #123456;"), "o seletor de cor escreve a cor nova (hexadecimal) no CSS");
conferir((await estiloDe("header", "background-color")) === "rgb(18, 52, 86)", "e a prévia pinta o cabeçalho");

// Regra nova: seletor do Chrome e edição aberta.
await selecionarNo(pagina, ".rodape p");
await pagina.locator("[data-nova-regra]").click();
await pagina.locator("[data-campo-estilo=nome]").fill("color");
await pagina.locator("[data-campo-estilo=nome]").press("Tab");
await pagina.locator("[data-campo-estilo=valor]").fill("teal");
await pagina.locator("[data-campo-estilo=valor]").press("Enter");
await pagina.waitForTimeout(250);
conferir((await cssNaTela()).includes("p {\n  color: teal;\n}"), "a regra nova usa o seletor que o Chrome sugere (p) e já recebe a declaração");
conferir((await estiloDe(".rodape p", "color")) === "rgb(0, 128, 128)", "e vale na prévia");

// Estilo inline (element.style).
await selecionarNo(pagina, "#do-dia .preco");
await declaracao("element.style", "font-size").locator("[data-valor-propriedade]").click();
await pagina.locator("[data-campo-estilo=valor]").fill("24px");
await pagina.locator("[data-campo-estilo=valor]").press("Enter");
await pagina.waitForTimeout(250);
conferir((await iframe.evaluate((el) => el.contentDocument.querySelector("#do-dia .preco").getAttribute("style"))) === "font-size: 24px", "editar o element.style troca o atributo style");

// Link da fonte abre o editor CSS na linha.
await selecionarNo(pagina, "h1");
await blocoDoSeletor("h1").locator("[data-fonte-regra]").click();
await pagina.waitForTimeout(300);
conferir(await pagina.locator("[data-editor-css]").isVisible(), "o link estilo.css:N abre a aba CSS do editor");
conferir((await pagina.locator("[data-editor-css] .cm-activeLine").innerText()).startsWith("h1 {"), "com o cursor na regra do h1");

// Desfazer volta a última mudança (a regra nova do rodapé? não: o inline, que foi o último).
await pagina.getByRole("button", { name: /^Desfazer/ }).first().click();
await pagina.waitForTimeout(250);
conferir((await iframe.evaluate((el) => el.contentDocument.querySelector("#do-dia .preco").getAttribute("style"))) === "font-size: 20px", "desfazer volta o style inline");
await pagina.getByRole("button", { name: /^Desfazer/ }).first().click();
await pagina.waitForTimeout(250);
conferir(!(await cssNaTela()).includes("color: teal"), "outro desfazer tira a regra nova");

conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();

// Celular em retrato: "Árvore | Estilos | Código" e alvos de 44px.
{
  const { navegador, pagina, erros } = await abrir({ largura: 390, altura: 844, toque: true, rota: "/lab/fases?fase=lab-motor-u1-f1", esperar: "iframe" });
  const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
  if (await recolher.isVisible().catch(() => false)) await recolher.tap();
  const segmentos = await pagina.getByRole("tablist", { name: "Mostrar no painel" }).getByRole("tab").allInnerTexts();
  conferir(segmentos.join("|") === "Árvore|Estilos|Código", `retrato: o painel alterna Árvore, Estilos e Código (${segmentos.join(", ")})`);
  await selecionarNo(pagina, "h1");
  await pagina.getByRole("tab", { name: "Estilos", exact: true }).tap();
  await pagina.waitForTimeout(200);
  conferir(await pagina.locator("[data-painel-estilos]").isVisible(), "tocar em Estilos mostra o painel");
  conferir(!(await pagina.locator("[role=tree]").first().isVisible()), "no lugar da árvore");
  const regraH1 = pagina.locator('[data-lista-estilos] > section[aria-label="Regra h1"]').first();
  const caixa = await regraH1.locator('[data-declaracao="font-size"] label:has([data-alternar-declaracao])').boundingBox();
  conferir(caixa && caixa.width >= 44 && caixa.height >= 44, `a caixinha tem 44px de área de toque (${caixa?.width}x${caixa?.height})`);
  await regraH1.locator('[data-declaracao="font-size"] [data-valor-propriedade]').tap();
  const setas = pagina.locator("[data-setas-numericas] button");
  conferir((await setas.count()) === 2, "no toque, o campo de número ganha os botões de seta");
  const botao = await setas.first().boundingBox();
  conferir(botao && botao.width >= 44 && botao.height >= 44, "com 44px cada");
  await pagina.getByRole("button", { name: "Aumentar o número" }).tap();
  conferir((await pagina.locator("[data-campo-estilo=valor]").inputValue()) === "33px", "o botão de cima soma 1 (32px vira 33px)");
  await pagina.locator("[data-campo-estilo=valor]").press("Enter");
  await pagina.waitForTimeout(250);
  conferir(
    (await pagina.locator("section[data-previa] iframe").evaluate((el) => el.contentWindow.getComputedStyle(el.contentDocument.querySelector("h1")).fontSize)) === "33px",
    "e vale na prévia",
  );
  conferir(errosRelevantes(erros).length === 0, `console limpo no retrato ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}

// Celular deitado: árvore e Estilos lado a lado.
{
  const { navegador, pagina, erros } = await abrir({ largura: 844, altura: 390, toque: true, rota: "/lab/fases?fase=lab-motor-u1-f1", esperar: "iframe" });
  const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
  if (await recolher.isVisible().catch(() => false)) await recolher.tap();
  await selecionarNo(pagina, "h1");
  const arvore = await pagina.locator("[role=tree]").first().boundingBox();
  const estilos = await pagina.locator("[data-painel-estilos]").boundingBox();
  conferir(arvore && estilos && estilos.x >= arvore.x + arvore.width - 2, "paisagem: a árvore e o painel Estilos ficam lado a lado");
  const segmentos = await pagina.getByRole("tablist", { name: "Mostrar no painel" }).getByRole("tab").allInnerTexts();
  conferir(segmentos.join("|") === "Árvore e Estilos|Código", `e o seletor do painel não repete Estilos (${segmentos.join(", ")})`);
  const botao = await pagina.locator("[data-nova-regra]").boundingBox();
  conferir(botao && botao.x + botao.width <= estilos.x + estilos.width + 1 && botao.height >= 44, "o botão de regra nova cabe no painel estreito (desce de linha), com 44px");
  await pagina.locator("[data-nova-regra]").tap();
  await pagina.locator("[data-campo-estilo=nome]").fill("color");
  await pagina.locator("[data-campo-estilo=nome]").press("Tab");
  await pagina.locator("[data-campo-estilo=valor]").fill("purple");
  await pagina.locator("[data-campo-estilo=valor]").press("Enter");
  await pagina.waitForTimeout(250);
  conferir(
    (await pagina.locator("section[data-previa] iframe").evaluate((el) => el.contentWindow.getComputedStyle(el.contentDocument.querySelector("h1")).color)) === "rgb(128, 0, 128)",
    "deitado, a regra nova pelo toque vale na prévia",
  );
  conferir(errosRelevantes(erros).length === 0, `console limpo na paisagem ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}
