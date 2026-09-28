/*
 * Avaliador de media queries do motor, contra uma tela informada.
 *
 * O jogo não usa o `matchMedia` do navegador para decidir a cascata: ele
 * avalia a condição contra uma largura (e altura) de tela explícita. Assim
 * o painel Estilos, os validadores e o testar:conteudo (jsdom, que não tem
 * `matchMedia`) chegam à MESMA resposta, e um validador pode perguntar "e
 * num celular de 390 px?" (`larguraTela`).
 *
 * O que ele sabe (Media Queries 4):
 * - tipos `all`, `screen` (valem) e `print` (não vale), com `only` e `not`;
 * - `min-width`, `max-width`, `width`, `min-height`, `max-height`,
 *   `height`, em px, em e rem (1em = 1rem = 16px, como nas media queries
 *   de verdade: elas usam o tamanho de fonte inicial, não o da página);
 * - a sintaxe de intervalo: `(width >= 600px)`, `(400px <= width < 800px)`;
 * - `orientation: portrait | landscape` (retrato quando a altura é maior ou
 *   igual à largura, como na especificação);
 * - `and`, `or`, `not` dentro da condição e listas com vírgula (basta uma
 *   valer).
 *
 * O que ele não sabe avaliar (`prefers-color-scheme`, `hover`, `vw` numa
 * condição, `aspect-ratio`...) conta como "não se aplica": a regra fica
 * fora, como o navegador faz com um recurso desconhecido. Isso é decisão
 * registrada em teste (testes/conteudo/cascata.test.ts).
 */

export type Tela = { largura: number; altura: number };

/** A tela usada quando ninguém diz outra (e não há janela): o Notebook 1280 do modo dispositivo. */
export const TELA_PADRAO: Tela = { largura: 1280, altura: 800 };

/** Tamanho de fonte inicial, em px: o que vale para em e rem numa media query. */
const FONTE_INICIAL = 16;

/** Resultado de três estados: "desconhecido" vira "não se aplica" no fim. */
type Tres = boolean | null;

/** Converte "600px", "37.5em", "40rem" em px; null se a unidade não serve. */
export function medidaEmPx(texto: string): number | null {
  const achado = /^(-?\d*\.?\d+)(px|em|rem)?$/i.exec(texto.trim());
  if (!achado) return null;
  const numero = Number(achado[1]);
  const unidade = (achado[2] ?? "").toLowerCase();
  if (unidade === "") return numero === 0 ? 0 : null;
  if (unidade === "px") return numero;
  return numero * FONTE_INICIAL;
}

function e(a: Tres, b: Tres): Tres {
  if (a === false || b === false) return false;
  if (a === null || b === null) return null;
  return true;
}

function ou(a: Tres, b: Tres): Tres {
  if (a === true || b === true) return true;
  if (a === null || b === null) return null;
  return false;
}

function nao(a: Tres): Tres {
  return a === null ? null : !a;
}

/** Separa por vírgulas (ou pela palavra dada) fora de parênteses. */
function dividirNoTopo(texto: string, separador: RegExp): string[] {
  const partes: string[] = [];
  let nivel = 0;
  let inicio = 0;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (c === "(") nivel++;
    else if (c === ")") nivel = Math.max(0, nivel - 1);
    else if (nivel === 0) {
      separador.lastIndex = i;
      const achado = separador.exec(texto);
      if (achado && achado.index === i) {
        partes.push(texto.slice(inicio, i));
        inicio = i + achado[0].length;
        i = inicio - 1;
      }
    }
  }
  partes.push(texto.slice(inicio));
  return partes.map((parte) => parte.trim());
}

function comparar(esquerda: number, operador: string, direita: number): Tres {
  switch (operador) {
    case "<":
      return esquerda < direita;
    case "<=":
      return esquerda <= direita;
    case ">":
      return esquerda > direita;
    case ">=":
      return esquerda >= direita;
    case "=":
      return esquerda === direita;
    default:
      return null;
  }
}

function dimensao(nome: string, tela: Tela): number | null {
  if (nome === "width") return tela.largura;
  if (nome === "height") return tela.altura;
  return null;
}

/** O que está dentro de um par de parênteses que é um recurso: "min-width: 600px", "width >= 600px". */
function avaliarRecurso(texto: string, tela: Tela): Tres {
  const miolo = texto.trim().toLowerCase();
  const doisPontos = miolo.indexOf(":");
  if (doisPontos >= 0) {
    const nome = miolo.slice(0, doisPontos).trim();
    const valor = miolo.slice(doisPontos + 1).trim();
    if (nome === "orientation") {
      if (valor === "portrait") return tela.altura >= tela.largura;
      if (valor === "landscape") return tela.largura > tela.altura;
      return null;
    }
    const prefixo = /^(min|max)-(.+)$/.exec(nome);
    const base = prefixo ? prefixo[2] : nome;
    const atual = dimensao(base, tela);
    const px = medidaEmPx(valor);
    if (atual === null || px === null) return null;
    if (!prefixo) return atual === px;
    return prefixo[1] === "min" ? atual >= px : atual <= px;
  }
  // Sintaxe de intervalo: "width >= 600px", "600px <= width", "400px < width <= 800px".
  const pedacos = miolo.split(/\s*(<=|>=|<|>|=)\s*/).filter((pedaco) => pedaco.length > 0);
  if (pedacos.length === 3) {
    const [a, operador, b] = pedacos;
    const atualA = dimensao(a, tela);
    const atualB = dimensao(b, tela);
    if (atualA !== null && atualB === null) {
      const px = medidaEmPx(b);
      return px === null ? null : comparar(atualA, operador, px);
    }
    if (atualB !== null && atualA === null) {
      const px = medidaEmPx(a);
      return px === null ? null : comparar(px, operador, atualB);
    }
    return null;
  }
  if (pedacos.length === 5) {
    const [a, operador1, meio, operador2, b] = pedacos;
    const atual = dimensao(meio, tela);
    const pxA = medidaEmPx(a);
    const pxB = medidaEmPx(b);
    if (atual === null || pxA === null || pxB === null) return null;
    return e(comparar(pxA, operador1, atual), comparar(atual, operador2, pxB));
  }
  // "(width)", "(color)", "(hover: hover)"...: o motor não sabe.
  return null;
}

/** Uma condição: termos entre parênteses ligados por and ou por or, com not na frente. */
function avaliarCondicao(texto: string, tela: Tela): Tres {
  const limpo = texto.trim();
  if (limpo.length === 0) return null;
  const naoNaFrente = /^not\s+/i.exec(limpo);
  if (naoNaFrente) return nao(avaliarCondicao(limpo.slice(naoNaFrente[0].length), tela));
  const comE = dividirNoTopo(limpo, /\s+and\s+/giy);
  if (comE.length > 1) return comE.map((parte) => avaliarCondicao(parte, tela)).reduce(e, true);
  const comOu = dividirNoTopo(limpo, /\s+or\s+/giy);
  if (comOu.length > 1) return comOu.map((parte) => avaliarCondicao(parte, tela)).reduce(ou, false);
  if (limpo.startsWith("(") && limpo.endsWith(")")) {
    const dentro = limpo.slice(1, -1).trim();
    // Parênteses em volta de outra condição: "((min-width: 1px) and (max-width: 2px))".
    if (dentro.startsWith("(") || /^not\s/i.test(dentro)) return avaliarCondicao(dentro, tela);
    return avaliarRecurso(dentro, tela);
  }
  return null;
}

/** Uma query da lista: [not|only] [tipo] [and condição] ou só a condição. */
function avaliarQuery(texto: string, tela: Tela): Tres {
  const limpo = texto.trim();
  if (limpo.length === 0) return null;
  if (limpo.startsWith("(")) return avaliarCondicao(limpo, tela);
  const achado = /^(?:(not|only)\s+)?([a-z-]+)(?:\s+and\s+([\s\S]+))?$/i.exec(limpo);
  if (!achado) {
    // "not (max-width: 1px)" sem tipo: é uma condição com not.
    return /^not\s*\(/i.test(limpo) ? avaliarCondicao(limpo, tela) : null;
  }
  const [, modificador, tipoBruto, resto] = achado;
  const tipo = tipoBruto.toLowerCase();
  let resultado: Tres;
  if (tipo === "all" || tipo === "screen") resultado = true;
  else if (tipo === "print") resultado = false;
  else return null;
  if (resto !== undefined) resultado = e(resultado, avaliarCondicao(resto, tela));
  if (modificador?.toLowerCase() === "not") resultado = nao(resultado);
  return resultado;
}

/**
 * A media query (o texto depois do @media) vale nessa tela? Lista com
 * vírgula: basta uma valer. O que o motor não sabe avaliar não se aplica.
 */
export function midiaSeAplica(texto: string, tela: Tela): boolean {
  const lista = dividirNoTopo(texto, /,/gy);
  return lista.some((query) => avaliarQuery(query, tela) === true);
}

/** A tela de um documento: a janela dele (a prévia de verdade) ou a padrão. */
export function telaDoDocumento(documento: Document): Tela {
  const janela = documento.defaultView;
  const largura = janela?.innerWidth ?? 0;
  const altura = janela?.innerHeight ?? 0;
  return largura > 0 && altura > 0 ? { largura, altura } : TELA_PADRAO;
}
