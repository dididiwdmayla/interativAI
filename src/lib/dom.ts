/*
 * Utilitários de DOM que funcionam com nós de outro "realm" (o iframe do
 * site-alvo). instanceof Element não funciona entre janelas, então tudo
 * aqui compara nodeType.
 */

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

/** Nós que aparecem na árvore: elementos, comentários e textos que não são só espaço. */
export function ehNoVisivel(no: Node): boolean {
  if (ehElemento(no) || ehComentario(no)) return true;
  if (ehTexto(no)) return (no.nodeValue ?? "").trim().length > 0;
  return false;
}

export function filhosVisiveis(no: Node): Node[] {
  return Array.from(no.childNodes).filter(ehNoVisivel);
}

/** Caminho de índices (entre filhos visíveis) do body até o nó. */
export function caminhoDoNo(body: Element, no: Node): number[] | null {
  const caminho: number[] = [];
  let atual: Node | null = no;
  while (atual && atual !== body) {
    const pai: Node | null = atual.parentNode;
    if (!pai) return null;
    const indice = filhosVisiveis(pai).indexOf(atual);
    if (indice < 0) return null;
    caminho.unshift(indice);
    atual = pai;
  }
  return atual === body ? caminho : null;
}

export function noPeloCaminho(body: Element, caminho: readonly number[]): Node | null {
  let atual: Node = body;
  for (const indice of caminho) {
    const filho = filhosVisiveis(atual)[indice];
    if (!filho) return null;
    atual = filho;
  }
  return atual;
}

export function chaveDoCaminho(caminho: readonly number[]): string {
  return caminho.length === 0 ? "body" : caminho.join(".");
}
