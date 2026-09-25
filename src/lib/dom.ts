/*
 * Utilitários de DOM que funcionam com nós de outro "realm" (o iframe do
 * site-alvo). instanceof Element não funciona entre janelas, então tudo
 * aqui compara nodeType.
 */

import { filhosVisiveis } from "@/motor/chaveArvore";

const ELEMENTO = 1;
const TEXTO = 3;
const COMENTARIO = 8;

export function ehElemento(no: unknown): no is Element {
  return typeof no === "object" && no !== null && (no as Node).nodeType === ELEMENTO;
}

export function ehTexto(no: unknown): no is Text {
  return typeof no === "object" && no !== null && (no as Node).nodeType === TEXTO;
}

export function ehComentario(no: unknown): no is Comment {
  return typeof no === "object" && no !== null && (no as Node).nodeType === COMENTARIO;
}

// O esquema das chaves da árvore mora no motor (e os testes Playwright usam
// as mesmas funções): ver src/motor/chaveArvore.ts.
export {
  ATRIBUTO_INJETADO,
  ATRIBUTO_MODO_DOCUMENTO,
  caminhoDoNo,
  chaveDoCaminho,
  ehDocumentoInteiro,
  ehNoVisivel,
  filhosVisiveis,
  marcarDocumentoInteiro,
  raizDaArvore,
} from "@/motor/chaveArvore";

export function noPeloCaminho(raiz: Element, caminho: readonly number[]): Node | null {
  let atual: Node = raiz;
  for (const indice of caminho) {
    const filho = filhosVisiveis(atual)[indice];
    if (!filho) return null;
    atual = filho;
  }
  return atual;
}
