/*
 * Site-alvo dos micro-passos da L2: "Livraria Página Virada".
 *
 * O menu (nav ul) começa empilhado, do jeito que a L1 corrigiria com
 * inline-block; aqui o jogador resolve o MESMO problema com flexbox, mais
 * simples. Os cards de livro (.cards > .livro) começam como divs comuns
 * (block, colados, sem alinhamento), com alturas diferentes de propósito
 * (.livro-alto, .livro-medio, .livro-baixo) para o align-items ter efeito
 * visível.
 *
 * Âncoras naturais: nav ul, .cards, .livro-alto, .livro-medio,
 * .livro-baixo, .preco-livro.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_LIVRARIA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Livraria Página Virada</title>`;

const BODY_LIVRARIA = `<header>
  <h1>Livraria Página Virada</h1>
  <nav>
    <ul>
      <li><a href="#romance">Romance</a></li>
      <li><a href="#suspense">Suspense</a></li>
      <li><a href="#infantil">Infantil</a></li>
    </ul>
  </nav>
</header>
<main>
  <h2>Destaques da semana</h2>
  <div class="cards">
    <div class="livro livro-alto">
      <h3>Noites de Chuva</h3>
      <p class="preco-livro">R$ 42</p>
    </div>
    <div class="livro livro-baixo">
      <h3>O Enigma</h3>
      <p class="preco-livro">R$ 35</p>
    </div>
    <div class="livro livro-medio">
      <h3>Contos da Vila</h3>
      <p class="preco-livro">R$ 28</p>
    </div>
  </div>
</main>
<footer>
  <p>Livraria Página Virada, Praça das Letras, 8</p>
  <ul class="redes">
    <li>Instagram</li>
    <li>WhatsApp</li>
  </ul>
</footer>`;

export const CSS_LIVRARIA = `body {
  font-family: Arial, sans-serif;
  color: #3a3a3a;
  background-color: #faf6f0;
  margin: 0;
}

header {
  background-color: #6a4c93;
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
  color: #6a4c93;
  font-size: 20px;
}

.cards {
  margin: 0;
}

.livro {
  background-color: white;
  border: 2px solid #e0d6ee;
  border-radius: 12px;
  padding: 12px;
}

.livro-alto {
  padding-bottom: 48px;
}

.livro-medio {
  padding-bottom: 24px;
}

.livro-baixo {
  padding-bottom: 4px;
}

.livro h3 {
  margin: 0 0 4px;
  font-size: 16px;
}

.preco-livro {
  color: #6a4c93;
  font-weight: bold;
  margin: 0;
}

footer {
  background-color: #3a2e56;
  color: #d9d2e9;
  font-size: 14px;
  padding: 12px 24px;
}

.redes {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
}`;

export const LIVRARIA_PAGINA_VIRADA: SiteAlvo = {
  url: "paginavirada.livraria.site",
  titulo: "Livraria Página Virada",
  head: HEAD_LIVRARIA,
  body: BODY_LIVRARIA,
  css: CSS_LIVRARIA,
};
