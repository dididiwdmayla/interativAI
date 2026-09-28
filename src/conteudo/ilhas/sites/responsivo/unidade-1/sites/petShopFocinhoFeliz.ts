/*
 * Site-alvo da R1, Fase 2: "Pet Shop Focinho Feliz".
 *
 * `modoDocumento: true` na fase (não aqui: é a fase que decide). O head
 * NÃO tem `<meta name="viewport">` de propósito: é o ponto de partida
 * para o jogador ver a simulação de 980px e depois consertar.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_PET_SHOP = `<meta charset="utf-8">
<title>Pet Shop Focinho Feliz</title>`;

const BODY_PET_SHOP = `<header>
  <h1>Pet Shop Focinho Feliz</h1>
  <p>Banho, tosa e um mundo de mimo</p>
</header>
<main>
  <p class="banner-promocao">Setembro: 20% de desconto no primeiro banho</p>
  <section id="banho-e-tosa">
    <h2>Banho e tosa</h2>
    <p class="servico">Banho (cães pequenos) <span class="preco">R$ 45</span></p>
    <p class="servico">Tosa higiênica <span class="preco">R$ 30</span></p>
  </section>
  <section id="veterinaria">
    <h2>Consultas</h2>
    <p class="servico">Consulta de rotina <span class="preco">R$ 120</span></p>
  </section>
</main>
<footer>
  <p>Avenida dos Bichanos, 88</p>
</footer>`;

const CSS_PET_SHOP = `body {
  margin: 0;
  font-family: Verdana, sans-serif;
  color: #1f2937;
  background-color: #ecfeff;
}

header {
  padding: 28px 36px;
  background-color: #0891b2;
  color: white;
}

h1 {
  margin: 0 0 8px;
  font-size: 30px;
}

main {
  padding: 24px 36px;
}

.servico {
  margin-bottom: 12px;
}

.banner-promocao {
  width: 500px;
  padding: 10px 16px;
  background-color: #fde68a;
  color: #78350f;
  font-weight: bold;
  border-radius: 8px;
}

.preco {
  font-weight: bold;
}

footer {
  padding: 16px 36px;
  background-color: #164e63;
  color: #a5f3fc;
}`;

export const PET_SHOP_FOCINHO_FELIZ: SiteAlvo = {
  url: "focinhofeliz.com.br",
  titulo: "Pet Shop Focinho Feliz",
  head: HEAD_PET_SHOP,
  body: BODY_PET_SHOP,
  css: CSS_PET_SHOP,
};
