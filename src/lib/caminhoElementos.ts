/*
 * Caminho "só de elementos": índices entre os filhos que são elementos,
 * ignorando textos e comentários. É a ponte entre o código do editor e o
 * DOM do iframe, porque os dois lados contam elementos do mesmo jeito,
 * enquanto textos (entidades, espaços) e comentários variam.
 */
import { ehElemento } from "./dom";

export type AlvoCodigo = {
  /** Índices entre filhos-elemento, a partir do body. */
  caminho: number[];
  /** Tag de cada passo do caminho, em minúsculas, para conferir os dois lados. */
  tags: string[];
};

/** Caminho de um elemento do iframe, ou null se ele não estiver dentro do body. */
export function alvoDoElemento(body: Element, elemento: Element): AlvoCodigo | null {
  const caminho: number[] = [];
  const tags: string[] = [];
  let atual: Element | null = elemento;
  while (atual && atual !== body) {
    const pai: Element | null = atual.parentElement;
    if (!pai) return null;
    caminho.unshift(Array.prototype.indexOf.call(pai.children, atual) as number);
    tags.unshift(atual.tagName.toLowerCase());
    atual = pai;
  }
  return atual === body ? { caminho, tags } : null;
}

/** Elemento do iframe para um alvo vindo do código. Null se as tags não baterem. */
export function elementoDoAlvo(body: Element, alvo: AlvoCodigo): Element | null {
  let atual: Element = body;
  for (let passo = 0; passo < alvo.caminho.length; passo++) {
    const filho: Element | undefined = atual.children[alvo.caminho[passo]];
    if (!ehElemento(filho) || filho.tagName.toLowerCase() !== alvo.tags[passo]) return null;
    atual = filho;
  }
  return atual;
}
