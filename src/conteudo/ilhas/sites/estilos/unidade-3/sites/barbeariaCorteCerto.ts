/*
 * Site-alvo do desafio da E3: "Barbearia Corte Certo".
 *
 * Diferente da confeitaria (outro assunto, outro visual): os planos
 * (.plano) estão espremidos (sem padding, border nem margin, colados um
 * no outro) e o banner de promoção tem largura 100% com padding, sem
 * box-sizing — a mesma armadilha do bloco do WhatsApp, agora pra
 * resolver sem passo a passo.
 *
 * Âncoras: header, h1, main, h2, .plano (dois, sem id), h3, .preco,
 * .banner-promocao, footer.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_BARBEARIA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Barbearia Corte Certo</title>`;

const BODY_BARBEARIA = `<header>
  <h1>Barbearia Corte Certo</h1>
</header>
<main>
  <h2>Nossos planos</h2>
  <article class="plano">
    <h3>Corte simples</h3>
    <p class="preco">R$ 35</p>
  </article>
  <article class="plano">
    <h3>Corte e barba</h3>
    <p class="preco">R$ 55</p>
  </article>
  <div class="banner-promocao">Agende pelo WhatsApp e ganhe 10% de desconto</div>
</main>
<footer>
  <p>Barbearia Corte Certo, Avenida dos Barbeiros, 88</p>
</footer>`;

export const CSS_BARBEARIA = `body {
  font-family: Arial, sans-serif;
  color: #222222;
  background-color: #f5f5f5;
  margin: 0;
}

header {
  background-color: #2a6f97;
  padding: 16px 24px;
}

h1 {
  margin: 0;
  color: #ffffff;
  font-size: 24px;
}

main {
  padding: 8px 24px;
}

h2 {
  color: #2a6f97;
  font-size: 18px;
}

.plano {
  background-color: #ffffff;
}

.plano h3 {
  margin: 0;
  font-size: 16px;
}

.preco {
  margin: 0;
  color: #2a6f97;
  font-weight: bold;
}

.banner-promocao {
  display: block;
  width: 100%;
  background-color: #2a6f97;
  color: #ffffff;
  text-align: center;
  padding: 14px;
}

footer {
  background-color: #2a6f97;
  color: #ffffff;
  font-size: 12px;
  padding: 10px 24px;
}`;

export const BARBEARIA_CORTE_CERTO: SiteAlvo = {
  url: "cortecerto.barbearia.site",
  titulo: "Site da Barbearia Corte Certo",
  head: HEAD_BARBEARIA,
  body: BODY_BARBEARIA,
  css: CSS_BARBEARIA,
};
