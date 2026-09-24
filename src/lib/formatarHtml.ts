import { html } from "js-beautify";

/**
 * Formata o HTML do body do site-alvo, com indentação de 2 espaços.
 * Roda no navegador (o núcleo do js-beautify não depende de Node).
 */
export function formatarHtml(texto: string): string {
  return html(texto, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: true,
    max_preserve_newlines: 1,
    end_with_newline: false,
    indent_inner_html: false,
  });
}
