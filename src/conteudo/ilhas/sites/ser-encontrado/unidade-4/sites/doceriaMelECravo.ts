/*
 * Site-alvo da S4, Fase 3: "Doceria Mel & Cravo".
 *
 * Dois links que a doceria divulga (o do Instagram e o do e-mail de Natal),
 * sem nenhum parâmetro de rastreamento: não dá para saber qual divulgação
 * trouxe quem chegou.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const DOCERIA_MEL_E_CRAVO: SiteAlvo = {
  url: "docesmelecravo.exemplo",
  titulo: "Doceria Mel & Cravo",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Doceria Mel e Cravo | Panetones e doces de Natal em Salvador</title>
<style>
  body { font-family: Georgia, serif; margin: 0; padding: 20px; color: #3f2418; background: #fbf0e6; }
  h1 { color: #9a3b1f; }
  a { color: #1f5a7a; }
</style>`,
  body: `<h1>Doceria Mel e Cravo</h1>
<p>Encomende o panetone e os doces de Natal.</p>
<ul>
  <li><a id="link-insta" href="https://docesmelecravo.exemplo/">Encomendas de Natal, pelo Instagram</a></li>
  <li><a id="link-email" href="https://docesmelecravo.exemplo/">Encomendas de Natal, pelo e-mail</a></li>
</ul>`,
};
