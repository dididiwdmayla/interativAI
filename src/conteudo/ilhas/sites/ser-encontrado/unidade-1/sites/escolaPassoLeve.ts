/*
 * Site-alvo da S1, Fase 3: "Escola de Dança Passo Leve".
 *
 * O problema de propósito: um <meta name="robots" content="noindex">
 * esquecido desde quando o site estava em construção. A página está no
 * ar, mas não aparece em busca nenhuma.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const ESCOLA_PASSO_LEVE: SiteAlvo = {
  url: "passoleve.exemplo",
  titulo: "Escola de Dança Passo Leve",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Passo Leve | Escola de dança em Caruaru</title>
<meta name="description" content="Aulas de forró, samba e dança de salão para iniciantes, de segunda a sábado, em Caruaru.">
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 20px; color: #2b2340; background: #f6f3ff; }
  h1 { color: #5a3fb0; }
</style>`,
  body: `<h1>Escola de Dança Passo Leve</h1>
<p>Forró, samba e dança de salão para quem nunca dançou.</p>
<p>Primeira aula grátis.</p>`,
};
