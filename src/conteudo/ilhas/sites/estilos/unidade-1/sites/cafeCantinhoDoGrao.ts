/*
 * Site-alvo do desafio da E1: "Café Cantinho do Grão".
 *
 * Diferente da floricultura de propósito: outro assunto, um menu de links
 * no topo, um cardápio em lista com uma linha vermelha tracejada (feia) e
 * um prato especial sem regra nenhuma. A identidade está "errada" (azul de
 * banco, fonte comum, título pequeno): o desafio é repaginar a cafeteria
 * só pelo CSS.
 *
 * Por que a parte de desligar é a borda dos itens, e não o sublinhado do
 * menu: a folha do navegador também sublinha links (a:-webkit-any-link),
 * então desligar o text-decoration do site não tiraria o sublinhado. A
 * borda só existe na folha do site: desligou, sumiu.
 *
 * Sem @media na folha (ver a floricultura). Âncoras: h1, .menu a,
 * .cardapio, .item, .especial, footer.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_CAFE = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Café Cantinho do Grão</title>`;

const BODY_CAFE = `<header class="topo">
  <h1>Café Cantinho do Grão</h1>
  <nav class="menu">
    <a href="#cardapio">Cardápio</a>
    <a href="#endereco">Onde fica</a>
  </nav>
</header>
<section id="cardapio" class="cardapio">
  <h2>Cardápio do dia</h2>
  <ul>
    <li class="item">Café coado na hora, R$ 6</li>
    <li class="item">Pão de queijo quentinho, R$ 5</li>
    <li class="item">Bolo de fubá com goiabada, R$ 9</li>
  </ul>
  <p class="especial">Especial da casa: cappuccino com canela, R$ 12</p>
</section>
<footer id="endereco">
  <p>Praça do Coreto, 7. Abrimos às 7h.</p>
</footer>`;

export const CSS_CAFE = `body {
  font-family: Verdana, sans-serif;
  color: #333333;
  background-color: #f4f6f8;
  margin: 0;
}

.topo {
  background-color: #1f3b73;
  padding: 16px 20px;
}

h1 {
  color: #c9d6ee;
  font-size: 22px;
  margin: 0 0 8px;
}

.menu a {
  color: #ffffff;
  text-decoration: underline;
  margin-right: 16px;
}

.cardapio {
  padding: 12px 20px;
}

h2 {
  font-size: 20px;
}

.item {
  padding: 4px 0;
  border-bottom: 2px dashed #ff5a5a;
}

footer {
  padding: 12px 20px;
  font-size: 14px;
}`;

export const CAFE_CANTINHO_DO_GRAO: SiteAlvo = {
  url: "cantinhodograo.cafe.site",
  titulo: "Café Cantinho do Grão",
  head: HEAD_CAFE,
  body: BODY_CAFE,
  css: CSS_CAFE,
};
