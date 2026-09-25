// Ferramentas da Unidade 2 em qualquer fase: trilha, esconder, apagar,
// desfazer/refazer, duplicar, menu do nó (botão direito e toque longo) e a
// barra de ações do celular. Também confere as apresentações pela Caixa.
import { abrir, conferir, errosRelevantes, progressoComFase } from "./util.mjs";

const VISTAS = ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editar-duplo-clique", "editor", "sincronia"];
const PROGRESSO = progressoComFase("sites-elementos-u1-f1", { objetivoAtual: 0 }, { apresentacoesVistas: VISTAS });

const arvore = (pagina, chave) => pagina.locator(`[role=treeitem][data-chave="${chave}"]`).first();
const linha = (pagina, chave) => arvore(pagina, chave).locator("> div").first();
const classeDo = (pagina, seletor) =>
  pagina.frameLocator("iframe").first().locator(seletor).first().getAttribute("class");

// ---------------------------------------------------------------- desktop
{
  const { navegador, pagina, erros } = await abrir({ progresso: PROGRESSO });
  const iframe = pagina.frameLocator("iframe").first();
  await pagina.waitForTimeout(900);

  // Botão direito no h1 > Esconder.
  await linha(pagina, "1").click({ button: "right" });
  const menu = pagina.locator("[data-menu-no]");
  await menu.waitFor();
  conferir((await menu.getByRole("menuitem").count()) === 5, "menu do nó com Editar, Renomear tag, Esconder, Apagar e Duplicar");
  await menu.locator("[data-acao=esconder]").click();
  conferir((await classeDo(pagina, "h1"))?.includes("__web-inspector-hide-shortcut__"), "esconder põe a classe do Chrome no h1");
  const caixa = await iframe.locator("h1").boundingBox();
  const visivel = await iframe.locator("h1").evaluate((el) => getComputedStyle(el).visibility);
  conferir(caixa && caixa.height > 20 && visivel === "hidden", "h1 invisível e mantendo o espaço");
  conferir((await pagina.locator(".cm-content").textContent()).includes("__web-inspector-hide-shortcut__"), "a classe aparece no código");
  conferir((await arvore(pagina, "1").textContent()).includes("__web-inspector-hide-shortcut__"), "a classe aparece na árvore");

  // Ctrl+Z com o foco na árvore.
  await pagina.locator("[role=tree]").focus();
  await pagina.keyboard.press("Control+z");
  conferir(!(await classeDo(pagina, "h1"))?.includes("__web-inspector"), "Ctrl+Z desfaz o esconder");
  await pagina.keyboard.press("Control+Shift+z");
  conferir((await classeDo(pagina, "h1"))?.includes("__web-inspector"), "Ctrl+Shift+Z refaz");
  await pagina.keyboard.press("Control+z");

  // H alterna.
  await linha(pagina, "1").click();
  await pagina.keyboard.press("h");
  conferir((await classeDo(pagina, "h1"))?.includes("__web-inspector"), "H esconde o selecionado");
  await pagina.keyboard.press("h");
  conferir(!(await classeDo(pagina, "h1"))?.includes("__web-inspector"), "H de novo mostra");

  // Apagar pelo menu: a seleção passa para o próximo irmão.
  await linha(pagina, "0").click({ button: "right" });
  await menu.locator("[data-acao=apagar]").click();
  conferir((await iframe.locator("header").count()) === 0, "apagar tira o header");
  conferir((await pagina.locator("[role=treeitem][aria-selected=true]").textContent()).includes("h1"), "seleção passa para o próximo irmão");
  await pagina.getByRole("button", { name: /^Desfazer a última mudança/ }).click();
  conferir((await iframe.locator("header").count()) === 1, "botão Desfazer traz o header de volta");
  await pagina.getByRole("button", { name: /^Refazer/ }).click();
  conferir((await iframe.locator("header").count()) === 0, "botão Refazer apaga de novo");
  await pagina.getByRole("button", { name: /^Desfazer a última mudança/ }).click();

  // Delete apaga; Shift+Alt+seta duplica e seleciona a cópia.
  await linha(pagina, "5.0").click();
  await pagina.keyboard.press("Shift+Alt+ArrowDown");
  conferir((await iframe.locator("ul li").count()) === 4, "Shift+Alt+seta para baixo duplica o li");
  conferir((await pagina.locator("[role=treeitem][aria-selected=true]").getAttribute("data-chave")) === "5.1", "a cópia fica selecionada");
  await pagina.keyboard.press("Delete");
  conferir((await iframe.locator("ul li").count()) === 3, "Delete apaga o selecionado");

  // Trilha: do li até o ul.
  await linha(pagina, "5.2").click();
  const trilha = pagina.getByRole("navigation", { name: /Trilha de elementos/ });
  conferir((await trilha.textContent()).replace(/\s+/g, "").includes("html›body›ul.produtos›li"), "trilha mostra html › body › ul.produtos › li");
  await trilha.getByRole("button", { name: "ul.produtos" }).click();
  conferir((await pagina.locator("[role=treeitem][aria-selected=true]").getAttribute("data-chave")) === "5", "clicar na trilha seleciona o ancestral");

  // Apresentações novas pela Caixa (Rever).
  for (const id of ["trilha", "esconder", "apagar", "desfazer", "duplicar"]) {
    await pagina.getByRole("button", { name: "Abrir a Caixa de Ferramentas" }).click();
    await pagina.locator(`[data-card="${id}"]`).waitFor();
    conferir((await pagina.locator(`[data-card="${id}"]`).getByText("Você conhece essa em breve").count()) === 1, `${id}: card em silhueta antes de apresentar`);
    await pagina.keyboard.press("Escape");
  }

  conferir(errosRelevantes(erros).length === 0, `desktop: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}

// ---------------------------------------------------------------- celular
{
  const { navegador, pagina, erros } = await abrir({ largura: 390, altura: 844, toque: true, progresso: PROGRESSO });
  const iframe = pagina.frameLocator("iframe").first();
  await pagina.waitForTimeout(900);
  const fechar = pagina.getByRole("button", { name: /Fechar a conversa/ });
  if (await fechar.isVisible().catch(() => false)) await fechar.tap();

  await linha(pagina, "0").tap();
  const barra = pagina.locator("[data-barra-acoes]");
  await barra.waitFor();
  const botoes = await barra.locator("button").evaluateAll((lista) => lista.map((b) => b.getBoundingClientRect().height));
  const larguras = await barra.locator("button").evaluateAll((lista) => lista.map((b) => b.getBoundingClientRect().width));
  conferir(
    botoes.length === 7 && botoes.every((altura) => altura >= 44) && larguras.every((largura) => largura >= 44),
    "barra do nó com 7 botões de 44 px",
  );
  await barra.locator("[data-acao=esconder]").tap();
  conferir((await classeDo(pagina, "header"))?.includes("__web-inspector"), "celular: Esconder pela barra");
  await barra.locator("[data-acao=desfazer]").tap();
  conferir(!(await classeDo(pagina, "header"))?.includes("__web-inspector"), "celular: Desfazer pela barra");
  await barra.locator("[data-acao=duplicar]").tap();
  conferir((await iframe.locator("header").count()) === 2, "celular: Duplicar pela barra");
  await barra.locator("[data-acao=apagar]").tap();
  conferir((await iframe.locator("header").count()) === 1, "celular: Apagar pela barra");

  // Toque longo num nó abre o menu (e não o card da árvore).
  const alvo = await linha(pagina, "4").boundingBox();
  const ponto = { clientX: alvo.x + 60, clientY: alvo.y + alvo.height / 2, pointerType: "touch", isPrimary: true, pointerId: 7 };
  await linha(pagina, "4").dispatchEvent("pointerdown", ponto);
  await pagina.waitForTimeout(750);
  await linha(pagina, "4").dispatchEvent("pointerup", ponto);
  await pagina.waitForTimeout(200);
  conferir((await pagina.locator("[data-menu-no]").count()) === 1, "toque longo no nó abre o menu do nó");
  conferir((await pagina.getByRole("dialog", { name: "Caixa de Ferramentas" }).count()) === 0, "e não abre o card da árvore");
  await pagina.locator("[data-menu-no] [data-acao=esconder]").tap();
  conferir((await classeDo(pagina, "h2"))?.includes("__web-inspector"), "celular: Esconder pelo menu do toque longo");

  // Toque longo num botão de ferramenta continua abrindo o card.
  const inspecionar = pagina.getByRole("button", { name: /Modo inspecionar/ }).first();
  const caixa = await inspecionar.boundingBox();
  const noBotao = { clientX: caixa.x + 10, clientY: caixa.y + 10, pointerType: "touch", isPrimary: true, pointerId: 8 };
  await inspecionar.dispatchEvent("pointerdown", noBotao);
  await pagina.waitForTimeout(750);
  await inspecionar.dispatchEvent("pointerup", noBotao);
  await pagina.getByRole("dialog", { name: "Caixa de Ferramentas" }).waitFor({ timeout: 3000 });
  conferir(true, "toque longo no botão de ferramenta abre o card");

  conferir(errosRelevantes(erros).length === 0, `celular: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}

// ------------------------------------------------ apresentações (Rever)
for (const modo of ["desktop", "retrato"]) {
  const toque = modo === "retrato";
  const TODAS = [...VISTAS, "trilha", "esconder", "apagar", "desfazer", "duplicar"];
  const { navegador, pagina, erros } = await abrir({
    ...(toque ? { largura: 390, altura: 844, toque: true } : {}),
    progresso: progressoComFase("sites-elementos-u1-f1", { objetivoAtual: 0 }, { apresentacoesVistas: TODAS }),
  });
  await pagina.waitForTimeout(900);
  const tocar = (localizador) => (toque ? localizador.tap() : localizador.click());
  const abrirCaixa = async () => {
    if (toque) {
      const fechar = pagina.getByRole("button", { name: /Fechar a conversa/ });
      if (await fechar.isVisible().catch(() => false)) await fechar.tap();
      await pagina.getByRole("button", { name: "Mais opções" }).tap();
    }
    await tocar(pagina.getByRole("button", { name: "Abrir a Caixa de Ferramentas" }));
  };
  const menuOuBarra = async (chave, acao) => {
    if (toque) {
      await linha(pagina, chave).tap();
      await pagina.locator(`[data-barra-acoes] [data-acao=${acao}]`).tap();
    } else {
      await linha(pagina, chave).click({ button: "right" });
      await pagina.locator(`[data-menu-no] [data-acao=${acao}]`).click();
    }
  };
  const experimentar = {
    trilha: async () => {
      await tocar(linha(pagina, "5.0"));
      await tocar(pagina.getByRole("navigation", { name: /Trilha de elementos/ }).getByRole("button", { name: "ul.produtos" }));
    },
    esconder: () => menuOuBarra("2", "esconder"),
    apagar: () => menuOuBarra("2", "apagar"),
    desfazer: () => tocar(pagina.getByRole("button", { name: /^Desfazer a última mudança/ })),
    duplicar: () => menuOuBarra("3", "duplicar"),
  };
  for (const id of ["trilha", "esconder", "apagar", "desfazer", "duplicar"]) {
    await abrirCaixa();
    await tocar(pagina.locator(`[data-card="${id}"]`).getByRole("button", { name: "Rever apresentação" }));
    const camada = pagina.locator(`[data-apresentacao="${id}"]`);
    await camada.waitFor({ timeout: 5000 });
    for (let i = 0; i < 3; i++) {
      await tocar(pagina.getByRole("button", { name: /Continuar|Quero tentar/ }).first());
      await pagina.waitForTimeout(120);
    }
    await pagina.waitForTimeout(350);
    await experimentar[id]();
    try {
      await camada.waitFor({ state: "detached", timeout: 5000 });
    } catch (erro) {
      await pagina.screenshot({ path: `testes-falha-novas-${modo}-${id}.png` });
      throw erro;
    }
    conferir(true, `${modo}: apresentação ${id} fecha quando a ferramenta é usada de verdade`);
  }
  conferir(errosRelevantes(erros).length === 0, `${modo}: console limpo nas apresentações ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}
