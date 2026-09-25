// A aba Calculado dentro de Elementos, na Bancada de estilos
// (/lab/fases?fase=lab-motor-u1-f1): o diagrama do modelo de caixa com as
// medidas reais (getComputedStyle), a camada acesa na prévia ao passar o
// mouse (e ao tocar, no celular), a lista das calculadas sem e com
// "Mostrar todas", o filtro, o rastro de cada propriedade (a regra que
// vence e as riscadas) e o diagrama acompanhando uma edição no Estilos.
// Uso: node testes/calculado.mjs
import { abrir, conferir, errosRelevantes, selecionarNo } from "./util.mjs";

const lado = (pagina, camada, qual) =>
  pagina.locator(qual === "cima" ? `[data-camada="${camada}"] > span > [data-lado="cima"]` : `[data-camada="${camada}"] > [data-lado="${qual}"]`).first();
const camadasAcesas = (pagina) => pagina.locator("[data-realce-camada]").evaluateAll((lista) => lista.map((el) => el.getAttribute("data-realce-camada")).join(","));

{
  const { navegador, pagina, erros } = await abrir({ rota: "/lab/fases?fase=lab-motor-u1-f1", esperar: "[data-painel-estilos]" });
  await pagina.getByRole("button", { name: "Recolher o lab" }).click();
  const iframe = pagina.locator("section[data-previa] iframe");
  const calculadoDe = (seletor, propriedade) =>
    iframe.evaluate((el, [s, p]) => el.contentWindow.getComputedStyle(el.contentDocument.querySelector(s)).getPropertyValue(p), [seletor, propriedade]);

  await selecionarNo(pagina, ".prato");
  const subAbas = await pagina.getByRole("tablist", { name: "Painéis de estilo" }).getByRole("tab").allInnerTexts();
  conferir(subAbas.join("|") === "Estilos|Calculado", `Estilos e Calculado lado a lado, como Styles e Computed (${subAbas.join(", ")})`);
  await pagina.locator('[data-sub-aba="calculado"]').click();
  await pagina.locator("[data-painel-calculado]").waitFor();
  conferir(true, "a sub-aba Calculado abre");

  // Diagrama com as medidas reais.
  conferir((await lado(pagina, "padding", "cima").innerText()) === "12" && (await lado(pagina, "padding", "esquerda").innerText()) === "12", "padding 12 dos lados (padding: 12px)");
  conferir((await lado(pagina, "border", "direita").innerText()) === "2", "border 2 (border: 2px solid)");
  conferir((await lado(pagina, "margin", "baixo").innerText()) === "12" && (await lado(pagina, "margin", "cima").innerText()) === "0", "margin 12 embaixo e 0 em cima (zero aparece como 0, igual ao Chrome de hoje)");
  const largura = parseFloat(await calculadoDe(".prato", "width"));
  const textoLargura = await pagina.locator("[data-largura]").innerText();
  conferir(Number(textoLargura) === Math.round(largura * 1000) / 1000, `o conteúdo tem a largura calculada (${textoLargura} e ${largura})`);
  conferir(/^\d+(\.\d{3})?$/.test(await pagina.locator("[data-altura]").innerText()), "números quebrados com 3 casas, inteiros sem casas");

  // Camadas na prévia.
  conferir((await camadasAcesas(pagina)) === "", "nada aceso antes do mouse");
  await lado(pagina, "padding", "esquerda").hover();
  await pagina.waitForTimeout(100);
  conferir((await camadasAcesas(pagina)) === "padding", "mouse no padding acende só o padding na prévia");
  await lado(pagina, "margin", "baixo").hover();
  await pagina.waitForTimeout(100);
  conferir((await camadasAcesas(pagina)) === "margin", "no margin, só o margin");
  await pagina.locator('[data-camada="content"]').hover();
  await pagina.waitForTimeout(100);
  conferir((await camadasAcesas(pagina)) === "content", "no conteúdo, só o conteúdo");
  const caixaDiagrama = await pagina.locator("[data-modelo-caixa]").boundingBox();
  await pagina.mouse.move(caixaDiagrama.x + 3, caixaDiagrama.y + caixaDiagrama.height / 2);
  await pagina.waitForTimeout(100);
  conferir((await camadasAcesas(pagina)) === "margin,border,padding,content", "na borda do diagrama, todas as camadas");
  await pagina.mouse.move(5, 5);
  await pagina.waitForTimeout(100);
  conferir((await camadasAcesas(pagina)) === "", "tirar o mouse apaga");

  // Lista: sem "Mostrar todas", só o que o elemento declara (mais display, width e height).
  const nomes = () => pagina.locator("[data-calculada]").evaluateAll((lista) => lista.map((el) => el.getAttribute("data-calculada")));
  let lista = await nomes();
  conferir(
    ["border-top-width", "padding-left", "margin-bottom", "display", "width", "height"].every((nome) => lista.includes(nome)),
    "a lista tem as propriedades declaradas no .prato, mais display, width e height",
  );
  conferir(!lista.includes("color") && !lista.includes("font-family"), "e não tem as herdadas (color e font-family vêm do body)");
  const ordenada = lista.filter((nome) => !nome.startsWith("-"));
  conferir(ordenada.join() === [...ordenada].sort((a, b) => a.localeCompare(b)).join(), "em ordem alfabética");
  await pagina.locator("[data-mostrar-todas]").check();
  lista = await nomes();
  conferir(lista.includes("color") && lista.length > 100, `"Mostrar todas" mostra todas (${lista.length})`);
  conferir(lista.indexOf("-webkit-line-clamp") === -1 || lista.indexOf("-webkit-line-clamp") > lista.indexOf("z-index"), "as -webkit- ficam depois das normais");
  await pagina.locator("[data-mostrar-todas]").uncheck();
  await pagina.getByRole("searchbox", { name: "Filtrar as propriedades calculadas" }).fill("radius");
  lista = await nomes();
  conferir(lista.length === 4 && lista.every((nome) => nome.includes("radius")), `o filtro acha as 4 border-*-radius (${lista.join(", ")})`);
  await pagina.getByRole("searchbox", { name: "Filtrar as propriedades calculadas" }).fill("");

  // Rastro: de onde vem o valor.
  await pagina.locator('[data-calculada="border-top-width"] > button').click();
  const rastro = await pagina.locator('[data-rastro="border-top-width"]').innerText();
  conferir(rastro.includes(".prato") && /estilo\.css:\d+/.test(rastro) && rastro.includes("2px"), `a seta abre o rastro: 2px em .prato, estilo.css:N (${rastro.replace(/\n/g, " ")})`);
  await selecionarNo(pagina, "#do-dia .preco");
  await pagina.locator('[data-calculada="color"] > button').click();
  const linhas = pagina.locator('[data-rastro="color"] > li');
  conferir((await linhas.count()) === 3, "o rastro da cor do preço do dia tem as 3 regras");
  conferir((await linhas.first().innerText()).includes("#do-dia .preco"), "a que vence primeiro (a do !important)");
  conferir((await pagina.locator('[data-rastro="color"] [data-rastro-riscado]').count()) === 2, "e as outras duas riscadas");
  await pagina.locator('[data-rastro="color"] button').first().click();
  await pagina.waitForTimeout(300);
  conferir(await pagina.locator("[data-editor-css]").isVisible(), "o link do rastro abre o editor CSS na regra");

  // O diagrama acompanha uma edição no Estilos.
  await selecionarNo(pagina, ".prato");
  await pagina.locator('[data-sub-aba="estilos"]').click();
  await pagina.locator('[data-lista-estilos] > section[aria-label="Regra .prato"] [data-declaracao="padding"] [data-valor-propriedade]').first().click();
  await pagina.locator("[data-campo-estilo=valor]").fill("20px");
  await pagina.locator("[data-campo-estilo=valor]").press("Enter");
  await pagina.locator('[data-sub-aba="calculado"]').click();
  await pagina.waitForTimeout(200);
  conferir((await lado(pagina, "padding", "cima").innerText()) === "20", "trocar o padding no Estilos muda o diagrama (20)");
  await lado(pagina, "padding", "cima").hover();
  await pagina.locator('[data-sub-aba="estilos"]').click();
  await pagina.waitForTimeout(100);
  conferir((await camadasAcesas(pagina)) === "", "voltar para Estilos apaga a camada acesa");

  conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}

// Celular em pé: tocar numa camada acende; tocar de novo apaga.
{
  const { navegador, pagina, erros } = await abrir({ largura: 390, altura: 844, toque: true, rota: "/lab/fases?fase=lab-motor-u1-f1", esperar: "iframe" });
  const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
  if (await recolher.isVisible().catch(() => false)) await recolher.tap();
  await selecionarNo(pagina, ".prato");
  await pagina.getByRole("tab", { name: "Estilos", exact: true }).tap();
  await pagina.locator('[data-sub-aba="calculado"]').tap();
  await pagina.locator("[data-painel-calculado]").waitFor();
  const aba = await pagina.locator('[data-sub-aba="calculado"]').boundingBox();
  conferir(aba.height >= 44, "a sub-aba Calculado tem 44px de altura no toque");
  await lado(pagina, "padding", "esquerda").tap();
  await pagina.waitForTimeout(150);
  conferir((await camadasAcesas(pagina)) === "padding", "tocar no padding acende o padding");
  await lado(pagina, "padding", "esquerda").tap();
  await pagina.waitForTimeout(150);
  conferir((await camadasAcesas(pagina)) === "", "tocar de novo apaga");
  await lado(pagina, "border", "esquerda").tap();
  await pagina.waitForTimeout(150);
  await pagina.getByRole("tab", { name: "Árvore", exact: true }).tap();
  await pagina.waitForTimeout(150);
  conferir((await camadasAcesas(pagina)) === "", "trocar para a Árvore apaga a camada");
  conferir(errosRelevantes(erros).length === 0, `console limpo no celular ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}
