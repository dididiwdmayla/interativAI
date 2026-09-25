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

export const URL_JOGO = process.env.URL_JOGO ?? "http://localhost:3000";

export async function abrir({ largura = 1440, altura = 900, toque = false, progresso = null, rota = "/", esperar = "iframe" } = {}) {
  const navegador = await chromium.launch();
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: altura },
    hasTouch: toque,
    isMobile: toque,
    deviceScaleFactor: 1,
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
  await pagina.goto(`${URL_JOGO}${rota}`);
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

/** No celular, garante a Árvore à vista (fecha o balão e escolhe o segmento). */
export async function mostrarArvore(pagina) {
  const fechar = pagina.getByRole("button", { name: /Fechar a conversa/ });
  if (await fechar.isVisible().catch(() => false)) {
    await fechar.tap();
    await pagina.waitForTimeout(250);
  }
  const aba = pagina.getByRole("tab", { name: "Árvore", exact: true });
  if ((await aba.count()) > 0 && (await aba.getAttribute("aria-selected")) !== "true") {
    await aba.tap();
    await pagina.waitForTimeout(150);
  }
}

/** Linha da árvore (a parte clicável) de uma chave. */
export function linhaDaArvore(pagina, chave) {
  return pagina.locator(`[role=treeitem][data-chave="${chave}"] > div`).first();
}

/**
 * Seleciona pela árvore o primeiro elemento que casa com o seletor CSS
 * (clique no desktop, toque no celular). Devolve a chave usada.
 */
export async function selecionarNo(pagina, seletor) {
  const chave = await chaveDoSeletor(pagina, seletor);
  const toque = await pagina.evaluate(() => matchMedia("(pointer: coarse)").matches);
  if (toque) {
    await mostrarArvore(pagina);
    await linhaDaArvore(pagina, chave).tap();
  } else {
    await linhaDaArvore(pagina, chave).click();
  }
  await pagina.waitForTimeout(200);
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
  await pagina.waitForTimeout(300);
  return true;
}

export function conferir(condicao, mensagem) {
  if (!condicao) throw new Error(`Falhou: ${mensagem}`);
  console.log(`ok - ${mensagem}`);
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
