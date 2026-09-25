/*
 * Site-alvo dos micro-passos da Unidade 4: "Coral Vozes da Vila".
 *
 * O site de um coral amador, com um link do menu quebrado (leva a um id que
 * não existe), um link externo sem target="_blank", duas imagens (SVG
 * embutido em data URI, nunca externo) sem alt, e três cards de integrantes
 * onde só o primeiro tem a class que os outros dois precisam também.
 *
 * Âncoras naturais: #nav-integrantes, #nav-ingressos, #nav-contato,
 * #link-ingressos, #link-video, #foto-coral, #icone-ingressos,
 * #integrante-ana/.integrante, #integrante-bruno, #integrante-carla,
 * #rodape.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_CORAL = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Coral Vozes da Vila</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background: #fbf6ec;
    color: #2c2440;
    font-family: "Trebuchet MS", Arial, sans-serif;
  }
  header { padding: 18px 24px; text-align: center; background: #5b3a8e; color: #fff; }
  .marca { margin: 0 0 10px; font-size: 26px; font-weight: bold; }
  .menu { display: flex; justify-content: center; gap: 18px; }
  .menu a { color: #fff; text-decoration: none; font-weight: bold; }
  main { max-width: 640px; margin: 0 auto; padding: 20px; }
  section { margin-bottom: 28px; }
  h2 { color: #5b3a8e; }
  img { display: block; max-width: 100%; margin: 10px 0; }
  .cards { display: flex; gap: 12px; flex-wrap: wrap; }
  .musico-card, article { padding: 10px 14px; background: #f1e9fb; border-radius: 8px; }
  .integrante { border: 2px solid #b79ce0; }
  footer { padding: 16px 24px; background: #2c2440; color: #fbf6ec; text-align: center; }
</style>`;

const IMG_MICROFONE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='120' height='120'%3E%3Crect x='40' y='10' width='20' height='40' rx='10' fill='%235b3a8e'/%3E%3Cline x1='50' y1='55' x2='50' y2='80' stroke='%235b3a8e' stroke-width='4'/%3E%3Cline x1='30' y1='80' x2='70' y2='80' stroke='%235b3a8e' stroke-width='4'/%3E%3C/svg%3E";
const IMG_TICKET =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60' width='60' height='36'%3E%3Crect x='4' y='8' width='92' height='44' rx='6' fill='%23e8b64c'/%3E%3Ccircle cx='50' cy='30' r='6' fill='%23fbf6ec'/%3E%3C/svg%3E";

const BODY_CORAL = `<header>
  <p class="marca">Coral Vozes da Vila</p>
  <nav class="menu">
    <a href="#membros" id="nav-integrantes">Integrantes</a>
    <a href="#ingressos" id="nav-ingressos">Ingressos</a>
    <a href="#contato" id="nav-contato">Fale com a gente</a>
  </nav>
</header>
<main>
  <section id="sobre">
    <h2>Sobre o coral</h2>
    <img id="foto-coral" src="${IMG_MICROFONE}" width="120" height="120">
    <p>Um coral amador da vila, ensaiando toda quarta desde 2016.</p>
  </section>

  <section id="integrantes">
    <h2>Integrantes</h2>
    <div class="cards">
      <article class="integrante" id="integrante-ana"><h3>Ana</h3><p>Soprano</p></article>
      <article id="integrante-bruno"><h3>Bruno</h3><p>Tenor</p></article>
      <article id="integrante-carla"><h3>Carla</h3><p>Contralto</p></article>
    </div>
  </section>

  <section id="ingressos">
    <h2>Próximo espetáculo</h2>
    <img id="icone-ingressos" src="${IMG_TICKET}" width="60" height="36">
    <p>Ingressos pela <a href="https://exemplo.site/ingressos" id="link-ingressos">bilheteria online</a>.</p>
    <p>Veja um trecho do último show no <a href="https://exemplo.site/coral-video" id="link-video">canal do coral</a>.</p>
  </section>
</main>
<footer id="rodape">
  <p>Coral Vozes da Vila. Ensaios às quartas, 19h, no salão da igreja.</p>
</footer>`;

export const SITE_CORAL: SiteAlvo = {
  url: "coral-vozes-da-vila.site",
  titulo: "Site do Coral Vozes da Vila",
  head: HEAD_CORAL,
  body: BODY_CORAL,
};
