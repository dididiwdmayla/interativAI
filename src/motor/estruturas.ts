/*
 * Estruturas no palco (zona Estruturas de dados e Algoritmos essenciais):
 * - como uma lista mudou de um passo para o outro: entrou ou saiu pelo fim
 *   (push, pop) ou pelo começo (unshift, shift), e quais posições foram
 *   escritas ou trocaram de valor (a troca da ordenação). É assim que o
 *   palco anima os vagões entrando e saindo pelo lado certo e acende a
 *   troca;
 * - a forma de uma variável ao longo da execução: pilha (entra e sai pelo
 *   mesmo lado), fila (entra por um lado e sai pelo outro) ou árvore (um
 *   objeto com filhos objetos), para o validador `formaDaEstrutura`;
 * - a árvore desenhável de um objeto aninhado ("ver como árvore").
 * Puro (sem React).
 */
import type { FotoMemoria, ObjetoMemoria, PassoRastro, ValorMemoria } from "./executor/tipos";
import type { NoPalco } from "./palco";

export type MovimentoLista = {
  entraramInicio: number;
  entraramFim: number;
  sairamInicio: number;
  sairamFim: number;
  /** Posições (na lista de agora) que mudaram de valor sem entrar nem sair. */
  escritos: number[];
  /** Duas posições que trocaram de valor entre si (o "swap" da ordenação). */
  troca: [number, number] | null;
};

const iguais = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

/**
 * Como a lista mudou, comparando os itens (em texto). Entrar pelo fim é o
 * push; pelo começo, o unshift; sair pelo fim é o pop; pelo começo, o shift.
 */
export function movimentoDaLista(antes: readonly string[], depois: readonly string[]): MovimentoLista {
  const movimento: MovimentoLista = { entraramInicio: 0, entraramFim: 0, sairamInicio: 0, sairamFim: 0, escritos: [], troca: null };
  const n0 = antes.length;
  const n1 = depois.length;
  if (n1 > n0) {
    if (iguais(antes, depois.slice(0, n0))) return { ...movimento, entraramFim: n1 - n0 };
    if (iguais(antes, depois.slice(n1 - n0))) return { ...movimento, entraramInicio: n1 - n0 };
  } else if (n1 < n0) {
    if (iguais(depois, antes.slice(0, n1))) return { ...movimento, sairamFim: n0 - n1 };
    if (iguais(depois, antes.slice(n0 - n1))) return { ...movimento, sairamInicio: n0 - n1 };
  }
  const comum = Math.min(n0, n1);
  for (let i = 0; i < comum; i += 1) if (antes[i] !== depois[i]) movimento.escritos.push(i);
  if (n1 > n0) movimento.entraramFim = n1 - n0;
  if (n1 < n0) movimento.sairamFim = n0 - n1;
  if (n0 === n1 && movimento.escritos.length === 2) {
    const [a, b] = movimento.escritos;
    if (antes[a] === depois[b] && antes[b] === depois[a]) movimento.troca = [a, b];
  }
  return movimento;
}

/* ------------------------------------------------------------------ */
/* Pilha, fila e árvore ao longo da execução                           */
/* ------------------------------------------------------------------ */

export type ContagemEstrutura = { entraramInicio: number; entraramFim: number; sairamInicio: number; sairamFim: number };

export type FormaDaEstrutura = "pilha" | "fila" | "arvore";

function itensDaLista(valor: ValorMemoria | undefined, monte: FotoMemoria["monte"]): { id: number; itens: string[] } | null {
  if (valor?.t !== "ref") return null;
  const objeto = monte[String(valor.id)];
  return objeto?.t === "array" ? { id: valor.id, itens: objeto.itens.map((item) => JSON.stringify(item)) } : null;
}

/**
 * Para cada variável global que guarda uma lista, quantos itens entraram e
 * saíram por cada lado, passo a passo (a lista é a mesma: mesmo id). A foto
 * de cada passo é a de ANTES da linha rodar: a memória final fecha a conta.
 */
export function contarEstruturas(passos: readonly PassoRastro[], memoriaFinal: FotoMemoria | null = null): Record<string, ContagemEstrutura> {
  const contagens: Record<string, ContagemEstrutura> = {};
  const fotos = [...passos.map((p) => p.memoria), ...(memoriaFinal ? [memoriaFinal] : [])];
  for (let k = 1; k < fotos.length; k += 1) {
    const antes = fotos[k - 1];
    const depois = fotos[k];
    const globaisAntes = antes.quadros[0]?.escopos.find((e) => e.tipo === "global")?.variaveis ?? [];
    const globaisDepois = depois.quadros[0]?.escopos.find((e) => e.tipo === "global")?.variaveis ?? [];
    for (const variavel of globaisDepois) {
      const agora = itensDaLista(variavel.valor, depois.monte);
      const antiga = itensDaLista(globaisAntes.find((v) => v.nome === variavel.nome)?.valor, antes.monte);
      if (!agora || !antiga || agora.id !== antiga.id) continue;
      const m = movimentoDaLista(antiga.itens, agora.itens);
      if (!m.entraramFim && !m.entraramInicio && !m.sairamFim && !m.sairamInicio) continue;
      const atual = (contagens[variavel.nome] ??= { entraramInicio: 0, entraramFim: 0, sairamInicio: 0, sairamFim: 0 });
      atual.entraramInicio += m.entraramInicio;
      atual.entraramFim += m.entraramFim;
      atual.sairamInicio += m.sairamInicio;
      atual.sairamFim += m.sairamFim;
    }
  }
  return contagens;
}

/** Soma as contagens de várias execuções. */
export function somarContagens(lista: readonly ContagemEstrutura[]): ContagemEstrutura {
  return lista.reduce(
    (soma, c) => ({
      entraramInicio: soma.entraramInicio + c.entraramInicio,
      entraramFim: soma.entraramFim + c.entraramFim,
      sairamInicio: soma.sairamInicio + c.sairamInicio,
      sairamFim: soma.sairamFim + c.sairamFim,
    }),
    { entraramInicio: 0, entraramFim: 0, sairamInicio: 0, sairamFim: 0 },
  );
}

/** Pilha: entra e sai pelo mesmo lado. Fila: entra por um lado e sai pelo outro. */
export function formaPelasContagens(c: ContagemEstrutura): "pilha" | "fila" | null {
  const noFim = c.entraramFim + c.sairamFim;
  const noInicio = c.entraramInicio + c.sairamInicio;
  const entrou = c.entraramFim + c.entraramInicio > 0;
  const saiu = c.sairamFim + c.sairamInicio > 0;
  if (!entrou || !saiu) return null;
  if ((noFim > 0 && noInicio === 0) || (noInicio > 0 && noFim === 0)) return "pilha";
  if ((c.entraramFim > 0 && c.sairamInicio > 0 && c.entraramInicio === 0 && c.sairamFim === 0) || (c.entraramInicio > 0 && c.sairamFim > 0 && c.entraramFim === 0 && c.sairamInicio === 0)) return "fila";
  return null;
}

/** Os filhos objetos de um objeto (campos que são objetos ou listas de objetos). */
function filhosObjetos(objeto: ObjetoMemoria, monte: FotoMemoria["monte"]): number[] {
  if (objeto.t !== "objeto") return [];
  const filhos: number[] = [];
  for (const [, valor] of objeto.entradas) {
    if (valor.t !== "ref") continue;
    const alvo = monte[String(valor.id)];
    if (alvo?.t === "objeto") filhos.push(valor.id);
    if (alvo?.t === "array") for (const item of alvo.itens) if (item.t === "ref" && monte[String(item.id)]?.t === "objeto") filhos.push(item.id);
  }
  return filhos;
}

/** A variável global é uma árvore: um objeto com pelo menos um filho objeto. */
export function ehArvore(memoria: FotoMemoria | null, nome: string): boolean {
  const variavel = memoria?.quadros[0]?.escopos.find((e) => e.tipo === "global")?.variaveis.find((v) => v.nome === nome);
  if (!memoria || variavel?.valor.t !== "ref") return false;
  const objeto = memoria.monte[String(variavel.valor.id)];
  return objeto !== undefined && filhosObjetos(objeto, memoria.monte).length > 0;
}

/* ------------------------------------------------------------------ */
/* A árvore desenhável ("ver como árvore")                             */
/* ------------------------------------------------------------------ */

export type NoArvore = { id: number; rotulo: string; detalhe: string | null; filhos: NoArvore[] };

const CAMPOS_DE_ROTULO = ["nome", "valor", "texto", "titulo", "rotulo", "tag", "id"];

function textoCurto(no: NoPalco): string | null {
  if (no.t !== "primitivo") return null;
  const v = no.valor;
  if (v.t === "string") return v.v.length > 18 ? `${v.v.slice(0, 17)}…` : v.v;
  if (v.t === "number" || v.t === "boolean" || v.t === "bigint") return String(v.v);
  if (v.t === "null" || v.t === "undefined") return v.t;
  return null;
}

/** O objeto como árvore: o rótulo é o nome (ou valor, texto...), os filhos são os campos que guardam objetos. */
export function arvoreDoNo(no: NoPalco, limite = { nos: 40 }, profundidade = 0): NoArvore | null {
  if (no.t !== "ficha" || limite.nos <= 0 || profundidade > 6) return null;
  limite.nos -= 1;
  const primitivos = no.campos.flatMap(([chave, valor]) => {
    const texto = textoCurto(valor);
    return texto === null ? [] : [[chave, texto] as const];
  });
  const preferido = CAMPOS_DE_ROTULO.map((c) => primitivos.find(([chave]) => chave === c)).find(Boolean) ?? primitivos[0];
  const outro = primitivos.find((p) => p !== preferido);
  const filhos: NoArvore[] = [];
  for (const [, valor] of no.campos) {
    if (valor.t === "ficha") {
      const filho = arvoreDoNo(valor, limite, profundidade + 1);
      if (filho) filhos.push(filho);
    } else if (valor.t === "lista") {
      for (const item of valor.itens) {
        const filho = arvoreDoNo(item, limite, profundidade + 1);
        if (filho) filhos.push(filho);
      }
    }
  }
  return { id: no.id, rotulo: preferido ? preferido[1] : "objeto", detalhe: outro ? `${outro[0]}: ${outro[1]}` : null, filhos };
}

/** O valor tem jeito de árvore (objeto com filhos objetos): mostra o botão "Ver como árvore". */
export function temFormaDeArvore(no: NoPalco): boolean {
  const arvore = arvoreDoNo(no);
  return arvore !== null && arvore.filhos.length > 0;
}

/** Os objetos que a função de agora está olhando (as variáveis do quadro de cima): o nó visitado aceso. */
export function objetosDoQuadroDeCima(foto: FotoMemoria | null): Set<number> {
  const ids = new Set<number>();
  if (!foto || foto.quadros.length < 2) return ids;
  const topo = foto.quadros[foto.quadros.length - 1];
  for (const escopo of topo.escopos) for (const v of escopo.variaveis) if (v.valor.t === "ref") ids.add(v.valor.id);
  return ids;
}
