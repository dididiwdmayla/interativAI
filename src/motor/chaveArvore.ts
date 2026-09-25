/*
 * Esquema do `data-chave` de cada linha da árvore de elementos.
 *
 * - A chave é o caminho de índices do <body> até o nó, separado por ponto.
 *   O próprio <body> é "body"; o primeiro filho dele é "0"; o segundo filho
 *   do primeiro filho é "0.1".
 * - Os índices contam os filhos que APARECEM na árvore: elementos,
 *   comentários e textos que não são só espaço. Espaços e quebras de linha
 *   entre as tags não contam.
 * - Um texto também tem chave: em <li>Sonho</li>, se o li é "5", o texto
 *   "Sonho" é "5.0" (é nele que a árvore edita o texto).
 *
 * Este arquivo NÃO importa nada de propósito: os testes Playwright
 * (testes/util.mjs, `selecionarNo`) mandam o código dele para dentro da
 * página e calculam a chave com as MESMAS funções que a árvore usa.
 */

const NO_ELEMENTO = 1;
const NO_TEXTO = 3;
const NO_COMENTARIO = 8;

/** Nós que aparecem na árvore: elementos, comentários e textos que não são só espaço. */
export function ehNoVisivel(no: Node): boolean {
  if (no.nodeType === NO_ELEMENTO || no.nodeType === NO_COMENTARIO) return true;
  if (no.nodeType === NO_TEXTO) return (no.nodeValue ?? "").trim().length > 0;
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

export function chaveDoCaminho(caminho: readonly number[]): string {
  return caminho.length === 0 ? "body" : caminho.join(".");
}

/** A chave de um nó (elemento, texto ou comentário), ou null se não estiver no body. */
export function chaveDoNo(body: Element, no: Node): string | null {
  const caminho = caminhoDoNo(body, no);
  return caminho ? chaveDoCaminho(caminho) : null;
}

/** A chave do PRIMEIRO elemento que casa com o seletor, ou null se nada casar. */
export function chaveDoSeletor(documento: Document, seletor: string): string | null {
  const elemento = documento.body?.querySelector(seletor);
  return elemento && documento.body ? chaveDoNo(documento.body, elemento) : null;
}
