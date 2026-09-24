/*
 * Site-alvo do desafio da Unidade 2: "Brinquedos Arco-Íris".
 *
 * Uma loja diferente do jornal (outro assunto, outro visual, outra
 * estrutura), para o jogador provar que sabe fazer a faxina sozinho num
 * contexto novo. Tem pop-up de oferta flutuando por cima da vitrine,
 * banner no topo e anúncio do lado. As "fotos" dos produtos são desenhos
 * de CSS (nada de imagem externa).
 *
 * Âncoras: #popup-oferta, #banner-topo, #anuncio-lateral, #vitrine e
 * .produto (com h3 no nome).
 *
 * É "o site de outra pessoa": como todo arquivo em sites/, tem cores
 * próprias e fixas, fora dos tokens do jogo.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_BRINQUEDOS = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Brinquedos Arco-Íris</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    font-family: "Trebuchet MS", Verdana, sans-serif;
    color: #2d2350;
    background: #fdfbff;
  }

  .anuncio {
    position: relative;
    color: #ffffff;
    background: linear-gradient(90deg, #ff4d4d, #ff9f1c, #2ec4b6, #3a86ff, #8338ec);
  }
  .anuncio-selo {
    position: absolute;
    top: 4px;
    right: 8px;
    padding: 1px 6px;
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #2d2350;
    background: #ffffff;
    border-radius: 4px;
  }
  #banner-topo {
    padding: 12px 70px 12px 18px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    text-shadow: 0 2px 0 #2d2350;
  }

  .topo {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 22px;
    background: #fff4d6;
    border-bottom: 6px solid #ffd23f;
  }
  .logo {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: conic-gradient(#ff4d4d, #ff9f1c, #ffd23f, #2ec4b6, #3a86ff, #8338ec, #ff4d4d);
    border: 4px solid #ffffff;
    box-shadow: 0 3px 0 #2d2350;
  }
  .marca { margin: 0; font-size: 28px; font-weight: bold; }
  .slogan { margin: 2px 0 0; font-size: 14px; color: #6a5d9a; }

  /* Pop-up flutuando por cima da vitrine */
  #popup-oferta {
    position: fixed;
    top: 90px;
    left: 50%;
    z-index: 10;
    width: min(320px, 86vw);
    padding: 18px;
    text-align: center;
    background: #ffffff;
    border: 5px solid #8338ec;
    border-radius: 22px;
    box-shadow: 0 10px 0 #2d2350;
    transform: translateX(-50%) rotate(-2deg);
  }
  #popup-oferta h2 { margin: 0 0 6px; font-size: 24px; color: #ff4d4d; }
  #popup-oferta p { margin: 0 0 12px; }
  #popup-oferta button {
    padding: 8px 18px;
    font: bold 15px "Trebuchet MS", sans-serif;
    color: #ffffff;
    background: #2ec4b6;
    border: none;
    border-radius: 999px;
    box-shadow: 0 4px 0 #1a7f76;
  }

  .loja {
    display: flex;
    gap: 16px;
    padding: 18px 22px 26px;
  }
  #vitrine {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 14px;
    align-content: start;
  }
  .produto {
    padding: 12px;
    text-align: center;
    background: #ffffff;
    border: 3px solid #e7e0ff;
    border-radius: 18px;
    box-shadow: 0 5px 0 #e7e0ff;
  }
  .produto h3 { margin: 8px 0 2px; font-size: 16px; }
  .preco { margin: 0 0 8px; font-weight: bold; color: #8338ec; }
  .produto button {
    padding: 6px 14px;
    font: bold 13px "Trebuchet MS", sans-serif;
    color: #ffffff;
    background: #ff9f1c;
    border: none;
    border-radius: 999px;
  }

  /* Fotos desenhadas com CSS */
  .foto { height: 86px; border-radius: 12px; }
  .foto-urso {
    background:
      radial-gradient(circle at 34% 30%, #8b5a2b 0 12px, transparent 13px),
      radial-gradient(circle at 66% 30%, #8b5a2b 0 12px, transparent 13px),
      radial-gradient(circle at 50% 58%, #a0673a 0 28px, transparent 29px),
      #ffe8cc;
  }
  .foto-carro {
    background:
      radial-gradient(circle at 32% 72%, #2d2350 0 9px, transparent 10px),
      radial-gradient(circle at 68% 72%, #2d2350 0 9px, transparent 10px),
      linear-gradient(#ff4d4d, #ff4d4d) center 46% / 70% 26% no-repeat,
      linear-gradient(#ff7b7b, #ff7b7b) 45% 26% / 36% 22% no-repeat,
      #dff6ff;
  }
  .foto-quebra {
    background: conic-gradient(#3a86ff 25%, #ffd23f 0 50%, #3a86ff 0 75%, #ffd23f 0) 0 0 / 43px 43px;
  }
  .foto-massinha {
    background:
      radial-gradient(circle at 30% 40%, #ff4d4d 0 16px, transparent 17px),
      radial-gradient(circle at 62% 34%, #2ec4b6 0 14px, transparent 15px),
      radial-gradient(circle at 50% 70%, #8338ec 0 16px, transparent 17px),
      #fff7e0;
  }

  #anuncio-lateral {
    width: 150px;
    flex-shrink: 0;
    padding: 28px 12px 16px;
    font-size: 20px;
    font-weight: bold;
    line-height: 1.15;
    text-align: center;
    border-radius: 18px;
    text-shadow: 0 2px 0 #2d2350;
  }

  .rodape {
    padding: 14px 22px;
    font-size: 13px;
    color: #ffffff;
    background: #2d2350;
  }

  @media (max-width: 560px) {
    .loja { flex-direction: column; padding: 14px; }
    #anuncio-lateral { width: auto; }
    .marca { font-size: 22px; }
  }
</style>`;

const BODY_BRINQUEDOS = `<div id="banner-topo" class="anuncio">
  <span class="anuncio-selo">Anúncio</span>
  FRETE GRÁTIS para a galáxia inteira!
</div>
<header class="topo">
  <div class="logo"></div>
  <div>
    <p class="marca">Brinquedos Arco-Íris</p>
    <p class="slogan">Diversão de todas as cores</p>
  </div>
</header>
<div id="popup-oferta">
  <h2>Oferta relâmpago!</h2>
  <p>Tudo pela metade do preço nos próximos 3 minutos.</p>
  <button>Quero agora</button>
</div>
<main class="loja">
  <section id="vitrine">
    <article class="produto">
      <div class="foto foto-urso"></div>
      <h3>Urso de pelúcia</h3>
      <p class="preco">R$ 59,90</p>
      <button>Comprar</button>
    </article>
    <article class="produto">
      <div class="foto foto-carro"></div>
      <h3>Carrinho de corrida</h3>
      <p class="preco">R$ 39,90</p>
      <button>Comprar</button>
    </article>
    <article class="produto">
      <div class="foto foto-quebra"></div>
      <h3>Quebra-cabeça de 500 peças</h3>
      <p class="preco">R$ 49,90</p>
      <button>Comprar</button>
    </article>
    <article class="produto">
      <div class="foto foto-massinha"></div>
      <h3>Kit de massinha</h3>
      <p class="preco">R$ 29,90</p>
      <button>Comprar</button>
    </article>
  </section>
  <aside id="anuncio-lateral" class="anuncio">
    <span class="anuncio-selo">Anúncio</span>
    Clique aqui e ganhe um prêmio!
  </aside>
</main>
<footer class="rodape">Brinquedos Arco-Íris. Loja fictícia feita para treinar faxina de site.</footer>`;

export const SITE_BRINQUEDOS: SiteAlvo = {
  url: "brinquedos-arco-iris.site",
  titulo: "Site da loja Brinquedos Arco-Íris",
  head: HEAD_BRINQUEDOS,
  body: BODY_BRINQUEDOS,
};
