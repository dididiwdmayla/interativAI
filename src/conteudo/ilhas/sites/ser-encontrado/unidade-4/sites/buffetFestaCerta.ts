/*
 * Site-alvo da S4, Fase 1: "Buffet Festa Certa".
 *
 * Três ações que valem a medição: pedir orçamento pelo WhatsApp (já tem o
 * data-evento), enviar o pedido (sem data-evento) e ligar (link sem
 * data-evento). O site-alvo não roda JavaScript: o clique na prévia gera o
 * evento pelo data-evento (simulação, como diz a aba Medição).
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const BUFFET_FESTA_CERTA: SiteAlvo = {
  url: "buffetfestacerta.exemplo",
  titulo: "Buffet Festa Certa",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Buffet Festa Certa | Festas infantis em Campinas</title>
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 20px; color: #2c2a4a; background: #f4f1ff; }
  h1 { color: #5a3fb0; }
  button { background: #5a3fb0; color: #ffffff; border: 0; border-radius: 999px; padding: 10px 16px; font-weight: bold; margin: 4px 4px 4px 0; }
  a.ligar { display: inline-block; background: #2f8f5b; color: #ffffff; border-radius: 999px; padding: 10px 16px; font-weight: bold; text-decoration: none; }
</style>`,
  body: `<h1>Buffet Festa Certa</h1>
<p>Festas infantis completas, com salão, cardápio e recreação.</p>
<p>
  <button id="pedir-whatsapp" type="button" data-evento="clique_whatsapp">Pedir orçamento pelo WhatsApp</button>
</p>
<p>
  <button id="enviar-pedido" type="button">Enviar pedido de festa</button>
</p>
<p>
  <a id="ligar" class="ligar" href="tel:+5519355501234">Ligar agora</a>
</p>`,
};
