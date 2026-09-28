/*
 * Site-alvo da R2, Fase 1: "Estúdio de Dança Passo Leve".
 *
 * Layout de duas colunas por padrão (cabeçalho em row, cards em grid),
 * pronto para ganhar uma @media (max-width) que empilha tudo na tela
 * estreita. Nenhuma @media na folha inicial: o jogador escreve a
 * primeira.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_PASSO_LEVE = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Estúdio Passo Leve</title>`;

const BODY_PASSO_LEVE = `<header class="cabecalho">
  <h1>Estúdio Passo Leve</h1>
  <nav>
    <ul>
      <li><a href="#turmas">Turmas</a></li>
      <li><a href="#horarios">Horários</a></li>
    </ul>
  </nav>
</header>
<main>
  <section id="turmas" class="cards">
    <article class="card">
      <h2>Ballet infantil</h2>
      <p>Terças e quintas, 16h</p>
    </article>
    <article class="card">
      <h2>Dança de salão</h2>
      <p>Segundas e quartas, 19h</p>
    </article>
    <article class="card">
      <h2>Zumba</h2>
      <p>Sextas, 18h</p>
    </article>
  </section>
</main>
<footer>
  <p>Rua do Compasso, 12</p>
</footer>`;

const CSS_PASSO_LEVE = `body {
  margin: 0;
  font-family: Verdana, sans-serif;
  color: #3b0764;
  background-color: #faf5ff;
}

.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background-color: #7c3aed;
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

.cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  padding: 24px 32px;
}

.card {
  padding: 16px;
  border-radius: 10px;
  background-color: #ede9fe;
  border: 2px solid #c4b5fd;
}

footer {
  padding: 14px 32px;
  background-color: #3b0764;
  color: #ddd6fe;
}`;

export const ESTUDIO_PASSO_LEVE: SiteAlvo = {
  url: "estudiopassoleve.com.br",
  titulo: "Estúdio Passo Leve",
  head: HEAD_PASSO_LEVE,
  body: BODY_PASSO_LEVE,
  css: CSS_PASSO_LEVE,
};
