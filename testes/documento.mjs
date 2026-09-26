// Modo documento e "Adicionar atributo", na Bancada do documento
// (/lab/fases?fase=lab-motor-u1-f2): o editor com a página inteira, a
// árvore começando no <!DOCTYPE> e no <html> (com o head, o title e os
// meta), a aba do navegador falso com o <title> ao vivo, a simulação dos
// acentos quebrados sem meta charset (aviso e fala do computadorzinho), e
// o atributo novo pelo menu do nó (botão direito no desktop, toque longo
// no celular), com desfazer.
// Uso: node testes/documento.mjs
import { abrir, conferir, errosRelevantes, linhaDaArvore, mostrarArvore, selecionarNo, chaveDoSeletor } from "./util.mjs";

const ROTA = "/lab/fases?fase=lab-motor-u1-f2";

{
  const { navegador, pagina, erros } = await abrir({ rota: ROTA, esperar: "[data-aba-navegador]" });
  await pagina.getByRole("button", { name: "Recolher o lab" }).click();
  const iframe = pagina.locator("section[data-previa] iframe");
  const naPagina = (funcao, argumento) => iframe.evaluate(funcao, argumento);
  const textoDoEditor = async () => {
    await pagina.locator(".cm-content").first().click();
    await pagina.keyboard.press("Control+End");
    return pagina.locator(".cm-content").first().innerText();
  };
  const tituloDaAba = () => pagina.locator("[data-titulo-aba]").innerText();

  // A página inteira.
  conferir((await pagina.locator("[data-doctype]").innerText()).trim() === "<!DOCTYPE html>", "a árvore começa no <!DOCTYPE html>, como no Chrome");
  conferir((await pagina.locator('[role=treeitem][data-chave="body"]').innerText()).startsWith("<html"), "e a raiz é o <html>");
  conferir((await chaveDoSeletor(pagina, "head")) === "0" && (await chaveDoSeletor(pagina, "title")) === "0.1", "com o head, o meta e o title na árvore");
  const estilosNaArvore = await pagina.locator("[role=treeitem]", { hasText: "<style>" }).count();
  conferir(estilosNaArvore === 1, `os estilos do jogo não aparecem (só o <style> do site: ${estilosNaArvore})`);
  conferir((await pagina.locator(".cm-content").first().innerText()).startsWith("<!DOCTYPE html>"), "o editor mostra o documento inteiro");
  conferir((await pagina.getByText("index.html").count()) > 0, "e o cabeçalho diz que é a página (index.html)");

  // Sem meta charset: acentos quebrados (simulação).
  conferir((await tituloDaAba()) === "Meu cartÃ£o", `a aba mostra o title, quebrado sem meta charset (${await tituloDaAba()})`);
  conferir((await naPagina((el) => el.contentDocument.querySelector("h1").textContent)) === "CartÃ£o de visita", "a prévia quebra os acentos");
  await pagina.locator("[data-aviso-acentos]").click();
  await pagina.waitForTimeout(300);
  conferir((await pagina.locator("body").innerText()).includes("Isto é uma simulação"), "o aviso faz o computadorzinho explicar que é uma simulação");
  conferir(!(await textoDoEditor()).includes("Ã"), "o código continua com os acentos certos");

  // Title editado pela árvore: a aba muda na hora.
  const chaveTexto = await chaveDoSeletor(pagina, "title");
  await pagina.locator(`[role=treeitem][data-chave="${chaveTexto}"] [title='Dois cliques para editar']`).first().dblclick();
  const campo = pagina.locator("[role=tree] input").first();
  await campo.fill("Cartão da Ana");
  await campo.press("Enter");
  await pagina.waitForTimeout(250);
  conferir((await tituloDaAba()) === "Cartão da Ana", "trocar o texto do title pela árvore muda a aba ao vivo");
  conferir((await textoDoEditor()).includes("<title>Cartão da Ana</title>"), "e o código");

  // Meta charset pelo editor: os acentos voltam e o aviso some.
  await pagina.locator(".cm-line", { hasText: "<head>" }).first().click();
  await pagina.keyboard.press("End");
  await pagina.keyboard.type('\n<meta charset="utf-8">');
  await pagina.waitForFunction(() => {
    const el = document.querySelector("section[data-previa] iframe");
    return el?.contentDocument?.querySelector("meta[charset]") && !document.querySelector("[data-aviso-acentos]");
  });
  conferir((await naPagina((el) => el.contentDocument.querySelector("h1").textContent)) === "Cartão de visita", "com o meta charset, os acentos voltam");
  conferir((await tituloDaAba()) === "Cartão da Ana", "e a aba também");
  await pagina.waitForTimeout(400);

  // Adicionar atributo: botão direito no link.
  await selecionarNo(pagina, "a");
  const chaveLink = await chaveDoSeletor(pagina, "a");
  await linhaDaArvore(pagina, chaveLink).click({ button: "right" });
  const item = pagina.locator("[data-menu-no] [data-acao=adicionar-atributo]");
  conferir((await item.innerText()).includes("Adicionar atributo"), "o menu do nó tem Adicionar atributo");
  await item.click();
  const novo = pagina.locator("[data-atributo-novo] input");
  conferir(await novo.isVisible(), "um espaço para o atributo aparece dentro da tag, como no Chrome");
  await novo.fill('target="_blank" rel="noopener"');
  await novo.press("Enter");
  await pagina.waitForTimeout(250);
  conferir((await naPagina((el) => el.contentDocument.querySelector("a").getAttribute("target"))) === "_blank", "o link ganha target=_blank");
  conferir((await naPagina((el) => el.contentDocument.querySelector("a").getAttribute("rel"))) === "noopener", "dá para escrever mais de um de uma vez");
  conferir((await linhaDaArvore(pagina, chaveLink).innerText()).includes('target="_blank"'), "a árvore mostra o atributo novo");
  conferir((await textoDoEditor()).includes('target="_blank"'), "e o código também");

  await pagina.getByRole("button", { name: /^Desfazer/ }).first().click();
  await pagina.waitForTimeout(250);
  conferir((await naPagina((el) => el.contentDocument.querySelector("a").hasAttribute("target"))) === false, "desfazer tira os atributos novos");

  // Esc desiste.
  await linhaDaArvore(pagina, chaveLink).click({ button: "right" });
  await pagina.locator("[data-menu-no] [data-acao=adicionar-atributo]").click();
  await pagina.locator("[data-atributo-novo] input").fill("title=oi");
  await pagina.locator("[data-atributo-novo] input").press("Escape");
  await pagina.waitForTimeout(200);
  conferir((await naPagina((el) => el.contentDocument.querySelector("a").hasAttribute("title"))) === false, "Esc desiste do atributo novo");

  conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}

// Celular em pé: toque longo no nó e Adicionar atributo.
{
  const { navegador, pagina, erros } = await abrir({ largura: 390, altura: 844, toque: true, rota: ROTA, esperar: "[data-aba-navegador]" });
  const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
  if (await recolher.isVisible().catch(() => false)) await recolher.tap();
  conferir(await pagina.locator("[data-titulo-aba]").isVisible(), "no celular, a aba com o título aparece também");
  await mostrarArvore(pagina);
  const chaveLink = await chaveDoSeletor(pagina, "a");
  const linha = linhaDaArvore(pagina, chaveLink);
  await linha.scrollIntoViewIfNeeded();
  // Toque longo (como em ferramentas-novas.mjs).
  const caixa = await linha.boundingBox();
  const ponto = { clientX: caixa.x + 60, clientY: caixa.y + caixa.height / 2, pointerType: "touch", isPrimary: true, pointerId: 7 };
  await linha.dispatchEvent("pointerdown", ponto);
  await pagina.waitForTimeout(750);
  await linha.dispatchEvent("pointerup", ponto);
  await pagina.waitForTimeout(200);
  const item = pagina.locator("[data-menu-no] [data-acao=adicionar-atributo]");
  conferir((await item.count()) === 1, "toque longo no nó abre o menu com Adicionar atributo");
  const alvo = await item.boundingBox();
  conferir(alvo.height >= 44, "com 44px de altura");
  await item.tap();
  await pagina.locator("[data-atributo-novo] input").fill('target="_blank"');
  await pagina.locator("[data-atributo-novo] input").press("Enter");
  await pagina.waitForTimeout(250);
  conferir(
    (await pagina.locator("section[data-previa] iframe").evaluate((el) => el.contentDocument.querySelector("a").getAttribute("target"))) === "_blank",
    "o link ganha o atributo no celular",
  );
  conferir(errosRelevantes(erros).length === 0, `console limpo no celular ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}

// Celular deitado: a aba com o título e o menu do nó com o atributo novo.
{
  const { navegador, pagina, erros } = await abrir({ largura: 844, altura: 390, toque: true, rota: ROTA, esperar: "[data-aba-navegador]" });
  const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
  if (await recolher.isVisible().catch(() => false)) await recolher.tap();
  conferir((await pagina.locator("[data-titulo-aba]").innerText()) === "Meu cartÃ£o", "deitado, a aba mostra o título (quebrado, sem meta charset)");
  conferir(await pagina.locator("[data-doctype]").isVisible(), "e a árvore começa no doctype");
  conferir(errosRelevantes(erros).length === 0, `console limpo deitado ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}
