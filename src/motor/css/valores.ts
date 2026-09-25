/*
 * Valores de CSS: separar em pedaços, reconhecer cores e medidas, dizer se
 * um valor serve para uma propriedade e abrir os atalhos (margin: 10px 20px
 * vira margin-top: 10px, margin-right: 20px...).
 *
 * A validade tem três respostas, e a terceira é a importante:
 * - "valido": o motor tem certeza de que o navegador aceita;
 * - "invalido": o motor tem certeza de que o navegador joga fora (o
 *   Chrome risca e mostra um aviso);
 * - "desconhecido": o motor não sabe. Aí ele não risca ninguém por causa
 *   dessa declaração e não afirma o valor final.
 */
import { ATALHOS, longasDe } from "./propriedades";

export type Validade = "valido" | "invalido" | "desconhecido";

/** Palavras que valem em qualquer propriedade. */
export const PALAVRAS_GLOBAIS: ReadonlySet<string> = new Set(["inherit", "initial", "unset", "revert", "revert-layer"]);

/* ------------------------------------------------------------------ */
/* Pedaços                                                             */
/* ------------------------------------------------------------------ */

/**
 * Separa um valor nos espaços e vírgulas de fora de parênteses e strings.
 * As vírgulas voltam como pedaços "," (importam em font-family, sombras...).
 */
export function pedacosDoValor(valor: string): string[] {
  const pedacos: string[] = [];
  let atual = "";
  let profundidade = 0;
  let i = 0;
  const fechar = () => {
    if (atual.length > 0) pedacos.push(atual);
    atual = "";
  };
  while (i < valor.length) {
    const c = valor[i];
    if (c === '"' || c === "'") {
      let fim = i + 1;
      while (fim < valor.length && valor[fim] !== c) fim += valor[fim] === "\\" ? 2 : 1;
      atual += valor.slice(i, fim + 1);
      i = fim + 1;
      continue;
    }
    if (c === "(") profundidade++;
    if (c === ")" && profundidade > 0) profundidade--;
    if (profundidade === 0 && (c === " " || c === "\n" || c === "\t")) {
      fechar();
    } else if (profundidade === 0 && (c === "," || c === "/")) {
      fechar();
      pedacos.push(c);
    } else {
      atual += c;
    }
    i++;
  }
  fechar();
  return pedacos;
}

/* ------------------------------------------------------------------ */
/* Cores                                                               */
/* ------------------------------------------------------------------ */

export type Rgba = readonly [number, number, number, number];

/** As cores com nome do CSS (CSS Color 4), em hexadecimal. */
export const CORES_COM_NOME: Readonly<Record<string, string>> = {
  aliceblue: "f0f8ff", antiquewhite: "faebd7", aqua: "00ffff", aquamarine: "7fffd4", azure: "f0ffff",
  beige: "f5f5dc", bisque: "ffe4c4", black: "000000", blanchedalmond: "ffebcd", blue: "0000ff",
  blueviolet: "8a2be2", brown: "a52a2a", burlywood: "deb887", cadetblue: "5f9ea0", chartreuse: "7fff00",
  chocolate: "d2691e", coral: "ff7f50", cornflowerblue: "6495ed", cornsilk: "fff8dc", crimson: "dc143c",
  cyan: "00ffff", darkblue: "00008b", darkcyan: "008b8b", darkgoldenrod: "b8860b", darkgray: "a9a9a9",
  darkgreen: "006400", darkgrey: "a9a9a9", darkkhaki: "bdb76b", darkmagenta: "8b008b", darkolivegreen: "556b2f",
  darkorange: "ff8c00", darkorchid: "9932cc", darkred: "8b0000", darksalmon: "e9967a", darkseagreen: "8fbc8f",
  darkslateblue: "483d8b", darkslategray: "2f4f4f", darkslategrey: "2f4f4f", darkturquoise: "00ced1",
  darkviolet: "9400d3", deeppink: "ff1493", deepskyblue: "00bfff", dimgray: "696969", dimgrey: "696969",
  dodgerblue: "1e90ff", firebrick: "b22222", floralwhite: "fffaf0", forestgreen: "228b22", fuchsia: "ff00ff",
  gainsboro: "dcdcdc", ghostwhite: "f8f8ff", gold: "ffd700", goldenrod: "daa520", gray: "808080",
  green: "008000", greenyellow: "adff2f", grey: "808080", honeydew: "f0fff0", hotpink: "ff69b4",
  indianred: "cd5c5c", indigo: "4b0082", ivory: "fffff0", khaki: "f0e68c", lavender: "e6e6fa",
  lavenderblush: "fff0f5", lawngreen: "7cfc00", lemonchiffon: "fffacd", lightblue: "add8e6", lightcoral: "f08080",
  lightcyan: "e0ffff", lightgoldenrodyellow: "fafad2", lightgray: "d3d3d3", lightgreen: "90ee90", lightgrey: "d3d3d3",
  lightpink: "ffb6c1", lightsalmon: "ffa07a", lightseagreen: "20b2aa", lightskyblue: "87cefa",
  lightslategray: "778899", lightslategrey: "778899", lightsteelblue: "b0c4de", lightyellow: "ffffe0",
  lime: "00ff00", limegreen: "32cd32", linen: "faf0e6", magenta: "ff00ff", maroon: "800000",
  mediumaquamarine: "66cdaa", mediumblue: "0000cd", mediumorchid: "ba55d3", mediumpurple: "9370db",
  mediumseagreen: "3cb371", mediumslateblue: "7b68ee", mediumspringgreen: "00fa9a", mediumturquoise: "48d1cc",
  mediumvioletred: "c71585", midnightblue: "191970", mintcream: "f5fffa", mistyrose: "ffe4e1", moccasin: "ffe4b5",
  navajowhite: "ffdead", navy: "000080", oldlace: "fdf5e6", olive: "808000", olivedrab: "6b8e23",
  orange: "ffa500", orangered: "ff4500", orchid: "da70d6", palegoldenrod: "eee8aa", palegreen: "98fb98",
  paleturquoise: "afeeee", palevioletred: "db7093", papayawhip: "ffefd5", peachpuff: "ffdab9", peru: "cd853f",
  pink: "ffc0cb", plum: "dda0dd", powderblue: "b0e0e6", purple: "800080", rebeccapurple: "663399",
  red: "ff0000", rosybrown: "bc8f8f", royalblue: "4169e1", saddlebrown: "8b4513", salmon: "fa8072",
  sandybrown: "f4a460", seagreen: "2e8b57", seashell: "fff5ee", sienna: "a0522d", silver: "c0c0c0",
  skyblue: "87ceeb", slateblue: "6a5acd", slategray: "708090", slategrey: "708090", snow: "fffafa",
  springgreen: "00ff7f", steelblue: "4682b4", tan: "d2b48c", teal: "008080", thistle: "d8bfd8",
  tomato: "ff6347", turquoise: "40e0d0", violet: "ee82ee", wheat: "f5deb3", white: "ffffff",
  whitesmoke: "f5f5f5", yellow: "ffff00", yellowgreen: "9acd32",
};

/** Cores que dependem do contexto: valem, mas o motor não sabe o RGB. */
const CORES_DE_CONTEXTO = new Set([
  "currentcolor",
  "canvas",
  "canvastext",
  "linktext",
  "visitedtext",
  "activetext",
  "buttonface",
  "buttontext",
  "field",
  "fieldtext",
  "highlight",
  "highlighttext",
  "graytext",
  "mark",
  "marktext",
  "accentcolor",
  "accentcolortext",
  "-webkit-link",
]);

function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.min(maximo, Math.max(minimo, valor));
}

function lerHex(hex: string): Rgba | null {
  if (!/^[0-9a-fA-F]+$/.test(hex)) return null;
  const expandir = (texto: string) =>
    texto.length <= 4 ? texto.split("").map((caractere) => caractere + caractere).join("") : texto;
  if (![3, 4, 6, 8].includes(hex.length)) return null;
  const cheio = expandir(hex);
  const r = parseInt(cheio.slice(0, 2), 16);
  const g = parseInt(cheio.slice(2, 4), 16);
  const b = parseInt(cheio.slice(4, 6), 16);
  const a = cheio.length === 8 ? parseInt(cheio.slice(6, 8), 16) / 255 : 1;
  return [r, g, b, a];
}

/** Número ou porcentagem de um canal de cor (0 a 255). */
function canalRgb(texto: string): number | null {
  if (/^-?[\d.]+%$/.test(texto)) return limitar((parseFloat(texto) / 100) * 255, 0, 255);
  if (/^-?[\d.]+(e-?\d+)?$/.test(texto)) return limitar(parseFloat(texto), 0, 255);
  return null;
}

function canalAlfa(texto: string | undefined): number | null {
  if (texto === undefined) return 1;
  if (/^-?[\d.]+%$/.test(texto)) return limitar(parseFloat(texto) / 100, 0, 1);
  if (/^-?[\d.]+(e-?\d+)?$/.test(texto)) return limitar(parseFloat(texto), 0, 1);
  return null;
}

function hslParaRgb(h: number, s: number, l: number): [number, number, number] {
  const matiz = (((h % 360) + 360) % 360) / 360;
  const f = (n: number) => {
    const k = (n + matiz * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

function angulo(texto: string): number | null {
  const numero = parseFloat(texto);
  if (Number.isNaN(numero)) return null;
  if (texto.endsWith("turn")) return numero * 360;
  if (texto.endsWith("grad")) return numero * 0.9;
  if (texto.endsWith("rad")) return (numero * 180) / Math.PI;
  if (/^-?[\d.]+(deg)?$/.test(texto)) return numero;
  return null;
}

/** Argumentos de rgb()/hsl(), nos dois jeitos (com vírgulas e o moderno com barra). */
function argumentosDaFuncao(interno: string): string[] | null {
  const partes = pedacosDoValor(interno);
  const semVirgula = partes.filter((parte) => parte !== ",");
  const barra = semVirgula.indexOf("/");
  if (barra >= 0) {
    if (partes.includes(",")) return null;
    const cores = semVirgula.slice(0, barra);
    const alfa = semVirgula.slice(barra + 1);
    return cores.length === 3 && alfa.length === 1 ? [...cores, alfa[0]] : null;
  }
  return semVirgula.length === 3 || semVirgula.length === 4 ? semVirgula : null;
}

/**
 * A cor em RGBA (0 a 255 e alfa de 0 a 1), ou null se não é uma cor que o
 * motor sabe ler. Cores de contexto (currentcolor) dão null também.
 */
export function lerCor(valor: string): Rgba | null {
  const texto = valor.trim().toLowerCase();
  if (texto === "transparent") return [0, 0, 0, 0];
  if (Object.hasOwn(CORES_COM_NOME, texto)) return lerHex(CORES_COM_NOME[texto]);
  if (texto.startsWith("#")) return lerHex(texto.slice(1));
  const funcao = /^(rgba?|hsla?)\(([\s\S]*)\)$/.exec(texto);
  if (!funcao) return null;
  const argumentos = argumentosDaFuncao(funcao[2]);
  if (!argumentos) return null;
  const alfa = canalAlfa(argumentos[3]);
  if (alfa === null) return null;
  if (funcao[1].startsWith("rgb")) {
    const canais = argumentos.slice(0, 3).map(canalRgb);
    if (canais.some((canal) => canal === null)) return null;
    return [canais[0] as number, canais[1] as number, canais[2] as number, alfa];
  }
  const h = angulo(argumentos[0]);
  const s = /^[\d.]+%?$/.test(argumentos[1]) ? parseFloat(argumentos[1]) / 100 : null;
  const l = /^[\d.]+%?$/.test(argumentos[2]) ? parseFloat(argumentos[2]) / 100 : null;
  if (h === null || s === null || l === null) return null;
  const [r, g, b] = hslParaRgb(h, limitar(s, 0, 1), limitar(l, 0, 1));
  return [r, g, b, alfa];
}

const FUNCOES_DE_COR = /^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\([\s\S]*\)$/i;

/** É uma cor (o navegador aceitaria como cor)? */
export function ehCor(valor: string): Validade {
  const texto = valor.trim().toLowerCase();
  if (lerCor(texto) !== null) return "valido";
  if (CORES_DE_CONTEXTO.has(texto)) return "valido";
  if (texto.startsWith("#")) return "invalido";
  if (FUNCOES_DE_COR.test(texto)) return texto.startsWith("rgb") || texto.startsWith("hsl") ? "invalido" : "desconhecido";
  if (/^[a-z-]+$/.test(texto)) return "invalido";
  return "desconhecido";
}

/** "#rrggbb" (ou "#rrggbbaa" com transparência) de uma cor, para o seletor de cor. */
export function corEmHex(rgba: Rgba): string {
  const hex = (numero: number) => Math.round(numero).toString(16).padStart(2, "0");
  const base = `#${hex(rgba[0])}${hex(rgba[1])}${hex(rgba[2])}`;
  return rgba[3] < 1 ? `${base}${hex(rgba[3] * 255)}` : base;
}

/* ------------------------------------------------------------------ */
/* Medidas e números                                                   */
/* ------------------------------------------------------------------ */

const UNIDADES = new Set([
  "px", "em", "rem", "ex", "ch", "cap", "ic", "lh", "rlh",
  "vw", "vh", "vmin", "vmax", "svw", "svh", "lvw", "lvh", "dvw", "dvh", "vi", "vb",
  "cm", "mm", "q", "in", "pt", "pc",
  "cqw", "cqh", "cqi", "cqb", "cqmin", "cqmax",
]);

const NUMERO = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i;

/** Número com unidade: { numero, unidade } ("" sem unidade, "%" porcentagem). */
export function lerDimensao(valor: string): { numero: number; unidade: string } | null {
  const texto = valor.trim();
  const numero = NUMERO.exec(texto);
  if (!numero) return null;
  const unidade = texto.slice(numero[0].length).toLowerCase();
  if (unidade !== "" && unidade !== "%" && !UNIDADES.has(unidade) && !["fr", "deg", "s", "ms", "turn", "rad", "grad", "x", "dpi"].includes(unidade)) {
    return null;
  }
  return { numero: parseFloat(numero[0]), unidade };
}

const FUNCOES_DE_CALCULO = /^(calc|min|max|clamp|var|env|round|mod|rem|abs|sign)\([\s\S]*\)$/i;

/** Medida (px, em, %...) ou zero. `negativo` diz se aceita número negativo. */
export function ehMedida(valor: string, opcoes: { porcentagem?: boolean; negativo?: boolean } = {}): Validade {
  const texto = valor.trim().toLowerCase();
  if (FUNCOES_DE_CALCULO.test(texto)) return texto.startsWith("var(") ? "desconhecido" : "valido";
  const dimensao = lerDimensao(texto);
  if (!dimensao) return "invalido";
  if (dimensao.numero < 0 && opcoes.negativo === false) return "invalido";
  if (dimensao.unidade === "") return dimensao.numero === 0 ? "valido" : "invalido";
  if (dimensao.unidade === "%") return opcoes.porcentagem === false ? "invalido" : "valido";
  return UNIDADES.has(dimensao.unidade) ? "valido" : "invalido";
}

function ehNumero(valor: string, opcoes: { negativo?: boolean; inteiro?: boolean } = {}): Validade {
  const texto = valor.trim();
  if (FUNCOES_DE_CALCULO.test(texto)) return texto.startsWith("var(") ? "desconhecido" : "valido";
  const dimensao = lerDimensao(texto);
  if (!dimensao || dimensao.unidade !== "") return "invalido";
  if (opcoes.negativo === false && dimensao.numero < 0) return "invalido";
  if (opcoes.inteiro && !Number.isInteger(dimensao.numero)) return "invalido";
  return "valido";
}

/* ------------------------------------------------------------------ */
/* Validade por propriedade                                            */
/* ------------------------------------------------------------------ */

type Checador = (valor: string) => Validade;

const palavras =
  (...lista: string[]): Checador =>
  (valor) =>
    lista.includes(valor.trim().toLowerCase()) ? "valido" : "invalido";

const ou =
  (...checadores: Checador[]): Checador =>
  (valor) => {
    let resultado: Validade = "invalido";
    for (const checar of checadores) {
      const agora = checar(valor);
      if (agora === "valido") return "valido";
      if (agora === "desconhecido") resultado = "desconhecido";
    }
    return resultado;
  };

/** De 1 a `maximo` pedaços, cada um aceito pelo checador. */
const varios =
  (checar: Checador, maximo: number): Checador =>
  (valor) => {
    const pedacos = pedacosDoValor(valor);
    if (pedacos.length === 0 || pedacos.length > maximo || pedacos.some((pedaco) => pedaco === "," || pedaco === "/")) {
      return "invalido";
    }
    return combinar(pedacos.map(checar));
  };

function combinar(resultados: Validade[]): Validade {
  if (resultados.includes("invalido")) return "invalido";
  if (resultados.includes("desconhecido")) return "desconhecido";
  return "valido";
}

const cor: Checador = ehCor;
const medida: Checador = (valor) => ehMedida(valor);
const medidaPositiva: Checador = (valor) => ehMedida(valor, { negativo: false });
const auto = palavras("auto");
const larguraDeBorda = ou(palavras("thin", "medium", "thick"), medidaPositiva);
const estiloDeBorda = palavras("none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset");
const margem = ou(auto, medida);
const tamanho = ou(palavras("auto", "min-content", "max-content", "fit-content", "stretch"), medidaPositiva);
const tamanhoMaximo = ou(palavras("none", "min-content", "max-content", "fit-content"), medidaPositiva);
const tamanhoDaFonte = ou(
  palavras("xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large", "larger", "smaller"),
  medidaPositiva,
);
const pesoDaFonte: Checador = (valor) => {
  const texto = valor.trim().toLowerCase();
  if (["normal", "bold", "bolder", "lighter"].includes(texto)) return "valido";
  const numero = ehNumero(texto, { negativo: false });
  if (numero !== "valido") return numero;
  const peso = parseFloat(texto);
  return peso >= 1 && peso <= 1000 ? "valido" : "invalido";
};
const estiloDaFonte: Checador = (valor) => {
  const texto = valor.trim().toLowerCase();
  if (["normal", "italic", "oblique"].includes(texto)) return "valido";
  return texto.startsWith("oblique ") ? "desconhecido" : "invalido";
};
const familia: Checador = (valor) => {
  const pedacos = pedacosDoValor(valor);
  if (pedacos.length === 0 || pedacos[0] === "," || pedacos[pedacos.length - 1] === ",") return "invalido";
  for (const pedaco of pedacos) {
    if (pedaco === "/") return "invalido";
    if (pedaco === ",") continue;
    if (/^["']/.test(pedaco)) continue;
    if (!/^-?[a-zA-Z_ -￿][a-zA-Z0-9_\- -￿]*$/.test(pedaco)) return "invalido";
  }
  return "valido";
};
const alturaDaLinha = ou(palavras("normal"), (valor) => ehNumero(valor, { negativo: false }), medidaPositiva);
const espacamento = ou(palavras("normal"), medida);
const alinhamentoDoTexto = palavras("left", "right", "center", "justify", "start", "end", "match-parent", "justify-all");
const display = palavras(
  "block", "inline", "inline-block", "flex", "inline-flex", "grid", "inline-grid", "none", "contents",
  "flow-root", "list-item", "table", "table-row", "table-cell", "table-row-group", "table-header-group",
  "table-footer-group", "table-column", "table-column-group", "table-caption", "inline-table", "run-in",
  "ruby", "math", "flow", "block flow", "inline flow", "block flex", "inline flex", "block grid", "inline grid",
);
const posicao = palavras("static", "relative", "absolute", "fixed", "sticky");
const inteiroOuAuto = ou(auto, (valor) => ehNumero(valor, { inteiro: true }));
const opacidade = ou((valor) => ehNumero(valor), (valor) => (valor.trim().endsWith("%") ? ehMedida(valor) : "invalido"));
const justificar = palavras(
  "normal", "flex-start", "flex-end", "start", "end", "center", "left", "right", "space-between",
  "space-around", "space-evenly", "stretch", "safe center", "unsafe center",
);
const alinhar = palavras(
  "normal", "stretch", "flex-start", "flex-end", "start", "end", "center", "baseline", "first baseline",
  "last baseline", "self-start", "self-end", "anchor-center",
);
const alinharConteudo = palavras(
  "normal", "flex-start", "flex-end", "start", "end", "center", "space-between", "space-around",
  "space-evenly", "stretch", "baseline",
);
const faixasDoGrid: Checador = (valor) => {
  const texto = valor.trim().toLowerCase();
  if (texto === "none" || texto === "subgrid" || texto.startsWith("subgrid ")) return "valido";
  const pedacos = pedacosDoValor(texto);
  if (pedacos.length === 0) return "invalido";
  return combinar(
    pedacos.map((pedaco) => {
      if (/^(repeat|minmax|fit-content)\(.*\)$/.test(pedaco)) return "valido";
      if (/^\[.*\]$/.test(pedaco)) return "valido";
      if (["auto", "min-content", "max-content"].includes(pedaco)) return "valido";
      const dimensao = lerDimensao(pedaco);
      if (dimensao?.unidade === "fr") return dimensao.numero >= 0 ? "valido" : "invalido";
      return ehMedida(pedaco, { negativo: false });
    }),
  );
};
const linhaDoGrid: Checador = (valor) => {
  const texto = valor.trim().toLowerCase();
  if (texto === "auto") return "valido";
  if (/^-?\d+$/.test(texto)) return texto === "0" ? "invalido" : "valido";
  if (/^span\s+\d+$/.test(texto)) return "valido";
  return /^[a-z_-][a-z0-9_-]*$/.test(texto) ? "valido" : "desconhecido";
};
const raioDeBorda = medidaPositiva;
const sombra: Checador = (valor) => (valor.trim().toLowerCase() === "none" ? "valido" : "desconhecido");

/** Checadores das propriedades longas que o motor conhece de verdade. */
const CHECADORES: Readonly<Record<string, Checador>> = {
  color: cor,
  "background-color": cor,
  "border-top-color": cor,
  "border-right-color": cor,
  "border-bottom-color": cor,
  "border-left-color": cor,
  "outline-color": cor,
  "text-decoration-color": cor,
  "caret-color": ou(auto, cor),
  "accent-color": ou(auto, cor),
  "column-rule-color": cor,
  "margin-top": margem,
  "margin-right": margem,
  "margin-bottom": margem,
  "margin-left": margem,
  "padding-top": medidaPositiva,
  "padding-right": medidaPositiva,
  "padding-bottom": medidaPositiva,
  "padding-left": medidaPositiva,
  top: margem,
  right: margem,
  bottom: margem,
  left: margem,
  "border-top-width": larguraDeBorda,
  "border-right-width": larguraDeBorda,
  "border-bottom-width": larguraDeBorda,
  "border-left-width": larguraDeBorda,
  "border-top-style": estiloDeBorda,
  "border-right-style": estiloDeBorda,
  "border-bottom-style": estiloDeBorda,
  "border-left-style": estiloDeBorda,
  "border-top-left-radius": raioDeBorda,
  "border-top-right-radius": raioDeBorda,
  "border-bottom-right-radius": raioDeBorda,
  "border-bottom-left-radius": raioDeBorda,
  "outline-width": larguraDeBorda,
  "outline-style": ou(estiloDeBorda, palavras("auto")),
  "outline-offset": medida,
  width: tamanho,
  height: tamanho,
  "min-width": tamanho,
  "min-height": tamanho,
  "max-width": tamanhoMaximo,
  "max-height": tamanhoMaximo,
  "font-size": tamanhoDaFonte,
  "font-weight": pesoDaFonte,
  "font-style": estiloDaFonte,
  "font-family": familia,
  "font-variant-caps": palavras("normal", "small-caps", "all-small-caps", "petite-caps", "all-petite-caps", "unicase", "titling-caps"),
  "font-stretch": ou(
    palavras("normal", "ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded"),
    (valor) => (valor.trim().endsWith("%") ? ehMedida(valor, { negativo: false }) : "invalido"),
  ),
  "line-height": alturaDaLinha,
  "letter-spacing": espacamento,
  "word-spacing": espacamento,
  "text-align": alinhamentoDoTexto,
  "text-indent": medida,
  "text-transform": palavras("none", "capitalize", "uppercase", "lowercase", "full-width", "full-size-kana"),
  "text-decoration-line": (valor) => {
    const pedacos = pedacosDoValor(valor.toLowerCase());
    if (pedacos.length === 1 && pedacos[0] === "none") return "valido";
    const aceitas = ["underline", "overline", "line-through", "blink"];
    return pedacos.length > 0 && pedacos.every((pedaco) => aceitas.includes(pedaco)) ? "valido" : "invalido";
  },
  "text-decoration-style": palavras("solid", "double", "dotted", "dashed", "wavy"),
  "text-decoration-thickness": ou(palavras("auto", "from-font"), medida),
  "white-space": palavras("normal", "nowrap", "pre", "pre-wrap", "pre-line", "break-spaces"),
  "vertical-align": ou(palavras("baseline", "sub", "super", "text-top", "text-bottom", "middle", "top", "bottom"), medida),
  display,
  position: posicao,
  "z-index": inteiroOuAuto,
  float: palavras("none", "left", "right", "inline-start", "inline-end"),
  clear: palavras("none", "left", "right", "both", "inline-start", "inline-end"),
  "box-sizing": palavras("content-box", "border-box"),
  opacity: opacidade,
  visibility: palavras("visible", "hidden", "collapse"),
  "overflow-x": palavras("visible", "hidden", "clip", "scroll", "auto"),
  "overflow-y": palavras("visible", "hidden", "clip", "scroll", "auto"),
  cursor: () => "desconhecido",
  "list-style-type": (valor) => (/^[a-z-]+$/i.test(valor.trim()) || /^["']/.test(valor.trim()) ? "valido" : "desconhecido"),
  "list-style-position": palavras("inside", "outside"),
  "list-style-image": (valor) => (valor.trim().toLowerCase() === "none" ? "valido" : "desconhecido"),
  "flex-direction": palavras("row", "row-reverse", "column", "column-reverse"),
  "flex-wrap": palavras("nowrap", "wrap", "wrap-reverse"),
  "flex-grow": (valor) => ehNumero(valor, { negativo: false }),
  "flex-shrink": (valor) => ehNumero(valor, { negativo: false }),
  "flex-basis": ou(palavras("auto", "content", "min-content", "max-content", "fit-content"), medidaPositiva),
  order: (valor) => ehNumero(valor, { inteiro: true }),
  "justify-content": justificar,
  "align-items": alinhar,
  "align-self": ou(palavras("auto"), alinhar),
  "align-content": alinharConteudo,
  "justify-items": ou(palavras("legacy", "left", "right", "center"), alinhar),
  "justify-self": ou(palavras("auto", "left", "right"), alinhar),
  "row-gap": ou(palavras("normal"), medidaPositiva),
  "column-gap": ou(palavras("normal"), medidaPositiva),
  "grid-template-columns": faixasDoGrid,
  "grid-template-rows": faixasDoGrid,
  "grid-auto-columns": faixasDoGrid,
  "grid-auto-rows": faixasDoGrid,
  "grid-auto-flow": palavras("row", "column", "dense", "row dense", "column dense"),
  "grid-row-start": linhaDoGrid,
  "grid-row-end": linhaDoGrid,
  "grid-column-start": linhaDoGrid,
  "grid-column-end": linhaDoGrid,
  "object-fit": palavras("fill", "contain", "cover", "none", "scale-down"),
  "box-shadow": sombra,
  "text-shadow": sombra,
  "background-image": (valor) => (valor.trim().toLowerCase() === "none" ? "valido" : "desconhecido"),
  "background-repeat": palavras("repeat", "repeat-x", "repeat-y", "no-repeat", "space", "round"),
  "background-attachment": palavras("scroll", "fixed", "local"),
  "background-size": (valor) =>
    ["auto", "cover", "contain"].includes(valor.trim().toLowerCase()) ? "valido" : varios(ou(auto, medidaPositiva), 2)(valor),
  "background-position-x": ou(palavras("left", "center", "right"), medida),
  "background-position-y": ou(palavras("top", "center", "bottom"), medida),
  "background-origin": palavras("border-box", "padding-box", "content-box"),
  "background-clip": palavras("border-box", "padding-box", "content-box", "text"),
  "aspect-ratio": (valor) => (valor.trim() === "auto" ? "valido" : "desconhecido"),
};

/**
 * A declaração `propriedade: valor` serve? Propriedade personalizada
 * (`--algo`) e valores com var() valem na hora de decidir quem vence (o
 * navegador só descobre depois se o valor final funciona).
 */
export function validadeDoValor(propriedade: string, valor: string): Validade {
  const texto = valor.trim();
  if (propriedade.startsWith("--")) return "valido";
  if (texto.length === 0) return "invalido";
  if (PALAVRAS_GLOBAIS.has(texto.toLowerCase())) return "valido";
  if (/var\(/i.test(texto)) return "valido";
  if (!/^-?[a-z][a-z0-9-]*$/.test(propriedade)) return "invalido";
  if (Object.hasOwn(ATALHOS, propriedade)) {
    const aberto = abrirAtalho(propriedade, texto);
    if (aberto.validade !== "valido" || !aberto.longas) return aberto.validade;
    return combinar(
      Object.entries(aberto.longas).map(([longa, parte]) =>
        Object.hasOwn(CHECADORES, longa) ? CHECADORES[longa](parte) : "desconhecido",
      ),
    );
  }
  if (Object.hasOwn(CHECADORES, propriedade)) return CHECADORES[propriedade](texto);
  return "desconhecido";
}

/**
 * Propriedades com checador que só reconhece o "none" (ou quase nada): o
 * motor não tem certeza da maioria dos valores delas.
 */
const PARCIAIS: ReadonlySet<string> = new Set([
  "box-shadow",
  "text-shadow",
  "background-image",
  "list-style-image",
  "cursor",
  "aspect-ratio",
]);

/**
 * O motor conhece os valores dessa propriedade (a checagem da fábrica usa
 * para avisar quem escreve um valorEfetivo que nunca teria certeza).
 */
export function propriedadeConhecida(propriedade: string): boolean {
  const conhecida = (longa: string) => Object.hasOwn(CHECADORES, longa) && !PARCIAIS.has(longa);
  if (Object.hasOwn(ATALHOS, propriedade)) return longasDe(propriedade).every(conhecida);
  return conhecida(propriedade);
}

/* ------------------------------------------------------------------ */
/* Atalhos                                                             */
/* ------------------------------------------------------------------ */

export type AtalhoAberto = {
  validade: Validade;
  /** Valor de cada propriedade longa; null quando o motor não sabe separar. */
  longas: Record<string, string> | null;
};

/** 1 a 4 valores de caixa: cima, direita, baixo, esquerda. */
function caixa(pedacos: string[]): [string, string, string, string] | null {
  switch (pedacos.length) {
    case 1:
      return [pedacos[0], pedacos[0], pedacos[0], pedacos[0]];
    case 2:
      return [pedacos[0], pedacos[1], pedacos[0], pedacos[1]];
    case 3:
      return [pedacos[0], pedacos[1], pedacos[2], pedacos[1]];
    case 4:
      return [pedacos[0], pedacos[1], pedacos[2], pedacos[3]];
    default:
      return null;
  }
}

function porLongas(longas: readonly string[], valores: readonly string[]): Record<string, string> {
  return Object.fromEntries(longas.map((longa, indice) => [longa, valores[indice]]));
}

/** width, style e color de uma borda (em qualquer ordem, cada um no máximo uma vez). */
function partesDaBorda(pedacos: string[]): { largura: string; estilo: string; cor: string } | null {
  let largura: string | null = null;
  let estilo: string | null = null;
  let corDaBorda: string | null = null;
  for (const pedaco of pedacos) {
    if (estilo === null && estiloDeBorda(pedaco) === "valido") estilo = pedaco;
    else if (largura === null && larguraDeBorda(pedaco) === "valido") largura = pedaco;
    else if (corDaBorda === null && ehCor(pedaco) === "valido") corDaBorda = pedaco;
    else return null;
  }
  return { largura: largura ?? "medium", estilo: estilo ?? "none", cor: corDaBorda ?? "currentcolor" };
}

const PALAVRAS_DE_FONTE_ANTES = new Set(["normal", "italic", "oblique", "small-caps", "bold", "bolder", "lighter"]);

function abrirFonte(pedacos: string[]): Record<string, string> | null {
  const longas: Record<string, string> = {
    "font-style": "normal",
    "font-variant-caps": "normal",
    "font-weight": "normal",
    "font-stretch": "normal",
    "line-height": "normal",
  };
  let i = 0;
  // Estilo, variante, peso e largura, em qualquer ordem, antes do tamanho.
  while (i < pedacos.length && i < 4) {
    const pedaco = pedacos[i].toLowerCase();
    if (pedaco === "normal") {
      i++;
      continue;
    }
    if (pedaco === "italic" || pedaco === "oblique") longas["font-style"] = pedaco;
    else if (pedaco === "small-caps") longas["font-variant-caps"] = pedaco;
    else if (PALAVRAS_DE_FONTE_ANTES.has(pedaco) || (/^\d+$/.test(pedaco) && pesoDaFonte(pedaco) === "valido" && pedacos[i + 1] !== undefined && tamanhoDaFonte(pedacos[i + 1]) === "valido")) {
      longas["font-weight"] = pedaco;
    } else break;
    i++;
  }
  const tamanhoTexto = pedacos[i];
  if (tamanhoTexto === undefined || tamanhoDaFonte(tamanhoTexto) !== "valido") return null;
  longas["font-size"] = tamanhoTexto;
  i++;
  if (pedacos[i] === "/") {
    const altura = pedacos[i + 1];
    if (altura === undefined || alturaDaLinha(altura) !== "valido") return null;
    longas["line-height"] = altura;
    i += 2;
  }
  const familiaTexto = juntarPedacos(pedacos.slice(i));
  if (familia(familiaTexto) !== "valido") return null;
  longas["font-family"] = familiaTexto;
  return longas;
}

function abrirFundo(pedacos: string[]): Record<string, string> | null {
  if (pedacos.includes(",") || pedacos.includes("/")) return null;
  const longas: Record<string, string> = {
    "background-color": "transparent",
    "background-image": "none",
    "background-position-x": "0%",
    "background-position-y": "0%",
    "background-size": "auto",
    "background-repeat": "repeat",
    "background-attachment": "scroll",
    "background-origin": "padding-box",
    "background-clip": "border-box",
  };
  let caixas = 0;
  for (const pedaco of pedacos) {
    const texto = pedaco.toLowerCase();
    if (ehCor(texto) === "valido") longas["background-color"] = pedaco;
    else if (texto === "none" || /^(url|(repeating-)?(linear|radial|conic)-gradient|image-set)\(/.test(texto)) longas["background-image"] = pedaco;
    else if (CHECADORES["background-repeat"](texto) === "valido") longas["background-repeat"] = texto;
    else if (CHECADORES["background-attachment"](texto) === "valido") longas["background-attachment"] = texto;
    else if (["border-box", "padding-box", "content-box"].includes(texto)) {
      if (caixas === 0) {
        longas["background-origin"] = texto;
        longas["background-clip"] = texto;
      } else longas["background-clip"] = texto;
      caixas++;
    } else return null;
  }
  return longas;
}

function abrirFlex(pedacos: string[]): Record<string, string> | null {
  const numero = (texto: string) => ehNumero(texto, { negativo: false }) === "valido";
  const base = (texto: string) => CHECADORES["flex-basis"](texto) === "valido";
  if (pedacos.length === 1) {
    const texto = pedacos[0].toLowerCase();
    if (texto === "none") return { "flex-grow": "0", "flex-shrink": "0", "flex-basis": "auto" };
    if (texto === "auto") return { "flex-grow": "1", "flex-shrink": "1", "flex-basis": "auto" };
    if (numero(texto)) return { "flex-grow": texto, "flex-shrink": "1", "flex-basis": "0%" };
    if (base(texto)) return { "flex-grow": "1", "flex-shrink": "1", "flex-basis": texto };
    return null;
  }
  if (pedacos.length === 2) {
    if (!numero(pedacos[0])) return null;
    if (numero(pedacos[1])) return { "flex-grow": pedacos[0], "flex-shrink": pedacos[1], "flex-basis": "0%" };
    if (base(pedacos[1])) return { "flex-grow": pedacos[0], "flex-shrink": "1", "flex-basis": pedacos[1] };
    return null;
  }
  if (pedacos.length === 3 && numero(pedacos[0]) && numero(pedacos[1]) && base(pedacos[2])) {
    return { "flex-grow": pedacos[0], "flex-shrink": pedacos[1], "flex-basis": pedacos[2] };
  }
  return null;
}

function abrirDecoracao(pedacos: string[]): Record<string, string> | null {
  const longas: Record<string, string> = {
    "text-decoration-line": "none",
    "text-decoration-style": "solid",
    "text-decoration-color": "currentcolor",
    "text-decoration-thickness": "auto",
  };
  const linhas: string[] = [];
  for (const pedaco of pedacos) {
    const texto = pedaco.toLowerCase();
    if (["underline", "overline", "line-through", "blink"].includes(texto)) linhas.push(texto);
    else if (texto === "none" && linhas.length === 0) longas["text-decoration-line"] = "none";
    else if (CHECADORES["text-decoration-style"](texto) === "valido") longas["text-decoration-style"] = texto;
    else if (ehCor(texto) === "valido") longas["text-decoration-color"] = pedaco;
    else if (CHECADORES["text-decoration-thickness"](texto) === "valido") longas["text-decoration-thickness"] = texto;
    else return null;
  }
  if (linhas.length > 0) longas["text-decoration-line"] = linhas.join(" ");
  return longas;
}

function abrirListaDeEstilo(pedacos: string[]): Record<string, string> | null {
  const longas: Record<string, string> = {
    "list-style-type": "disc",
    "list-style-position": "outside",
    "list-style-image": "none",
  };
  let nones = 0;
  for (const pedaco of pedacos) {
    const texto = pedaco.toLowerCase();
    if (texto === "none") nones++;
    else if (texto === "inside" || texto === "outside") longas["list-style-position"] = texto;
    else if (/^url\(/.test(texto)) longas["list-style-image"] = pedaco;
    else if (/^[a-z-]+$/.test(texto)) longas["list-style-type"] = texto;
    else return null;
  }
  if (nones > 0) longas["list-style-type"] = "none";
  return longas;
}

function juntarPedacos(pedacos: string[]): string {
  return pedacos.join(" ").replace(/\s+,/g, ",").replace(/\s*\/\s*/g, " / ");
}

/**
 * Abre um atalho nos valores de cada propriedade longa. `longas` null quer
 * dizer que o motor não sabe separar (mas as propriedades afetadas são
 * conhecidas: `longasDe`). Palavras globais (inherit...) vão iguais para
 * todas.
 */
export function abrirAtalho(propriedade: string, valor: string): AtalhoAberto {
  const longasAfetadas = longasDe(propriedade);
  const texto = valor.trim();
  const global = texto.toLowerCase();
  if (PALAVRAS_GLOBAIS.has(global)) {
    return { validade: "valido", longas: porLongas(longasAfetadas, longasAfetadas.map(() => global)) };
  }
  if (/var\(/i.test(texto)) return { validade: "valido", longas: null };
  const pedacos = pedacosDoValor(texto);
  const invalido: AtalhoAberto = { validade: "invalido", longas: null };
  const naoSei: AtalhoAberto = { validade: "desconhecido", longas: null };
  const pronto = (longas: Record<string, string> | null): AtalhoAberto => (longas ? { validade: "valido", longas } : naoSei);

  switch (propriedade) {
    case "margin":
    case "padding":
    case "inset":
    case "border-width":
    case "border-style":
    case "border-color":
    case "scroll-margin":
    case "scroll-padding": {
      const lados = caixa(pedacos);
      if (!lados) return invalido;
      const longas = porLongas(longasAfetadas, lados);
      const checar = CHECADORES[longasAfetadas[0]];
      if (checar) {
        const resultado = combinar(lados.map(checar));
        if (resultado !== "valido") return { validade: resultado, longas: resultado === "invalido" ? null : longas };
      }
      return { validade: "valido", longas };
    }
    case "border-radius": {
      if (pedacos.includes("/")) return naoSei;
      const cantos = caixa(pedacos);
      if (!cantos) return invalido;
      const resultado = combinar(cantos.map(raioDeBorda));
      return resultado === "invalido" ? invalido : { validade: resultado, longas: porLongas(longasAfetadas, cantos) };
    }
    case "border":
    case "border-top":
    case "border-right":
    case "border-bottom":
    case "border-left":
    case "outline": {
      if (pedacos.length > 3) return invalido;
      const partes = partesDaBorda(pedacos);
      if (!partes) {
        return pedacos.some((pedaco) => ehCor(pedaco) === "desconhecido") ? naoSei : invalido;
      }
      if (propriedade === "border") {
        return pronto({
          ...Object.fromEntries(longasAfetadas.slice(0, 4).map((longa) => [longa, partes.largura])),
          ...Object.fromEntries(longasAfetadas.slice(4, 8).map((longa) => [longa, partes.estilo])),
          ...Object.fromEntries(longasAfetadas.slice(8, 12).map((longa) => [longa, partes.cor])),
        });
      }
      return pronto(porLongas(longasAfetadas, [partes.largura, partes.estilo, partes.cor]));
    }
    case "gap":
    case "grid-gap": {
      if (pedacos.length < 1 || pedacos.length > 2) return invalido;
      const [linha, coluna = pedacos[0]] = pedacos;
      const checar = CHECADORES["row-gap"];
      const resultado = combinar([checar(linha), checar(coluna)]);
      return resultado === "invalido" ? invalido : { validade: resultado, longas: { "row-gap": linha, "column-gap": coluna } };
    }
    case "overflow": {
      if (pedacos.length < 1 || pedacos.length > 2) return invalido;
      const [x, y = pedacos[0]] = pedacos;
      const resultado = combinar([CHECADORES["overflow-x"](x), CHECADORES["overflow-y"](y)]);
      return resultado === "invalido" ? invalido : { validade: resultado, longas: { "overflow-x": x, "overflow-y": y } };
    }
    case "place-items":
    case "place-content":
    case "place-self": {
      if (pedacos.length < 1 || pedacos.length > 2) return invalido;
      const [primeiro, segundo = pedacos[0]] = pedacos;
      return pronto(porLongas(longasAfetadas, [primeiro, segundo]));
    }
    case "flex-flow": {
      const longas: Record<string, string> = { "flex-direction": "row", "flex-wrap": "nowrap" };
      for (const pedaco of pedacos) {
        if (CHECADORES["flex-direction"](pedaco) === "valido") longas["flex-direction"] = pedaco;
        else if (CHECADORES["flex-wrap"](pedaco) === "valido") longas["flex-wrap"] = pedaco;
        else return invalido;
      }
      return pronto(longas);
    }
    case "flex":
      return pronto(abrirFlex(pedacos));
    case "font":
      return pronto(abrirFonte(pedacos));
    case "background":
      return pronto(abrirFundo(pedacos));
    case "background-position":
      return pedacos.length === 2 && !pedacos.includes(",")
        ? pronto({ "background-position-x": pedacos[0], "background-position-y": pedacos[1] })
        : naoSei;
    case "text-decoration":
      return pronto(abrirDecoracao(pedacos));
    case "list-style":
      return pronto(abrirListaDeEstilo(pedacos));
    case "margin-block":
    case "margin-inline":
    case "padding-block":
    case "padding-inline":
    case "inset-block":
    case "inset-inline": {
      if (pedacos.length < 1 || pedacos.length > 2) return invalido;
      const [inicio, fim = pedacos[0]] = pedacos;
      return pronto(porLongas(longasAfetadas, [inicio, fim]));
    }
    case "grid-row":
    case "grid-column": {
      const barra = pedacos.indexOf("/");
      const inicio = barra >= 0 ? juntarPedacos(pedacos.slice(0, barra)) : juntarPedacos(pedacos);
      const fim = barra >= 0 ? juntarPedacos(pedacos.slice(barra + 1)) : "auto";
      return pronto(porLongas(longasAfetadas, [inicio, fim]));
    }
    default:
      return naoSei;
  }
}

/* ------------------------------------------------------------------ */
/* Comparar valores                                                    */
/* ------------------------------------------------------------------ */

function normalizarPedaco(pedaco: string): string {
  if (/^["']/.test(pedaco)) {
    const dentro = pedaco.slice(1, -1);
    // Nome de fonte entre aspas vale o mesmo que sem aspas, se for uma palavra só.
    return /^[a-zA-Z_][a-zA-Z0-9_-]*( [a-zA-Z_][a-zA-Z0-9_-]*)*$/.test(dentro) ? dentro.toLowerCase() : pedaco;
  }
  const corLida = lerCor(pedaco);
  if (corLida) return `cor(${corLida.map((canal, indice) => (indice === 3 ? canal.toFixed(2) : Math.round(canal))).join(",")})`;
  const dimensao = lerDimensao(pedaco);
  if (dimensao && NUMERO.exec(pedaco)?.[0].length !== undefined) {
    const numero = Number(dimensao.numero.toFixed(4));
    if (numero === 0 && (dimensao.unidade === "" || UNIDADES.has(dimensao.unidade))) return "0";
    return `${numero}${dimensao.unidade}`;
  }
  const funcao = /^([a-zA-Z-]+)\(([\s\S]*)\)$/.exec(pedaco);
  if (funcao) {
    return `${funcao[1].toLowerCase()}(${pedacosDoValor(funcao[2]).map(normalizarPedaco).join(" ")})`;
  }
  return pedaco.toLowerCase();
}

/**
 * Forma normalizada de um valor, para comparar: espaços, maiúsculas,
 * cores em qualquer formato (red = #f00 = rgb(255, 0, 0)), números
 * (16.0px = 16px, 0px = 0) e aspas de nomes de fonte.
 */
export function normalizarValor(valor: string): string {
  return pedacosDoValor(valor.trim())
    .map(normalizarPedaco)
    .join(" ")
    .replace(/ , /g, ",");
}

export function valoresIguais(a: string, b: string): boolean {
  return normalizarValor(a) === normalizarValor(b);
}

/** Palavras que valem um número em certas propriedades (o Chrome mostra o número no Calculado). */
const SINONIMOS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  "font-weight": { normal: "400", bold: "700" },
};

/** Como `valoresIguais`, sabendo dos sinônimos da propriedade (bold = 700 em font-weight). */
export function valoresDaPropriedadeIguais(propriedade: string, a: string, b: string): boolean {
  const sinonimos = SINONIMOS[propriedade];
  const trocar = (valor: string) => (sinonimos ? (sinonimos[valor.trim().toLowerCase()] ?? valor) : valor);
  return valoresIguais(trocar(a), trocar(b));
}
