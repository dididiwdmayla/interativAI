/*
 * Caminho "só de elementos": índices entre os filhos que são elementos,
 * ignorando textos e comentários. É a ponte entre o código do editor e o
 * DOM do iframe, porque os dois lados contam elementos do mesmo jeito,
 * enquanto textos (entidades, espaços) e comentários variam.
 */
import { ehDocumentoInteiro, ehElemento } from "./dom";

export type AlvoCodigo = {
  /** Índices entre filhos-elemento, a partir do body (no modo documento, do documento: o html é o 0). */
  caminho: number[];
  /** Tag de cada passo do caminho, em minúsculas, para conferir os dois lados. */
  tags: string[];
};

/**
 * De onde o código conta os caminhos: o body (o editor mostra só o de
 * dentro dele) ou, no modo documento, o próprio documento (o editor mostra
 * o <html> inteiro, e ele é o primeiro elemento do código).
 */
export function raizDoCodigo(documento: Document): Element | Document {
  return ehDocumentoInteiro(documento) ? documento : documento.body;
}

/** Caminho de um elemento do iframe, ou null se ele não estiver dentro da raiz. */
export function alvoDoElemento(raiz: Element | Document, elemento: Element): AlvoCodigo | null {
  const caminho: number[] = [];
  const tags: string[] = [];
  let atual: Element | Document | null = elemento;
  while (atual && atual !== raiz) {
    const pai: Element | Document | null = (atual as Element).parentNode as Element | Document | null;
    if (!pai) return null;
    caminho.unshift(Array.prototype.indexOf.call(pai.children, atual) as number);
    tags.unshift((atual as Element).tagName.toLowerCase());
    atual = pai;
  }
  return atual === raiz ? { caminho, tags } : null;
}

/** Elemento do iframe para um alvo vindo do código. Null se as tags não baterem. */
export function elementoDoAlvo(raiz: Element | Document, alvo: AlvoCodigo): Element | null {
  let atual: Element | Document = raiz;
  for (let passo = 0; passo < alvo.caminho.length; passo++) {
    const filho: Element | undefined = atual.children[alvo.caminho[passo]];
    if (!ehElemento(filho) || filho.tagName.toLowerCase() !== alvo.tags[passo]) return null;
    atual = filho;
  }
  return ehElemento(atual) ? atual : null;
}
