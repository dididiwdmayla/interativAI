// Joga as Unidades 1 e 2 do começo ao fim, como um jogador, a partir do
// mapa: mundo -> ilha Sites -> unidade -> fases -> volta para a ilha, que
// comemora. No caminho: apresentações, meta com antes/depois, previsões, o
// esbarrão do computadorzinho, objetivos sozinho, o desafio com checklist e
// o Rever (revisão e volta).
// Uso: node testes/unidades.mjs [desktop|retrato|paisagem]
import { abrir, chaveDoSeletor, conferir, errosRelevantes, selecionarNo } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: "/", esperar: "[data-mapa=mundo]" });
const toque = TAMANHOS[MODO].toque;
const movel = MODO !== "desktop";
const iframe = pagina.frameLocator("iframe[title^='Site']").first();

// ------------------------------------------------------------ ajudantes
const esperar = (ms) => pagina.waitForTimeout(ms);

async function tocar(localizador, opcoes) {
  if (toque) await localizador.tap(opcoes);
  else await localizador.click(opcoes);
}

async function falhar(nome, erro) {
  await pagina.screenshot({ path: `testes-falha-unidades-${MODO}-${nome}.png` });
  throw erro;
}

/** No celular, a conversa mora num balão que abre e fecha. */
async function abrirBalao() {
  if (!movel) return;
  const abrirConversa = pagina.getByRole("button", { name: /Abrir a conversa/ });
  if (await abrirConversa.isVisible().catch(() => false)) await abrirConversa.tap();
  await esperar(250);
}
async function fecharBalao() {
  if (!movel) return;
  const fechar = pagina.getByRole("button", { name: /Fechar a conversa/ });
  if (await fechar.isVisible().catch(() => false)) await fechar.tap();
  await esperar(250);
}

async function mostrarPainel(segmento) {
  if (!movel) return;
  await fecharBalao();
  const aba = pagina.getByRole("tab", { name: segmento, exact: true });
  if ((await aba.getAttribute("aria-selected")) !== "true") await aba.tap();
  await esperar(150);
}

/** Botões da conversa (Continuar, Vamos lá!, Próximo objetivo...). */
async function botaoConversa(nome) {
  await abrirBalao();
  const botao = pagina.getByRole("button", { name: nome }).first();
  await botao.waitFor({ timeout: 8000 });
  await tocar(botao);
  await esperar(250);
}

async function conversar(vezes) {
  for (let i = 0; i < vezes; i++) await botaoConversa(/^(Continuar|Vamos lá!)$/);
}

async function proximoObjetivo(nome) {
  try {
    await abrirBalao();
    await pagina.getByRole("button", { name: /Próximo objetivo|Ver resultado/ }).first().waitFor({ timeout: 8000 });
  } catch (erro) {
    await falhar(nome, erro);
  }
  conferir(true, `${nome}: concluído`);
  await botaoConversa(/Próximo objetivo|Ver resultado/);
}

/** Fala as 3 falas de uma apresentação e faz o "Experimente". */
async function apresentacao(id, experimentar) {
  const camada = pagina.locator(`[data-apresentacao="${id}"]`);
  try {
    await camada.waitFor({ timeout: 8000 });
  } catch (erro) {
    await falhar(`apresentacao-${id}`, erro);
  }
  for (let i = 0; i < 3; i++) {
    await tocar(pagina.getByRole("button", { name: /Continuar|Quero tentar/ }).first());
    await esperar(120);
  }
  await esperar(350);
  await experimentar();
  try {
    await camada.waitFor({ state: "detached", timeout: 6000 });
  } catch (erro) {
    await falhar(`experimente-${id}`, erro);
  }
  conferir(true, `apresentação ${id} fechou depois do uso`);
}

const no = (chave) => pagina.locator(`[role=treeitem][data-chave="${chave}"] > div`).first();
const textoDoNo = (chave) => pagina.locator(`[role=treeitem][data-chave="${chave}"] [title='Dois cliques para editar']`).first();
const nomeDaTag = (chave) => pagina.locator(`[role=treeitem][data-chave="${chave}"] [title='Dois cliques para renomear a tag']`).first();
const campoDaTag = () => pagina.locator("[role=tree] input[aria-label^='Nome da tag']");

/** Ação do menu do nó (no primeiro elemento do seletor): botão direito no desktop, barra de ações no celular. */
async function acaoNoNo(seletor, acao) {
  const chave = await chaveDoSeletor(pagina, seletor);
  await mostrarPainel("Árvore");
  if (toque) {
    await no(chave).tap();
    await pagina.locator(`[data-barra-acoes] [data-acao=${acao}]`).tap();
  } else {
    await no(chave).click({ button: "right" });
    await pagina.locator(`[data-menu-no] [data-acao=${acao}]`).click();
  }
  await esperar(200);
}

/** Troca o texto do primeiro elemento do seletor pela árvore. */
async function editarTexto(seletor, texto) {
  const chave = await chaveDoSeletor(pagina, seletor);
  await mostrarPainel("Árvore");
  if (toque) {
    await no(chave).tap();
    await pagina.locator("[data-barra-acoes] [data-acao=editar]").tap();
  } else {
    await textoDoNo(chave).dblclick();
  }
  const campo = pagina.locator("[role=tree] input").first();
  await campo.fill(texto);
  await campo.press("Enter");
  await esperar(200);
}

/**
 * Troca o valor do PRIMEIRO atributo do primeiro elemento do seletor (a
 * árvore só edita atributo que já existe): dois cliques nele.
 */
async function editarValorAtributo(seletor, novoValor) {
  const chave = await chaveDoSeletor(pagina, seletor);
  await mostrarPainel("Árvore");
  await esperar(150);
  const alvo = pagina.locator(`[role=treeitem][data-chave="${chave}"] [title='Dois cliques para editar']`).first();
  await alvo.scrollIntoViewIfNeeded();
  if (toque) {
    await alvo.tap();
    await esperar(180);
    await alvo.tap();
  } else {
    await alvo.dblclick();
  }
  const campo = pagina.locator("[role=tree] input").first();
  await campo.waitFor({ timeout: 8000 });
  await campo.fill(novoValor);
  await campo.press("Enter");
  await esperar(250);
}

/**
 * Acrescenta um atributo novo pelo código (a árvore não cria atributo que
 * não existe): clica na linha que tem `buscaTexto`, anda até logo depois
 * de `apos` e digita `textoNovo` ali.
 */
async function acrescentarAtributoPeloCodigo(buscaTexto, apos, textoNovo) {
  await clicarLinhaCodigo(buscaTexto);
  const linha = pagina.locator(".cm-line", { hasText: buscaTexto }).first();
  const texto = (await linha.textContent()) ?? "";
  const indice = texto.indexOf(apos);
  if (indice < 0) throw new Error(`Falhou: "${apos}" não está na linha "${texto}"`);
  const posicao = indice + apos.length;
  await pagina.keyboard.press("Home");
  for (let i = 0; i < posicao; i++) await pagina.keyboard.press("ArrowRight");
  await pagina.keyboard.type(textoNovo);
  await esperar(250);
}

/** Renomeia a tag do primeiro elemento do seletor: dois cliques (ou toques) no nome dela. */
async function renomearTag(seletor, novaTag) {
  const chave = await chaveDoSeletor(pagina, seletor);
  await mostrarPainel("Árvore");
  await esperar(200);
  const campo = campoDaTag();
  if (toque) {
    // No celular, a barra de ações do nó selecionado é mais estável do que o duplo toque em sequência.
    await no(chave).tap();
    await pagina.locator("[data-barra-acoes] [data-acao=renomear]").tap();
  } else {
    await nomeDaTag(chave).dblclick();
  }
  await campo.waitFor({ timeout: 8000 });
  await campo.fill(novaTag);
  await campo.press("Enter");
  await esperar(300);
}

/** Clica numa linha do código, rolando o editor até o fim primeiro (CodeMirror só renderiza linhas visíveis). */
async function clicarLinhaCodigo(texto) {
  await mostrarPainel("Código");
  const scroller = pagina.locator(".cm-scroller").first();
  await scroller.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  await esperar(200);
  const linha = pagina.locator(".cm-line", { hasText: texto }).first();
  await linha.waitFor({ timeout: 8000 });
  await tocar(linha);
}

async function trilha(rotulo) {
  await mostrarPainel("Árvore");
  await tocar(pagina.getByRole("navigation", { name: /Trilha de elementos/ }).getByRole("button", { name: rotulo, exact: true }));
  await esperar(200);
}

async function inspecionar(seletor) {
  await fecharBalao();
  await iframe.locator(seletor).first().scrollIntoViewIfNeeded();
  await tocar(pagina.getByRole("button", { name: /Modo inspecionar/ }).first());
  await esperar(300);
  const caixa = await iframe.locator(seletor).first().boundingBox();
  const x = caixa.x + Math.min(20, caixa.width / 2);
  const y = caixa.y + caixa.height / 2;
  if (toque) await pagina.touchscreen.tap(x, y);
  else await pagina.mouse.click(x, y);
  await esperar(300);
}

async function conclusaoEProxima(nome) {
  const conclusao = pagina.locator("[data-conclusao]");
  await conclusao.waitFor({ timeout: 8000 });
  for (let i = 0; i < 4; i++) {
    const continuar = pagina.getByRole("dialog").getByRole("button", { name: "Continuar", exact: true });
    if (!(await continuar.isVisible().catch(() => false))) break;
    await tocar(continuar);
    await esperar(200);
  }
  conferir(await pagina.getByText("Missão de campo").isVisible(), `${nome}: missão de campo na conclusão`);
  await tocar(pagina.getByRole("button", { name: "Próxima fase" }));
  await esperar(900);
}

const checklist = () => pagina.locator("[data-checklist]").first();
/** Partes marcadas no checklist (no celular em pé ele abre na barra; deitado, fica no balão). */
async function partesFeitas() {
  const barra = pagina.locator("button[aria-expanded]").filter({ hasText: /Checklist|Desafio/ }).first();
  if (MODO === "retrato") {
    await fecharBalao();
    await barra.tap();
    await esperar(250);
  }
  if (MODO === "paisagem") await abrirBalao();
  const feitas = await pagina.locator('[data-parte][data-feita="true"]').count();
  if (MODO === "retrato") {
    await barra.tap();
    await esperar(200);
  }
  return feitas;
}

async function metaDaUnidade(nome) {
  const meta = pagina.locator("[data-meta]");
  await meta.waitFor({ timeout: 8000 });
  const previas = pagina.getByRole("dialog").locator("iframe");
  conferir((await previas.count()) === 2, `${nome}: meta com antes e depois lado a lado`);
  const [antes, depois] = await Promise.all([previas.nth(0).boundingBox(), previas.nth(1).boundingBox()]);
  conferir(Math.abs(antes.y - depois.y) < 2 && depois.x > antes.x, `${nome}: as duas prévias ficam lado a lado`);
  await tocar(pagina.getByRole("button", { name: /Bora!|Começar o desafio/ }));
  await esperar(300);
}

// ------------------------------------------------------------ mapa
const ponto = (id) => pagina.locator(`[data-unidade="${id}"]`);
const estadoDoPonto = (id) => ponto(id).getAttribute("data-estado");

/** Na ilha: abre o card da unidade e aperta o botão (Jogar, Continuar...). */
async function jogarUnidade(unidadeId, rotulo) {
  await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
  await ponto(unidadeId).scrollIntoViewIfNeeded();
  await tocar(ponto(unidadeId));
  const botao = pagina.getByRole("dialog").getByRole("button", { name: rotulo, exact: true });
  await botao.waitFor();
  await tocar(botao);
  await pagina.waitForSelector("section[data-previa] iframe");
  await esperar(400);
}

/** Fim da última fase da unidade: missão de campo e "Voltar pra ilha", que comemora. */
async function conclusaoEVoltarAIlha(nome) {
  const conclusao = pagina.locator("[data-conclusao]");
  await conclusao.waitFor({ timeout: 8000 });
  for (let i = 0; i < 4; i++) {
    const continuar = pagina.getByRole("dialog").getByRole("button", { name: "Continuar", exact: true });
    if (!(await continuar.isVisible().catch(() => false))) break;
    await tocar(continuar);
    await esperar(200);
  }
  conferir((await pagina.getByRole("button", { name: "Próxima fase" }).count()) === 0, `${nome}: depois do desafio não tem Próxima fase`);
  await tocar(pagina.getByRole("button", { name: "Voltar pra ilha" }));
  await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
  await pagina.locator("[data-comemoracao]").waitFor({ timeout: 6000 });
  conferir(true, `${nome}: voltou para a ilha, que comemora`);
}

// Mundo -> ilha Sites. No começo, só a U1 está aberta.
await tocar(pagina.locator("[data-ilha=sites]"));
await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
conferir((await estadoDoPonto("sites-elementos-u2")) === "bloqueada", "ilha no começo: U2 com cadeado");
await jogarUnidade("sites-elementos-u1", "Jogar");

// ------------------------------------------------------------ Unidade 1
// A meta (antes/depois) cobre a tela: passa por ela antes de mais nada.
await metaDaUnidade("U1 começo");

await conversar(3);
await apresentacao("painel", () => tocar(pagina.getByRole("tab", { name: "Elementos" }).first()));
await apresentacao("previa", async () => {
  if (toque) await iframe.locator("h2").tap();
  else {
    await pagina.locator('[data-ferramenta~="previa"]').first().hover();
    await pagina.mouse.wheel(0, 200);
  }
});
await apresentacao("me-ajuda", () => tocar(pagina.getByRole("button", { name: /^Me ajuda\. Próxima/ }).first()));
await apresentacao("tutor", async () => {
  const campo = pagina.getByPlaceholder("Pergunte ao computadorzinho...").first();
  await campo.fill("o que é uma tag?");
  await campo.press("Enter");
});
await esperar(600);

await apresentacao("arvore", async () => {
  await mostrarPainel("Árvore");
  if (toque) await no("0").tap();
  else await no("0").hover();
});
await mostrarPainel("Árvore");
await selecionarNo(pagina, "h1");
await proximoObjetivo("U1 objetivo 1");
await apresentacao("inspecionar", () => inspecionar("button"));
await proximoObjetivo("U1 objetivo 2");
await apresentacao("editar-duplo-clique", async () => {
  await mostrarPainel("Árvore");
  if (toque) {
    await no("1").tap();
    await pagina.locator("[data-barra-acoes] [data-acao=editar]").tap();
  } else {
    await textoDoNo("1").dblclick();
  }
});
const campoU1 = pagina.locator("[role=tree] input").first();
await campoU1.fill("Minha padaria favorita");
await campoU1.press("Enter");
await proximoObjetivo("U1 objetivo 3");
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
await proximoObjetivo("U1 objetivo 4");
await conclusaoEProxima("U1");

// ------------------------------------------------------------ U1 fase 2 (sozinho)
// Mesmas 4 habilidades da Fase 1, sem ajuda completa, na página de encomendas.
await conversar(3);
await mostrarPainel("Árvore");
await selecionarNo(pagina, "h2"); // "Sabores de hoje"
await proximoObjetivo("U1F2 objetivo 1 (árvore, sozinho)");
await inspecionar(".sabores li");
await proximoObjetivo("U1F2 objetivo 2 (inspecionar, sozinho)");
await editarTexto(".sabores li", "Torta de limão");
await proximoObjetivo("U1F2 objetivo 3 (editar texto, sozinho)");
await mostrarPainel("Código");
await tocar(pagina.locator(".cm-line", { hasText: "Cajuzinho" }).first());
await pagina.keyboard.press("End");
await pagina.keyboard.press("Enter");
await pagina.keyboard.type("<li>Sonho");
await proximoObjetivo("U1F2 objetivo 4 (código, sozinho)");
await conclusaoEProxima("U1F2");

// ------------------------------------------------------------ U1 fase 3 (desafio)
await metaDaUnidade("Desafio U1");
await conversar(3);
if (!movel) conferir(await checklist().isVisible(), "desafio U1: checklist no lugar dos objetivos");

await mostrarPainel("Árvore");
await selecionarNo(pagina, "#aviso");
conferir((await partesFeitas()) === 1, "desafio U1: selecionar o aviso pela árvore marca a parte");

await inspecionar(".botao");
conferir((await partesFeitas()) === 2, "desafio U1: inspecionar o botão marca a parte");

await editarTexto(".cardapio li", "Wrap de frango");
conferir((await partesFeitas()) === 3, "desafio U1: trocar o prato marca a parte");

// Regra da Etapa 1 da fábrica: parte de estado (texto) desmarca ao desfazer;
// parte de seleção (árvore, setinha) continua marcada.
await tocar(pagina.getByRole("button", { name: /^Desfazer a última mudança/ }));
conferir((await partesFeitas()) === 2, "desafio U1: desfazer desmarca a parte de texto (ao vivo)");
await editarTexto(".cardapio li", "Wrap de frango");
conferir((await partesFeitas()) === 3, "desafio U1: refazer a troca marca a parte de novo");

await mostrarPainel("Código");
await tocar(pagina.locator(".cm-line", { hasText: "Batata rústica" }).first());
await pagina.keyboard.press("End");
await pagina.keyboard.press("Enter");
await pagina.keyboard.type("<li>Torta");
try {
  await abrirBalao();
  await pagina.getByRole("button", { name: "Ver resultado" }).first().waitFor({ timeout: 6000 });
} catch (erro) {
  await falhar("desafio-u1", erro);
}
conferir((await partesFeitas()) === 4, "desafio U1: as 4 partes marcadas");
await botaoConversa("Ver resultado");
await pagina.locator("[data-conclusao]").waitFor();
conferir((await pagina.getByText("Desafio vencido!").count()) > 0, "desafio U1: conclusão");
conferir((await pagina.getByRole("dialog").locator("[aria-label='3 de 3 estrelas']").count()) === 1, "desafio U1: 3 estrelas");
await conclusaoEVoltarAIlha("U1");
conferir((await estadoDoPonto("sites-elementos-u1")) === "concluida", "ilha: U1 concluída");
conferir((await estadoDoPonto("sites-elementos-u2")) === "disponivel", "ilha: U2 abriu");
await jogarUnidade("sites-elementos-u2", "Jogar");

// ------------------------------------------------------------ U2 fase 1
await metaDaUnidade("U2 começo");
await conversar(3);
await apresentacao("trilha", async () => {
  await mostrarPainel("Árvore");
  await selecionarNo(pagina, "#noticia-praca .leia-mais");
  await trilha("article#noticia-praca.noticia");
});
await proximoObjetivo("U2F1 objetivo 1 (trilha)");

// Previsão: o card aparece antes, com as opções.
await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
conferir((await pagina.getByRole("button", { name: /^Me ajuda/ }).count()) === 0, "previsão: sem Me ajuda antes do palpite");
await tocar(pagina.locator("[data-previsao] button").nth(1));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
conferir(true, "previsão: acertou e mostra a explicação");
await mostrarPainel("Árvore");
await selecionarNo(pagina, "main");
await proximoObjetivo("U2F1 objetivo 2 (previsão)");

// Sozinho: selo, só 2 degraus de ajuda, setinha + trilha.
await abrirBalao();
if (!movel) conferir((await pagina.locator("[aria-current=step]").textContent()).includes("Sozinho"), "sozinho: selo na faixa do objetivo");
const ajudaSozinho = pagina.getByRole("button", { name: /^Me ajuda/ }).first();
await tocar(ajudaSozinho);
await tocar(ajudaSozinho);
conferir(await ajudaSozinho.isDisabled(), "sozinho: o Me ajuda para no degrau 2");
await inspecionar("#noticia-feira h3");
await trilha("section#noticias");
await pagina.locator("[data-fez-sozinho]").waitFor({ timeout: 5000 });
conferir(true, "sozinho: comemoração Fez sozinho!");
await proximoObjetivo("U2F1 objetivo 3 (sozinho)");
await conclusaoEProxima("U2F1");

// ------------------------------------------------------------ U2 fase 2
await conversar(3);
await apresentacao("esconder", () => acaoNoNo("#banner-topo", "esconder"));
const alturaBanner = (await iframe.locator("#banner-topo").boundingBox())?.height ?? 0;
conferir(alturaBanner > 20, "esconder: o banner guarda o espaço");
await proximoObjetivo("U2F2 objetivo 1 (esconder)");

// Previsão errada de propósito: não custa estrela, e o apagar só é apresentado depois.
await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
conferir((await pagina.locator("[data-apresentacao]").count()) === 0, "a apresentação do apagar espera o palpite");
await tocar(pagina.locator("[data-previsao] button").nth(0));
await pagina.locator('[data-previsao-respondida="errou"]').waitFor();
conferir(true, "previsão errada mostra a certa e a explicação");
const noticiasAntes = (await iframe.locator("#noticias").boundingBox()).y;
await apresentacao("apagar", () => acaoNoNo("#popup-cookies", "apagar"));
const noticiasDepois = (await iframe.locator("#noticias").boundingBox()).y;
conferir(noticiasDepois < noticiasAntes, `apagar: as notícias sobem (${Math.round(noticiasAntes)} -> ${Math.round(noticiasDepois)})`);
await proximoObjetivo("U2F2 objetivo 2 (previsão + apagar)");

// Esbarrão: o computadorzinho apaga o rodapé; o jogador desfaz.
await pagina.waitForFunction(() => {
  const doc = document.querySelector("iframe[title^='Site']")?.contentDocument;
  return doc && !doc.querySelector("#rodape");
}, null, { timeout: 5000 });
conferir(true, "esbarrão: o rodapé some sozinho");
await apresentacao("desfazer", () => tocar(pagina.getByRole("button", { name: /^Desfazer a última mudança/ })));
conferir((await iframe.locator("#rodape").count()) === 1, "desfazer: o rodapé volta");
await proximoObjetivo("U2F2 objetivo 3 (desfazer)");

// Sozinho: apaga o anúncio e troca uma manchete.
await acaoNoNo("#anuncio-lateral", "apagar");
await editarTexto("#noticia-time h3", "Goleiro vira artilheiro da vila");
await pagina.locator("[data-fez-sozinho]").waitFor({ timeout: 5000 });
await proximoObjetivo("U2F2 objetivo 4 (sozinho)");
conferir((await pagina.locator("[aria-label='3 de 3 estrelas']").count()) > 0, "previsão errada não custou estrela");
await conclusaoEProxima("U2F2");

// ------------------------------------------------------------ U2 fase 3
await conversar(3);
await apresentacao("duplicar", async () => {
  await mostrarPainel("Árvore");
  await selecionarNo(pagina, "#noticia-praca h3");
  await trilha("article#noticia-praca.noticia");
  await acaoNoNo("#noticia-praca", "duplicar");
});
// A cópia leva o mesmo id: ela é a segunda notícia da seção.
await editarTexto("#noticias > .noticia:nth-child(2) h3", "Biblioteca da vila abre à noite");
await proximoObjetivo("U2F3 objetivo 1 (duplicar)");
await acaoNoNo("#noticias > .noticia:nth-child(4)", "duplicar");
await editarTexto("#noticias > .noticia:nth-child(5) h3", "Horta da escola colhe a primeira alface");
await acaoNoNo("#noticias > .noticia:nth-child(4)", "duplicar");
await editarTexto("#noticias > .noticia:nth-child(5) h3", "Padaria nova abre na rua de cima");
conferir((await iframe.locator("#noticias .noticia").count()) === 6, "seis notícias na página");
await proximoObjetivo("U2F3 objetivo 2 (sozinho)");
await conclusaoEProxima("U2F3");

// ------------------------------------------------------------ Desafio
await metaDaUnidade("Desafio");
await conversar(3);
if (!movel) conferir(await checklist().isVisible(), "desafio: checklist no lugar dos objetivos");
await acaoNoNo("#popup-oferta", "apagar");
conferir((await partesFeitas()) === 1, "desafio: a parte se marca sozinha");

// Rever: abre a fase 2 em revisão, sem estrelas, e volta.
await abrirBalao();
await tocar(pagina.getByRole("button", { name: /^Rever/ }));
await pagina.locator("[data-lista-rever]").waitFor();
await tocar(pagina.locator("[data-lista-rever] li").filter({ hasText: "Esconder o banner" }).getByRole("button", { name: "Rever este passo" }));
await esperar(1200);
conferir((await pagina.getByText("Revisão", { exact: true }).count()) > 0, "revisão: chip sem estrelas");
conferir((await iframe.locator("#noticias").count()) === 1, "revisão: abriu o Jornal da Vila (fase 2)");
await tocar(pagina.getByRole("button", { name: "Voltar ao desafio" }).first());
await esperar(1400);
conferir((await iframe.locator("#vitrine").count()) === 1, "voltou ao desafio");
conferir((await iframe.locator("#popup-oferta").count()) === 0, "o desafio ficou salvo do jeito que estava");
conferir((await partesFeitas()) === 1, "o checklist continua com a parte feita");
conferir((await pagina.locator("[aria-label='2 de 3 estrelas']").count()) > 0, "o Rever custou 1 estrela");

await acaoNoNo("#banner-topo", "esconder");
await acaoNoNo("#anuncio-lateral", "apagar");
await acaoNoNo("#vitrine .produto", "duplicar");
await editarTexto("#vitrine .produto:nth-child(2) h3", "Robô dançarino");
await mostrarPainel("Árvore");
await selecionarNo(pagina, "#vitrine .produto h3");
await trilha("section#vitrine");
try {
  await abrirBalao();
  await pagina.getByRole("button", { name: "Ver resultado" }).first().waitFor({ timeout: 6000 });
} catch (erro) {
  await falhar("desafio", erro);
}
conferir((await partesFeitas()) === 5, "desafio: as 5 partes marcadas");
await botaoConversa("Ver resultado");
await pagina.locator("[data-conclusao]").waitFor();
conferir((await pagina.getByText("Desafio completo!").count()) > 0, "desafio: conclusão");
conferir((await pagina.getByRole("dialog").locator("[aria-label='2 de 3 estrelas']").count()) === 1, "desafio: 2 estrelas");

// Volta para a ilha: a U2 acende e o próximo ponto (U3, já pronta) aparece bloqueado até jogar.
await conclusaoEVoltarAIlha("U2");
conferir((await estadoDoPonto("sites-elementos-u2")) === "concluida", "ilha: U2 concluída");
conferir((await estadoDoPonto("sites-elementos-u3")) === "disponivel", "ilha: a U3 abriu");
await jogarUnidade("sites-elementos-u3", "Jogar");

// ------------------------------------------------------------ U3 fase 1
await metaDaUnidade("U3 começo");
await conversar(3);
await apresentacao("renomear-tag", () => renomearTag("#titulo-principal", "h1"));
await proximoObjetivo("U3F1 objetivo 1 (renomear tag)");

// Previsão: acerta o palpite (índice 1) e confirma renomeando o h5 para h2.
await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
await tocar(pagina.locator("[data-previsao] button").nth(1));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
conferir(true, "U3F1: previsão sobre o nível do título acertou");
await renomearTag("#passos-titulo", "h2");
await proximoObjetivo("U3F1 objetivo 2 (previsão)");

// Código: escreve um novo parágrafo no fim do article.
await clicarLinhaCodigo("encharcar demais");
await pagina.keyboard.press("End");
await pagina.keyboard.press("Enter");
await pagina.keyboard.type("<p>Tomate colhido na hora tem um sabor que nenhum de mercado alcança.</p>");
await proximoObjetivo("U3F1 objetivo 3 (parágrafo pelo código)");

// Sozinho: setinha no título da dica, renomeia para h3, e mais um parágrafo pelo código.
await inspecionar("#dica-titulo");
await renomearTag("#dica-titulo", "h3");
await clicarLinhaCodigo("mercado alcança");
await pagina.keyboard.press("End");
await pagina.keyboard.press("Enter");
await pagina.keyboard.type("<p>Plantas de tomate gostam de um espaço para as raízes respirarem.</p>");
await proximoObjetivo("U3F1 objetivo 4 (sozinho)");
await conclusaoEProxima("U3F1");

// ------------------------------------------------------------ U3 fase 2
await conversar(3);
// Previsão: b vira strong, sem mudar o visual.
await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
await tocar(pagina.locator("[data-previsao] button").nth(1));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
await renomearTag("#aviso .destaque-importante", "strong");
await proximoObjetivo("U3F2 objetivo 1 (previsão strong)");

await renomearTag("#curiosidade .destaque-tom", "em");
await proximoObjetivo("U3F2 objetivo 2 (em)");

// Sozinho: as duas trocas no último aviso.
await renomearTag("#extra .destaque-importante", "strong");
await renomearTag("#extra .destaque-tom", "em");
await proximoObjetivo("U3F2 objetivo 3 (sozinho)");
await conclusaoEProxima("U3F2");

// ------------------------------------------------------------ U3 fase 3
await conversar(3);
await selecionarNo(pagina, "#passos li");
await trilha("ul#passos");
await renomearTag("#passos", "ol");
await proximoObjetivo("U3F3 objetivo 1 (trilha + numerar)");

// Previsão: duplicar um item de materiais não pede números.
await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
await tocar(pagina.locator("[data-previsao] button").nth(0));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
await acaoNoNo("#materiais li", "duplicar");
await editarTexto("#materiais li:nth-child(2)", "Regador pequeno");
await proximoObjetivo("U3F3 objetivo 2 (previsão duplicar)");

// Sozinho: outra lista cuja ordem importa, sem dizer qual.
await renomearTag("#cuidados", "ol");
await proximoObjetivo("U3F3 objetivo 3 (sozinho)");
await conclusaoEProxima("U3F3");

// ------------------------------------------------------------ Desafio U3
await metaDaUnidade("Desafio U3");
await conversar(3);
if (!movel) conferir(await checklist().isVisible(), "desafio U3: checklist no lugar dos objetivos");

await renomearTag("#titulo-receita", "h1");
conferir((await partesFeitas()) === 1, "desafio U3: título principal marca a parte");

await renomearTag("#ingredientes-titulo", "h2");
await renomearTag("#modo-titulo", "h2");
conferir((await partesFeitas()) === 2, "desafio U3: os dois subtítulos marcam a parte");

await renomearTag("#aviso-receita .destaque-importante", "strong");
conferir((await partesFeitas()) === 3, "desafio U3: aviso importante marca a parte");

await acaoNoNo("#passos-receita li", "duplicar");
await editarTexto("#passos-receita li:nth-child(2)", "Deixe esfriar antes de desenformar");
await renomearTag("#passos-receita", "ol");
try {
  await abrirBalao();
  await pagina.getByRole("button", { name: "Ver resultado" }).first().waitFor({ timeout: 6000 });
} catch (erro) {
  await falhar("desafio-u3", erro);
}
conferir((await partesFeitas()) === 4, "desafio U3: as 4 partes marcadas");
await botaoConversa("Ver resultado");
await pagina.locator("[data-conclusao]").waitFor();
conferir((await pagina.getByText("Desafio vencido!").count()) > 0, "desafio U3: conclusão");
conferir((await pagina.getByRole("dialog").locator("[aria-label='3 de 3 estrelas']").count()) === 1, "desafio U3: 3 estrelas");

// Volta para a ilha: a U3 acende e o próximo ponto (U4, já pronta) aparece bloqueado até jogar.
await conclusaoEVoltarAIlha("U3");
conferir((await estadoDoPonto("sites-elementos-u3")) === "concluida", "ilha: U3 concluída");
conferir((await estadoDoPonto("sites-elementos-u4")) === "disponivel", "ilha: a U4 abriu");
await jogarUnidade("sites-elementos-u4", "Jogar");

// ------------------------------------------------------------ U4 fase 1
await metaDaUnidade("U4 começo");
await conversar(3);
await editarValorAtributo("#nav-contato", "#rodape");
await proximoObjetivo("U4F1 objetivo 1 (href quebrado)");

// Previsão: acerta o palpite e escreve target="_blank" pelo código (o atributo ainda não existe).
await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
await tocar(pagina.locator("[data-previsao] button").nth(1));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
conferir(true, "U4F1: previsão sobre target acertou");
await acrescentarAtributoPeloCodigo("link-ingressos", 'id="link-ingressos"', ' target="_blank"');
await proximoObjetivo("U4F1 objetivo 2 (previsão + código)");

// Sozinho: href existente pela árvore, target novo pelo código.
await editarValorAtributo("#nav-integrantes", "#integrantes");
await acrescentarAtributoPeloCodigo("link-video", 'id="link-video"', ' target="_blank"');
await proximoObjetivo("U4F1 objetivo 3 (sozinho)");
await conclusaoEProxima("U4F1");

// ------------------------------------------------------------ U4 fase 2
await conversar(3);
await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
await tocar(pagina.locator("[data-previsao] button").nth(1));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
await acrescentarAtributoPeloCodigo("foto-coral", 'id="foto-coral"', ' alt="Coral Vozes da Vila cantando em um palco de igreja"');
await proximoObjetivo("U4F2 objetivo 1 (previsão alt)");

await acrescentarAtributoPeloCodigo("icone-ingressos", 'id="icone-ingressos"', ' alt="Ícone de um ingresso"');
await proximoObjetivo("U4F2 objetivo 2 (sozinho)");
await conclusaoEProxima("U4F2");

// ------------------------------------------------------------ U4 fase 3
await conversar(3);
await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
await tocar(pagina.locator("[data-previsao] button").nth(1));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
await acrescentarAtributoPeloCodigo("integrante-bruno", "<article", ' class="integrante"');
await acrescentarAtributoPeloCodigo("integrante-carla", "<article", ' class="integrante"');
await proximoObjetivo("U4F3 objetivo 1 (previsão id duplicado)");

await acaoNoNo("#integrante-ana", "duplicar");
await editarTexto(".cards > article:nth-child(2) h3", "Duda");
await proximoObjetivo("U4F3 objetivo 2 (sozinho, duplicar)");
await conclusaoEProxima("U4F3");

// ------------------------------------------------------------ Desafio U4
await metaDaUnidade("Desafio U4");
await conversar(3);
if (!movel) conferir(await checklist().isVisible(), "desafio U4: checklist no lugar dos objetivos");

await editarValorAtributo("#nav-contato", "#rodape");
conferir((await partesFeitas()) === 1, "desafio U4: link do menu marca a parte");

await acrescentarAtributoPeloCodigo("link-ingressos-banda", 'id="link-ingressos-banda"', ' target="_blank"');
conferir((await partesFeitas()) === 2, "desafio U4: aba nova marca a parte");

await acrescentarAtributoPeloCodigo("foto-banda", 'id="foto-banda"', ' alt="Os quatro integrantes da banda Trovão de Lata"');
conferir((await partesFeitas()) === 3, "desafio U4: alt da foto marca a parte");

await acrescentarAtributoPeloCodigo("musico-rita", "<article", ' class="musico"');
await acrescentarAtributoPeloCodigo("musico-davi", "<article", ' class="musico"');
try {
  await abrirBalao();
  await pagina.getByRole("button", { name: "Ver resultado" }).first().waitFor({ timeout: 6000 });
} catch (erro) {
  await falhar("desafio-u4", erro);
}
conferir((await partesFeitas()) === 4, "desafio U4: as 4 partes marcadas");
await botaoConversa("Ver resultado");
await pagina.locator("[data-conclusao]").waitFor();
conferir((await pagina.getByText("Desafio vencido!").count()) > 0, "desafio U4: conclusão");
conferir((await pagina.getByRole("dialog").locator("[aria-label='3 de 3 estrelas']").count()) === 1, "desafio U4: 3 estrelas");

// Volta para a ilha: a U4 acende e o próximo ponto aparece como planejado.
await conclusaoEVoltarAIlha("U4");
conferir((await estadoDoPonto("sites-elementos-u4")) === "concluida", "ilha: U4 concluída");
conferir((await estadoDoPonto("sites-elementos-u5")) === "planejada", "ilha: a U5 aparece como planejada");
const salvo = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")));
conferir(salvo.fasesConcluidas.length === 15, `15 fases concluídas (${salvo.fasesConcluidas.length})`);
// No mundo, Sites mostra as quatro unidades concluídas.
await tocar(pagina.getByRole("link", { name: "Mundo" }).first());
await pagina.locator("[data-mapa=mundo]").waitFor();
conferir((await pagina.locator("[data-ilha=sites]").textContent()).includes("4 de 4 unidades"), "mundo: Sites com 4 de 4 unidades");

conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
