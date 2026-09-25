import { ATRIBUTO_FOLHA_DO_JOGO } from "@/motor/css/cascata";
import { ESTILO_ESCONDER } from "./esconder";

/** Um "</style" dentro do CSS fecharia o <style> antes da hora. */
function protegerCss(css: string): string {
  return css.replace(/<\/style/gi, "<\\/style");
}

/** O <style> editável do site-alvo (a folha "estilo.css" do painel Estilos). */
export function tagFolhaDoJogo(css: string): string {
  // Sem quebra de linha em volta: as linhas do textContent batem com as do editor CSS.
  return `<style ${ATRIBUTO_FOLHA_DO_JOGO}>${protegerCss(css)}</style>`;
}

/**
 * Monta o documento completo que vai no srcdoc do iframe do preview.
 * A folha editável (quando a fase tem CSS) vem depois do head fixo, e a
 * regra de esconder do F12 vai no fim, como o Chrome faz.
 */
export function montarDocumentoSiteAlvo(head: string, body: string, css: string | null = null): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
${head}
${css !== null ? `${tagFolhaDoJogo(css)}\n` : ""}${ESTILO_ESCONDER}
</head>
<body>
${body}
</body>
</html>`;
}

/** Cria um Document solto (fora da tela) a partir de um body, para comparações. */
export function criarDocumentoSolto(head: string, body: string, css: string | null = null): Document {
  return new DOMParser().parseFromString(montarDocumentoSiteAlvo(head, body, css), "text/html");
}

/** O texto da folha editável no documento, ou null se a fase não tem CSS. */
export function lerCssDoDocumento(documento: Document): string | null {
  const estilo = documento.querySelector(`style[${ATRIBUTO_FOLHA_DO_JOGO}]`);
  return estilo ? (estilo.textContent ?? "") : null;
}

/** Troca o texto da folha editável na hora (sem recarregar a página). */
export function escreverCssNoDocumento(documento: Document, css: string): boolean {
  const estilo = documento.querySelector(`style[${ATRIBUTO_FOLHA_DO_JOGO}]`);
  if (!estilo) return false;
  estilo.textContent = css;
  return true;
}
