// Modo dispositivo na Bancada de variáveis (/lab/fases?fase=lab-motor-u1-f3)
// e na Bancada do documento (lab-motor-u1-f2): Ctrl+Shift+M e o botão ao
// lado da setinha ligam a barra; o iframe ganha a largura do aparelho de
// verdade (o matchMedia do próprio iframe concorda com o painel Estilos);
// modelos, girar, largura livre pelas alças, zoom quando não cabe, a setinha
// acertando a peça com o zoom; sem meta viewport, o celular desenha em
// 980 px (aviso "simulação") e desfazer volta. No celular, a barra cabe numa
// linha.
// Uso: node testes/dispositivo.mjs [desktop|retrato|paisagem]
import { abrir, conferir, errosRelevantes, esperarPronto, fecharBalao, selecionarNo } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;

async function abrirBancada(fase) {
  const aberto = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: `/lab/fases?fase=${fase}`, esperar: "section[data-previa] iframe" });
  const recolher = aberto.pagina.getByRole("button", { name: "Recolher o lab" });
  if (await recolher.isVisible().catch(() => false)) await (toque ? recolher.tap() : recolher.click());
  await esperarPronto(aberto.pagina);
  return aberto;
}

function ajudantes(pagina) {
  const iframe = pagina.locator("section[data-previa] iframe");
  return {
    iframe,
    larguraDaPagina: () => iframe.evaluate((el) => el.contentWindow.innerWidth),
    casa: (consulta) => iframe.evaluate((el, q) => el.contentWindow.matchMedia(q).matches, consulta),
    aparelho: pagina.locator("[data-aparelho]"),
    barra: pagina.locator("[data-barra-dispositivo]"),
    tocar: async (localizador) => {
      if (toque) await fecharBalao(pagina);
      await localizador.scrollIntoViewIfNeeded();
      if (toque) await localizador.tap();
      else await localizador.click();
      await esperarPronto(pagina);
    },
  };
}

// ---------------------------------------------------------------- ligar, modelos, girar, @media de verdade
{
  const { navegador, pagina, erros } = await abrirBancada("lab-motor-u1-f3");
  const { larguraDaPagina, casa, aparelho, barra, tocar } = ajudantes(pagina);
  conferir((await aparelho.getAttribute("data-aparelho")) === "desligado", `${MODO}: começa sem a barra de dispositivo`);
  if (toque) {
    await tocar(pagina.locator("[data-botao-dispositivo]"));
    const botao = await pagina.locator("[data-botao-dispositivo]").boundingBox();
    conferir(botao.width >= 44 && botao.height >= 44, `${MODO}: o botão do modo dispositivo tem 44 px no toque`);
  } else {
    await pagina.locator("section[data-previa]").click({ position: { x: 5, y: 5 } });
    await pagina.keyboard.press("Control+Shift+M");
    await esperarPronto(pagina);
    conferir(true, `${MODO}: Ctrl+Shift+M liga a barra de dispositivo`);
  }
  await barra.waitFor();
  conferir((await pagina.locator("[data-botao-dispositivo]").getAttribute("aria-pressed")) === "true", `${MODO}: o botão fica apertado`);
  await pagina.waitForFunction(() => document.querySelector("section[data-previa] iframe")?.contentWindow?.innerWidth === 390);
  conferir(true, `${MODO}: o iframe tem 390 px de verdade (Celular 390, a página tem meta viewport)`);
  conferir(await casa("(max-width: 600px)"), `${MODO}: e a @media (max-width: 600px) vale dentro dele`);
  await selecionarNo(pagina, ".cards");
  if (MODO === "retrato") await tocar(pagina.getByRole("tab", { name: "Estilos", exact: true }).first());
  await esperarPronto(pagina);
  conferir((await pagina.locator('[data-lista-estilos] [data-condicao-regra="media"]').count()) > 0, `${MODO}: o painel mostra a regra da @media, concordando com a prévia`);

  await pagina.locator("[data-modelo-dispositivo]").selectOption("tablet-768");
  await pagina.waitForFunction(() => document.querySelector("section[data-previa] iframe")?.contentWindow?.innerWidth === 768);
  await esperarPronto(pagina);
  conferir(!(await casa("(max-width: 600px)")), `${MODO}: no Tablet 768 a @media não vale`);
  conferir((await pagina.locator('[data-lista-estilos] [data-condicao-regra="media"]').count()) === 0, `${MODO}: e some do painel`);

  await tocar(pagina.locator("[data-girar-dispositivo]"));
  await pagina.waitForFunction(() => document.querySelector("section[data-previa] iframe")?.contentWindow?.innerWidth === 1024);
  conferir((await barra.getAttribute("data-orientacao")) === "paisagem", `${MODO}: girar deita o tablet (1024 de largura)`);

  await pagina.locator("[data-modelo-dispositivo]").selectOption("notebook-1280");
  await pagina.waitForFunction(() => document.querySelector("section[data-previa] iframe")?.contentWindow?.innerWidth === 1280);
  const zoom = Number(await aparelho.getAttribute("data-zoom"));
  conferir(zoom < 100, `${MODO}: o Notebook 1280 não cabe: zoom de ${zoom}%`);
  conferir((await pagina.locator("[data-zoom-dispositivo]").textContent()).trim() === `${zoom}%`, `${MODO}: a barra mostra o zoom`);

  // A setinha acerta a peça mesmo com a página encolhida.
  if (!toque) {
    await pagina.getByRole("button", { name: /^Modo inspecionar/ }).click();
    const alvo = await pagina.locator("section[data-previa] iframe").evaluate((el) => {
      const caixa = el.contentDocument.querySelector("#pilates h2").getBoundingClientRect();
      const moldura = el.getBoundingClientRect();
      const escala = moldura.width / el.offsetWidth;
      return { x: moldura.left + (caixa.left + caixa.width / 2) * escala, y: moldura.top + (caixa.top + caixa.height / 2) * escala };
    });
    await pagina.mouse.click(alvo.x, alvo.y);
    await esperarPronto(pagina);
    const selecionada = await pagina.locator('[role="treeitem"][aria-selected="true"]').first().textContent();
    conferir(/h2/.test(selecionada), `${MODO}: com zoom, a setinha escolhe o h2 do card do meio (${selecionada.trim().slice(0, 30)})`);
  }

  // Largura livre pelas alças.
  await pagina.locator("[data-modelo-dispositivo]").selectOption("celular-390");
  await pagina.waitForFunction(() => document.querySelector("section[data-previa] iframe")?.contentWindow?.innerWidth === 390);
  const alca = pagina.locator('[data-alca-dispositivo="direita"]');
  const caixaAlca = await alca.boundingBox();
  // O zoom exato: a moldura tem 2 px de borda de cada lado.
  const zoomAntes = ((await aparelho.boundingBox()).width - 4) / 390;
  if (toque) {
    // Dedo: arrasto com eventos de ponteiro de toque.
    await alca.dispatchEvent("pointerdown", { pointerId: 7, pointerType: "touch", clientX: caixaAlca.x + 5, clientY: caixaAlca.y + 10, isPrimary: true });
    await alca.dispatchEvent("pointermove", { pointerId: 7, pointerType: "touch", clientX: caixaAlca.x + 5 + 30, clientY: caixaAlca.y + 10, isPrimary: true });
    await alca.dispatchEvent("pointerup", { pointerId: 7, pointerType: "touch", clientX: caixaAlca.x + 5 + 30, clientY: caixaAlca.y + 10, isPrimary: true });
  } else {
    await pagina.mouse.move(caixaAlca.x + caixaAlca.width / 2, caixaAlca.y + caixaAlca.height / 2);
    await pagina.mouse.down();
    await pagina.mouse.move(caixaAlca.x + caixaAlca.width / 2 + 30, caixaAlca.y + caixaAlca.height / 2, { steps: 4 });
    await pagina.mouse.up();
  }
  await esperarPronto(pagina);
  const livre = Number(await aparelho.getAttribute("data-largura"));
  conferir(Math.abs(livre - Math.round(390 + 60 / zoomAntes)) <= 2, `${MODO}: arrastar a alça 30 px aumenta o aparelho em 60 px de tela (${livre})`);
  conferir((await pagina.locator("[data-modelo-dispositivo]").inputValue()) === "livre", `${MODO}: e o aparelho vira "Livre"`);
  conferir((await larguraDaPagina()) === livre, `${MODO}: o iframe acompanha (${await larguraDaPagina()})`);

  if (toque) {
    const medidas = await barra.evaluate((el) => ({ altura: el.getBoundingClientRect().height, sw: el.scrollWidth, cw: el.clientWidth }));
    conferir(medidas.sw <= medidas.cw + 1 && medidas.altura <= 52, `${MODO}: a barra de dispositivo cabe numa linha (${JSON.stringify(medidas)})`);
    const girar = await pagina.locator("[data-girar-dispositivo]").boundingBox();
    conferir(girar.width >= 44 && girar.height >= 44, `${MODO}: o botão de girar tem 44 px`);
  }

  // Desligar: o iframe volta a ocupar o espaço todo.
  await tocar(pagina.locator("[data-botao-dispositivo]"));
  await barra.waitFor({ state: "detached" });
  conferir((await aparelho.getAttribute("data-aparelho")) === "desligado", `${MODO}: desligar tira a barra e o aparelho`);
  conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}

// ---------------------------------------------------------------- sem meta viewport: 980 px (simulação)
{
  const { navegador, pagina, erros } = await abrirBancada("lab-motor-u1-f2");
  const { larguraDaPagina, tocar, aparelho } = ajudantes(pagina);
  await tocar(pagina.locator("[data-botao-dispositivo]"));
  await pagina.waitForFunction(() => document.querySelector("section[data-previa] iframe")?.contentWindow?.innerWidth === 390);
  conferir(true, `${MODO}: com o meta viewport, 390 px`);
  await selecionarNo(pagina, 'meta[name="viewport"]');
  if (toque) {
    await pagina.locator('[role="treeitem"][aria-selected="true"]').first().waitFor();
    await tocar(pagina.getByRole("button", { name: "Apagar", exact: true }).first());
  } else {
    await pagina.keyboard.press("Delete");
  }
  await pagina.waitForFunction(() => document.querySelector("section[data-previa] iframe")?.contentWindow?.innerWidth === 980);
  await esperarPronto(pagina);
  conferir((await larguraDaPagina()) === 980 && (await aparelho.getAttribute("data-largura-layout")) === "980", `${MODO}: sem meta viewport, o celular desenha a página em 980 px`);
  conferir(await pagina.locator("[data-aviso-viewport]").isVisible(), `${MODO}: com o aviso de simulação na prévia`);
  const fala = await pagina.evaluate(() => document.body.innerText.includes("980 px e encolhe tudo"));
  conferir(fala, `${MODO}: e o computadorzinho explica`);
  await tocar(pagina.getByRole("button", { name: "Desfazer" }).first());
  await pagina.waitForFunction(() => document.querySelector("section[data-previa] iframe")?.contentWindow?.innerWidth === 390);
  conferir((await pagina.locator("[data-aviso-viewport]").count()) === 0, `${MODO}: desfazer devolve o meta viewport e a largura do aparelho`);
  conferir(errosRelevantes(erros).length === 0, `${MODO}: console limpo no documento ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}
