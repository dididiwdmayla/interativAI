/*
 * Site-alvo do desafio da S1: "Casa de Farinha Seu Dito" (site novo).
 *
 * Os três problemas juntos: noindex esquecido, title que passa do espaço
 * da busca (cortado com reticências) e nenhuma meta description.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const CASA_DE_FARINHA: SiteAlvo = {
  url: "casadefarinhaseudito.exemplo",
  titulo: "Casa de Farinha Seu Dito",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Casa de Farinha Seu Dito: farinha de mandioca, beiju, tapioca, goma, bolo de macaxeira e muito mais</title>
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 20px; color: #3b2a14; background: #fdf6e8; }
  h1 { color: #9a5b12; }
</style>`,
  body: `<h1>Casa de Farinha Seu Dito</h1>
<p>Farinha torrada no forno de lenha, do jeito de antigamente.</p>
<p>Entregamos em Garanhuns e região às sextas-feiras.</p>`,
};
