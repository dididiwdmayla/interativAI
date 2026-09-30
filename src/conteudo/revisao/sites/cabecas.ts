/*
 * Heads dos mini-sites de revisão da zona "Ser encontrado" (modo
 * documento: o jogador mexe no head). O estilo é o HEAD_MINI; o resto é o
 * que a busca lê (title, meta description, meta robots).
 */
import { HEAD_MINI } from "./estilos";

/** Um head com charset, viewport, o title e o que mais vier (metas), e o estilo dos mini-sites. */
export function cabecaComTitulo(titulo: string, extras = ""): string {
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>${extras ? `\n${extras}` : ""}
${HEAD_MINI}`;
}
