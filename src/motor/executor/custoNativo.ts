/*
 * O custo escondido dos métodos nativos (o contador de passos e o gráfico de
 * Desempenho). O código do jogador conta um passo por comando; um método
 * nativo que trabalha por dentro (shift move todos os itens, includes
 * examina um por um) contaria 1. Aqui fica o trabalho que cada método faz
 * de verdade, em "passos escondidos", proporcionais ao tamanho:
 * - shift, unshift: o tamanho da lista (todos os itens se movem);
 * - splice: os itens movidos depois da posição, mais os inseridos e removidos;
 * - indexOf, includes, lastIndexOf: os itens examinados até achar (ou todos);
 * - slice, concat, join, reverse, fill, o espalhar (...), Array.from,
 *   Object.keys, values e entries, new Set(lista) e new Map(pares): os
 *   itens copiados ou percorridos;
 * - sort sem comparador: n x log2(n) (com comparador, as chamadas dele já
 *   contam como passos do código);
 * - map, filter, find, some, every, forEach, reduce...: um por item
 *   visitado (o callback conta os passos dele à parte);
 * - texto: includes e indexOf (até achar), split e replaceAll (o texto
 *   todo), repeat (o texto que sai).
 * push, pop, Map e Set (get, set, has, delete) e o acesso por índice ou
 * chave não têm custo escondido: o passo do comando já é o trabalho todo.
 *
 * Só as chamadas escritas no código do jogador entram (o instrumentador
 * troca `lista.shift()` por `__r.m(lista,"lista").shift()`), e só quando o
 * método é o nativo do reino: uma classe Fila com um shift próprio conta os
 * passos do próprio código. O custo é um modelo didático (o motor de
 * JavaScript tem atalhos), não uma medida de tempo.
 */

/** Quanto um método custou, depois de rodar. `antes`: o tamanho do receptor antes da chamada. */
type CustoDepois = (receptor: unknown, args: readonly unknown[], resultado: unknown, antes: number) => number;

export type CustoNativo =
  /** O custo sai do receptor, dos argumentos e do resultado. */
  | { nome: string; tipo: "medido"; custo: CustoDepois }
  /** Um passo por chamada do callback (o item visitado). */
  | { nome: string; tipo: "visita" };

type Reino = {
  arrayProto: Record<string, unknown>;
  stringProto: Record<string, unknown>;
  Array: Record<string, unknown>;
  Object: Record<string, unknown>;
};

/** Os nomes de método que o instrumentador embrulha (as chamadas `x.nome(...)`). */
export const METODOS_COM_CUSTO: ReadonlySet<string> = new Set([
  "shift",
  "unshift",
  "splice",
  "indexOf",
  "lastIndexOf",
  "includes",
  "slice",
  "concat",
  "join",
  "reverse",
  "fill",
  "sort",
  "map",
  "filter",
  "find",
  "findIndex",
  "findLast",
  "findLastIndex",
  "some",
  "every",
  "forEach",
  "reduce",
  "reduceRight",
  "flatMap",
  "split",
  "repeat",
  "replaceAll",
  "from",
  "keys",
  "values",
  "entries",
]);

/** O nome do custo do espalhar (`...lista`). */
export const NOME_ESPALHAR = "...";

const tamanhoDe = (valor: unknown): number => {
  if (typeof valor === "string") return valor.length;
  if (Array.isArray(valor)) return valor.length;
  return 0;
};

/** Uma posição relativa (como slice, splice e fill leem): negativa conta do fim. */
function posicao(valor: unknown, tamanho: number, padrao: number): number {
  if (valor === undefined) return padrao;
  const n = Math.trunc(Number(valor)) || 0;
  return n < 0 ? Math.max(tamanho + n, 0) : Math.min(n, tamanho);
}

/** n x log2(n), arredondado para cima: as comparações de uma boa ordenação. */
export function custoDeOrdenar(n: number): number {
  return n < 2 ? 0 : Math.ceil(n * Math.log2(n));
}

/**
 * A tabela dos métodos nativos do reino: a função nativa vira o custo dela.
 * `indexOfNativo`: o indexOf de lista do reino (o includes descobre onde achou).
 */
export function tabelaDeCustos(reino: Reino): Map<unknown, CustoNativo> {
  const tabela = new Map<unknown, CustoNativo>();
  const a = reino.arrayProto;
  const s = reino.stringProto;
  const indexOfLista = a.indexOf as (this: unknown, item: unknown) => number;
  const indexOfTexto = s.indexOf as (this: unknown, item: unknown) => number;
  const medido = (alvo: Record<string, unknown>, metodo: string, custo: CustoDepois, nome = metodo) => {
    if (typeof alvo[metodo] === "function") tabela.set(alvo[metodo], { nome, tipo: "medido", custo });
  };
  const resultado: CustoDepois = (_r, _args, res) => tamanhoDe(res);
  const receptor: CustoDepois = (_r, _args, _res, antes) => antes;

  // Listas
  medido(a, "shift", receptor);
  medido(a, "unshift", (r) => tamanhoDe(r));
  medido(a, "splice", (_r, args, res, antes) => {
    if (!args.length) return 0;
    const inicio = posicao(args[0], antes, 0);
    const removidos = tamanhoDe(res);
    const inseridos = Math.max(0, args.length - 2);
    return Math.max(0, antes - inicio - removidos) + inseridos + removidos;
  });
  medido(a, "indexOf", (_r, _args, res, antes) => (typeof res === "number" && res >= 0 ? res + 1 : antes));
  medido(a, "lastIndexOf", (_r, _args, res, antes) => (typeof res === "number" && res >= 0 ? antes - res : antes));
  medido(a, "includes", (r, args, res, antes) => {
    if (res !== true) return antes;
    const onde = indexOfLista.call(r, args[0]);
    return onde >= 0 ? onde + 1 : antes; // NaN: includes acha, indexOf não
  });
  medido(a, "slice", resultado);
  medido(a, "concat", resultado);
  medido(a, "join", receptor);
  medido(a, "reverse", receptor);
  medido(a, "fill", (_r, args, _res, antes) => Math.max(0, posicao(args[2], antes, antes) - posicao(args[1], antes, 0)));
  medido(a, "sort", (_r, args, _res, antes) => (args[0] === undefined ? custoDeOrdenar(antes) : 0));
  for (const metodo of ["map", "filter", "find", "findIndex", "findLast", "findLastIndex", "some", "every", "forEach", "reduce", "reduceRight", "flatMap"]) {
    if (typeof a[metodo] === "function") tabela.set(a[metodo], { nome: metodo, tipo: "visita" });
  }

  // Textos
  const achouNoTexto: CustoDepois = (r, args, res, antes) => {
    const onde = typeof res === "number" ? res : res === true ? indexOfTexto.call(r, args[0]) : -1;
    return onde >= 0 ? Math.min(antes, onde + String(args[0]).length) : antes;
  };
  medido(s, "includes", achouNoTexto);
  medido(s, "indexOf", achouNoTexto);
  medido(s, "split", receptor);
  medido(s, "replaceAll", receptor);
  medido(s, "repeat", resultado);

  // Funções de Array e Object
  medido(reino.Array, "from", resultado, "Array.from");
  medido(reino.Object, "keys", resultado, "Object.keys");
  medido(reino.Object, "values", resultado, "Object.values");
  medido(reino.Object, "entries", resultado, "Object.entries");
  return tabela;
}

/** O tamanho do receptor antes da chamada (listas e textos). */
export function tamanhoAntes(receptor: unknown): number {
  return tamanhoDe(receptor);
}

/** Quantos itens o espalhar percorre: lista, texto, Map e Set pelo tamanho; objeto, pelos campos. */
export function custoDoEspalhar(valor: unknown, marca: string): number {
  if (typeof valor === "string" || Array.isArray(valor)) return valor.length;
  if (marca === "[object Map]" || marca === "[object Set]") return (valor as { size: number }).size;
  if (typeof valor === "object" && valor !== null && typeof (valor as { [Symbol.iterator]?: unknown })[Symbol.iterator] !== "function") return Object.keys(valor).length;
  return 0;
}

/** "500.500 escondidos em shift" (o método que mais pesou primeiro). */
export function metodosQueMaisPesaram(porMetodo: Readonly<Record<string, number>>, quantos = 2): string[] {
  return Object.entries(porMetodo)
    .filter(([, n]) => n > 0)
    .sort((x, y) => y[1] - x[1])
    .slice(0, quantos)
    .map(([nome]) => nome);
}
