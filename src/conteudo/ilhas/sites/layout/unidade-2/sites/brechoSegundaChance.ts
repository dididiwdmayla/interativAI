/*
 * Site-alvo do desafio da L2: "Brechó Segunda Chance" (roupas usadas).
 *
 * Site NOVO: outro assunto (brechó), outros nomes (.produtos, .roupa-*,
 * .preco-roupa), sem os ids da livraria. Junta as quatro habilidades da
 * unidade: flex no menu, justify-content e align-items nos produtos, gap
 * e flex-wrap.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_BRECHO = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Brechó Segunda Chance</title>`;

const BODY_BRECHO = `<header>
  <h1>Brechó Segunda Chance</h1>
  <nav>
    <ul>
      <li><a href="#roupas">Roupas</a></li>
      <li><a href="#acessorios">Acessórios</a></li>
      <li><a href="#calcados">Calçados</a></li>
    </ul>
  </nav>
</header>
<main>
  <h2>Peças da semana</h2>
  <div class="produtos">
    <div class="roupa roupa-alta">
      <h3>Jaqueta jeans</h3>
      <p class="preco-roupa">R$ 60</p>
    </div>
    <div class="roupa roupa-baixa">
      <h3>Camisa listrada</h3>
      <p class="preco-roupa">R$ 25</p>
    </div>
    <div class="roupa roupa-media">
      <h3>Vestido floral</h3>
      <p class="preco-roupa">R$ 48</p>
    </div>
  </div>
</main>
<footer>
  <p>Brechó Segunda Chance, Rua da Reforma, 90</p>
</footer>`;

const CSS_BRECHO = `body {
  font-family: Arial, sans-serif;
  color: #3a3a3a;
  background-color: #fdf7f2;
  margin: 0;
}

header {
  background-color: #bb4430;
  color: white;
  padding: 16px 24px;
}

h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

nav li {
  margin-bottom: 2px;
}

nav a {
  color: white;
  text-decoration: none;
}

main {
  padding: 8px 24px;
}

h2 {
  color: #bb4430;
  font-size: 20px;
}

.produtos {
  margin: 0;
}

.roupa {
  background-color: white;
  border: 2px solid #f0dcd3;
  border-radius: 12px;
  padding: 12px;
}

.roupa-alta {
  padding-bottom: 48px;
}

.roupa-media {
  padding-bottom: 24px;
}

.roupa-baixa {
  padding-bottom: 4px;
}

.roupa h3 {
  margin: 0 0 4px;
  font-size: 16px;
}

.preco-roupa {
  color: #bb4430;
  font-weight: bold;
  margin: 0;
}

footer {
  background-color: #4a2c2a;
  color: #e8d6d1;
  font-size: 14px;
  padding: 12px 24px;
}`;

export const BRECHO_SEGUNDA_CHANCE: SiteAlvo = {
  url: "segundachance.brecho.site",
  titulo: "Brechó Segunda Chance",
  head: HEAD_BRECHO,
  body: BODY_BRECHO,
  css: CSS_BRECHO,
};
