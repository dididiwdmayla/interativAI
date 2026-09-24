/*
 * Esconder igual ao Chrome.
 *
 * No F12 do Chrome, a tecla H (ou "Hide element" no menu do botão direito)
 * liga e desliga a classe `__web-inspector-hide-shortcut__` no elemento e
 * coloca na página uma regra de CSS com `visibility: hidden !important`
 * para essa classe e tudo dentro dela (código do devtools-frontend,
 * função toggleClassAndInjectStyleRule). Por isso o elemento some mas o
 * lugar dele continua reservado, e a classe aparece na árvore.
 *
 * Aqui é igual: a classe vai no elemento (e aparece na árvore e no código)
 * e a regra já vem pronta no <head> do site-alvo.
 */
import { ehElemento } from "./dom";

export const CLASSE_ESCONDER = "__web-inspector-hide-shortcut__";

export const ID_ESTILO_ESCONDER = "__web-inspector-hide-shortcut-style__";

/** A mesma regra que o Chrome injeta na página. */
export const ESTILO_ESCONDER = `<style id="${ID_ESTILO_ESCONDER}">
.${CLASSE_ESCONDER}, .${CLASSE_ESCONDER} * { visibility: hidden !important; }
</style>`;

/** O próprio elemento tem a classe do Chrome. */
export function temClasseEsconder(elemento: Element): boolean {
  return elemento.classList.contains(CLASSE_ESCONDER);
}

/**
 * Invisível mantendo o espaço: ele ou um ancestral tem a classe do Chrome
 * ou `visibility: hidden` escrito no atributo style.
 */
export function estaEscondido(elemento: Element): boolean {
  let atual: Element | null = elemento;
  while (ehElemento(atual)) {
    if (temClasseEsconder(atual)) return true;
    const estilo = (atual as HTMLElement).style;
    if (estilo && estilo.visibility === "hidden") return true;
    atual = atual.parentElement;
  }
  return false;
}
