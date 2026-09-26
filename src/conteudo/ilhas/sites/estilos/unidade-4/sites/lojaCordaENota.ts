/*
 * Site-alvo dos micro-passos da E4: "Corda & Nota".
 *
 * Cheio de regras que competem de propósito, na ordem ERRADA pra quem
 * pensa "a última regra do arquivo sempre vence":
 * - #topo (dourado) vem ANTES de h1 (azul) no arquivo, mas #topo vence
 *   (especificidade, não ordem);
 * - .titulo-secao (teal) vem ANTES de main h2 (roxo), e TAMBÉM vence
 *   (uma classe bate duas tags, de novo não é ordem);
 * - header tem background-color: green !important, e .preco tem
 *   color: crimson !important;
 * - .descricao não tem cor própria: herda o roxo do article.instrumento.
 *
 * Âncoras: header, h1#topo, main, h2.titulo-secao, article.instrumento,
 * h3, .descricao, .preco, footer.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_CORDA_E_NOTA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Corda & Nota</title>`;

const BODY_CORDA_E_NOTA = `<header>
  <h1 id="topo">Corda &amp; Nota</h1>
</header>
<main>
  <h2 class="titulo-secao">Violões em destaque</h2>
  <article class="instrumento">
    <h3>Violão Clássico</h3>
    <p class="descricao">Cordas de nylon, ótimo para iniciantes.</p>
    <p class="preco">R$ 450</p>
  </article>
</main>
<footer>
  <p>Corda &amp; Nota, Rua da Música, 5</p>
</footer>`;

export const CSS_CORDA_E_NOTA = `body {
  font-family: Arial, sans-serif;
  color: #333333;
  margin: 0;
}

header {
  background-color: green !important;
  padding: 16px 24px;
}

#topo {
  color: gold;
}

h1 {
  color: blue;
}

main {
  padding: 8px 24px;
}

.titulo-secao {
  color: teal;
}

main h2 {
  color: purple;
}

.instrumento {
  color: #3d348b;
}

.instrumento h3 {
  margin: 0;
  font-size: 16px;
}

.descricao {
  margin: 0 0 4px;
  font-size: 14px;
}

.preco {
  color: crimson !important;
  font-weight: bold;
  margin: 0;
}

footer {
  background-color: #3d348b;
  color: #ffffff;
  font-size: 12px;
  padding: 10px 24px;
}`;

export const LOJA_CORDA_E_NOTA: SiteAlvo = {
  url: "cordaenota.instrumentos.site",
  titulo: "Site da loja Corda & Nota",
  head: HEAD_CORDA_E_NOTA,
  body: BODY_CORDA_E_NOTA,
  css: CSS_CORDA_E_NOTA,
};
