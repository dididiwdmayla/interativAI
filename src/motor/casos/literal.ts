/*
 * O que o aluno escreve num caso de teste, lido como VALOR (sem rodar
 * nada): números, textos entre aspas, true, false, null, listas [ ] e
 * objetos { }. A entrada é como os argumentos de uma chamada (`[8, 6]` ou
 * `10, 7`); a saída esperada é um valor só.
 *
 * Lido pela árvore do acorn (o mesmo leitor do executor), não por eval: o
 * caso não roda código do aluno, e o validador `casosDoAluno` compara os
 * argumentos com os casos de borda que a fase exige.
 */
import { type Node as NoAcorn, parseExpressionAt } from "acorn";
import type { ValorEsperado } from "../executor/tipos";

export type Leitura<T> = { ok: true; valor: T } | { ok: false; motivo: string };

const MOTIVO_GERAL = "use números, textos entre aspas, true, false, null, listas [ ] e objetos { }";

class ErroLiteral extends Error {}

type No = NoAcorn & Record<string, unknown>;

function valorDoNo(no: No): ValorEsperado {
  switch (no.type) {
    case "Literal": {
      const valor = no.value;
      if (no.regex || typeof valor === "bigint") throw new ErroLiteral(MOTIVO_GERAL);
      if (valor === null || typeof valor === "number" || typeof valor === "string" || typeof valor === "boolean") return valor;
      throw new ErroLiteral(MOTIVO_GERAL);
    }
    case "TemplateLiteral": {
      const expressoes = no.expressions as No[];
      const quasis = no.quasis as { value: { cooked: string | null } }[];
      if (expressoes.length) throw new ErroLiteral("texto com ${...} não vale aqui: escreva o valor pronto");
      return quasis.map((q) => q.value.cooked ?? "").join("");
    }
    case "UnaryExpression": {
      const operador = no.operator as string;
      const argumento = no.argument as No;
      if ((operador === "-" || operador === "+") && argumento.type === "Literal" && typeof argumento.value === "number") {
        return operador === "-" ? -argumento.value : argumento.value;
      }
      throw new ErroLiteral(MOTIVO_GERAL);
    }
    case "ArrayExpression": {
      const itens = no.elements as (No | null)[];
      return itens.map((item) => {
        if (!item || item.type === "SpreadElement") throw new ErroLiteral("lista com buraco ou ... não vale aqui");
        return valorDoNo(item);
      });
    }
    case "ObjectExpression": {
      const objeto: { [chave: string]: ValorEsperado } = {};
      for (const propriedade of no.properties as No[]) {
        if (propriedade.type !== "Property" || propriedade.computed || propriedade.kind !== "init" || propriedade.method) throw new ErroLiteral("objeto só com campos simples: { nome: valor }");
        const chave = propriedade.key as No;
        const nome = chave.type === "Identifier" ? (chave.name as string) : chave.type === "Literal" && (typeof chave.value === "string" || typeof chave.value === "number") ? String(chave.value) : null;
        if (nome === null) throw new ErroLiteral("objeto só com campos simples: { nome: valor }");
        if (propriedade.shorthand) throw new ErroLiteral(`o campo ${nome} precisa de um valor: { ${nome}: ... }`);
        objeto[nome] = valorDoNo(propriedade.value as No);
      }
      return objeto;
    }
    case "Identifier": {
      const nome = no.name as string;
      if (nome === "undefined") throw new ErroLiteral("undefined não vale como valor de caso: use null");
      if (nome === "NaN" || nome === "Infinity") throw new ErroLiteral(`${nome} não vale como valor de caso`);
      throw new ErroLiteral(`${nome} não é um valor: texto vai entre aspas ("${nome}")`);
    }
    default:
      throw new ErroLiteral(`isso é uma conta ou um comando: escreva o valor pronto (${MOTIVO_GERAL})`);
  }
}

/** Lê uma expressão inteira (sem sobrar nada depois). */
function lerExpressao(texto: string): No {
  const no = parseExpressionAt(texto, 0, { ecmaVersion: "latest" }) as No;
  if (texto.slice(no.end).trim() !== "") throw new ErroLiteral(`sobrou "${texto.slice(no.end).trim()}" depois do valor`);
  return no;
}

function comMotivo<T>(ler: () => T): Leitura<T> {
  try {
    return { ok: true, valor: ler() };
  } catch (erro) {
    if (erro instanceof ErroLiteral) return { ok: false, motivo: erro.message };
    return { ok: false, motivo: `não deu para ler (${MOTIVO_GERAL})` };
  }
}

/** Os argumentos de uma chamada: "10, 7" ou "[8, 6]" (vazio: nenhum argumento). */
export function lerArgumentos(texto: string): Leitura<ValorEsperado[]> {
  if (!texto.trim()) return { ok: true, valor: [] };
  return comMotivo(() => {
    const lista = lerExpressao(`[${texto}\n]`);
    if (lista.type !== "ArrayExpression") throw new ErroLiteral(MOTIVO_GERAL);
    return valorDoNo(lista) as ValorEsperado[];
  });
}

/** Um valor só (a saída esperada). */
export function lerValor(texto: string): Leitura<ValorEsperado> {
  if (!texto.trim()) return { ok: false, motivo: "escreva o que a função tem que devolver" };
  return comMotivo(() => valorDoNo(lerExpressao(texto.trim())));
}

/** Dois valores iguais (números com tolerância de arredondamento, listas e objetos pelo conteúdo). */
export function valoresIguais(a: ValorEsperado, b: ValorEsperado): boolean {
  if (typeof a === "number" && typeof b === "number") return a === b || Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b));
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return a === b;
  if (Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, i) => valoresIguais(item, b[i]));
  const chaves = Object.keys(a);
  return chaves.length === Object.keys(b).length && chaves.every((chave) => chave in b && valoresIguais(a[chave], b[chave]));
}
