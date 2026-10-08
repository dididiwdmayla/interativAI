// Utilitários dos testes de navegador. Rodar com o servidor no ar:
//   node testes/<arquivo>.mjs
// Usa o Playwright do projeto ou, se não houver, o instalado globalmente.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const exigir = createRequire(import.meta.url);
function carregarPlaywright() {
  try {
    return exigir("playwright");
  } catch {
    const global = execSync("npm root -g").toString().trim();
    return exigir(path.join(global, "playwright"));
  }
}
const { chromium } = carregarPlaywright();
export { opcaoDaPrevisao } from "./previsoes.mjs";

export const URL_JOGO = process.env.URL_JOGO ?? "http://localhost:3000";

/** A primeira fase do jogo (o endereço padrão quando o teste não diz outro). */
export const FASE_INICIAL = "sites-elementos-u1-f1";

/**
 * Abre o jogo. Sem `rota`, vai direto para a fase atual do progresso (ou a
 * primeira), em /fase/<id>; o mundo é "/" e a ilha, /ilha/<id>.
 */
export async function abrir({ largura = 1440, altura = 900, toque = false, escala = 1, progresso = null, rota, esperar = "iframe" } = {}) {
  const destino = rota ?? `/fase/${progresso?.faseAtual ?? FASE_INICIAL}`;
  const navegador = await chromium.launch();
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: altura },
    hasTouch: toque,
    isMobile: toque,
    deviceScaleFactor: escala,
  });
  // Só no Playwright: cada worker do executor (inclusive após recarga/timeout)
  // recebe o preparo determinístico. A página do jogo mantém seu relógio real.
  await contexto.addInitScript(() => {
    const WorkerReal = window.Worker;
    window.Worker = class extends WorkerReal {
      constructor(url, opcoes) {
        const alvo = new URL(url, location.href);
        alvo.searchParams.set("executor-teste", "1");
        super(alvo, opcoes);
      }
    };
  });
  const pagina = await contexto.newPage();
  const erros = [];
  pagina.on("console", (mensagem) => {
    if (mensagem.type() === "error" || mensagem.type() === "warning") erros.push(mensagem.text());
  });
  pagina.on("pageerror", (erro) => erros.push(String(erro)));
  if (progresso !== undefined) {
    await pagina.addInitScript((valor) => {
      // Também roda nos iframes sem permissão de armazenamento (mini prévias): lá, ignora.
      try {
        if (window !== window.top) return;
        if (sessionStorage.getItem("teste:iniciado")) return;
        sessionStorage.setItem("teste:iniciado", "1");
        if (valor === null) localStorage.clear();
        else localStorage.setItem(`ilha-sites:progresso:v${valor.versao === 2 ? 2 : 1}`, JSON.stringify(valor));
      } catch {
        // Sem armazenamento neste frame.
      }
    }, progresso);
  }
  await pagina.goto(`${URL_JOGO}${destino}`);
  await pagina.waitForSelector(esperar);
  return { navegador, contexto, pagina, erros };
}

/** Progresso v2 com uma fase em andamento (introdução e meta já vistas). */
export function progressoComFase(faseId, estadoFase = {}, extra = {}) {
  return {
    versao: 2,
    fasesConcluidas: [],
    estrelasPorFase: {},
    faseAtual: faseId,
    fasesEmAndamento: {
      [faseId]: { objetivoAtual: 0, htmlAtual: null, estrelas: 3, introducaoVista: true, metaVista: true, ...estadoFase },
    },
    tema: "doce",
    temasDesbloqueados: ["doce", "fliperama"],
    som: false,
    missoesDeCampo: {},
    apresentacoesVistas: [],
    metasVistas: [],
    unidadesComemoradas: [],
    posicaoNoMapa: {},
    mapaDesbloqueado: false,
    proporcaoPrevia: 0.4,
    ...extra,
  };
}

// ------------------------------------------------------------ data-chave da árvore
// A chave de cada linha da árvore (esquema em src/motor/chaveArvore.ts e em
// testes/README.md) é calculada com as MESMAS funções do app: o arquivo do
// motor é transpilado aqui (TypeScript do projeto) e o código vai para
// dentro da página. Ele não importa nada, justamente para isso funcionar.
const CODIGO_CHAVE_ARVORE = (() => {
  const ts = exigir("typescript");
  const fonte = readFileSync(new URL("../src/motor/chaveArvore.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(fonte, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  return outputText.replace(/^export /gm, "");
})();

/** O data-chave do primeiro elemento do site-alvo (prévia principal) que casa com o seletor. */
export async function chaveDoSeletor(pagina, seletor) {
  const chave = await pagina.evaluate(`(() => {
    ${CODIGO_CHAVE_ARVORE}
    const iframe = document.querySelector("section[data-previa] iframe");
    const documento = iframe && iframe.contentDocument;
    return documento ? chaveDoSeletor(documento, ${JSON.stringify(seletor)}) : null;
  })()`);
  if (chave === null) throw new Error(`Falhou: o seletor "${seletor}" não achou nenhum elemento no site-alvo`);
  return chave;
}

// ------------------------------------------------------------ estados explícitos
// O jogo expõe o estado no elemento raiz da fase ([data-jogo-fase]):
//   data-pronto="sim|nao"            nada vai mudar a tela sozinho (sem roteiro,
//                                   timer, recarga da prévia, animação do balão
//                                   ou tutor pensando)
//   data-apresentacao-estado="ativa|inativa"
//   data-objetivo-atual="<id>"      ("desafio" no desafio, vazio fora dos objetivos)
//   data-etapa="meta|introducao|objetivos|concluida"
// e, no celular, o avatar do computadorzinho tem
//   data-balao="aberto|fechado|abrindo|fechando".
// Os ajudantes abaixo esperam esses estados, nunca um tempo fixo.

/** Dois quadros: o React aplica o que o último gesto mudou antes de conferir o estado. */
export async function doisQuadros(pagina) {
  await pagina
    .evaluate(() => new Promise((resolver) => requestAnimationFrame(() => requestAnimationFrame(() => resolver(null)))))
    .catch(() => {});
}

/** Espera a fase ficar pronta (fora de uma fase, só os dois quadros). */
export async function esperarPronto(pagina, tempo = 20000) {
  for (let tentativa = 0; tentativa < 3; tentativa++) {
    await doisQuadros(pagina);
    try {
      await pagina.waitForFunction(
        () => {
          const raiz = document.querySelector("[data-jogo-fase]");
          return !raiz || raiz.getAttribute("data-pronto") === "sim";
        },
        null,
        { timeout: tempo, polling: "raf" },
      );
      return;
    } catch (erro) {
      // Navegou no meio da espera: confere de novo na página nova.
      if (!/context was destroyed|navigation/i.test(String(erro))) throw erro;
    }
  }
}

/** O estado do balão no celular (null no desktop, onde a conversa é fixa). */
export async function estadoDoBalao(pagina) {
  const avatar = pagina.locator("[data-balao]");
  if ((await avatar.count()) === 0) return null;
  return avatar.first().getAttribute("data-balao");
}

async function tocarOuClicar(pagina, localizador) {
  const toque = await pagina.evaluate(() => matchMedia("(pointer: coarse)").matches);
  if (toque) await localizador.tap();
  else await localizador.click();
}

/**
 * No celular, abre o balão da conversa e espera ele assentar. Deitado, o
 * balão fecha sozinho depois do tempo de leitura (contado desde que abriu):
 * um balão aberto há um tempo é fechado e aberto de novo, para o teste ter
 * o tempo de leitura inteiro pela frente.
 */
export async function abrirBalao(pagina) {
  await esperarPronto(pagina);
  const estado = await estadoDoBalao(pagina);
  if (estado === null) return;
  if (estado === "aberto") {
    const deitado = (await pagina.locator('[data-jogo-fase][data-layout="paisagem"]').count()) > 0;
    if (!deitado) return;
    await fecharBalao(pagina);
    return abrirBalao(pagina);
  }
  if (estado === "fechado") await tocarOuClicar(pagina, pagina.locator("[data-balao]").first());
  await pagina.locator('[data-balao="aberto"]').waitFor({ timeout: 8000 });
  await esperarPronto(pagina);
}

/**
 * A fila de falas do computadorzinho: enquanto uma fala importante espera o
 * jogador (ou há recados na fila), toca em Continuar no balão (no celular,
 * abre o balão antes). Volta quando a fila está livre.
 */
export async function continuarFalas(pagina, vezes = 8) {
  for (let i = 0; i < vezes; i++) {
    await esperarPronto(pagina);
    const fila = await pagina.locator("[data-jogo-fase]").getAttribute("data-fila-falas").catch(() => null);
    if (fila !== "pede") return;
    if ((await estadoDoBalao(pagina)) !== null) await abrirBalao(pagina);
    await tocarOuClicar(pagina, pagina.locator("[data-continuar-fala]").first());
  }
}

/** No celular, fecha o balão da conversa e espera a animação de saída acabar. */
export async function fecharBalao(pagina) {
  await esperarPronto(pagina);
  const estado = await estadoDoBalao(pagina);
  if (estado === null || estado === "fechado") return;
  if (estado === "aberto") await tocarOuClicar(pagina, pagina.locator("[data-balao]").first());
  await pagina.locator('[data-balao="fechado"]').waitFor({ timeout: 8000 });
  await esperarPronto(pagina);
}

/**
 * O segmento da árvore no celular: "Árvore" ou, deitado numa fase com o
 * painel Estilos (árvore e Estilos lado a lado), "Árvore e Estilos".
 */
export function abaDaArvore(pagina) {
  return pagina.getByRole("tab", { name: /^Árvore( e Estilos)?$/ });
}

/** No celular, garante a Árvore à vista (fecha o balão e escolhe o segmento). */
export async function mostrarArvore(pagina) {
  await fecharBalao(pagina);
  const aba = abaDaArvore(pagina);
  if ((await aba.count()) > 0 && (await aba.getAttribute("aria-selected")) !== "true") {
    await aba.tap();
    await esperarPronto(pagina);
  }
}

/** Linha da árvore (a parte clicável) de uma chave. */
export function linhaDaArvore(pagina, chave) {
  return pagina.locator(`[role=treeitem][data-chave="${chave}"] > div`).first();
}

/**
 * Toca (ou clica) na linha de uma chave da árvore e espera ela ficar
 * selecionada. Se não ficar, o erro diz o que aconteceu no lugar (outra
 * linha selecionada, menu do nó aberto) e guarda uma foto da tela.
 */
export async function tocarNo(pagina, chave) {
  const toque = await pagina.evaluate(() => matchMedia("(pointer: coarse)").matches);
  const linha = linhaDaArvore(pagina, chave);
  if (toque) await linha.tap();
  else await linha.click();
  try {
    await pagina.locator(`[role=treeitem][data-chave="${chave}"][aria-selected="true"]`).waitFor({ timeout: 5000 });
  } catch (erro) {
    const selecionada = await pagina.locator("[role=treeitem][aria-selected=true]").first().getAttribute("data-chave").catch(() => null);
    const menu = await pagina.locator("[data-menu-no]").count();
    await pagina.screenshot({ path: `testes-falha-no-${chave}.png` }).catch(() => {});
    throw new Error(`Falhou: o toque na linha "${chave}" não a selecionou (selecionada: ${selecionada}, menu do nó aberto: ${menu > 0}). ${erro}`);
  }
}

/**
 * No celular: toca a linha da chave e a ação da barra do nó selecionado
 * (Editar, Renomear, Esconder, Apagar, Duplicar...). Se a barra não
 * aparecer, o erro diz por quê (campo de edição aberto, menu do nó) e
 * guarda uma foto.
 */
export async function acaoDaBarra(pagina, chave, acao) {
  await tocarNo(pagina, chave);
  const botao = pagina.locator(`[data-barra-acoes] [data-acao=${acao}]`);
  try {
    await botao.waitFor({ timeout: 5000 });
  } catch (erro) {
    const edicao = await pagina.locator("[role=tree] input").count();
    const menu = await pagina.locator("[data-menu-no]").count();
    const barras = await pagina.locator("[data-barra-acoes]").count();
    const selecionada = await pagina.locator("[role=treeitem][aria-selected=true]").first().getAttribute("data-chave").catch(() => null);
    await pagina.screenshot({ path: `testes-falha-barra-${chave}-${acao}.png` }).catch(() => {});
    throw new Error(
      `Falhou: a barra do nó "${chave}" não mostrou "${acao}" (selecionada: ${selecionada}, barras: ${barras}, campo de edição aberto: ${edicao > 0}, menu do nó: ${menu > 0}). ${erro}`,
    );
  }
  await botao.tap();
}

/**
 * Seleciona pela árvore o primeiro elemento que casa com o seletor CSS
 * (clique no desktop, toque no celular). Devolve a chave usada.
 */
export async function selecionarNo(pagina, seletor) {
  const chave = await chaveDoSeletor(pagina, seletor);
  const toque = await pagina.evaluate(() => matchMedia("(pointer: coarse)").matches);
  if (toque) await mostrarArvore(pagina);
  await tocarNo(pagina, chave);
  await esperarPronto(pagina);
  return chave;
}

/**
 * Passa pela tela de meta da unidade (antes/depois), se ela estiver
 * aberta ou abrir em até `espera` ms. Devolve true se passou por ela.
 */
export async function pularMeta(pagina, espera = 3000) {
  const meta = pagina.locator("[data-meta]");
  try {
    await meta.waitFor({ timeout: espera });
  } catch {
    return false;
  }
  const botao = pagina.getByRole("dialog").getByRole("button", { name: /^(Bora!|Começar o desafio)$/ });
  const toque = await pagina.evaluate(() => matchMedia("(pointer: coarse)").matches);
  if (toque) await botao.tap();
  else await botao.click();
  await meta.waitFor({ state: "detached", timeout: 5000 }).catch(() => {});
  await esperarPronto(pagina);
  return true;
}

/**
 * `RESUMO=1`: modo resumido (economia de cota, ver CLAUDE.md) — não
 * imprime uma linha por checagem que passou, só conta. Falha sempre
 * aparece (lança e interrompe o arquivo, como sem o modo). Quem chama em
 * lote (`todos.mjs`) pode então imprimir "N checagens ok" no fim.
 */
let contagemResumo = 0;
export function conferir(condicao, mensagem) {
  if (!condicao) throw new Error(`Falhou: ${mensagem}`);
  if (process.env.RESUMO) contagemResumo += 1;
  else console.log(`ok - ${mensagem}`);
}
export function contagemDeChecagensResumidas() {
  return contagemResumo;
}

/**
 * Erros de console, ignorando avisos do modo de desenvolvimento do Next e o
 * aviso que o PRÓPRIO Playwright causa ao tentar injetar o addInitScript nos
 * iframes com sandbox das mini prévias, em contexto de celular (sem o
 * script do teste, o jogo não gera esse aviso; conferido na Etapa 17).
 */
export function errosRelevantes(erros) {
  return erros.filter(
    (texto) =>
      !/Download the React DevTools|\[HMR\]|\[Fast Refresh\]/.test(texto) &&
      !/^Blocked script execution in 'about:srcdoc' because the document's frame is sandboxed/.test(texto),
  );
}

/**
 * Espera o cartão da apresentação parar de se mover: a mesma posição por
 * 400 ms (mais que a transição de 0,3 s; o cartão pode ficar alguns quadros
 * no lugar antigo antes de começar a deslizar).
 */
async function cartaoParado(pagina, camada) {
  const cartao = camada.locator(".cartao-apresentacao");
  let antes = null;
  let parado = 0;
  for (let i = 0; i < 40 && parado < 4; i++) {
    const caixa = await cartao.boundingBox().catch(() => null);
    const agora = caixa ? `${Math.round(caixa.x)},${Math.round(caixa.y)}` : "";
    parado = agora && agora === antes ? parado + 1 : 0;
    antes = agora;
    await pagina.waitForTimeout(100);
  }
}

/**
 * Uma apresentação de ferramenta inteira: espera ela aparecer, passa as 3
 * falas, espera o passo "Experimente" e faz a ação; confere que ela fecha.
 * `aoFalhar(nome, erro)` tira a foto da tela, se o teste quiser.
 */
export async function passarApresentacao(pagina, id, experimentar, aoFalhar = async (_nome, erro) => { throw erro; }) {
  const camada = pagina.locator(`[data-apresentacao="${id}"]`);
  try {
    await camada.waitFor({ timeout: 10000 });
  } catch (erro) {
    await aoFalhar(`apresentacao-${id}`, erro);
  }
  const toque = await pagina.evaluate(() => matchMedia("(pointer: coarse)").matches);
  for (let i = 0; i < 3; i++) {
    const continuar = pagina.getByRole("button", { name: /Continuar|Quero tentar/ }).first();
    if (toque) await continuar.tap();
    else await continuar.click();
    await doisQuadros(pagina);
    if ((await camada.getAttribute("data-passo-apresentacao").catch(() => null)) !== "fala") break;
  }
  // data-alvo-livre: os buracos do véu (o alvo e as áreas extras) já estão medidos.
  await pagina.locator(`[data-apresentacao="${id}"][data-passo-apresentacao="experimente"][data-alvo-livre="sim"]`).waitFor({ timeout: 5000 });
  await esperarPronto(pagina);
  // O cartão desliza para o lugar do "Experimente" (transição de 0,3 s em left e top). Um toque
  // no meio do caminho pode acertar o alvo no touchstart e o cartão no click, que vem logo depois.
  await cartaoParado(pagina, camada);
  await experimentar();
  try {
    await camada.waitFor({ state: "detached", timeout: 8000 });
  } catch (erro) {
    await aoFalhar(`experimente-${id}`, erro);
  }
  await esperarPronto(pagina);
}
