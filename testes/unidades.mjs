// Joga as Unidades 1 a 6 da zona Elementos e a E1 da zona Estilos do
// começo ao fim, como um jogador, a partir do mapa: mundo -> ilha Sites ->
// unidade -> fases -> volta para a ilha, que comemora. No caminho:
// apresentações, meta com antes/depois, previsões, o esbarrão do
// computadorzinho, objetivos sozinho, o desafio com checklist, o Rever
// (revisão e volta), o modo documento da U6 (escrever a página inteira,
// title na aba, meta charset com a simulação de acento, adicionar
// atributo) e, na E1, o painel Estilos (editar valor, caixinha, setas,
// seletor de cor, + declaração e regra nova).
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
  await esperar(200);
  const alvo = pagina.locator(`[role=treeitem][data-chave="${chave}"] [title='Dois cliques para editar']`).first();
  const campo = pagina.locator("[role=tree] input").first();
  for (let tentativa = 0; tentativa < 3; tentativa++) {
    await alvo.scrollIntoViewIfNeeded();
    if (toque) {
      await alvo.tap();
      await esperar(200);
      await alvo.tap();
    } else {
      await alvo.dblclick();
    }
    try {
      await campo.waitFor({ timeout: 4000 });
      break;
    } catch (erro) {
      if (tentativa === 2) throw erro;
      await esperar(300);
    }
  }
  await campo.fill(novoValor);
  await campo.press("Enter");
  await esperar(250);
}

/**
 * Acrescenta um atributo novo pelo código (a árvore não cria atributo que
 * não existe): acha a linha com `buscaTexto`, anda até logo depois de
 * `apos` (Home duas vezes — a primeira só vai até o começo do texto,
 * pulando a indentação — e então ArrowRight) e digita `textoNovo` ali.
 * `clicarLinhaCodigo` já desliga a quebra de linha, para Home/End andarem
 * pela linha lógica inteira, não só pela linha visual.
 */
async function acrescentarAtributoPeloCodigo(buscaTexto, apos, textoNovo) {
  await clicarLinhaCodigo(buscaTexto);
  const linha = pagina.locator(".cm-line", { hasText: buscaTexto }).first();
  const texto = (await linha.textContent()) ?? "";
  const indice = texto.indexOf(apos);
  if (indice < 0) throw new Error(`Falhou: "${apos}" não está na linha "${texto}"`);
  const posicao = indice + apos.length;
  await pagina.keyboard.press("Home");
  await pagina.keyboard.press("Home");
  for (let i = 0; i < posicao; i++) await pagina.keyboard.press("ArrowRight");
  await pagina.keyboard.type(textoNovo);
  // O caminho do editor tem debounce de 300 ms antes de revalidar.
  await esperar(450);
  const novaLinha = texto.slice(0, posicao) + textoNovo + texto.slice(posicao);
  const conferida = await pagina.locator(".cm-line", { hasText: buscaTexto }).first().textContent();
  if (conferida !== novaLinha) throw new Error(`Falhou: linha ficou "${conferida}", esperava "${novaLinha}"`);
}

/**
 * Modo documento (U6): escreve uma linha nova logo depois da linha que tem
 * `buscaTexto` (a mesma rolagem de `clicarLinhaCodigo`, já que o documento
 * inteiro pode ser mais comprido que a tela).
 */
async function digitarNoDocumento(buscaTexto, linhaNova) {
  await clicarLinhaCodigo(buscaTexto);
  await pagina.keyboard.press("End");
  await pagina.keyboard.press("Enter");
  await pagina.keyboard.type(linhaNova);
  await esperar(600);
}

/**
 * "Adicionar atributo" pelo menu do nó (botão direito no desktop, toque
 * longo no celular), como o Add attribute do Chrome: abre um campo dentro
 * da tag, onde `textoAtributo` é digitado inteiro (ex.: 'target="_blank"').
 */
async function adicionarAtributoPeloMenu(seletor, textoAtributo) {
  const chave = await chaveDoSeletor(pagina, seletor);
  await mostrarPainel("Árvore");
  const linha = no(chave);
  await linha.scrollIntoViewIfNeeded();
  if (toque) {
    const caixa = await linha.boundingBox();
    const ponto = { clientX: caixa.x + 60, clientY: caixa.y + caixa.height / 2, pointerType: "touch", isPrimary: true, pointerId: 11 };
    await linha.dispatchEvent("pointerdown", ponto);
    await esperar(750);
    await linha.dispatchEvent("pointerup", ponto);
  } else {
    await linha.click({ button: "right" });
  }
  const item = pagina.locator("[data-menu-no] [data-acao=adicionar-atributo]");
  await item.waitFor({ timeout: 5000 });
  await tocar(item);
  const campo = pagina.locator("[data-atributo-novo] input");
  await campo.fill(textoAtributo);
  await campo.press("Enter");
  await esperar(300);
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
  // Com quebra de linha, Home/End andam pela linha VISUAL, não pela lógica:
  // desliga para os cálculos de posição por caractere ficarem confiáveis.
  const quebra = pagina.getByRole("switch", { name: /Quebrar linhas/ });
  if ((await quebra.count()) > 0 && (await quebra.getAttribute("aria-checked")) === "true") {
    await tocar(quebra);
    await esperar(150);
  }
  // O CodeMirror só mantém no DOM as linhas perto da rolagem atual: desce
  // aos poucos até a linha procurada aparecer, em vez de pular direto pro
  // fim (ela pode estar no meio do arquivo).
  const scroller = pagina.locator(".cm-scroller").first();
  const linha = pagina.locator(".cm-line", { hasText: texto }).first();
  await scroller.evaluate((el) => {
    el.scrollTop = 0;
  });
  await esperar(150);
  for (let tentativa = 0; tentativa < 40; tentativa++) {
    if ((await linha.count()) > 0) break;
    await scroller.evaluate((el) => {
      el.scrollTop += el.clientHeight * 0.8;
    });
    await esperar(70);
  }
  await linha.waitFor({ timeout: 8000 });
  await linha.scrollIntoViewIfNeeded();
  await esperar(100);
  // Perto do começo da linha, mas depois da régua de números (linhas
  // compridas, como o data URI de uma imagem, passam da largura da tela).
  // Tenta alguns deslocamentos: a régua muda de largura com a
  // quantidade de dígitos do número da linha.
  let ultimoErro;
  for (const x of [16, 28, 44, 70]) {
    try {
      await tocar(linha, { position: { x, y: 10 }, timeout: 4000 });
      ultimoErro = undefined;
      break;
    } catch (erro) {
      ultimoErro = erro;
    }
  }
  if (ultimoErro) throw ultimoErro;
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

// Volta para a ilha: a U4 acende e o próximo ponto (U5, já pronta) aparece bloqueado até jogar.
await conclusaoEVoltarAIlha("U4");
conferir((await estadoDoPonto("sites-elementos-u4")) === "concluida", "ilha: U4 concluída");
conferir((await estadoDoPonto("sites-elementos-u5")) === "disponivel", "ilha: a U5 abriu");
await jogarUnidade("sites-elementos-u5", "Jogar");

// ------------------------------------------------------------ U5 fase 1
await metaDaUnidade("U5 começo");
await conversar(3);
await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
await tocar(pagina.locator("[data-previsao] button").nth(1));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
await clicarLinhaCodigo("Consertamos bicicletas");
await pagina.keyboard.press("End");
await pagina.keyboard.press("ArrowDown");
await pagina.keyboard.press("End");
await pagina.keyboard.press("Enter");
await pagina.keyboard.type('<div id="aviso-oficina">Aberta também em feriados, mediante agendamento.</div>');
await proximoObjetivo("U5F1 objetivo 1 (previsão div nova)");

await renomearTag("#topo", "header");
await proximoObjetivo("U5F1 objetivo 2 (header)");

await inspecionar("#rodape");
await renomearTag("#rodape", "footer");
await proximoObjetivo("U5F1 objetivo 3 (sozinho)");
await conclusaoEProxima("U5F1");

// ------------------------------------------------------------ U5 fase 2
await conversar(3);
await renomearTag("#servicos", "section");
await proximoObjetivo("U5F2 objetivo 1 (section)");

await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
await tocar(pagina.locator("[data-previsao] button").nth(1));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
await renomearTag("#servico-revisao", "article");
await proximoObjetivo("U5F2 objetivo 2 (previsão article)");

await renomearTag("#servico-pintura", "article");
await renomearTag("#sobre", "section");
await proximoObjetivo("U5F2 objetivo 3 (sozinho)");
await conclusaoEProxima("U5F2");

// ------------------------------------------------------------ U5 fase 3
await conversar(3);
await renomearTag("#servico-revisao .preco", "span");
await proximoObjetivo("U5F3 objetivo 1 (span)");

await renomearTag("#servico-pintura .preco", "span");
await proximoObjetivo("U5F3 objetivo 2 (sozinho)");
await conclusaoEProxima("U5F3");

// ------------------------------------------------------------ Desafio U5
await metaDaUnidade("Desafio U5");
await conversar(3);
if (!movel) conferir(await checklist().isVisible(), "desafio U5: checklist no lugar dos objetivos");

await renomearTag("#topo", "header");
await renomearTag("#rodape", "footer");
conferir((await partesFeitas()) === 1, "desafio U5: cabeçalho e rodapé marcam a parte");

await renomearTag("#servicos", "section");
conferir((await partesFeitas()) === 2, "desafio U5: a seção de serviços marca a parte");

await renomearTag("#servico-banho", "article");
await renomearTag("#servico-vet", "article");
conferir((await partesFeitas()) === 3, "desafio U5: os dois cards marcam a parte");

await renomearTag("#servico-banho .preco", "span");
await renomearTag("#servico-vet .preco", "span");
try {
  await abrirBalao();
  await pagina.getByRole("button", { name: "Ver resultado" }).first().waitFor({ timeout: 6000 });
} catch (erro) {
  await falhar("desafio-u5", erro);
}
conferir((await partesFeitas()) === 4, "desafio U5: as 4 partes marcadas");
await botaoConversa("Ver resultado");
await pagina.locator("[data-conclusao]").waitFor();
conferir((await pagina.getByText("Desafio vencido!").count()) > 0, "desafio U5: conclusão");
conferir((await pagina.getByRole("dialog").locator("[aria-label='3 de 3 estrelas']").count()) === 1, "desafio U5: 3 estrelas");

// Volta para a ilha: a U5 acende; a U6 já é conteúdo, então a zona Estilos
// espera ela também (só abre quando TODAS as prontas de Elementos acabam).
await conclusaoEVoltarAIlha("U5");
conferir((await estadoDoPonto("sites-elementos-u5")) === "concluida", "ilha: U5 concluída");
conferir((await estadoDoPonto("sites-elementos-u6")) === "disponivel", "ilha: a U6 abriu");
conferir((await estadoDoPonto("sites-estilos-u1")) === "bloqueada", "ilha: a E1 ainda espera a U6");
const salvoU5 = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")));
conferir(salvoU5.fasesConcluidas.length === 19, `19 fases concluídas (${salvoU5.fasesConcluidas.length})`);

await jogarUnidade("sites-elementos-u6", "Jogar");

// ------------------------------------------------------------ U6 fase 1 (modo documento)
await metaDaUnidade("U6 começo");
await conversar(3);
conferir((await pagina.getByText("index.html").count()) > 0, "modo documento: cabeçalho do editor fala da página inteira");
await digitarNoDocumento("<body>", "<h1>Feira de Talentos</h1>");
await proximoObjetivo("U6F1 objetivo 1 (h1 no body)");

// Previsão: escrever no head não faz o texto aparecer na tela.
await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
await tocar(pagina.locator("[data-previsao] button").nth(1));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
await digitarNoDocumento("<head>", "<title>Feira de Talentos</title>");
conferir((await pagina.locator("[data-titulo-aba]").innerText()) === "Feira de Talentos", "a aba mudou com o title");
await proximoObjetivo("U6F1 objetivo 2 (previsão do title)");

// Sozinho: parágrafo com acento e link, numa tacada só.
await abrirBalao();
if (!movel) conferir((await pagina.locator("[aria-current=step]").textContent()).includes("Sozinho"), "sozinho: selo na faixa do objetivo");
await clicarLinhaCodigo("<h1>Feira de Talentos</h1>");
await pagina.keyboard.press("End");
await pagina.keyboard.press("Enter");
await pagina.keyboard.type("<p>Inscrições até sexta-feira!</p>");
await pagina.keyboard.press("Enter");
await pagina.keyboard.type('<a href="https://exemplo.site/inscricao">Inscreva-se aqui</a>');
await esperar(600);
await pagina.locator("[data-fez-sozinho]").waitFor({ timeout: 5000 });
conferir(true, "sozinho: comemoração Fez sozinho!");
await proximoObjetivo("U6F1 objetivo 3 (sozinho, parágrafo e link)");
await conclusaoEProxima("U6F1");

// ------------------------------------------------------------ U6 fase 2
await conversar(2);
conferir((await iframe.locator("p").first().textContent()) !== "Inscrições até sexta-feira!", "os acentos chegam quebrados sem o meta charset (simulação)");
await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
await tocar(pagina.locator("[data-previsao] button").nth(1));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
await digitarNoDocumento("<head>", '<meta charset="utf-8">');
await pagina.waitForFunction(() => document.querySelector("[data-titulo-aba]") && !document.querySelector("[data-aviso-acentos]"));
conferir((await iframe.locator("p").first().textContent()) === "Inscrições até sexta-feira!", "o meta charset conserta os acentos na hora");
await proximoObjetivo("U6F2 objetivo 1 (previsão do meta charset)");

await apresentacao("adicionar-atributo", () => adicionarAtributoPeloMenu("a", 'target="_blank"'));
await proximoObjetivo("U6F2 objetivo 2 (adicionar atributo, aba nova)");

await digitarNoDocumento("<head>", '<meta name="viewport" content="width=device-width, initial-scale=1">');
await proximoObjetivo("U6F2 objetivo 3 (sozinho, meta viewport)");
await conclusaoEProxima("U6F2");

// ------------------------------------------------------------ Desafio U6
await metaDaUnidade("Desafio U6");
await conversar(3);
if (!movel) conferir(await checklist().isVisible(), "desafio U6: checklist no lugar dos objetivos");

await digitarNoDocumento("<head>", "<title>Marcos Conserta Bikes</title>");
conferir((await partesFeitas()) === 1, "desafio U6: title da aba marca a parte");

await digitarNoDocumento("<body>", "<h1>Marcos Conserta Bikes</h1>");
conferir((await partesFeitas()) === 2, "desafio U6: h1 no body marca a parte");

await digitarNoDocumento("<head>", '<meta charset="utf-8">');
conferir((await partesFeitas()) === 3, "desafio U6: meta charset marca a parte");

await digitarNoDocumento("<head>", '<meta name="viewport" content="width=device-width, initial-scale=1">');
conferir((await partesFeitas()) === 4, "desafio U6: meta viewport marca a parte");

await digitarNoDocumento("<h1>Marcos Conserta Bikes</h1>", "<p>Conserto rápido de bicicletas, com revisão grátis!</p>");
try {
  await abrirBalao();
  await pagina.getByRole("button", { name: "Ver resultado" }).first().waitFor({ timeout: 6000 });
} catch (erro) {
  await falhar("desafio-u6", erro);
}
conferir((await partesFeitas()) === 5, "desafio U6: as 5 partes marcadas");
await botaoConversa("Ver resultado");
await pagina.locator("[data-conclusao]").waitFor();
conferir((await pagina.getByText("Desafio vencido!").count()) > 0, "desafio U6: conclusão");
conferir((await pagina.getByRole("dialog").locator("[aria-label='3 de 3 estrelas']").count()) === 1, "desafio U6: 3 estrelas");

// Volta para a ilha: a U6 acende e, agora sim, a zona Estilos abre.
await conclusaoEVoltarAIlha("U6");
conferir((await estadoDoPonto("sites-elementos-u6")) === "concluida", "ilha: U6 concluída");
conferir((await estadoDoPonto("sites-estilos-u1")) === "disponivel", "ilha: a E1 abriu (a zona Elementos acabou, U1 a U6)");
const salvoU6 = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")));
conferir(salvoU6.fasesConcluidas.length === 22, `22 fases concluídas (${salvoU6.fasesConcluidas.length})`);

// ------------------------------------------------------------ painel Estilos (E1)
/** No celular em pé, o painel Estilos é um segmento; deitado e no desktop, fica ao lado da árvore. */
async function mostrarEstilos() {
  if (MODO !== "retrato") return;
  await fecharBalao();
  const aba = pagina.getByRole("tablist", { name: "Mostrar no painel" }).getByRole("tab", { name: "Estilos", exact: true });
  if ((await aba.getAttribute("aria-selected")) !== "true") await aba.tap();
  await esperar(150);
}
/** O bloco de uma regra do site no painel (a do site vem antes da do navegador). */
const regraNoPainel = (seletorRegra) => pagina.locator(`[data-lista-estilos] > section[aria-label="Regra ${seletorRegra}"]`).first();
const campoEstilo = (qual) => pagina.locator(`[data-campo-estilo=${qual}]`);

/** Seleciona a peça pela árvore e mostra o painel Estilos. */
async function selecionarParaEstilos(seletor) {
  await fecharBalao();
  await selecionarNo(pagina, seletor);
  await mostrarEstilos();
}
/** Clica (ou toca) no valor de uma declaração, escreve outro e confirma. */
async function trocarValorNoPainel(seletorRegra, propriedade, valor) {
  await tocar(regraNoPainel(seletorRegra).locator(`[data-declaracao="${propriedade}"] [data-valor-propriedade]`).first());
  await campoEstilo("valor").fill(valor);
  await campoEstilo("valor").press("Enter");
  await esperar(250);
}
/** Escreve nome e valor nos campos abertos (declaração nova ou regra nova). */
async function escreverDeclaracao(propriedade, valor) {
  await campoEstilo("nome").fill(propriedade);
  await campoEstilo("nome").press("Tab");
  await campoEstilo("valor").fill(valor);
  await campoEstilo("valor").press("Enter");
  await esperar(250);
}
/** "+ declaração" no fim da regra. */
async function acrescentarNoPainel(seletorRegra, propriedade, valor) {
  const regra = regraNoPainel(seletorRegra);
  if (!toque) await regra.hover();
  await tocar(regra.locator("[data-adicionar-declaracao]"));
  await escreverDeclaracao(propriedade, valor);
}
/** A caixinha de uma declaração (desliga ou liga). */
async function caixinhaNoPainel(seletorRegra, propriedade) {
  const regra = regraNoPainel(seletorRegra);
  if (!toque) await regra.hover();
  await tocar(regra.locator(`[data-declaracao="${propriedade}"] [data-alternar-declaracao]`));
  await esperar(250);
}
/** Uma seta para cima no campo de número: tecla no desktop, botão no toque. */
async function setaParaCima() {
  if (toque) await pagina.getByRole("button", { name: "Aumentar o número" }).tap();
  else await campoEstilo("valor").press("ArrowUp");
  await esperar(80);
}
const valorNaPagina = (seletor, propriedade) =>
  pagina
    .locator("section[data-previa] iframe")
    .evaluate((el, [s, p]) => el.contentWindow.getComputedStyle(el.contentDocument.querySelector(s)).getPropertyValue(p), [seletor, propriedade]);

await jogarUnidade("sites-estilos-u1", "Jogar");

// ------------------------------------------------------------ E1 fase 1
await metaDaUnidade("E1 começo");
await conversar(3);
await apresentacao("painel-estilos", async () => {
  await mostrarEstilos();
  await tocar(pagina.locator("[data-painel-estilos]"));
});
await selecionarNo(pagina, "h1");
await mostrarEstilos();
conferir((await regraNoPainel("h1").count()) === 1, "E1F1: com o h1 selecionado, o painel mostra a regra h1");
await proximoObjetivo("E1F1 objetivo 1 (ver as regras do h1)");

// Editar valor: a apresentação pede para usar de verdade, e o uso já resolve o objetivo.
await apresentacao("editar-valor-css", async () => {
  await mostrarEstilos();
  await trocarValorNoPainel("h1", "color", "white");
});
conferir((await valorNaPagina("h1", "color")) === "rgb(255, 255, 255)", "E1F1: o nome ficou branco na prévia");
await proximoObjetivo("E1F1 objetivo 2 (cor do h1)");

// Previsão: desligar não apaga a peça. A caixinha é apresentada depois do palpite, já no footer.
await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
await tocar(pagina.locator("[data-previsao] button").nth(1));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
await apresentacao("ligar-desligar-declaracao", async () => {
  await mostrarEstilos();
  await caixinhaNoPainel("footer", "background-color");
});
conferir((await valorNaPagina("footer", "background-color")) === "rgba(0, 0, 0, 0)", "E1F1: o rodapé perdeu o fundo, mas continua lá");
await proximoObjetivo("E1F1 objetivo 3 (previsão e caixinha)");

await selecionarParaEstilos(".preco");
await trocarValorNoPainel(".preco", "color", "crimson");
await proximoObjetivo("E1F1 objetivo 4 (sozinho, preços)");
await conclusaoEProxima("E1F1");

// ------------------------------------------------------------ E1 fase 2
await conversar(2);
// Setas: a apresentação mostra o h1 (a peça do objetivo) e pede uma seta de verdade.
await apresentacao("setas-numericas", async () => {
  await mostrarEstilos();
  await tocar(regraNoPainel("h1").locator('[data-declaracao="font-size"] [data-valor-propriedade]').first());
  await setaParaCima();
});
if (!(await campoEstilo("valor").isVisible().catch(() => false))) {
  await mostrarEstilos();
  await tocar(regraNoPainel("h1").locator('[data-declaracao="font-size"] [data-valor-propriedade]').first());
}
for (let i = 0; i < 12 && (await campoEstilo("valor").inputValue()) !== "36px"; i++) await setaParaCima();
conferir((await campoEstilo("valor").inputValue()) === "36px", "E1F2: as setas levaram o font-size do h1 a 36px");
await campoEstilo("valor").press("Enter");
await esperar(250);
await proximoObjetivo("E1F2 objetivo 1 (setas)");

await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
await tocar(pagina.locator("[data-previsao] button").nth(1));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
await selecionarParaEstilos(".descricao");
await trocarValorNoPainel(".descricao", "font-size", "1rem");
conferir((await valorNaPagina(".descricao", "font-size")) === "16px", "E1F2: 1rem deu os mesmos 16px");
await proximoObjetivo("E1F2 objetivo 2 (previsão rem)");

await selecionarParaEstilos("body");
await trocarValorNoPainel("body", "font-family", "Georgia, serif");
await proximoObjetivo("E1F2 objetivo 3 (fonte da página)");

await selecionarParaEstilos("h2");
await acrescentarNoPainel("h2", "text-align", "center");
await proximoObjetivo("E1F2 objetivo 4 (+ declaração)");

await selecionarParaEstilos("footer");
await trocarValorNoPainel("footer", "font-size", "16px");
await acrescentarNoPainel("footer", "text-align", "center");
await proximoObjetivo("E1F2 objetivo 5 (sozinho, rodapé)");
await conclusaoEProxima("E1F2");

// ------------------------------------------------------------ E1 fase 3
await conversar(2);
await abrirBalao();
await pagina.locator("[data-previsao]").waitFor();
await tocar(pagina.locator("[data-previsao] button").nth(0));
await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
await selecionarParaEstilos("h2");
await trocarValorNoPainel("h2", "color", "#ff0000");
await proximoObjetivo("E1F3 objetivo 1 (previsão hexadecimal)");

// Seletor de cor: a apresentação já mostra o header (a peça do objetivo).
await apresentacao("seletor-de-cor", async () => {
  await mostrarEstilos();
  await regraNoPainel("header").locator("[data-seletor-cor]").first().fill("#2a6f97");
});
conferir((await valorNaPagina("header", "background-color")) === "rgb(42, 111, 151)", "E1F3: o seletor de cor pintou o cabeçalho");
await proximoObjetivo("E1F3 objetivo 2 (seletor de cor)");

// Regra nova: a apresentação já seleciona a promoção; o + cria p.promo e abre o nome.
await apresentacao("nova-regra", async () => {
  await mostrarEstilos();
  await tocar(pagina.locator("[data-nova-regra]"));
});
if (await campoEstilo("nome").isVisible().catch(() => false)) await escreverDeclaracao("font-weight", "bold");
else await acrescentarNoPainel("p.promo", "font-weight", "bold");
conferir((await valorNaPagina(".promo", "font-weight")) === "700", "E1F3: a promoção ficou em negrito");
await proximoObjetivo("E1F3 objetivo 3 (regra nova)");

await selecionarParaEstilos(".horario");
await tocar(pagina.locator("[data-nova-regra]"));
await escreverDeclaracao("color", "#1d3557");
await proximoObjetivo("E1F3 objetivo 4 (sozinho, regra nova)");
await conclusaoEProxima("E1F3");

// ------------------------------------------------------------ Desafio E1
await metaDaUnidade("Desafio E1");
await conversar(3);
if (!movel) conferir(await checklist().isVisible(), "desafio E1: checklist no lugar dos objetivos");

await selecionarParaEstilos(".topo");
await trocarValorNoPainel(".topo", "background-color", "#6f4e37");
conferir((await partesFeitas()) === 1, "desafio E1: o fundo do topo marca a parte");

await selecionarParaEstilos("h1");
await trocarValorNoPainel("h1", "font-size", "40px");
conferir((await partesFeitas()) === 2, "desafio E1: o título grande marca a parte");

await selecionarParaEstilos(".item");
await caixinhaNoPainel(".item", "border-bottom");
conferir((await partesFeitas()) === 3, "desafio E1: desligar a linha dos itens marca a parte");

await selecionarParaEstilos("body");
await trocarValorNoPainel("body", "font-family", "Georgia, serif");
conferir((await partesFeitas()) === 4, "desafio E1: a fonte da página marca a parte");

await selecionarParaEstilos(".especial");
await tocar(pagina.locator("[data-nova-regra]"));
await escreverDeclaracao("background-color", "#fff3cd");
try {
  await abrirBalao();
  await pagina.getByRole("button", { name: "Ver resultado" }).first().waitFor({ timeout: 6000 });
} catch (erro) {
  await falhar("desafio-e1", erro);
}
conferir((await partesFeitas()) === 5, "desafio E1: as 5 partes marcadas");
await botaoConversa("Ver resultado");
await pagina.locator("[data-conclusao]").waitFor();
conferir((await pagina.getByText("Desafio vencido!").count()) > 0, "desafio E1: conclusão");
conferir((await pagina.getByRole("dialog").locator("[aria-label='3 de 3 estrelas']").count()) === 1, "desafio E1: 3 estrelas");

// Volta para a ilha: a E1 acende; a E2 segue planejada.
await conclusaoEVoltarAIlha("E1");
conferir((await estadoDoPonto("sites-estilos-u1")) === "concluida", "ilha: E1 concluída");
conferir((await estadoDoPonto("sites-estilos-u2")) === "planejada", "ilha: a E2 aparece como planejada");
const salvo = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")));
conferir(salvo.fasesConcluidas.length === 26, `26 fases concluídas (${salvo.fasesConcluidas.length})`);
// No mundo, Sites mostra as sete unidades prontas concluídas (U1 a U6 e E1).
await tocar(pagina.getByRole("link", { name: "Mundo" }).first());
await pagina.locator("[data-mapa=mundo]").waitFor();
conferir((await pagina.locator("[data-ilha=sites]").textContent()).includes("7 de 7 unidades"), "mundo: Sites com 7 de 7 unidades");

conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
