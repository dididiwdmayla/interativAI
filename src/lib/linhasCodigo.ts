import { ehElemento } from "@/lib/dom";

function numeroDaLinha(texto: string, indice: number): number {
  let linha = 1;
  for (let posicao = 0; posicao < indice; posicao++) {
    if (texto.charCodeAt(posicao) === 10) linha++;
  }
  return linha;
}

/**
 * Linha do editor onde começa a tag de um elemento. Conta quantos elementos
 * com a mesma tag vêm antes dele no documento e acha a mesma ocorrência de
 * "<tag" no texto do editor.
 */
export function linhaDoElemento(texto: string, elemento: Element): number | null {
  const tag = elemento.tagName.toLowerCase();
  const documento = elemento.ownerDocument;
  if (tag === "body" || tag === "html") return 1;
  const mesmos = Array.from(documento.body.getElementsByTagName(tag));
  const ordem = mesmos.indexOf(elemento);
  if (ordem < 0) return null;
  const busca = new RegExp(`<${tag}(?=[\\s>/])`, "gi");
  let encontrado: RegExpExecArray | null;
  let contador = 0;
  while ((encontrado = busca.exec(texto)) !== null) {
    if (contador === ordem) return numeroDaLinha(texto, encontrado.index);
    contador++;
  }
  return null;
}

export function linhaDoNo(texto: string, no: Node): number | null {
  const elemento = ehElemento(no) ? no : no.parentNode;
  return ehElemento(elemento) ? linhaDoElemento(texto, elemento) : null;
}

/** Todas as linhas que contêm um trecho de texto. */
export function linhasComTexto(texto: string, trecho: string): number[] {
  const alvo = trecho.toLowerCase();
  return texto
    .split("\n")
    .map((linha, indice) => (linha.toLowerCase().includes(alvo) ? indice + 1 : 0))
    .filter((linha) => linha > 0);
}
