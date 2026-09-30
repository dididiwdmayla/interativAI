// Jornada da zona Layout (L1 a L4), a partir do mapa, com o progresso das
// zonas Elementos e Estilos JÁ SEMEADO (todas as unidades publicadas
// delas concluídas, todas as ferramentas já apresentadas): jogar essas fases
// de novo aqui seria repetir o que `unidades.mjs` já cobre e levaria a
// bateria a uns 45 min extras sem testar nada novo.
//
// Ferramenta de teste (não é motor): UNIDADE=<id> semeia também as
// unidades da Layout anteriores a ela como concluídas, para rodar só a
// jornada dessa unidade (mais rápido ao escrever uma unidade nova).
// Uso: node testes/layout.mjs [desktop|retrato|paisagem]
//      UNIDADE=sites-layout-u2 node testes/layout.mjs
import {
  abrir,
  abrirBalao as abrirBalaoDaPagina,
  chaveDoSeletor,
  conferir,
  errosRelevantes,
  esperarPronto,
  fecharBalao as fecharBalaoDaPagina,
  linhaDaArvore,
  mostrarArvore,
} from "./util.mjs";
import { PUBLICADAS, prontasDaIlha } from "./curriculo.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;
const movel = MODO !== "desktop";

// Todas as unidades publicadas das zonas Elementos e Estilos, com as fases
// delas, derivadas do currículo e do publicados.json (testes/curriculo.mjs):
// uma unidade nova numa dessas zonas (como a E5) entra sozinha no semeado.
const UNIDADES_ELEMENTOS_E_ESTILOS = prontasDaIlha("sites")
  .filter((unidade) => unidade.zona.id === "elementos" || unidade.zona.id === "estilos")
  .map((unidade) => unidade.id);
const FASES_ELEMENTOS_E_ESTILOS = UNIDADES_ELEMENTOS_E_ESTILOS.flatMap((id) => PUBLICADAS[id]);
// Ferramentas usadas até o fim da zona Estilos: a Layout não apresenta
// nenhuma ferramenta nova, então todas precisam já estar vistas.
const FERRAMENTAS_ATE_ESTILOS = [
  "painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editar-duplo-clique", "editor", "sincronia",
  "trilha", "esconder", "apagar", "desfazer", "duplicar", "renomear-tag", "adicionar-atributo",
  "editor-css", "painel-estilos", "editar-valor-css", "ligar-desligar-declaracao", "setas-numericas",
  "seletor-de-cor", "nova-regra", "painel-calculado", "modelo-de-caixa",
];

// As unidades da própria Layout, na ordem: cada uma entra aqui quando
// ganha uma seção de jornada abaixo (rodadaLayout()).
const UNIDADES_LAYOUT = ["sites-layout-u1", "sites-layout-u2", "sites-layout-u3", "sites-layout-u4"];
const FASES_POR_UNIDADE_LAYOUT = {
  "sites-layout-u1": ["sites-layout-u1-f1", "sites-layout-u1-f2", "sites-layout-u1-f3", "sites-layout-u1-f4"],
  "sites-layout-u2": ["sites-layout-u2-f1", "sites-layout-u2-f2", "sites-layout-u2-f3", "sites-layout-u2-f4"],
  "sites-layout-u3": ["sites-layout-u3-f1", "sites-layout-u3-f2", "sites-layout-u3-f3", "sites-layout-u3-f4"],
  "sites-layout-u4": ["sites-layout-u4-f1", "sites-layout-u4-f2", "sites-layout-u4-f3", "sites-layout-u4-f4"],
};

const UNIDADE_ALVO = process.env.UNIDADE ?? null;
const indiceAlvo = UNIDADE_ALVO ? UNIDADES_LAYOUT.indexOf(UNIDADE_ALVO) : -1;
if (UNIDADE_ALVO && indiceAlvo === -1) throw new Error(`UNIDADE desconhecida: ${UNIDADE_ALVO}`);
const unidadesLayoutASemear = indiceAlvo >= 0 ? UNIDADES_LAYOUT.slice(0, indiceAlvo) : [];
const fasesLayoutASemear = unidadesLayoutASemear.flatMap((id) => FASES_POR_UNIDADE_LAYOUT[id]);

const progressoSemeado = {
  versao: 2,
  fasesConcluidas: [...FASES_ELEMENTOS_E_ESTILOS, ...fasesLayoutASemear],
  estrelasPorFase: Object.fromEntries(
    [...FASES_ELEMENTOS_E_ESTILOS, ...fasesLayoutASemear].map((id) => [id, 3]),
  ),
  tema: "doce",
  temasDesbloqueados: ["doce", "fliperama"],
  som: false,
  missoesDeCampo: {},
  apresentacoesVistas: FERRAMENTAS_ATE_ESTILOS,
  metasVistas: [...UNIDADES_ELEMENTOS_E_ESTILOS, ...unidadesLayoutASemear],
  unidadesComemoradas: [...UNIDADES_ELEMENTOS_E_ESTILOS, ...unidadesLayoutASemear],
  posicaoNoMapa: {},
  mapaDesbloqueado: false,
  proporcaoPrevia: 0.4,
};

const { navegador, pagina, erros } = await abrir({
  ...TAMANHOS[MODO],
  progresso: progressoSemeado,
  rota: "/",
  esperar: "[data-mapa=mundo]",
});

// ------------------------------------------------------------ ajudantes (mesmo padrão de unidades.mjs)
const assentar = () => esperarPronto(pagina);

async function tocar(localizador, opcoes) {
  if (toque) await localizador.tap(opcoes);
  else await localizador.click(opcoes);
}

async function falhar(nome, erro) {
  await pagina.screenshot({ path: `testes-falha-layout-${MODO}-${nome}.png` });
  throw erro;
}

async function abrirBalao() {
  if (!movel) return assentar();
  await abrirBalaoDaPagina(pagina);
}
async function fecharBalao() {
  if (!movel) return assentar();
  await fecharBalaoDaPagina(pagina);
}

async function mostrarEstilos() {
  if (MODO !== "retrato") return;
  await fecharBalao();
  const aba = pagina.getByRole("tablist", { name: "Mostrar no painel" }).getByRole("tab", { name: "Estilos", exact: true });
  if ((await aba.getAttribute("aria-selected")) !== "true") await aba.tap();
  await assentar();
}

async function botaoConversa(nome) {
  await abrirBalao();
  const botao = pagina.getByRole("button", { name: nome }).first();
  await botao.waitFor({ timeout: 8000 });
  await tocar(botao);
  await assentar();
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

const regraNoPainel = (seletorRegra) => pagina.locator(`[data-lista-estilos] > section[aria-label="Regra ${seletorRegra}"]`).first();
const campoEstilo = (qual) => pagina.locator(`[data-campo-estilo=${qual}]`);
/**
 * Como selecionarNo (testes/util.mjs), mas clica perto do canto
 * esquerdo da linha em vez do centro: em paisagem, a coluna da árvore é
 * estreita e um atributo comprido (como o href de um link) quebra a linha
 * em várias, e o centro da caixa cai fora da própria linha.
 */
async function selecionarNoRobusto(seletor) {
  const chave = await chaveDoSeletor(pagina, seletor);
  if (toque) await mostrarArvore(pagina);
  const linha = linhaDaArvore(pagina, chave);
  const selecionada = pagina.locator(`[role=treeitem][data-chave="${chave}"][aria-selected="true"]`);
  await linha.scrollIntoViewIfNeeded();
  // Duas tentativas de clique: perto do canto esquerdo (evita o centro cair
  // fora da linha quando um atributo comprido quebra ela em várias, em
  // paisagem) e, se essa cair na setinha de expandir/recolher de um nó
  // colapsado, o centro de verdade (como o tocarNo de util.mjs).
  for (const opcoes of [{ position: { x: 10, y: 10 } }, undefined]) {
    if (toque) await linha.tap(opcoes);
    else await linha.click(opcoes);
    if (await selecionada.isVisible({ timeout: 2000 }).catch(() => false)) {
      await esperarPronto(pagina);
      return;
    }
  }
  await pagina.screenshot({ path: `testes-falha-layout-selecionar-${chave.replace(/\./g, "_")}.png` }).catch(() => {});
  throw new Error(`Falhou: nenhum clique selecionou a linha "${chave}" (seletor: ${seletor})`);
}

async function selecionarParaEstilos(seletor) {
  await fecharBalao();
  await assentar();
  await selecionarNoRobusto(seletor);
  await mostrarEstilos();
}
async function escreverDeclaracao(propriedade, valor) {
  await campoEstilo("nome").fill(propriedade);
  await campoEstilo("nome").press("Tab");
  await campoEstilo("valor").fill(valor);
  await campoEstilo("valor").press("Enter");
  await assentar();
}
/** "+ declaração" no fim da regra: as propriedades de Layout raramente já existem na regra. */
async function acrescentarNoPainel(seletorRegra, propriedade, valor) {
  await fecharBalao();
  const regra = regraNoPainel(seletorRegra);
  if (!toque) await regra.hover();
  await tocar(regra.locator("[data-adicionar-declaracao]"));
  await escreverDeclaracao(propriedade, valor);
}
const acrescentarDisplay = (seletorRegra, valor) => acrescentarNoPainel(seletorRegra, "display", valor);
const valorNaPagina = (seletor, propriedade) =>
  pagina
    .locator("section[data-previa] iframe")
    .evaluate((el, [s, p]) => el.contentWindow.getComputedStyle(el.contentDocument.querySelector(s)).getPropertyValue(p), [seletor, propriedade]);

async function metaDaUnidade(nome) {
  const meta = pagina.locator("[data-meta]");
  await meta.waitFor({ timeout: 8000 });
  await pagina.locator('[role=dialog][data-modal-assentado="sim"]').waitFor({ timeout: 8000 });
  const previas = pagina.getByRole("dialog").locator("iframe");
  conferir((await previas.count()) === 2, `${nome}: meta com antes e depois lado a lado`);
  await tocar(pagina.getByRole("button", { name: /Bora!|Começar o desafio/ }));
  await assentar();
}
async function conclusaoEProxima(nome) {
  const conclusao = pagina.locator("[data-conclusao]");
  await conclusao.waitFor({ timeout: 8000 });
  for (let i = 0; i < 4; i++) {
    const continuar = pagina.getByRole("dialog").getByRole("button", { name: "Continuar", exact: true });
    if (!(await continuar.isVisible().catch(() => false))) break;
    await tocar(continuar);
    await assentar();
  }
  conferir(await pagina.getByText("Missão de campo").isVisible(), `${nome}: missão de campo na conclusão`);
  const faseAntes = await pagina.locator("[data-jogo-fase]").getAttribute("data-jogo-fase");
  await tocar(pagina.getByRole("button", { name: "Próxima fase" }));
  await pagina.locator(`[data-jogo-fase]:not([data-jogo-fase="${faseAntes}"])`).waitFor({ timeout: 10000 });
  await assentar();
}
async function conclusaoEVoltarAIlha(nome) {
  const conclusao = pagina.locator("[data-conclusao]");
  await conclusao.waitFor({ timeout: 8000 });
  for (let i = 0; i < 4; i++) {
    const continuar = pagina.getByRole("dialog").getByRole("button", { name: "Continuar", exact: true });
    if (!(await continuar.isVisible().catch(() => false))) break;
    await tocar(continuar);
    await assentar();
  }
  conferir((await pagina.getByRole("button", { name: "Próxima fase" }).count()) === 0, `${nome}: depois do desafio não tem Próxima fase`);
  await tocar(pagina.getByRole("button", { name: "Voltar pra ilha" }));
  await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
  await pagina.locator("[data-comemoracao]").waitFor({ timeout: 6000 });
  conferir(true, `${nome}: voltou para a ilha, que comemora`);
}

const ponto = (id) => pagina.locator(`[data-unidade="${id}"]`);
const estadoDoPonto = (id) => ponto(id).getAttribute("data-estado");
async function jogarUnidade(unidadeId, rotulo) {
  await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
  await ponto(unidadeId).scrollIntoViewIfNeeded();
  await tocar(ponto(unidadeId));
  const botao = pagina.getByRole("dialog").getByRole("button", { name: rotulo, exact: true });
  await botao.waitFor();
  await tocar(botao);
  await pagina.waitForSelector("section[data-previa] iframe");
  await assentar();
}

const checklist = () => pagina.locator("[data-checklist]").first();
async function partesFeitas() {
  const barra = pagina.locator("button[aria-expanded]").filter({ hasText: /Checklist|Desafio/ }).first();
  if (MODO === "retrato") {
    await fecharBalao();
    await barra.tap();
    await assentar();
  }
  if (MODO === "paisagem") await abrirBalao();
  const feitas = await pagina.locator('[data-parte][data-feita="true"]').count();
  if (MODO === "retrato") {
    await barra.tap();
    await assentar();
  }
  return feitas;
}

// ------------------------------------------------------------ mundo -> ilha Sites
await tocar(pagina.locator("[data-ilha=sites]"));
await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
const primeiraARodar = UNIDADE_ALVO ?? UNIDADES_LAYOUT[0];
conferir((await estadoDoPonto(primeiraARodar)) === "disponivel", `ilha: ${primeiraARodar} está disponível para começar`);

// ------------------------------------------------------------ L1: Display
async function rodarL1() {
  await jogarUnidade("sites-layout-u1", indiceAlvo === -1 || indiceAlvo === 0 ? "Jogar" : "Jogar de novo");
  await metaDaUnidade("L1 começo");
  await conversar(3);

  // Fase 1: block
  await selecionarParaEstilos(".etiqueta");
  await proximoObjetivo("L1F1 objetivo 1 (ver o display da etiqueta)");
  await abrirBalao();
  await pagina.locator("[data-previsao]").waitFor();
  await tocar(pagina.locator("[data-previsao] button").nth(1));
  await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
  await selecionarParaEstilos(".etiqueta");
  await acrescentarDisplay(".etiqueta", "block");
  conferir((await valorNaPagina(".etiqueta", "display")) === "block", "L1F1: a etiqueta virou block na prévia");
  await proximoObjetivo("L1F1 objetivo 2 (previsão: etiqueta vira block)");
  await selecionarParaEstilos(".chegou");
  await acrescentarDisplay(".chegou", "block");
  await proximoObjetivo("L1F1 objetivo 3 (sozinho: chegou vira block)");
  await conclusaoEProxima("L1F1");

  // Fase 2: inline-block
  await conversar(1);
  await abrirBalao();
  await pagina.locator("[data-previsao]").waitFor();
  await tocar(pagina.locator("[data-previsao] button").nth(0));
  await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
  await selecionarParaEstilos(".preco");
  await acrescentarDisplay(".preco", "inline-block");
  conferir((await valorNaPagina(".preco", "display")) === "inline-block", "L1F2: o preço virou inline-block na prévia");
  await proximoObjetivo("L1F2 objetivo 1 (previsão: preço vira inline-block)");
  await selecionarParaEstilos("#menu-principal li");
  await acrescentarDisplay("#menu-principal li", "inline-block");
  await proximoObjetivo("L1F2 objetivo 2 (sozinho: menu horizontal)");
  await conclusaoEProxima("L1F2");

  // Fase 3: none x Esconder
  await conversar(2);
  await abrirBalao();
  await pagina.locator("[data-previsao]").waitFor();
  await tocar(pagina.locator("[data-previsao] button").nth(2));
  await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
  await selecionarParaEstilos("#aviso-frete");
  await acrescentarDisplay("#aviso-frete", "none");
  conferir((await valorNaPagina("#aviso-frete", "display")) === "none", "L1F3: o aviso de frete sumiu de vez na prévia");
  await proximoObjetivo("L1F3 objetivo 1 (previsão: none x Esconder)");
  await selecionarParaEstilos(".aviso-manutencao");
  await acrescentarDisplay(".aviso-manutencao", "none");
  await proximoObjetivo("L1F3 objetivo 2 (sozinho: aviso de manutenção)");
  await conclusaoEProxima("L1F3");

  // Desafio: Oficina Conserta Tudo
  await metaDaUnidade("Desafio L1");
  await conversar(3);
  if (!movel) conferir(await checklist().isVisible(), "desafio L1: checklist no lugar dos objetivos");

  await selecionarParaEstilos(".aviso-garantia");
  await acrescentarDisplay(".aviso-garantia", "block");
  conferir((await partesFeitas()) === 1, "desafio L1: a garantia em linha própria marca a parte");

  await selecionarParaEstilos("#menu-servicos li");
  await acrescentarDisplay("#menu-servicos li", "inline-block");
  conferir((await partesFeitas()) === 2, "desafio L1: o menu horizontal marca a parte");

  await selecionarParaEstilos(".promo-vencida");
  await acrescentarDisplay(".promo-vencida", "none");
  try {
    await abrirBalao();
    await pagina.getByRole("button", { name: "Ver resultado" }).first().waitFor({ timeout: 6000 });
  } catch (erro) {
    await falhar("desafio-l1", erro);
  }
  conferir((await partesFeitas()) === 3, "desafio L1: as 3 partes marcadas");
  await botaoConversa("Ver resultado");
  await pagina.locator("[data-conclusao]").waitFor();
  conferir((await pagina.getByText("Desafio vencido!").count()) > 0, "desafio L1: conclusão");
  conferir((await pagina.getByRole("dialog").locator("[aria-label='3 de 3 estrelas']").count()) === 1, "desafio L1: 3 estrelas");

  await conclusaoEVoltarAIlha("L1");
  conferir((await estadoDoPonto("sites-layout-u1")) === "concluida", "ilha: L1 concluída");
  conferir((await estadoDoPonto("sites-layout-u2")) === "disponivel", "ilha: a L2 abriu");
}

// ------------------------------------------------------------ L2: Flexbox
async function rodarL2() {
  await jogarUnidade("sites-layout-u2", "Jogar");
  await metaDaUnidade("L2 começo");
  await conversar(2);

  // Fase 1: flexbox e flex-direction
  await selecionarParaEstilos("nav ul");
  await acrescentarDisplay("nav ul", "flex");
  await proximoObjetivo("L2F1 objetivo 1 (nav vira flex)");
  await abrirBalao();
  await pagina.locator("[data-previsao]").waitFor();
  await tocar(pagina.locator("[data-previsao] button").nth(0));
  await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
  await selecionarParaEstilos("nav ul");
  await acrescentarNoPainel("nav ul", "flex-direction", "column");
  conferir((await valorNaPagina("nav ul", "flex-direction")) === "column", "L2F1: o menu empilhou de novo (column)");
  await proximoObjetivo("L2F1 objetivo 2 (previsão: flex-direction column)");
  await selecionarParaEstilos(".redes");
  await acrescentarDisplay(".redes", "flex");
  await proximoObjetivo("L2F1 objetivo 3 (sozinho: redes vira flex)");
  await conclusaoEProxima("L2F1");

  // Fase 2: justify-content e align-items
  await conversar(1);
  await selecionarParaEstilos(".cards");
  await acrescentarDisplay(".cards", "flex");
  await proximoObjetivo("L2F2 objetivo 1 (cards vira flex)");
  await abrirBalao();
  await pagina.locator("[data-previsao]").waitFor();
  await tocar(pagina.locator("[data-previsao] button").nth(1));
  await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
  await selecionarParaEstilos(".cards");
  await acrescentarNoPainel(".cards", "justify-content", "space-between");
  await proximoObjetivo("L2F2 objetivo 2 (previsão: justify-content)");
  await selecionarParaEstilos(".cards");
  await acrescentarNoPainel(".cards", "align-items", "center");
  await proximoObjetivo("L2F2 objetivo 3 (sozinho: align-items)");
  await conclusaoEProxima("L2F2");

  // Fase 3: gap e flex-wrap
  await conversar(1);
  await abrirBalao();
  await pagina.locator("[data-previsao]").waitFor();
  await tocar(pagina.locator("[data-previsao] button").nth(1));
  await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
  await selecionarParaEstilos(".cards");
  await acrescentarNoPainel(".cards", "gap", "16px");
  await proximoObjetivo("L2F3 objetivo 1 (previsão: gap)");
  await selecionarParaEstilos(".cards");
  await acrescentarNoPainel(".cards", "flex-wrap", "wrap");
  await proximoObjetivo("L2F3 objetivo 2 (flex-wrap)");
  await selecionarParaEstilos("nav ul");
  await acrescentarNoPainel("nav ul", "gap", "24px");
  await proximoObjetivo("L2F3 objetivo 3 (sozinho: gap no menu)");
  await conclusaoEProxima("L2F3");

  // Desafio: Brechó Segunda Chance
  await metaDaUnidade("Desafio L2");
  await conversar(3);
  if (!movel) conferir(await checklist().isVisible(), "desafio L2: checklist no lugar dos objetivos");

  await selecionarParaEstilos("nav ul");
  await acrescentarDisplay("nav ul", "flex");
  conferir((await partesFeitas()) === 1, "desafio L2: o menu em flex marca a parte");

  await selecionarParaEstilos(".produtos");
  await acrescentarDisplay(".produtos", "flex");
  await acrescentarNoPainel(".produtos", "justify-content", "space-between");
  conferir((await partesFeitas()) === 2, "desafio L2: os produtos espalhados marcam a parte");

  await selecionarParaEstilos(".produtos");
  await acrescentarNoPainel(".produtos", "align-items", "center");
  conferir((await partesFeitas()) === 3, "desafio L2: os produtos centralizados marcam a parte");

  await selecionarParaEstilos(".produtos");
  await acrescentarNoPainel(".produtos", "gap", "16px");
  conferir((await partesFeitas()) === 4, "desafio L2: o gap marca a parte");

  await selecionarParaEstilos(".produtos");
  await acrescentarNoPainel(".produtos", "flex-wrap", "wrap");
  try {
    await abrirBalao();
    await pagina.getByRole("button", { name: "Ver resultado" }).first().waitFor({ timeout: 6000 });
  } catch (erro) {
    await falhar("desafio-l2", erro);
  }
  conferir((await partesFeitas()) === 5, "desafio L2: as 5 partes marcadas");
  await botaoConversa("Ver resultado");
  await pagina.locator("[data-conclusao]").waitFor();
  conferir((await pagina.getByText("Desafio vencido!").count()) > 0, "desafio L2: conclusão");
  conferir((await pagina.getByRole("dialog").locator("[aria-label='3 de 3 estrelas']").count()) === 1, "desafio L2: 3 estrelas");

  await conclusaoEVoltarAIlha("L2");
  conferir((await estadoDoPonto("sites-layout-u2")) === "concluida", "ilha: L2 concluída");
  conferir((await estadoDoPonto("sites-layout-u3")) === "disponivel", "ilha: a L3 abriu");
}

// ------------------------------------------------------------ L3: Grid
async function rodarL3() {
  await jogarUnidade("sites-layout-u3", "Jogar");
  await metaDaUnidade("L3 começo");
  await conversar(2);

  // Fase 1: display: grid, grid-template-columns e fr
  await selecionarParaEstilos(".destaques");
  await acrescentarDisplay(".destaques", "grid");
  await proximoObjetivo("L3F1 objetivo 1 (destaques vira grid)");
  await abrirBalao();
  await pagina.locator("[data-previsao]").waitFor();
  await tocar(pagina.locator("[data-previsao] button").nth(0));
  await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
  await selecionarParaEstilos(".destaques");
  await acrescentarNoPainel(".destaques", "grid-template-columns", "1fr 1fr 1fr");
  await proximoObjetivo("L3F1 objetivo 2 (previsão: fr divide o espaço)");
  await selecionarParaEstilos(".galeria");
  await acrescentarDisplay(".galeria", "grid");
  await acrescentarNoPainel(".galeria", "grid-template-columns", "1fr 1fr");
  await proximoObjetivo("L3F1 objetivo 3 (sozinho: galeria vira grid de 2 colunas)");
  await conclusaoEProxima("L3F1");

  // Fase 2: grid-template-rows e gap
  await conversar(1);
  await selecionarParaEstilos(".galeria");
  await acrescentarNoPainel(".galeria", "grid-template-rows", "140px 140px");
  await proximoObjetivo("L3F2 objetivo 1 (linhas fixas da galeria)");
  await abrirBalao();
  await pagina.locator("[data-previsao]").waitFor();
  await tocar(pagina.locator("[data-previsao] button").nth(1));
  await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
  await selecionarParaEstilos(".galeria");
  await acrescentarNoPainel(".galeria", "gap", "12px");
  await proximoObjetivo("L3F2 objetivo 2 (previsão: gap num grid)");
  await selecionarParaEstilos(".destaques");
  await acrescentarNoPainel(".destaques", "gap", "16px");
  await proximoObjetivo("L3F2 objetivo 3 (sozinho: gap nos destaques)");
  await conclusaoEProxima("L3F2");

  // Fase 3: grid-template-areas
  await conversar(2);
  await selecionarParaEstilos(".capa");
  await acrescentarDisplay(".capa", "grid");
  await acrescentarNoPainel(".capa", "grid-template-columns", "1fr 1fr");
  await proximoObjetivo("L3F3 objetivo 1 (capa vira grid de 2 colunas)");
  await abrirBalao();
  await pagina.locator("[data-previsao]").waitFor();
  await tocar(pagina.locator("[data-previsao] button").nth(0));
  await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
  await selecionarParaEstilos(".capa");
  await acrescentarNoPainel(".capa", "grid-template-areas", '"titulo titulo" "texto imagem"');
  await proximoObjetivo("L3F3 objetivo 2 (previsão: o mapa de áreas)");
  await selecionarParaEstilos(".creditos");
  await acrescentarDisplay(".creditos", "grid");
  await acrescentarNoPainel(".creditos", "grid-template-columns", "1fr 1fr");
  await acrescentarNoPainel(".creditos", "grid-template-areas", '"texto redes"');
  await proximoObjetivo("L3F3 objetivo 3 (sozinho: áreas nos créditos)");
  await conclusaoEProxima("L3F3");

  // Desafio: Revista Ventania
  await metaDaUnidade("Desafio L3");
  await conversar(3);
  if (!movel) conferir(await checklist().isVisible(), "desafio L3: checklist no lugar dos objetivos");

  await selecionarParaEstilos(".reportagens");
  await acrescentarDisplay(".reportagens", "grid");
  await acrescentarNoPainel(".reportagens", "grid-template-columns", "1fr 1fr 1fr");
  conferir((await partesFeitas()) === 1, "desafio L3: as reportagens em grid marcam a parte");

  await selecionarParaEstilos(".mapas");
  await acrescentarNoPainel(".mapas", "grid-template-rows", "140px 140px");
  conferir((await partesFeitas()) === 2, "desafio L3: as linhas fixas marcam a parte");

  await selecionarParaEstilos(".mapas");
  await acrescentarNoPainel(".mapas", "gap", "12px");
  conferir((await partesFeitas()) === 3, "desafio L3: o gap marca a parte");

  await selecionarParaEstilos(".abertura");
  await acrescentarDisplay(".abertura", "grid");
  await acrescentarNoPainel(".abertura", "grid-template-columns", "1fr 1fr");
  await acrescentarNoPainel(".abertura", "grid-template-areas", '"titulo titulo" "texto imagem"');
  try {
    await abrirBalao();
    await pagina.getByRole("button", { name: "Ver resultado" }).first().waitFor({ timeout: 6000 });
  } catch (erro) {
    await falhar("desafio-l3", erro);
  }
  conferir((await partesFeitas()) === 4, "desafio L3: as 4 partes marcadas");
  await botaoConversa("Ver resultado");
  await pagina.locator("[data-conclusao]").waitFor();
  conferir((await pagina.getByText("Desafio vencido!").count()) > 0, "desafio L3: conclusão");
  conferir((await pagina.getByRole("dialog").locator("[aria-label='3 de 3 estrelas']").count()) === 1, "desafio L3: 3 estrelas");

  await conclusaoEVoltarAIlha("L3");
  conferir((await estadoDoPonto("sites-layout-u3")) === "concluida", "ilha: L3 concluída");
  conferir((await estadoDoPonto("sites-layout-u4")) === "disponivel", "ilha: a L4 abriu");
}

// ------------------------------------------------------------ L4: Posição e camadas
async function rodarL4() {
  await jogarUnidade("sites-layout-u4", "Jogar");
  await metaDaUnidade("L4 começo");
  await conversar(2);

  // Fase 1: relative
  await selecionarParaEstilos(".aviso");
  await acrescentarNoPainel(".aviso", "position", "relative");
  await proximoObjetivo("L4F1 objetivo 1 (aviso vira relative)");
  await abrirBalao();
  await pagina.locator("[data-previsao]").waitFor();
  await tocar(pagina.locator("[data-previsao] button").nth(0));
  await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
  await selecionarParaEstilos(".aviso");
  await acrescentarNoPainel(".aviso", "top", "12px");
  await proximoObjetivo("L4F1 objetivo 2 (previsão: relative desliza sem sair do lugar)");
  await selecionarParaEstilos(".preco-disco");
  await acrescentarNoPainel(".preco-disco", "position", "relative");
  await acrescentarNoPainel(".preco-disco", "top", "6px");
  await proximoObjetivo("L4F1 objetivo 3 (sozinho: preço desliza)");
  await conclusaoEProxima("L4F1");

  // Fase 2: absolute ancorado no pai relative
  await conversar(1);
  await selecionarParaEstilos(".card");
  await acrescentarNoPainel(".card", "position", "relative");
  await proximoObjetivo("L4F2 objetivo 1 (card vira âncora)");
  await abrirBalao();
  await pagina.locator("[data-previsao]").waitFor();
  await tocar(pagina.locator("[data-previsao] button").nth(1));
  await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
  await selecionarParaEstilos(".selo");
  await acrescentarNoPainel(".selo", "position", "absolute");
  await acrescentarNoPainel(".selo", "top", "8px");
  await acrescentarNoPainel(".selo", "right", "8px");
  await proximoObjetivo("L4F2 objetivo 2 (previsão: absolute ancora no pai relative)");
  await selecionarParaEstilos(".selo-topo");
  await acrescentarNoPainel(".selo-topo", "position", "absolute");
  await acrescentarNoPainel(".selo-topo", "top", "8px");
  await acrescentarNoPainel(".selo-topo", "right", "8px");
  await proximoObjetivo("L4F2 objetivo 3 (sozinho: segundo selo)");
  await conclusaoEProxima("L4F2");

  // Fase 3: fixed, sticky e z-index
  await conversar(1);
  await selecionarParaEstilos(".topo");
  await acrescentarNoPainel(".topo", "position", "fixed");
  await acrescentarNoPainel(".topo", "bottom", "16px");
  await acrescentarNoPainel(".topo", "right", "16px");
  await proximoObjetivo("L4F3 objetivo 1 (botão vira fixed)");
  await abrirBalao();
  await pagina.locator("[data-previsao]").waitFor();
  await tocar(pagina.locator("[data-previsao] button").nth(2));
  await pagina.locator('[data-previsao-respondida="acertou"]').waitFor();
  await selecionarParaEstilos("#cabecalho");
  await acrescentarNoPainel("#cabecalho", "position", "sticky");
  await acrescentarNoPainel("#cabecalho", "top", "0");
  await proximoObjetivo("L4F3 objetivo 2 (previsão: cabeçalho vira sticky)");
  await selecionarParaEstilos(".selo");
  await acrescentarNoPainel(".selo", "z-index", "2");
  await proximoObjetivo("L4F3 objetivo 3 (sozinho: z-index resolve a sobreposição)");
  await conclusaoEProxima("L4F3");

  // Desafio: Confeitaria Doce Instante
  await metaDaUnidade("Desafio L4");
  await conversar(3);
  if (!movel) conferir(await checklist().isVisible(), "desafio L4: checklist no lugar dos objetivos");

  await selecionarParaEstilos(".card-bolo");
  await acrescentarNoPainel(".card-bolo", "position", "relative");
  conferir((await partesFeitas()) === 1, "desafio L4: o card virar âncora marca a parte");

  await selecionarParaEstilos(".selo-bolo");
  await acrescentarNoPainel(".selo-bolo", "position", "absolute");
  await acrescentarNoPainel(".selo-bolo", "top", "8px");
  await acrescentarNoPainel(".selo-bolo", "right", "8px");
  conferir((await partesFeitas()) === 2, "desafio L4: o selo sobre o card marca a parte");

  await selecionarParaEstilos(".selo-bolo");
  await acrescentarNoPainel(".selo-bolo", "z-index", "2");
  conferir((await partesFeitas()) === 3, "desafio L4: o z-index marca a parte");

  await selecionarParaEstilos("#topo-confeitaria");
  await acrescentarNoPainel("#topo-confeitaria", "position", "sticky");
  await acrescentarNoPainel("#topo-confeitaria", "top", "0");
  conferir((await partesFeitas()) === 4, "desafio L4: o cabeçalho sticky marca a parte");

  await selecionarParaEstilos(".whatsapp");
  await acrescentarNoPainel(".whatsapp", "position", "fixed");
  await acrescentarNoPainel(".whatsapp", "bottom", "16px");
  await acrescentarNoPainel(".whatsapp", "right", "16px");
  try {
    await abrirBalao();
    await pagina.getByRole("button", { name: "Ver resultado" }).first().waitFor({ timeout: 6000 });
  } catch (erro) {
    await falhar("desafio-l4", erro);
  }
  conferir((await partesFeitas()) === 5, "desafio L4: as 5 partes marcadas");
  await botaoConversa("Ver resultado");
  await pagina.locator("[data-conclusao]").waitFor();
  conferir((await pagina.getByText("Desafio vencido!").count()) > 0, "desafio L4: conclusão");
  conferir((await pagina.getByRole("dialog").locator("[aria-label='3 de 3 estrelas']").count()) === 1, "desafio L4: 3 estrelas");

  await conclusaoEVoltarAIlha("L4");
  conferir((await estadoDoPonto("sites-layout-u4")) === "concluida", "ilha: L4 concluída");
}

if (!UNIDADE_ALVO || UNIDADE_ALVO === "sites-layout-u1") await rodarL1();
if (!UNIDADE_ALVO || UNIDADE_ALVO === "sites-layout-u2") await rodarL2();
if (!UNIDADE_ALVO || UNIDADE_ALVO === "sites-layout-u3") await rodarL3();
if (!UNIDADE_ALVO || UNIDADE_ALVO === "sites-layout-u4") await rodarL4();

// ------------------------------------------------------------ fim
conferir(errosRelevantes(erros).length === 0, `console limpo: ${errosRelevantes(erros).join(" | ")}`);
await navegador.close();
