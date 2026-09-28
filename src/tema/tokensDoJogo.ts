/*
 * Os tokens de cor do jogo (as variáveis `--cor-*` de src/tema/tokens.css),
 * lidos de onde eles moram de verdade, sem copiar nenhuma cor para cá:
 *
 * - no navegador, das folhas de estilo da própria página (o tokens.css
 *   compilado): a regra `[data-theme=<tema>]` de cada tema;
 * - nos testes (jsdom), do arquivo tokens.css, que o preparo do Vitest
 *   entrega com `definirLeitorDeTokens` (testes/conteudo/preparar.ts).
 *
 * A E5 usa isso para montar a maquete do jogo (o site-alvo `tipo: "jogo"`)
 * com as cores reais do tema aberto, e o "Meu tema" guarda um conjunto
 * completo, partindo de um tema de base.
 */
import { analisarCss } from "@/motor/css/analisarCss";

/** "--cor-fundo" -> "#fff3f8", na ordem do tokens.css. */
export type Tokens = Record<string, string>;

/** Tema de onde os tokens saem (os três do tokens.css). */
export type TemaDeBase = "doce" | "fliperama" | "segredo";

export const TEMAS_DE_BASE: readonly TemaDeBase[] = ["doce", "fliperama", "segredo"];

const NOME_TOKEN = /^--cor-[a-z0-9-]+$/;

export function ehNomeDeToken(nome: string): boolean {
  return NOME_TOKEN.test(nome);
}

/** O seletor de um tema, com ou sem aspas (o CSS compilado tira as aspas). */
function seletorDoTema(tema: TemaDeBase): RegExp {
  return new RegExp(`\\[data-theme=(["']?)${tema}\\1\\]`);
}

/** Os tokens de um tema dentro de um texto de CSS (o tokens.css, por exemplo). */
export function tokensDoTextoCss(texto: string, tema: TemaDeBase): Tokens {
  const tokens: Tokens = {};
  const padrao = seletorDoTema(tema);
  for (const regra of analisarCss(texto).regras) {
    if (!padrao.test(regra.seletor)) continue;
    for (const declaracao of regra.declaracoes) {
      if (declaracao.ativa && ehNomeDeToken(declaracao.propriedade)) tokens[declaracao.propriedade] = declaracao.valor;
    }
  }
  return tokens;
}

/** Os tokens de um tema nas folhas de estilo da página (o tokens.css compilado). */
function tokensDaPagina(tema: TemaDeBase): Tokens | null {
  if (typeof document === "undefined") return null;
  const tokens: Tokens = {};
  const padrao = seletorDoTema(tema);
  const visitar = (regras: CSSRuleList) => {
    for (const regra of Array.from(regras)) {
      if ("selectorText" in regra && "style" in regra && padrao.test(String(regra.selectorText))) {
        const estilo = regra.style as CSSStyleDeclaration;
        for (let indice = 0; indice < estilo.length; indice++) {
          const nome = estilo.item(indice);
          if (ehNomeDeToken(nome)) tokens[nome] = estilo.getPropertyValue(nome).trim();
        }
      } else if ("cssRules" in regra) {
        visitar((regra as CSSGroupingRule).cssRules);
      }
    }
  };
  for (const folha of Array.from(document.styleSheets)) {
    try {
      visitar(folha.cssRules);
    } catch {
      // Folha de outra origem: não dá para ler (e os tokens não moram nela).
    }
  }
  return Object.keys(tokens).length > 0 ? tokens : null;
}

type Leitor = (tema: TemaDeBase) => Tokens | null;
let leitorDefinido: Leitor | null = null;

/** Os testes (sem as folhas da página) dizem de onde ler: o arquivo tokens.css. */
export function definirLeitorDeTokens(leitor: Leitor | null): void {
  leitorDefinido = leitor;
}

/**
 * Os tokens de um tema. Lança um erro se não achar (a página sem o
 * tokens.css, ou um teste sem o leitor): é melhor falhar alto do que
 * montar uma maquete sem cores.
 */
export function tokensDoTema(tema: TemaDeBase): Tokens {
  const tokens = (leitorDefinido ?? tokensDaPagina)(tema);
  if (!tokens || Object.keys(tokens).length === 0) {
    throw new Error(`não achei os tokens do tema "${tema}" (o tokens.css está na página, ou o teste definiu o leitor?)`);
  }
  return tokens;
}
