/*
 * Site-alvo do desafio da S4: "Casa de Sucos Vitamina" (site novo;
 * docs/MAPA-CURRICULAR.md: "descobrir qual divulgação trouxe clientes").
 *
 * Duas divulgações do verão (Instagram e folheto com QR code) sem
 * rastreamento e um botão de pedido sem medição.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const CASA_DE_SUCOS_VITAMINA: SiteAlvo = {
  url: "casadesucosvitamina.exemplo",
  titulo: "Casa de Sucos Vitamina",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Casa de Sucos Vitamina | Sucos naturais em Aracaju</title>
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 20px; color: #2b3a1f; background: #f7fbe9; }
  h1 { color: #c2570c; }
  button { background: #c2570c; color: #ffffff; border: 0; border-radius: 999px; padding: 10px 16px; font-weight: bold; }
  a { color: #1f5a7a; }
</style>`,
  body: `<h1>Casa de Sucos Vitamina</h1>
<p>Sucos naturais e vitaminas, feitos na hora.</p>
<ul>
  <li><a id="link-insta" href="https://casadesucosvitamina.exemplo/">Promoção de verão, pelo Instagram</a></li>
  <li><a id="link-folheto" href="https://casadesucosvitamina.exemplo/">Promoção de verão, pelo folheto</a></li>
</ul>
<p>
  <button id="fazer-pedido" type="button">Fazer pedido</button>
</p>`,
};
