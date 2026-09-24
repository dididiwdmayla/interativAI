import { ESTILO_ESCONDER } from "./esconder";

/**
 * Monta o documento completo que vai no srcdoc do iframe do preview.
 * A regra de esconder do F12 vai junto no <head>, como o Chrome faz.
 */
export function montarDocumentoSiteAlvo(head: string, body: string): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
${head}
${ESTILO_ESCONDER}
</head>
<body>
${body}
</body>
</html>`;
}

/** Cria um Document solto (fora da tela) a partir de um body, para comparações. */
export function criarDocumentoSolto(head: string, body: string): Document {
  return new DOMParser().parseFromString(montarDocumentoSiteAlvo(head, body), "text/html");
}
