/*
 * Site-alvo do desafio da E2: "Mercadinho Preço Bom".
 *
 * Diferente da livraria (outro assunto, outro visual): uma seção de ofertas
 * com produtos em promoção (class .promocao), um deles com id único
 * (#oferta-relampago), e um aviso solto fora da seção (aside.chamada, com a
 * mesma class .preco dos produtos) — a mesma armadilha da citação da
 * livraria, agora com preço.
 *
 * Âncoras: header, h1, main, #ofertas, h2, .produto, .promocao,
 * #oferta-relampago, h3, .preco, aside.chamada, footer.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_MERCADINHO = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mercadinho Preço Bom</title>`;

const BODY_MERCADINHO = `<header>
  <h1>Mercadinho Preço Bom</h1>
</header>
<main>
  <section id="ofertas">
    <h2>Ofertas da semana</h2>
    <article class="produto promocao">
      <h3>Arroz 5kg</h3>
      <p class="preco">R$ 18</p>
    </article>
    <article class="produto promocao" id="oferta-relampago">
      <h3>Óleo de soja</h3>
      <p class="preco">R$ 6</p>
    </article>
    <article class="produto">
      <h3>Feijão 1kg</h3>
      <p class="preco">R$ 7</p>
    </article>
  </section>
  <aside class="chamada">
    <p class="preco">Preços sujeitos a alteração sem aviso</p>
  </aside>
</main>
<footer>
  <p>Mercadinho Preço Bom, Avenida Central, 500</p>
</footer>`;

export const CSS_MERCADINHO = `body {
  font-family: Arial, sans-serif;
  color: #333333;
  background-color: #ffffff;
  margin: 0;
}

header {
  background-color: #dddddd;
  padding: 16px 24px;
}

h1 {
  margin: 0;
  font-size: 22px;
}

main {
  padding: 8px 24px;
}

h2 {
  font-size: 18px;
  color: #555555;
}

.produto {
  border: 1px solid #eeeeee;
  padding: 10px;
  margin-bottom: 10px;
}

h3 {
  margin: 0 0 4px;
  font-size: 15px;
}

.preco {
  margin: 0;
  color: #555555;
}

.chamada {
  padding: 8px 0;
  font-size: 12px;
}

footer {
  padding: 10px 24px;
  font-size: 12px;
  color: #999999;
}`;

export const MERCADINHO_PRECO_BOM: SiteAlvo = {
  url: "precobom.mercadinho.site",
  titulo: "Site do Mercadinho Preço Bom",
  head: HEAD_MERCADINHO,
  body: BODY_MERCADINHO,
  css: CSS_MERCADINHO,
};
