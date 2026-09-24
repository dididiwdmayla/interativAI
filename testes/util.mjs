// Utilitários dos testes de navegador. Rodar com o servidor no ar:
//   node testes/<arquivo>.mjs
// Usa o Playwright do projeto ou, se não houver, o instalado globalmente.
import { execSync } from "node:child_process";
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

export async function abrir({ largura = 1440, altura = 900, toque = false, progresso = null } = {}) {
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
      if (sessionStorage.getItem("teste:iniciado")) return;
      sessionStorage.setItem("teste:iniciado", "1");
      if (valor === null) localStorage.clear();
      else localStorage.setItem(`ilha-sites:progresso:v${valor.versao === 2 ? 2 : 1}`, JSON.stringify(valor));
    }, progresso);
  }
  await pagina.goto(URL_JOGO);
  await pagina.waitForSelector("iframe");
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
    proporcaoPrevia: 0.4,
    ...extra,
  };
}

export function conferir(condicao, mensagem) {
  if (!condicao) throw new Error(`Falhou: ${mensagem}`);
  console.log(`ok - ${mensagem}`);
}

/** Erros de console, ignorando avisos do modo de desenvolvimento do Next. */
export function errosRelevantes(erros) {
  return erros.filter((texto) => !/Download the React DevTools|\[HMR\]|\[Fast Refresh\]/.test(texto));
}
