/*
 * Como o Console do Chrome escreve os valores, em texto. Conferido no
 * devtools-frontend (ConsoleViewMessage.ts, RemoteObjectPreviewFormatter.ts e
 * StringUtilities.formatAsJSLiteral):
 * - resposta de uma expressão: texto entre aspas simples ('oi'), preferindo a
 *   aspa que não precisa de escape;
 * - console.log com o primeiro argumento texto: é o "formato" (%s, %d, %i,
 *   %f, %o, %O, %c) e os textos seguintes saem sem aspas; senão, os textos
 *   saem entre aspas (console.log(1, 'a') mostra 1 'a');
 * - lista: "(3) [1, 2, 3]" (o tamanho só com mais de um item); dentro de
 *   outra prévia, "Array(3)";
 * - objeto: "{nome: 'Ana', idade: 30}" (com o nome da classe na frente, se
 *   não for Object); dentro de outra prévia, "{…}"; até 5 campos, depois ", …";
 * - Map e Set: "Map(2) {'a' => 1, 'b' => 2}", "Set(2) {1, 2}";
 * - função: "ƒ soma(a, b) {...}" (a palavra function vira ƒ); arrow como
 *   foi escrita; dentro de prévia, só "ƒ".
 */
import type { ValorEsperado, ValorExibido } from "./tipos";

const CAMPOS_NA_PREVIA = 5;
const ITENS_NA_PREVIA = 100;

const ESCAPES: Record<string, string> = { "\n": "\\n", "\r": "\\r", "\t": "\\t", "\b": "\\b", "\f": "\\f", "\v": "\\v", "\\": "\\\\" };

function escapar(conteudo: string, aspa: string): string {
  let saida = "";
  for (const letra of conteudo) {
    if (ESCAPES[letra]) saida += ESCAPES[letra];
    else if (letra === aspa) saida += `\\${aspa}`;
    else {
      const codigo = letra.codePointAt(0) ?? 0;
      saida += codigo < 0x20 ? `\\x${codigo.toString(16).padStart(2, "0")}` : letra;
    }
  }
  return saida;
}

/** Texto como literal de JavaScript: 'oi', "it's", `a'b"c`. */
export function literalJs(conteudo: string): string {
  if (!conteudo.includes("'")) return `'${escapar(conteudo, "'")}'`;
  if (!conteudo.includes('"')) return `"${escapar(conteudo, '"')}"`;
  if (!conteudo.includes("`") && !conteudo.includes("${")) return `\`${escapar(conteudo, "`")}\``;
  return `'${escapar(conteudo, "'")}'`;
}

function nomeDoCampo(nome: string): string {
  return /^\s|\s$|^$|\n/.test(nome) ? `"${nome.replace(/\n/g, "↵")}"` : nome;
}

/** O texto de uma função, como o Console mostra quando ela é a resposta ou o argumento. */
export function textoDaFuncao(v: Extract<ValorExibido, { t: "funcao" }>): string {
  if (v.classe) return v.texto;
  if (v.seta) return v.texto;
  if (v.texto.startsWith("function")) return `ƒ${v.texto.slice("function".length)}`;
  // Método de objeto ou de classe: "somar(a) {...}".
  return `ƒ ${v.texto}`;
}

/**
 * Prévia de um valor. `dentro` = já está dentro de outra prévia (o Chrome
 * abrevia: "{…}", "Array(3)", "ƒ").
 */
export function textoPrevia(v: ValorExibido, dentro = false): string {
  switch (v.t) {
    case "undefined":
      return "undefined";
    case "null":
      return "null";
    case "boolean":
      return String(v.v);
    case "number":
      return v.v;
    case "bigint":
      return `${v.v}n`;
    case "symbol":
      return v.v;
    case "string":
      return literalJs(v.v);
    case "array": {
      if (dentro) return `Array(${v.tamanho})`;
      const itens = v.itens.slice(0, ITENS_NA_PREVIA).map((item) => textoPrevia(item, true));
      const sobra = v.cortado || v.tamanho > itens.length;
      const tamanho = v.tamanho > 1 ? `(${v.tamanho}) ` : "";
      return `${tamanho}[${itens.join(", ")}${sobra ? (itens.length ? ", …" : "…") : ""}]`;
    }
    case "objeto": {
      const classe = v.classe && v.classe !== "Object" ? v.classe : null;
      if (dentro) return classe ?? "{…}";
      const campos = v.entradas.slice(0, CAMPOS_NA_PREVIA).map(([nome, valor]) => `${nomeDoCampo(nome)}: ${textoPrevia(valor, true)}`);
      const sobra = v.cortado || v.entradas.length > campos.length;
      return `${classe ? `${classe} ` : ""}{${campos.join(", ")}${sobra ? (campos.length ? ", …" : "…") : ""}}`;
    }
    case "map": {
      if (dentro) return `Map(${v.tamanho})`;
      const pares = v.entradas.slice(0, CAMPOS_NA_PREVIA).map(([chave, valor]) => `${textoPrevia(chave, true)} => ${textoPrevia(valor, true)}`);
      return `Map(${v.tamanho}) {${pares.join(", ")}${v.tamanho > pares.length ? ", …" : ""}}`;
    }
    case "set": {
      if (dentro) return `Set(${v.tamanho})`;
      const itens = v.itens.slice(0, CAMPOS_NA_PREVIA).map((item) => textoPrevia(item, true));
      return `Set(${v.tamanho}) {${itens.join(", ")}${v.tamanho > itens.length ? ", …" : ""}}`;
    }
    case "funcao":
      return dentro ? "ƒ" : textoDaFuncao(v);
    case "erro":
      return v.mensagem ? `${v.nome}: ${v.mensagem}` : v.nome;
    case "data":
      return v.texto;
    case "fundo":
      return v.resumo;
  }
}

/** A resposta do Console a uma expressão (texto entre aspas; o resto, prévia). */
export function textoDoResultado(v: ValorExibido): string {
  return textoPrevia(v, false);
}

/** Um argumento de console.log: texto sem aspas quando a mensagem começa com texto. */
function textoDoArgumento(v: ValorExibido, formato: boolean): string {
  if (v.t === "string" && formato) return v.v;
  return textoPrevia(v, false);
}

function numeroDe(v: ValorExibido): number {
  if (v.t === "number") return Number(v.v);
  if (v.t === "string") return Number(v.v);
  if (v.t === "boolean") return v.v ? 1 : 0;
  return Number.NaN;
}

/** A linha que console.log(...partes) escreve, em texto. */
export function textoDaSaida(partes: readonly ValorExibido[], formato: boolean): string {
  if (!partes.length) return "";
  const resto = [...partes];
  let inicio = "";
  if (formato && resto[0].t === "string") {
    const primeiro = resto.shift() as Extract<ValorExibido, { t: "string" }>;
    inicio = primeiro.v.replace(/%([sdifoOc%])/g, (inteiro, letra: string) => {
      if (letra === "%") return "%";
      if (!resto.length) return inteiro;
      const arg = resto.shift() as ValorExibido;
      switch (letra) {
        case "s":
          return arg.t === "string" ? arg.v : textoPrevia(arg, true);
        case "d":
        case "i": {
          const n = numeroDe(arg);
          return String(Number.isNaN(n) ? Number.NaN : Math.trunc(n));
        }
        case "f":
          return String(numeroDe(arg));
        case "c":
          return "";
        default:
          return textoPrevia(arg, false);
      }
    });
    if (!resto.length) return inicio;
    return `${inicio} ${resto.map((p) => textoDoArgumento(p, true)).join(" ")}`;
  }
  return resto.map((p) => textoDoArgumento(p, formato)).join(" ");
}

/** Um valor exibido é igual ao esperado (JSON)? Números com tolerância de arredondamento. */
export function valorIgual(obtido: ValorExibido | null, esperado: ValorEsperado): boolean {
  if (!obtido) return false;
  if (esperado === null) return obtido.t === "null";
  if (typeof esperado === "boolean") return obtido.t === "boolean" && obtido.v === esperado;
  if (typeof esperado === "number") {
    if (obtido.t !== "number") return false;
    const n = Number(obtido.v);
    return n === esperado || Math.abs(n - esperado) < 1e-9 * Math.max(1, Math.abs(esperado));
  }
  if (typeof esperado === "string") return obtido.t === "string" && obtido.v === esperado;
  if (Array.isArray(esperado)) {
    return (
      obtido.t === "array" && !obtido.cortado && obtido.tamanho === esperado.length && esperado.every((item, i) => valorIgual(obtido.itens[i] ?? null, item))
    );
  }
  if (obtido.t !== "objeto" || obtido.cortado) return false;
  const chaves = Object.keys(esperado);
  if (chaves.length !== obtido.entradas.length) return false;
  const campos = new Map(obtido.entradas);
  return chaves.every((chave) => campos.has(chave) && valorIgual(campos.get(chave) ?? null, esperado[chave]));
}

/** O valor esperado escrito como o Console mostraria (para mensagens das checagens e do jogo). */
export function textoDoEsperado(esperado: ValorEsperado): string {
  if (esperado === null) return "null";
  if (typeof esperado === "string") return literalJs(esperado);
  if (typeof esperado !== "object") return String(esperado);
  if (Array.isArray(esperado)) return `[${esperado.map(textoDoEsperado).join(", ")}]`;
  return `{${Object.entries(esperado)
    .map(([k, v]) => `${nomeDoCampo(k)}: ${textoDoEsperado(v)}`)
    .join(", ")}}`;
}
