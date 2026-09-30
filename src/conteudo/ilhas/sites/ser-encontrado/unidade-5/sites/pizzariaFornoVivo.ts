/*
 * Site-alvo da S5, Fase 1: "Pizzaria Forno Vivo" (página de destino fraca de
 * propósito, como o site da demonstração da campanha: sem title, sem meta
 * description, foto sem alt e rodapé de baixo contraste). A fase 1 mexe só no
 * leilão; a nota baixa da página deixa o anúncio caro.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const PIZZARIA_FORNO_VIVO: SiteAlvo = {
  url: "pizzariafornovivo.exemplo",
  titulo: "Pizzaria Forno Vivo",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 16px; color: #33261a; background: #fff6ef; }
  .foto { display: block; width: 100%; max-width: 320px; height: 120px; background: #d9b8a0; }
  .pedir { background: #2f8f5b; color: #ffffff; border: 0; border-radius: 999px; padding: 10px 16px; font-weight: bold; }
  .rodape { color: #e8d9cc; }
</style>`,
  body: `<main>
  <h1>Pizzaria Forno Vivo</h1>
  <p>Pizza artesanal no forno a lenha, com entrega em Campinas.</p>
  <img class="foto" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">
  <button class="pedir" type="button" data-evento="clique_whatsapp">Pedir pelo WhatsApp</button>
</main>
<footer class="rodape">Rua das Flores, 45. Peça com 1 hora de antecedência.</footer>`,
};
