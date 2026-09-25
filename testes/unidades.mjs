// Joga as Unidades 1 e 2 do começo ao fim, como um jogador: apresentações,
// meta com antes/depois, previsões, o esbarrão do computadorzinho,
// objetivos sozinho, o desafio com checklist, o Rever (revisão e volta) e a
// Lista de fases com cadeados.
// Uso: node testes/unidades.mjs [desktop|retrato|paisagem]
import { abrir, conferir, errosRelevantes } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: null });
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

/** Ação do menu do nó: botão direito no desktop, barra de ações no celular. */
async function acaoNoNo(chave, acao) {
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

async function editarTexto(chave, texto) {
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

async function abrirListaFases() {
  if (movel) {
    await fecharBalao();
    await pagina.getByRole("button", { name: "Mais opções" }).tap();
  }
  await tocar(pagina.getByRole("button", { name: "Abrir a lista de fases" }));
  await pagina.getByRole("dialog", { name: "Lista de fases" }).waitFor();
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

// ------------------------------------------------------------ Unidade 1
// A meta (antes/depois) cobre a tela: passa por ela antes de mais nada.
await metaDaUnidade("U1 começo");

// Lista de fases no começo: só a primeira aberta.
await abrirListaFases();
conferir(await pagina.locator('[data-fase="sites-elementos-u2-f1"]').isDisabled(), "lista de fases: Unidade 2 com cadeado no começo");
await pagina.keyboard.press("Escape");
await esperar(400);

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
await tocar(no("1"));
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
await tocar(no("4")); // h2 "Sabores de hoje"
await proximoObjetivo("U1F2 objetivo 1 (árvore, sozinho)");
await inspecionar(".sabores li");
await proximoObjetivo("U1F2 objetivo 2 (inspecionar, sozinho)");
await editarTexto("5.0", "Torta de limão");
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
await tocar(no("1")); // #aviso
conferir((await partesFeitas()) === 1, "desafio U1: selecionar o aviso pela árvore marca a parte");

await inspecionar(".botao");
conferir((await partesFeitas()) === 2, "desafio U1: inspecionar o botão marca a parte");

await editarTexto("6.0", "Wrap de frango");
conferir((await partesFeitas()) === 3, "desafio U1: trocar o prato marca a parte");

// Regra da Etapa 1 da fábrica: parte de estado (texto) desmarca ao desfazer;
// parte de seleção (árvore, setinha) continua marcada.
await tocar(pagina.getByRole("button", { name: /^Desfazer a última mudança/ }));
conferir((await partesFeitas()) === 2, "desafio U1: desfazer desmarca a parte de texto (ao vivo)");
await editarTexto("6.0", "Wrap de frango");
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
await conclusaoEProxima("U1F3");

// ------------------------------------------------------------ U2 fase 1
await metaDaUnidade("U2 começo");
await conversar(3);
await apresentacao("trilha", async () => {
  await mostrarPainel("Árvore");
  await tocar(no("3.0.0.2")); // link "Leia mais" da primeira notícia
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
await tocar(no("3"));
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
await apresentacao("esconder", () => acaoNoNo("0", "esconder"));
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
await apresentacao("apagar", () => acaoNoNo("2", "apagar"));
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
await acaoNoNo("2.1", "apagar"); // main > aside (o pop-up já saiu)
await editarTexto("2.0.2.0", "Goleiro vira artilheiro da vila");
await pagina.locator("[data-fez-sozinho]").waitFor({ timeout: 5000 });
await proximoObjetivo("U2F2 objetivo 4 (sozinho)");
conferir((await pagina.locator("[aria-label='3 de 3 estrelas']").count()) > 0, "previsão errada não custou estrela");
await conclusaoEProxima("U2F2");

// ------------------------------------------------------------ U2 fase 3
await conversar(3);
await apresentacao("duplicar", async () => {
  await mostrarPainel("Árvore");
  await tocar(no("1.0.0.0")); // h3 da primeira notícia
  await trilha("article#noticia-praca.noticia");
  await acaoNoNo("1.0.0", "duplicar");
});
await editarTexto("1.0.1.0", "Biblioteca da vila abre à noite");
await proximoObjetivo("U2F3 objetivo 1 (duplicar)");
await acaoNoNo("1.0.3", "duplicar");
await editarTexto("1.0.4.0", "Horta da escola colhe a primeira alface");
await acaoNoNo("1.0.3", "duplicar");
await editarTexto("1.0.4.0", "Padaria nova abre na rua de cima");
conferir((await iframe.locator("#noticias .noticia").count()) === 6, "seis notícias na página");
await proximoObjetivo("U2F3 objetivo 2 (sozinho)");
await conclusaoEProxima("U2F3");

// ------------------------------------------------------------ Desafio
await metaDaUnidade("Desafio");
await conversar(3);
if (!movel) conferir(await checklist().isVisible(), "desafio: checklist no lugar dos objetivos");
await acaoNoNo("2", "apagar"); // pop-up de oferta
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

// Sem o pop-up, o main passou a ser o filho 2 do body.
await acaoNoNo("0", "esconder");
await acaoNoNo("2.1", "apagar");
await acaoNoNo("2.0.0", "duplicar");
await editarTexto("2.0.1.1", "Robô dançarino");
await mostrarPainel("Árvore");
await tocar(no("2.0.0.1"));
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

// Tudo concluído na lista de fases.
await pagina.keyboard.press("Escape");
await esperar(400);
await abrirListaFases();
const concluidas = await pagina.getByRole("dialog", { name: "Lista de fases" }).getByRole("img", { name: "Concluída" }).count();
conferir(concluidas === 7, `lista de fases: 7 fases concluídas (${concluidas})`);

conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
