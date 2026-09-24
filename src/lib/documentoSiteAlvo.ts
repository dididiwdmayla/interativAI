/** Monta o documento completo que vai no srcdoc do iframe do preview. */
export function montarDocumentoSiteAlvo(head: string, body: string): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
${head}
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
