/*
 * Site-alvo dos micro-passos da E2: "Livraria Página Virada".
 *
 * Pensado pra ensinar seletores: h3 (tag, todos os títulos), .autor e
 * .preco (classe, repetidas em cada livro) e um id único no livro mais
 * vendido. O <aside class="chamada"> tem outro parágrafo com a MESMA
 * class .autor (uma citação, não um autor de livro): serve pra mostrar
 * que .autor sozinho pega os dois, e o seletor descendente (main .autor)
 * pega só os de dentro dos livros.
 *
 * Âncoras naturais: header, h1, aside.chamada, main, h2, .livro
 * (#livro-mais-vendido é o primeiro), h3, .autor, .preco, footer.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_LIVRARIA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Livraria Página Virada</title>`;

const BODY_LIVRARIA = `<header>
  <h1>Livraria Página Virada</h1>
</header>
<aside class="chamada">
  <p class="autor">"Um livro é um sonho que você segura nas mãos." — um autor famoso</p>
</aside>
<main>
  <h2>Destaques da semana</h2>
  <article class="livro" id="livro-mais-vendido">
    <h3>O Mistério do Farol</h3>
    <p class="autor">Camila Duarte</p>
    <p class="preco">R$ 39</p>
  </article>
  <article class="livro">
    <h3>Viagem ao Sul</h3>
    <p class="autor">Renato Alves</p>
    <p class="preco">R$ 45</p>
  </article>
  <article class="livro">
    <h3>Receitas da Vovó</h3>
    <p class="autor">Iracema Souza</p>
    <p class="preco">R$ 28</p>
  </article>
</main>
<footer>
  <p>Livraria Página Virada, Rua dos Leitores, 200</p>
</footer>`;

export const CSS_LIVRARIA = `body {
  font-family: Arial, sans-serif;
  color: #333333;
  background-color: #fdfdfb;
  margin: 0;
}

header {
  background-color: #cccccc;
  padding: 16px 24px;
}

h1 {
  margin: 0;
  font-size: 22px;
  color: #666666;
}

.chamada {
  padding: 8px 24px;
  font-style: italic;
}

main {
  padding: 8px 24px;
}

h2 {
  color: #888888;
  font-size: 18px;
}

.livro {
  border: 1px solid #dddddd;
  padding: 10px;
  margin-bottom: 10px;
}

h3 {
  margin: 0 0 4px;
  font-size: 16px;
}

.autor {
  margin: 0 0 4px;
  font-size: 13px;
  color: #999999;
}

.preco {
  margin: 0;
  color: #cccccc;
}

footer {
  padding: 10px 24px;
  font-size: 12px;
  color: #999999;
}`;

export const LIVRARIA_PAGINA_VIRADA: SiteAlvo = {
  url: "paginavirada.livraria.site",
  titulo: "Site da Livraria Página Virada",
  head: HEAD_LIVRARIA,
  body: BODY_LIVRARIA,
  css: CSS_LIVRARIA,
};
