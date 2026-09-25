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
 * - No modo documento (fase com `modoDocumento`), a raiz da árvore é o
 *   <html>, não o <body>: o head é "0" e o body, "1". A chave da raiz
 *   continua "body" (é só um nome interno; ninguém vê).
 * - Os estilos que o jogo põe na página (a regra do esconder, a folha
 *   editável no modo documento) têm `data-jogo-injetado` e não aparecem.
 *
 * Este arquivo NÃO importa nada de propósito: os testes Playwright
 * (testes/util.mjs, `selecionarNo`) mandam o código dele para dentro da
 * página e calculam a chave com as MESMAS funções que a árvore usa.
 */

const NO_ELEMENTO = 1;
const NO_TEXTO = 3;
const NO_COMENTARIO = 8;

/** Marca os elementos que o jogo põe na página e que a árvore não mostra. */
export const ATRIBUTO_INJETADO = "data-jogo-injetado";

/** Marca o <iframe> da prévia quando a fase edita o documento inteiro. */
export const ATRIBUTO_MODO_DOCUMENTO = "data-modo-documento";

/** Documentos soltos (testes, simulação) em modo documento. */
const DOCUMENTOS_INTEIROS = new WeakSet<Document>();

/** Diz que este documento solto é editado inteiro (a raiz da árvore vira o <html>). */
export function marcarDocumentoInteiro(documento: Document): void {
  DOCUMENTOS_INTEIROS.add(documento);
}

/** O documento é editado inteiro (modo documento)? */
export function ehDocumentoInteiro(documento: Document): boolean {
  if (DOCUMENTOS_INTEIROS.has(documento)) return true;
  try {
    return documento.defaultView?.frameElement?.hasAttribute(ATRIBUTO_MODO_DOCUMENTO) ?? false;
  } catch {
    return false;
  }
}

/** A raiz da árvore: o <body> ou, no modo documento, o <html>. */
export function raizDaArvore(documento: Document): Element | null {
  return ehDocumentoInteiro(documento) ? documento.documentElement : documento.body;
}

/** Nós que aparecem na árvore: elementos, comentários e textos que não são só espaço. */
export function ehNoVisivel(no: Node): boolean {
  if (no.nodeType === NO_ELEMENTO) return !(no as Element).hasAttribute(ATRIBUTO_INJETADO);
  if (no.nodeType === NO_COMENTARIO) return true;
  if (no.nodeType === NO_TEXTO) return (no.nodeValue ?? "").trim().length > 0;
  return false;
}

export function filhosVisiveis(no: Node): Node[] {
  return Array.from(no.childNodes).filter(ehNoVisivel);
}

/** Caminho de índices (entre filhos visíveis) da raiz (o body, ou o html no modo documento) até o nó. */
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
  const raiz = raizDaArvore(documento);
  if (!raiz) return null;
  const elemento = raiz.matches(seletor) ? raiz : raiz.querySelector(seletor);
  return elemento ? chaveDoNo(raiz, elemento) : null;
}
