/*
 * Site-alvo do desafio da Unidade 4: "Trovão de Lata".
 *
 * O site de uma banda de rock fictícia, com os mesmos quatro problemas dos
 * micro-passos (link quebrado, link sem aba nova, imagem sem alt, cards sem
 * a class em comum), num site novo e diferente do Coral Vozes da Vila.
 *
 * Âncoras naturais: #nav-shows, #nav-quem-somos, #nav-contato,
 * #link-ingressos-banda, #foto-banda, #musico-joao/.musico, #musico-rita,
 * #musico-davi, #rodape.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_BANDA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trovão de Lata</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background: #1b1b1f;
    color: #f1ede4;
    font-family: "Arial Black", Arial, sans-serif;
  }
  header { padding: 18px 24px; text-align: center; background: #b3271e; }
  .marca { margin: 0 0 10px; font-size: 28px; letter-spacing: 0.04em; }
  .menu { display: flex; justify-content: center; gap: 18px; font-size: 14px; }
  .menu a { color: #f1ede4; text-decoration: none; }
  main { max-width: 640px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
  section { margin-bottom: 28px; }
  h2 { color: #e8b64c; }
  img { display: block; max-width: 100%; margin: 10px 0; }
  .cards { display: flex; gap: 12px; flex-wrap: wrap; }
  article { padding: 10px 14px; background: #2b2b31; border-radius: 8px; }
  .musico { border: 2px solid #e8b64c; }
  footer { padding: 16px 24px; background: #000; text-align: center; font-size: 13px; }
  a { color: #e8b64c; }
</style>`;

const IMG_BANDA =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80' width='160' height='106'%3E%3Crect width='120' height='80' fill='%232b2b31'/%3E%3Ccircle cx='30' cy='40' r='14' fill='%23e8b64c'/%3E%3Ccircle cx='60' cy='40' r='14' fill='%23b3271e'/%3E%3Ccircle cx='90' cy='40' r='14' fill='%23f1ede4'/%3E%3C/svg%3E";

const BODY_BANDA = `<header>
  <p class="marca">TROVÃO DE LATA</p>
  <nav class="menu">
    <a href="#shows" id="nav-shows">Shows</a>
    <a href="#quem-somos" id="nav-quem-somos">Quem somos</a>
    <a href="#fim" id="nav-contato">Contato</a>
  </nav>
</header>
<main>
  <section id="quem-somos">
    <h2>Quem somos</h2>
    <img id="foto-banda" src="${IMG_BANDA}" width="160" height="106">
    <p>Quatro amigos que tocam rock de garagem desde 2010.</p>
  </section>

  <section id="integrantes-banda">
    <h2>A banda</h2>
    <div class="cards">
      <article class="musico" id="musico-joao"><h3>João</h3><p>Vocal</p></article>
      <article id="musico-rita"><h3>Rita</h3><p>Guitarra</p></article>
      <article id="musico-davi"><h3>Davi</h3><p>Baixo</p></article>
    </div>
  </section>

  <section id="shows">
    <h2>Próximo show</h2>
    <p>Ingressos no <a href="https://exemplo.site/trovao-ingressos" id="link-ingressos-banda">site oficial</a>.</p>
  </section>
</main>
<footer id="rodape">
  <p>Trovão de Lata. Ensaios no galpão da Rua das Oficinas.</p>
</footer>`;

export const SITE_BANDA: SiteAlvo = {
  url: "trovao-de-lata.site",
  titulo: "Site da banda Trovão de Lata",
  head: HEAD_BANDA,
  body: BODY_BANDA,
};
