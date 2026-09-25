// Renomear tag pela árvore (dois cliques no nome, como no Chrome) e links
// dentro da prévia (a prévia não navega; âncora rola, o computadorzinho
// avisa para onde o link levaria). Desktop e celular em pé, com a
// apresentação da ferramenta nova pela Caixa.
import { abrir, chaveDoSeletor, conferir, errosRelevantes, linhaDaArvore, mostrarArvore, progressoComFase } from "./util.mjs";

const VISTAS_U1 = ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editar-duplo-clique", "editor", "sincronia"];
const VISTAS_U2 = [...VISTAS_U1, "trilha", "esconder", "apagar", "desfazer", "duplicar"];
const nomeDaTag = (pagina, chave) =>
  pagina.locator(`[role=treeitem][data-chave="${chave}"] [title='Dois cliques para renomear a tag']`).first();
const tagDe = (pagina, seletor) =>
  pagina.frameLocator("section[data-previa] iframe").locator(seletor).first().evaluate((el) => el.tagName.toLowerCase());
const campoDaTag = (pagina) => pagina.locator("[role=tree] input[aria-label^='Nome da tag']");

// ---------------------------------------------------------------- desktop: renomear
{
  const { navegador, pagina, erros } = await abrir({
    progresso: progressoComFase("sites-elementos-u1-f1", { objetivoAtual: 0 }, { apresentacoesVistas: VISTAS_U2 }),
  });
  const iframe = pagina.frameLocator("section[data-previa] iframe");
  await pagina.waitForTimeout(900);

  // Dois cliques no nome da tag do h1: o campo abre com o nome selecionado e o fechamento acompanha.
  const chaveH1 = await chaveDoSeletor(pagina, "h1");
  await nomeDaTag(pagina, chaveH1).dblclick();
  const campo = campoDaTag(pagina);
  await campo.waitFor();
  await campo.pressSequentially("h2");
  const linhaH1 = pagina.locator(`[role=treeitem][data-chave="${chaveH1}"]`);
  conferir((await linhaH1.textContent()).includes("</h2>"), "o fechamento acompanha o nome digitado");
  await campo.press("Enter");
  await pagina.waitForTimeout(300);
  conferir((await iframe.locator("h1").count()) === 0, "o h1 sumiu");
  conferir((await iframe.locator("h2").first().textContent()) === "Pão quentinho toda manhã", "virou h2 com o mesmo texto");
  conferir((await pagina.locator(".cm-content").textContent()).includes("<h2>Pão quentinho toda manhã</h2>"), "o código mostra a tag nova");
  conferir((await pagina.locator("[role=treeitem][aria-selected=true]").getAttribute("data-chave")) === chaveH1, "a peça renomeada continua selecionada");

  // Esc desiste.
  const chaveUl = await chaveDoSeletor(pagina, "ul.produtos");
  await nomeDaTag(pagina, chaveUl).dblclick();
  await campoDaTag(pagina).pressSequentially("ol");
  await campoDaTag(pagina).press("Escape");
  conferir((await tagDe(pagina, ".produtos")) === "ul", "Esc desiste e a lista continua ul");

  // Espaço confirma (como no F12) e os atributos ficam.
  const chaveP = await chaveDoSeletor(pagina, "p.descricao");
  await nomeDaTag(pagina, chaveP).dblclick();
  await campoDaTag(pagina).pressSequentially("div ");
  await pagina.waitForTimeout(300);
  conferir((await tagDe(pagina, ".descricao")) === "div", "Espaço confirma: p vira div com a mesma classe");

  // Nome inválido não muda nada.
  await nomeDaTag(pagina, chaveP).dblclick();
  await campoDaTag(pagina).pressSequentially("2x");
  await campoDaTag(pagina).press("Enter");
  conferir((await tagDe(pagina, ".descricao")) === "div", "nome inválido não troca a tag");

  // Entra no desfazer e no refazer.
  await pagina.getByRole("button", { name: /^Desfazer a última mudança/ }).click();
  conferir((await tagDe(pagina, ".descricao")) === "p", "Desfazer volta o p");
  await pagina.getByRole("button", { name: /^Refazer/ }).click();
  conferir((await tagDe(pagina, ".descricao")) === "div", "Refazer volta a div");

  // Pelo menu do nó.
  await linhaDaArvore(pagina, await chaveDoSeletor(pagina, "footer")).click({ button: "right" });
  await pagina.locator("[data-menu-no] [data-acao=renomear]").click();
  await campoDaTag(pagina).fill("section");
  await campoDaTag(pagina).press("Enter");
  conferir((await tagDe(pagina, ".rodape")) === "section", "menu do nó: Renomear tag");

  // O body não renomeia (o Chrome também não deixa).
  conferir((await nomeDaTag(pagina, "body").count()) === 0, "o nome do body não é editável");

  // Apresentação e card pela Caixa.
  await pagina.getByRole("button", { name: "Abrir a Caixa de Ferramentas" }).click();
  const card = pagina.locator('[data-card="renomear-tag"]');
  await card.waitFor();
  conferir((await card.getByText("Você conhece essa em breve").count()) === 1, "card em silhueta antes de apresentar");
  await pagina.keyboard.press("Escape");
  // Como se a fase já tivesse apresentado: a Caixa deixa rever.
  await pagina.evaluate(() => {
    const progresso = JSON.parse(localStorage.getItem("ilha-sites:progresso:v2"));
    progresso.apresentacoesVistas.push("renomear-tag");
    localStorage.setItem("ilha-sites:progresso:v2", JSON.stringify(progresso));
  });
  await pagina.reload();
  await pagina.waitForSelector("section[data-previa] iframe");
  await pagina.waitForTimeout(900);
  await pagina.getByRole("button", { name: "Abrir a Caixa de Ferramentas" }).click();
  await card.getByRole("button", { name: "Rever apresentação" }).click();
  const camada = pagina.locator('[data-apresentacao="renomear-tag"]');
  await camada.waitFor({ timeout: 5000 });
  for (let i = 0; i < 3; i++) {
    await pagina.getByRole("button", { name: /Continuar|Quero tentar/ }).first().click();
    await pagina.waitForTimeout(120);
  }
  await pagina.waitForTimeout(350);
  await nomeDaTag(pagina, await chaveDoSeletor(pagina, "header")).dblclick();
  await campoDaTag(pagina).fill("div");
  await campoDaTag(pagina).press("Enter");
  await camada.waitFor({ state: "detached", timeout: 5000 });
  conferir(true, "desktop: a apresentação fecha quando a tag é renomeada de verdade");
  await pagina.getByRole("button", { name: "Abrir a Caixa de Ferramentas" }).click();
  await card.waitFor();
  conferir((await card.getByText("Dê dois cliques no nome da tag").count()) > 0, "o card mostra como usar com o mouse");
  await pagina.keyboard.press("Escape");

  conferir(errosRelevantes(erros).length === 0, `desktop: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}

// ---------------------------------------------------------------- links na prévia
for (const modo of ["desktop", "retrato"]) {
  const toque = modo === "retrato";
  const { navegador, pagina, erros } = await abrir({
    ...(toque ? { largura: 390, altura: 844, toque: true } : {}),
    progresso: progressoComFase(
      "sites-elementos-u2-f1",
      { objetivoAtual: 0 },
      { apresentacoesVistas: VISTAS_U2, fasesConcluidas: ["sites-elementos-u1-f1", "sites-elementos-u1-f2", "sites-elementos-u1-f3"] },
    ),
  });
  const iframe = pagina.frameLocator("section[data-previa] iframe");
  await pagina.waitForTimeout(1200);
  const tocar = (localizador) => (toque ? localizador.tap() : localizador.click());
  const balao = async () => {
    if (toque) {
      const abrirConversa = pagina.getByRole("button", { name: /Abrir a conversa/ });
      if (await abrirConversa.isVisible().catch(() => false)) await abrirConversa.tap();
      await pagina.waitForTimeout(250);
    }
    return pagina.locator("body");
  };
  const fechar = async () => {
    if (!toque) return;
    const botao = pagina.getByRole("button", { name: /Fechar a conversa/ });
    if (await botao.isVisible().catch(() => false)) await botao.tap();
    await pagina.waitForTimeout(250);
  };
  const clicarNoLink = async (seletor) => {
    await fechar();
    const link = iframe.locator(seletor).first();
    await link.scrollIntoViewIfNeeded();
    await tocar(link);
    await pagina.waitForTimeout(700);
  };
  const mudarLink = (seletor, href, alvo) =>
    pagina.evaluate(
      ([s, h, a]) => {
        // Só o atributo, direto no documento: aqui o que se testa é o clique.
        const link = document.querySelector("section[data-previa] iframe").contentDocument.querySelector(s);
        if (h === null) link.removeAttribute("href");
        else link.setAttribute("href", h);
        if (a) link.setAttribute("target", a);
      },
      [seletor, href, alvo ?? null],
    );
  const naPagina = () => pagina.evaluate(() => document.querySelector("section[data-previa] iframe").contentDocument.location.href);

  await clicarNoLink("#noticia-praca .leia-mais");
  await balao();
  conferir((await pagina.getByText('Esse link tem href="#"').count()) > 0, `${modo}: link com href="#" tem fala própria`);
  conferir((await naPagina()) === "about:srcdoc" && (await iframe.locator("#noticias").count()) === 1, `${modo}: a prévia não saiu do lugar`);

  await mudarLink("#noticia-praca .leia-mais", "https://exemplo.site/praca", "_blank");
  await clicarNoLink("#noticia-praca .leia-mais");
  await balao();
  conferir(
    (await pagina.getByText("Esse link levaria para: https://exemplo.site/praca (numa aba nova)").count()) > 0,
    `${modo}: link externo diz para onde levaria`,
  );
  conferir((await naPagina()) === "about:srcdoc" && (await iframe.locator("#noticias").count()) === 1, `${modo}: link externo não navega`);
  if (!toque) {
    await iframe.locator("#noticia-praca .leia-mais").click({ button: "middle" });
    await pagina.waitForTimeout(400);
    conferir((await naPagina()) === "about:srcdoc", "botão do meio também não sai do lugar");
  }

  await mudarLink("#noticia-praca .leia-mais", "#sumiu");
  await clicarNoLink("#noticia-praca .leia-mais");
  await balao();
  conferir((await pagina.getByText("É um link quebrado!").count()) > 0, `${modo}: âncora sem alvo é link quebrado`);

  await mudarLink("#noticia-praca .leia-mais", null);
  await clicarNoLink("#noticia-praca .leia-mais");
  await balao();
  conferir((await pagina.getByText("o href dele está vazio").count()) > 0, `${modo}: link sem href tem fala de vazio`);

  await mudarLink("#noticia-praca .leia-mais", "#rodape");
  await pagina.evaluate(() => document.querySelector("section[data-previa] iframe").contentWindow.scrollTo(0, 0));
  const rolavel = await pagina.evaluate(() => {
    const doc = document.querySelector("section[data-previa] iframe").contentDocument;
    return doc.scrollingElement.scrollHeight > doc.scrollingElement.clientHeight + 40;
  });
  await clicarNoLink("#noticia-praca .leia-mais");
  const rolagem = await pagina.evaluate(() => document.querySelector("section[data-previa] iframe").contentWindow.scrollY);
  if (rolavel) conferir(rolagem > 0, `${modo}: link âncora rola a prévia até o rodapé (${Math.round(rolagem)} px)`);

  if (toque) {
    // Renomear pela barra do nó selecionado.
    await mostrarArvore(pagina);
    const chave = await chaveDoSeletor(pagina, "#noticia-praca h3");
    await linhaDaArvore(pagina, chave).tap();
    await pagina.locator("[data-barra-acoes] [data-acao=renomear]").tap();
    await campoDaTag(pagina).fill("h2");
    await campoDaTag(pagina).press("Enter");
    conferir((await tagDe(pagina, "#noticia-praca > :first-child")) === "h2", "celular: Renomear pela barra do nó");
    // Dois toques no nome da tag.
    await nomeDaTag(pagina, chave).tap();
    await pagina.waitForTimeout(80);
    await nomeDaTag(pagina, chave).tap();
    await campoDaTag(pagina).waitFor({ timeout: 3000 });
    await campoDaTag(pagina).fill("h3");
    await campoDaTag(pagina).press("Enter");
    conferir((await tagDe(pagina, "#noticia-praca > :first-child")) === "h3", "celular: dois toques no nome da tag");
  }

  conferir(errosRelevantes(erros).length === 0, `${modo}: console limpo ${JSON.stringify(errosRelevantes(erros))}`);
  await navegador.close();
}
