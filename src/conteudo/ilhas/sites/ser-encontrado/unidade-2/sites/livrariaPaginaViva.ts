/*
 * Site-alvo da S2, Fase 3: "Livraria Página Viva".
 *
 * Os problemas de propósito: dois links com texto genérico ("clique aqui" e
 * "saiba mais") e duas fotos sem alt. Imagens em data: (SVG), sem 404.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const FOTO_LOJA =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='110'%3E%3Crect width='200' height='110' fill='%23b98a5e'/%3E%3Crect x='20' y='20' width='30' height='70' fill='%236b4a2b'/%3E%3Crect x='60' y='30' width='30' height='60' fill='%23a34a3b'/%3E%3Crect x='100' y='15' width='30' height='75' fill='%232f5d62'/%3E%3C/svg%3E";
const FOTO_CAFE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='110'%3E%3Crect width='200' height='110' fill='%23e4d3bd'/%3E%3Ccircle cx='100' cy='60' r='30' fill='%236b4a2b'/%3E%3C/svg%3E";

export const LIVRARIA_PAGINA_VIVA: SiteAlvo = {
  url: "livrariapaginaviva.exemplo",
  titulo: "Livraria Página Viva",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Livraria Página Viva | Livros novos e usados em Belo Horizonte</title>
<style>
  body { font-family: Georgia, serif; margin: 0; padding: 20px; color: #33261c; background: #faf3e8; }
  h1 { color: #7a3b2a; }
  img { display: block; margin: 8px 0; }
  a { color: #1d5f8a; }
</style>`,
  body: `<h1>Livraria Página Viva</h1>
<img id="foto-loja" src="${FOTO_LOJA}" width="200" height="110">
<p>Livros novos e usados, com café no fundo da loja.</p>
<p>Confira o catálogo completo: <a id="link-catalogo" href="catalogo.html">clique aqui</a>.</p>
<img id="foto-cafe" src="${FOTO_CAFE}" width="200" height="110">
<ul>
  <li>Clube de leitura toda quinta: <a id="link-clube" href="clube.html">saiba mais</a></li>
</ul>`,
};
