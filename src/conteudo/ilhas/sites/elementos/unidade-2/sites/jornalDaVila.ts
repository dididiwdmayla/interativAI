/*
 * Site-alvo dos micro-passos da Unidade 2: "Jornal da Vila".
 *
 * Um portal de notícias do bairro, bagunçado de propósito: banner no topo,
 * pop-up de cookies no meio do caminho e anúncio do lado. Os anúncios são
 * desenhados só com CSS (nada de imagem externa).
 *
 * Âncoras naturais para os validadores: #banner-topo, #popup-cookies,
 * #noticias, .noticia (com ids #noticia-praca, #noticia-feira,
 * #noticia-time), .leia-mais, #anuncio-lateral e #rodape.
 *
 * É "o site de outra pessoa": como todo arquivo em sites/, tem cores
 * próprias e fixas, fora dos tokens do jogo.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_JORNAL = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Jornal da Vila</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background: #f6f1e6;
    color: #1f1d1a;
    font-family: Georgia, "Times New Roman", serif;
  }
  a { color: #b3261e; }

  /* Anúncios: chamativos de propósito */
  .anuncio {
    position: relative;
    font-family: Impact, "Arial Black", sans-serif;
    color: #2b0a3d;
    background:
      repeating-linear-gradient(45deg, #ffe44d 0 16px, #ffd000 16px 32px);
    border: 4px solid #e8178a;
  }
  .anuncio-selo {
    position: absolute;
    top: 4px;
    right: 6px;
    padding: 1px 6px;
    font: bold 10px/1.4 Arial, sans-serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #ffffff;
    background: #2b0a3d;
    border-radius: 4px;
  }
  #banner-topo {
    margin: 0;
    padding: 14px 70px 14px 20px;
    font-size: 22px;
    letter-spacing: 0.02em;
    text-align: center;
    border-width: 0 0 4px;
  }
  #banner-topo strong { color: #e8178a; }

  .cabecalho {
    padding: 18px 24px 12px;
    text-align: center;
    border-bottom: 3px double #1f1d1a;
  }
  .marca {
    margin: 0;
    font-size: 38px;
    font-weight: bold;
    letter-spacing: 0.04em;
  }
  .data {
    margin: 4px 0 10px;
    font: italic 14px Georgia, serif;
    color: #6b645a;
  }
  .menu {
    display: flex;
    justify-content: center;
    gap: 18px;
    font: bold 14px Arial, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .menu a { color: #1f1d1a; text-decoration: none; }

  /* Pop-up de cookies no meio do caminho (ocupa espaço na página) */
  .popup {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 16px auto;
    max-width: 560px;
    padding: 14px 18px;
    font-family: Arial, sans-serif;
    font-size: 15px;
    background: #ffffff;
    border: 2px solid #1f1d1a;
    border-radius: 14px;
    box-shadow: 6px 6px 0 #1f1d1a;
  }
  .popup p { margin: 0; flex: 1; }
  .popup-botao {
    padding: 8px 14px;
    font: bold 14px Arial, sans-serif;
    color: #ffffff;
    background: #b3261e;
    border: none;
    border-radius: 999px;
  }

  main {
    display: flex;
    gap: 18px;
    padding: 18px 24px 28px;
  }
  #noticias {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 14px;
    align-content: start;
  }
  .noticia {
    padding: 14px;
    background: #fffdf8;
    border: 1px solid #d8cfbf;
    border-top: 5px solid #b3261e;
  }
  .noticia h3 { margin: 0 0 6px; font-size: 19px; line-height: 1.2; }
  .noticia p { margin: 0 0 8px; font-size: 14px; line-height: 1.45; color: #45403a; }
  .leia-mais { font: bold 13px Arial, sans-serif; }

  #anuncio-lateral {
    width: 170px;
    flex-shrink: 0;
    padding: 30px 14px 16px;
    font-size: 22px;
    line-height: 1.1;
    text-align: center;
  }
  #anuncio-lateral span.grande {
    display: block;
    margin-top: 8px;
    font-size: 40px;
    color: #e8178a;
  }

  .rodape {
    padding: 16px 24px;
    font: 13px Arial, sans-serif;
    color: #f6f1e6;
    background: #1f1d1a;
  }

  @media (max-width: 560px) {
    .marca { font-size: 30px; }
    #banner-topo { font-size: 17px; }
    main { flex-direction: column; padding: 14px; }
    #anuncio-lateral { width: auto; }
  }
</style>`;

const TOPO = `<header class="cabecalho">
  <p class="marca">Jornal da Vila</p>
  <p class="data">Edição de domingo</p>
  <nav class="menu"><a href="#">Notícias</a><a href="#">Esportes</a><a href="#">Cultura</a></nav>
</header>`;

const NOTICIAS = `<section id="noticias">
    <article class="noticia" id="noticia-praca">
      <h3>Praça da Vila ganha balanço novo</h3>
      <p>A criançada comemorou a chegada do brinquedo, pintado de azul pelos moradores.</p>
      <a class="leia-mais" href="#">Leia mais</a>
    </article>
    <article class="noticia" id="noticia-feira">
      <h3>Feira de domingo bate recorde de pastel</h3>
      <p>Foram 800 pastéis vendidos antes do meio-dia, segundo a barraca da Dona Célia.</p>
      <a class="leia-mais" href="#">Leia mais</a>
    </article>
    <article class="noticia" id="noticia-time">
      <h3>Time da vila vence a final do bairro</h3>
      <p>O gol da vitória saiu no último minuto, de cabeça, pelo goleiro.</p>
      <a class="leia-mais" href="#">Leia mais</a>
    </article>
  </section>`;

const RODAPE = `<footer id="rodape" class="rodape">Jornal da Vila. Notícias do bairro desde 1998.</footer>`;

/** O jornal bagunçado: banner, pop-up de cookies e anúncio lateral. */
const BODY_JORNAL = `<div id="banner-topo" class="anuncio">
  <span class="anuncio-selo">Anúncio</span>
  <strong>MEGA PROMOÇÃO!</strong> Sapatos com 90% de desconto. Só hoje!
</div>
${TOPO}
<div id="popup-cookies" class="popup">
  <p><strong>Cookies!</strong> Este site usa cookies para lembrar de você.</p>
  <button class="popup-botao">Aceitar tudo</button>
</div>
<main>
  ${NOTICIAS}
  <aside id="anuncio-lateral" class="anuncio">
    <span class="anuncio-selo">Anúncio</span>
    Compre já!
    <span class="grande">SÓ HOJE</span>
  </aside>
</main>
${RODAPE}`;

/** O jornal depois da faxina: sem anúncios e sem pop-up. */
const BODY_JORNAL_LIMPO = `${TOPO}
<main>
  ${NOTICIAS}
</main>
${RODAPE}`;

const BASE = {
  url: "jornal-da-vila.site",
  titulo: "Site do Jornal da Vila",
  head: HEAD_JORNAL,
};

export const SITE_JORNAL: SiteAlvo = { ...BASE, body: BODY_JORNAL };

export const SITE_JORNAL_LIMPO: SiteAlvo = { ...BASE, body: BODY_JORNAL_LIMPO };
