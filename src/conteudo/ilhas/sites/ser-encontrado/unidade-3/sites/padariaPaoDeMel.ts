/*
 * Site-alvo do desafio da S3: "Padaria Pão de Mel" (site novo, modo
 * documento; docs/MAPA-CURRICULAR.md: "uma padaria com três endereços
 * diferentes espalhados").
 *
 * O perfil da padaria no Google (dito nas falas) diz Rua das Flores, 120,
 * Sarandi. O site tem três endereços diferentes (topo, contato e rodapé),
 * um bloco de dados estruturados com vírgula sobrando e tipo genérico, e
 * uma avaliação de uma estrela sem resposta.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const PADARIA_PAO_DE_MEL: SiteAlvo = {
  url: "padariapaodemel.exemplo",
  titulo: "Padaria Pão de Mel",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Padaria Pão de Mel | Pães e bolos em Sarandi</title>
<script id="dados-padaria" type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Padaria Pão de Mel",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua das Flores, 210",
    "addressLocality": "Sarandi"
  },
  "telephone": "(44) 3555-0100",
}
</script>
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 20px; color: #3b2a14; background: #fdf3df; }
  h1 { color: #9a5b12; }
  .avaliacao { border: 1px solid #e6cf9f; border-radius: 8px; padding: 8px 12px; background: #fff9ea; }
  .resposta-dono { margin: 6px 0 0; padding-left: 10px; border-left: 3px solid #d9b877; font-size: 14px; }
  footer { margin-top: 20px; font-size: 14px; }
</style>`,
  body: `<header>
  <h1>Padaria Pão de Mel</h1>
  <p>Pão quentinho toda hora. Venha nos visitar: <span id="end-topo">Rua das Flores, 120, Sarandi</span></p>
</header>
<main>
  <h2>Fale com a gente</h2>
  <p>Endereço: <span id="end-contato">Rua das Flores, 102, Sarandi</span></p>
  <section id="avaliacoes">
    <h2>Avaliações</h2>
    <article class="avaliacao">
      <p><strong>1 estrela.</strong> O pão de sal estava frio quando cheguei.</p>
      <p class="resposta-dono" id="resposta-1">Sem resposta da padaria.</p>
    </article>
  </section>
</main>
<footer>
  <p>Padaria Pão de Mel, <span id="end-rodape">R. das Flores, 210, Sarandi</span></p>
</footer>`,
};
