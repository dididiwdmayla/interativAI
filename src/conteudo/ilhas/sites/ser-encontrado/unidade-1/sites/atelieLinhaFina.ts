/*
 * Site-alvo da S1, Fase 1: "Ateliê Linha Fina" (consertos de roupa).
 *
 * O problema de propósito: o <title> é só "Início", o que acontece muito
 * em site feito com modelo pronto. Na busca, o resultado não diz nem o
 * nome do ateliê. Sem meta description (a Fase 2 ataca isso num site
 * novo); a busca mostra o primeiro parágrafo.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const ATELIE_LINHA_FINA: SiteAlvo = {
  url: "atelielinhafina.exemplo",
  titulo: "Ateliê Linha Fina",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Início</title>
<style>
  body { font-family: Georgia, serif; margin: 0; padding: 20px; color: #3a2e39; background: #fbf5ee; }
  h1 { color: #8c3b5e; }
  .servicos li { margin-bottom: 4px; }
</style>`,
  body: `<h1>Ateliê Linha Fina</h1>
<p>Bainha, zíper e ajuste de roupa em até 3 dias.</p>
<ul class="servicos">
  <li>Barra de calça</li>
  <li>Troca de zíper</li>
  <li>Ajuste de vestido</li>
</ul>
<p>Rua da Agulha, 12, Recife.</p>`,
};
