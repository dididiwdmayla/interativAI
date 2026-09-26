/*
 * Um pedaço da folha de estilo do navegador (a "user agent stylesheet"
 * que o Chrome mostra no fim do painel Styles): as regras que dão estilo
 * a uma página sem CSS nenhum. Sem ela, o motor diria que um h1 herda o
 * peso da fonte do body, quando na verdade o navegador já deixa o h1 em
 * negrito.
 *
 * Conferido contra o html.css do Chromium
 * (third_party/blink/renderer/core/html/resources/html.css) e a seção
 * "Rendering" do HTML Living Standard. Duas simplificações conscientes:
 * - margens em propriedades físicas (margin-top e margin-bottom) no lugar
 *   das lógicas (margin-block-start e margin-block-end): numa página
 *   escrita da esquerda para a direita elas são a mesma coisa, e assim o
 *   motor consegue riscar a margem do navegador quando o site troca a
 *   margem;
 * - `a[href]` no lugar de `a:-webkit-any-link` (o Chrome mostra o nome
 *   dele; o motor usa um seletor que funciona em qualquer lugar).
 *
 * Fica de fora o que o motor não precisa para decidir a cascata das
 * propriedades que o jogo ensina (tabelas, formulários, mídia).
 */

export const TEXTO_FOLHA_DO_NAVEGADOR = `html, address, blockquote, body, center, dialog, div, figure, figcaption, footer, form, header, hr, legend, listing, main, p, plaintext, pre, search, xmp, article, aside, h1, h2, h3, h4, h5, h6, hgroup, nav, section, dir, dd, dl, dt, menu, ol, ul, li, details, summary {
  display: block;
}
li {
  display: list-item;
}
head, link, meta, script, style, title, template, [hidden] {
  display: none;
}
body {
  margin: 8px;
}
p, blockquote, figure, dl, pre {
  margin-top: 1em;
  margin-bottom: 1em;
}
h1 {
  font-size: 2em;
  font-weight: bold;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
}
h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
}
h3 {
  font-size: 1.17em;
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 1em;
}
h4 {
  font-weight: bold;
  margin-top: 1.33em;
  margin-bottom: 1.33em;
}
h5 {
  font-size: 0.83em;
  font-weight: bold;
  margin-top: 1.67em;
  margin-bottom: 1.67em;
}
h6 {
  font-size: 0.67em;
  font-weight: bold;
  margin-top: 2.33em;
  margin-bottom: 2.33em;
}
ul, ol, menu, dir {
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 40px;
}
ul, menu, dir {
  list-style-type: disc;
}
ol {
  list-style-type: decimal;
}
ul ul, ol ul, ul ol, ol ol {
  margin-top: 0;
  margin-bottom: 0;
}
b, strong {
  font-weight: bolder;
}
i, em, cite, dfn, var, address {
  font-style: italic;
}
u, ins {
  text-decoration: underline;
}
s, del, strike {
  text-decoration: line-through;
}
small {
  font-size: smaller;
}
big {
  font-size: larger;
}
code, kbd, samp, pre, tt {
  font-family: monospace;
}
pre {
  white-space: pre;
}
a[href] {
  color: -webkit-link;
  text-decoration: underline;
  cursor: pointer;
}
mark {
  background-color: Mark;
  color: MarkText;
}
blockquote, figure {
  margin-left: 40px;
  margin-right: 40px;
}
hr {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  border-style: inset;
  border-width: 1px;
}
img {
  display: inline;
}
button, input, select, textarea {
  display: inline-block;
}
table {
  display: table;
}
`;

/** Seletores que o painel mostra diferente do que o motor usa para casar. */
export const SELETOR_EXIBIDO: Readonly<Record<string, string>> = {
  "a[href]": "a:-webkit-any-link",
};
