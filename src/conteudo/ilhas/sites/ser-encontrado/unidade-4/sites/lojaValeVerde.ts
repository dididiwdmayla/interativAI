/*
 * Site-alvo da S4, Fase 2: "Loja Vale Verde" (modo documento).
 *
 * O "Search Console" avisou (na história da fase) que a página da loja não
 * está na busca: tem um noindex esquecido. E mostrou que as pessoas chegam
 * buscando "vasos de cerâmica", coisa que o title não diz.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const LOJA_VALE_VERDE: SiteAlvo = {
  url: "lojavaleverde.exemplo",
  titulo: "Loja Vale Verde",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Loja Vale Verde | Início</title>
<meta name="description" content="Plantas, vasos e tudo para o seu jardim, com entrega em Goiânia.">
<style>
  body { font-family: Georgia, serif; margin: 0; padding: 20px; color: #26382a; background: #f0f7ee; }
  h1 { color: #2f6b3a; }
</style>`,
  body: `<h1>Loja Vale Verde</h1>
<p>Plantas, vasos de cerâmica e adubo, com entrega em Goiânia.</p>
<p>Aberta de segunda a sábado.</p>`,
};
