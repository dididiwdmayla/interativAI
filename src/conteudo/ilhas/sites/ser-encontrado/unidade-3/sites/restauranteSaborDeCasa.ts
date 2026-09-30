/*
 * Site-alvo da S3, Fase 2: "Restaurante Sabor de Casa".
 *
 * Três avaliações de clientes (a de duas estrelas pede uma resposta
 * educada) e o espaço para o dono responder. As respostas começam com o
 * texto "Sem resposta do restaurante." para o jogador trocar.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const RESTAURANTE_SABOR_DE_CASA: SiteAlvo = {
  url: "saboredecasa.exemplo",
  titulo: "Restaurante Sabor de Casa",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Restaurante Sabor de Casa | Comida caseira em Belém</title>
<style>
  body { font-family: Georgia, serif; margin: 0; padding: 20px; color: #33261a; background: #fbf4e6; }
  h1 { color: #8a4b12; }
  .avaliacao { border: 1px solid #e0c9a3; border-radius: 8px; padding: 8px 12px; margin-bottom: 10px; background: #fffaf0; }
  .nota { font-weight: bold; color: #b06a10; margin: 0 0 4px; }
  .resposta-dono { margin: 6px 0 0; padding-left: 10px; border-left: 3px solid #d9b877; color: #5c4a2e; font-size: 14px; }
</style>`,
  body: `<h1>Restaurante Sabor de Casa</h1>
<section id="avaliacoes">
  <h2>O que dizem de nós</h2>
  <article class="avaliacao" id="aval-1">
    <p class="nota">5 estrelas</p>
    <p>Comida caseira de verdade e atendimento ótimo.</p>
    <p class="resposta-dono" id="resposta-1">Sem resposta do restaurante.</p>
  </article>
  <article class="avaliacao" id="aval-2">
    <p class="nota">2 estrelas</p>
    <p>Esperei 50 minutos pelo prato e ninguém avisou nada.</p>
    <p class="resposta-dono" id="resposta-2">Sem resposta do restaurante.</p>
  </article>
  <article class="avaliacao" id="aval-3">
    <p class="nota">4 estrelas</p>
    <p>Feijoada muito boa, só faltou uma sobremesa.</p>
    <p class="resposta-dono" id="resposta-3">Sem resposta do restaurante.</p>
  </article>
</section>`,
};
