/*
 * Site-alvo do desafio da S2: "Casa de Chá Lótus" (site novo).
 *
 * Bonita e invisível para a busca: o nome é uma div (e a "oferta" é o único
 * h1), um parágrafo de enchimento, um texto vago onde iria o preço, um link
 * "clique aqui", fotos sem alt e todas baixando de uma vez (a capa aparece
 * logo; as três da galeria ficam lá embaixo).
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const foto = (cor: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='140'%3E%3Crect width='300' height='140' fill='%23${cor}'/%3E%3C/svg%3E`;

export const CASA_DE_CHA_LOTUS: SiteAlvo = {
  url: "casadechalotus.exemplo",
  titulo: "Casa de Chá Lótus",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Casa de Chá Lótus | Chás e docinhos em Florianópolis</title>
<style>
  body { font-family: Georgia, serif; margin: 0; padding: 20px; color: #2f3a2c; background: #f4f6ee; }
  .nome { font-size: 32px; font-weight: bold; color: #4d6b3a; }
  h1 { font-size: 22px; color: #6a7f3a; }
  .enchimento { color: #55624f; font-size: 14px; }
  img { display: block; margin: 6px 0; }
  .galeria img { display: inline-block; margin-right: 6px; }
  a { color: #2a6a5d; }
</style>`,
  body: `<header>
  <div id="nome" class="nome">Casa de Chá Lótus</div>
</header>
<main>
  <h1 id="oferta">Ofertas da semana</h1>
  <img id="capa" src="${foto("9ab77d")}" width="300" height="140">
  <p id="preco">Temos chás e docinhos para todos os gostos.</p>
  <p class="enchimento">casa de chá barata casa de chá Florianópolis casa de chá boa casa de chá perto de mim</p>
  <p>Cardápio completo: <a id="link-cardapio" href="cardapio.html">clique aqui</a>.</p>
  <section class="galeria">
    <img id="galeria-1" class="foto" src="${foto("b7a57d")}" width="140" height="66">
    <img id="galeria-2" class="foto" src="${foto("7db7a4")}" width="140" height="66">
    <img id="galeria-3" class="foto" src="${foto("b77d9a")}" width="140" height="66">
  </section>
</main>`,
};
