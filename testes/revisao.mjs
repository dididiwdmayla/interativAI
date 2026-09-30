// A Revisão do dia jogada de ponta a ponta: progresso semeado com quatro
// conceitos vencidos (e um no futuro), o Porto da revisão no mundo com a
// contagem, a sessão na ordem dos mais atrasados, um item de cada jeito
// ("Não lembrei", acerto sem ajuda, previsão errada e acerto com o Me ajuda
// até a dica), o resumo (quando volta, "Rever onde aprendi", a sequência) e
// o agendamento gravado no progresso. Depois, o porto em dia e o treino livre.
// Uso: node testes/revisao.mjs [desktop|retrato|paisagem]
import { PUBLICADAS } from "./curriculo.mjs";
import { abaDaArvore, abrir, abrirBalao, acaoDaBarra, chaveDoSeletor, conferir, errosRelevantes, esperarPronto, fecharBalao, selecionarNo } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;
const movel = MODO !== "desktop";

/** O dia local, como o jogo calcula (o navegador do teste roda no mesmo fuso). */
function dia(deslocamento = 0) {
  const agora = new Date();
  const alvo = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + deslocamento);
  const dois = (n) => String(n).padStart(2, "0");
  return `${alvo.getFullYear()}-${dois(alvo.getMonth() + 1)}-${dois(alvo.getDate())}`;
}
const HOJE = dia(0);

const U1U2 = ["sites-elementos-u1", "sites-elementos-u2"];
const progresso = {
  versao: 2,
  fasesConcluidas: U1U2.flatMap((id) => PUBLICADAS[id]),
  estrelasPorFase: {},
  fasesEmAndamento: {},
  faseAtual: null,
  tema: "doce",
  temasDesbloqueados: ["doce", "fliperama"],
  som: false,
  missoesDeCampo: {},
  apresentacoesVistas: [],
  metasVistas: U1U2,
  unidadesComemoradas: U1U2,
  posicaoNoMapa: {},
  mapaDesbloqueado: false,
  proporcaoPrevia: 0.4,
  revisao: {
    // vezes escolhe a variação: tag-2, selecionar-pela-arvore-1, elemento-pai-2 e esconder-elemento-1.
    conceitos: {
      tag: { nivel: 1, proxima: dia(-3), vezes: 1, ultima: dia(-6) },
      "selecionar-pela-arvore": { nivel: 2, proxima: dia(-2), vezes: 0, ultima: null },
      "elemento-pai": { nivel: 1, proxima: dia(-1), vezes: 1, ultima: null },
      "esconder-elemento": { nivel: 2, proxima: HOJE, vezes: 0, ultima: null },
      elemento: { nivel: 3, proxima: dia(10), vezes: 2, ultima: dia(-11) },
    },
    sequencia: { atual: 3, melhor: 5, ultimoDia: dia(-4) },
  },
};

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso, rota: "/", esperar: "[data-mapa=mundo]" });
const assentar = () => esperarPronto(pagina);

async function tocar(localizador) {
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
}

async function falhar(nome, erro) {
  await pagina.screenshot({ path: `testes-falha-revisao-${MODO}-${nome}.png` }).catch(() => {});
  throw erro;
}

/** Espera o item da vez montar e ficar pronto. */
async function item(id) {
  try {
    await pagina.locator(`[data-item-revisao="${id}"] [data-jogo-fase][data-etapa="objetivos"]`).waitFor({ timeout: 15000 });
  } catch (erro) {
    await falhar(`item-${id}`, erro);
  }
  await assentar();
  conferir(true, `${MODO}: item ${id} aberto direto no objetivo`);
}

/** O botão da última pausa do item ("Próximo"), no balão. */
async function proximo(nome) {
  await abrirBalao(pagina);
  const botao = pagina.getByRole("button", { name: /^Próximo$/ }).first();
  try {
    await botao.waitFor({ timeout: 8000 });
  } catch (erro) {
    await falhar(nome, erro);
  }
  await tocar(botao);
  await assentar();
}

// --- O Porto no mundo -------------------------------------------------------
const porto = pagina.locator("[data-porto]");
await porto.waitFor();
conferir((await porto.getAttribute("data-porto-itens")) === "4", `${MODO}: o Porto da revisão mostra 4 itens vencidos hoje`);
await tocar(porto);
await pagina.locator("[data-revisao-inicio]").waitFor();
conferir(new URL(pagina.url()).pathname === "/revisao", `${MODO}: o Porto abre /revisao`);
conferir((await pagina.locator("[data-vencidos]").getAttribute("data-vencidos")) === "4", `${MODO}: a revisão diz 4 itens para hoje`);
await tocar(pagina.locator("[data-comecar-revisao]"));

// --- 1. tag-2 (o mais atrasado): "Não lembrei" --------------------------------
await item("tag-2");
conferir((await pagina.locator("[data-estrelas]").count()) === 0, `${MODO}: a revisão não mostra estrelas`);
if (movel) await fecharBalao(pagina);
await tocar(pagina.locator("[data-nao-lembrei]").first());

// --- 2. selecionar-pela-arvore-1: acerto sem ajuda ---------------------------
await item("selecionar-pela-arvore-1");
await selecionarNo(pagina, "#horario");
await proximo("selecionar");

// --- 3. elemento-pai-2: previsão errada ------------------------------------
await item("elemento-pai-2");
await abrirBalao(pagina);
conferir((await pagina.getByRole("button", { name: /^Me ajuda/ }).count()) === 0, `${MODO}: sem Me ajuda antes do palpite`);
await tocar(pagina.locator("[data-previsao] button").nth(1));
await pagina.locator('[data-previsao-respondida="errou"]').waitFor();
await proximo("previsao");

// --- 4. esconder-elemento-1: o Me ajuda vai até a dica, e acerta --------------
await item("esconder-elemento-1");
await abrirBalao(pagina);
const ajuda = pagina.getByRole("button", { name: /^Me ajuda/ }).first();
await tocar(ajuda);
await assentar();
await abrirBalao(pagina);
await tocar(ajuda);
await assentar();
await abrirBalao(pagina);
conferir(await ajuda.isDisabled(), `${MODO}: o Me ajuda para na dica (degrau 2)`);
const chave = await chaveDoSeletor(pagina, ".banner");
if (toque) {
  await fecharBalao(pagina);
  const aba = abaDaArvore(pagina);
  if ((await aba.count()) > 0 && (await aba.getAttribute("aria-selected")) !== "true") await aba.tap();
  await acaoDaBarra(pagina, chave, "esconder");
} else {
  await pagina.locator(`[role=treeitem][data-chave="${chave}"] > div`).first().click({ button: "right" });
  await pagina.locator("[data-menu-no] [data-acao=esconder]").click();
}
await assentar();
await proximo("esconder");

// --- O resumo -----------------------------------------------------------------
await pagina.locator("[data-revisao-resumo]").waitFor();
const resultado = async (conceito) => pagina.locator(`[data-resumo-conceito="${conceito}"]`).getAttribute("data-resultado");
conferir((await resultado("tag")) === "errou", `${MODO}: resumo, tag ainda não firmou`);
conferir((await resultado("selecionar-pela-arvore")) === "sem-ajuda", `${MODO}: resumo, selecionar lembrou sozinho`);
conferir((await resultado("elemento-pai")) === "errou", `${MODO}: resumo, previsão errada conta como errou`);
conferir((await resultado("esconder-elemento")) === "com-ajuda", `${MODO}: resumo, com a dica conta como com ajuda`);
const volta = async (conceito) => pagina.locator(`[data-resumo-conceito="${conceito}"] [data-volta]`).textContent();
conferir((await volta("tag")) === "Volta amanhã", `${MODO}: quem errou volta amanhã`);
conferir((await volta("selecionar-pela-arvore")) === "Volta em 21 dias", `${MODO}: sem ajuda sobe do intervalo de 7 para o de 21 dias`);
conferir((await volta("esconder-elemento")) === "Volta em 7 dias", `${MODO}: com ajuda mantém o intervalo de 7 dias`);
conferir((await pagina.locator("[data-rever-onde-aprendi]").count()) === 4, `${MODO}: cada conceito tem o "Rever onde aprendi"`);
const hrefRever = await pagina.locator('[data-resumo-conceito="tag"] [data-rever-onde-aprendi]').getAttribute("href");
conferir(hrefRever === "/fase/sites-elementos-u1-f1", `${MODO}: "Rever onde aprendi" leva à fase que ensina a tag`);
// A sequência tinha quebrado (último dia há 4 dias): recomeça, sem bronca.
conferir((await pagina.locator("[data-sequencia]").getAttribute("data-sequencia")) === "1", `${MODO}: a sequência recomeça em 1`);
conferir((await pagina.getByText("Primeiro dia da sequência").count()) === 1, `${MODO}: a sequência nova sem mensagem de culpa`);

// O agendamento foi gravado.
const salvo = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2") ?? "{}").revisao);
conferir(salvo.conceitos.tag.nivel === 0 && salvo.conceitos.tag.vezes === 2, `${MODO}: tag voltou ao nível 0, com a revisão contada`);
conferir(salvo.conceitos["selecionar-pela-arvore"].nivel === 3, `${MODO}: selecionar subiu um nível`);
conferir(salvo.conceitos.elemento.proxima === dia(10), `${MODO}: o conceito que não venceu não mudou`);
conferir(salvo.sequencia.ultimoDia === HOJE && salvo.sequencia.melhor === 5, `${MODO}: a sequência guarda hoje e o recorde`);

// --- De volta ao mundo: o porto em dia; o treino livre -------------------------
await tocar(pagina.locator("[data-voltar-mapa]"));
await pagina.locator("[data-mapa=mundo]").waitFor();
conferir((await pagina.locator("[data-porto]").getAttribute("data-porto-itens")) === "0", `${MODO}: o porto fica em dia`);
await tocar(pagina.locator("[data-porto]"));
await pagina.locator("[data-revisao-inicio]").waitFor();
conferir((await pagina.getByText("Nada pra revisar hoje").count()) === 1, `${MODO}: "Nada pra revisar hoje"`);
await tocar(pagina.locator("[data-treino-livre]"));
await pagina.locator("[data-item-revisao] [data-jogo-fase]").waitFor();
conferir(
  (await pagina.getByText(/Treino livre › Item 1 de|Item 1 de/).count()) > 0,
  `${MODO}: o treino livre abre um item dos conceitos já aprendidos`,
);

const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo${relevantes.length ? `: ${relevantes.join(" | ")}` : ""}`);
await navegador.close();
