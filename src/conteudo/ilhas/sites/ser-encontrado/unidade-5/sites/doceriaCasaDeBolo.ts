/*
 * Site-alvo da S5, Fase 3: "Doceria Casa de Bolo" (modo documento; página
 * fraca de propósito: sem title, sem meta description, foto sem alt). A fase
 * melhora a página aos poucos: primeiro a busca (title e description), depois o
 * alt da foto; o custo por cliente cai a cada passo.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const DOCERIA_CASA_DE_BOLO: SiteAlvo = {
  url: "doceriacasadebolo.exemplo",
  titulo: "Doceria Casa de Bolo",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 16px; color: #33261a; background: #fff4f0; }
  .foto { display: block; width: 100%; max-width: 320px; height: 120px; background: #d9b8a0; }
  .pedir { background: #2f8f5b; color: #ffffff; border: 0; border-radius: 999px; padding: 10px 16px; font-weight: bold; }
  .rodape { color: #e8d9cc; }
</style>`,
  body: `<main>
  <h1>Doceria Casa de Bolo</h1>
  <p>Bolos de pote e doces para festa, feitos por encomenda em Recife.</p>
  <img class="foto" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">
  <button class="pedir" type="button" data-evento="clique_whatsapp">Pedir pelo WhatsApp</button>
</main>
<footer class="rodape">Rua do Açúcar, 5. Encomendas com 2 dias.</footer>`,
};
