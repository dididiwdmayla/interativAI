/*
 * Site-alvo do desafio da R2: "Restaurante Sabor da Vila" (o site do
 * MAPA-CURRICULAR.md para esta unidade: "deixar o site de um restaurante
 * bom no celular com media queries").
 *
 * Escrito desktop first, de propósito (cabeçalho em row, cardápio em
 * grid de 3 colunas, foto com largura fixa): o jogador precisa
 * acrescentar a @media, tornar a foto responsiva e resolver o cabeçalho,
 * sem passo a passo.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_RESTAURANTE = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sabor da Vila</title>`;

const BODY_RESTAURANTE = `<header class="cabecalho">
  <h1>Sabor da Vila</h1>
  <nav>
    <ul>
      <li><a href="#cardapio">Cardápio</a></li>
      <li><a href="#reservas">Reservas</a></li>
    </ul>
  </nav>
</header>
<main>
  <img class="foto-salao" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='300'%3E%3Crect width='560' height='300' fill='%237c2d12'/%3E%3C/svg%3E" alt="Salão do restaurante com mesas postas">
  <section id="cardapio" class="cardapio">
    <article><h2>Feijoada</h2><p>R$ 42</p></article>
    <article><h2>Moqueca</h2><p>R$ 48</p></article>
    <article><h2>Risoto</h2><p>R$ 39</p></article>
  </section>
</main>
<footer>
  <p>Praça da Vila, 5</p>
</footer>`;

const CSS_RESTAURANTE = `body {
  margin: 0;
  font-family: Georgia, serif;
  color: #431407;
  background-color: #fff7ed;
}

.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background-color: #7c2d12;
  color: white;
}

.cabecalho nav ul {
  display: flex;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.cabecalho a {
  color: white;
  text-decoration: none;
}

.foto-salao {
  width: 560px;
  display: block;
  margin: 16px auto;
}

.cardapio {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  padding: 0 32px 24px;
}

.cardapio article {
  padding: 14px;
  border: 2px solid #fdba74;
  border-radius: 8px;
}

footer {
  padding: 14px 32px;
  background-color: #431407;
  color: #fed7aa;
}`;

export const RESTAURANTE_SABOR_DA_VILA: SiteAlvo = {
  url: "sabordavila.com.br",
  titulo: "Sabor da Vila",
  head: HEAD_RESTAURANTE,
  body: BODY_RESTAURANTE,
  css: CSS_RESTAURANTE,
};
