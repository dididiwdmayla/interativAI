/*
 * Site-alvo da S2, Fase 4: "Estúdio Foco" (fotografia).
 *
 * O problema de propósito: quatro fotos que baixam todas de uma vez, mesmo
 * as que ficam lá embaixo. A capa aparece logo (não deve ser preguiçosa); as
 * três da galeria, sim. As fotos já têm alt e tamanho (data:, sem 404).
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const foto = (cor: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='140'%3E%3Crect width='300' height='140' fill='%23${cor}'/%3E%3C/svg%3E`;

export const ESTUDIO_FOCO: SiteAlvo = {
  url: "estudiofoco.exemplo",
  titulo: "Estúdio Foco",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Estúdio Foco | Fotografia de casamento e família em Curitiba</title>
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 20px; color: #242a33; background: #f1f3f7; }
  h1 { color: #33507a; }
  img { display: block; max-width: 100%; height: auto; margin: 6px 0; }
  .galeria img { width: 150px; height: 70px; display: inline-block; }
</style>`,
  body: `<h1>Estúdio Foco</h1>
<img id="capa" class="capa" src="${foto("6d8fb5")}" alt="Casal caminhando no parque ao pôr do sol" width="300" height="140">
<p>Fotos de casamento, família e eventos, entregues em 15 dias.</p>
<section class="galeria">
  <img id="foto-1" src="${foto("b5836d")}" alt="Noiva sorrindo com o buquê" width="150" height="70">
  <img id="foto-2" src="${foto("7db58c")}" alt="Família reunida na praia" width="150" height="70">
  <img id="foto-3" src="${foto("b56d8f")}" alt="Festa de aniversário infantil" width="150" height="70">
</section>
<p>Peça o orçamento pelo WhatsApp.</p>`,
};
