/*
 * Site-alvo do desafio da S5: "Pet Shop Rabo Feliz" (site novo; página fraca:
 * sem title, sem meta description, foto sem alt). A verba é curta (R$ 90 por
 * dia) e a campanha começa cara, com um cliente por dia.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const PET_SHOP_RABO_FELIZ: SiteAlvo = {
  url: "petshoprabofeliz.exemplo",
  titulo: "Pet Shop Rabo Feliz",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 16px; color: #33261a; background: #f3f8ee; }
  .foto { display: block; width: 100%; max-width: 320px; height: 120px; background: #d9b8a0; }
  .pedir { background: #2f8f5b; color: #ffffff; border: 0; border-radius: 999px; padding: 10px 16px; font-weight: bold; }
  .rodape { color: #e8d9cc; }
</style>`,
  body: `<main>
  <h1>Pet Shop Rabo Feliz</h1>
  <p>Banho e tosa, ração e veterinário, com leva e traz em Aracaju.</p>
  <img class="foto" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">
  <button class="pedir" type="button" data-evento="clique_whatsapp">Pedir pelo WhatsApp</button>
</main>
<footer class="rodape">Avenida Central, 88. Agende pelo WhatsApp.</footer>`,
};
