/*
 * Site-alvo da P1, Fase 2: "Loja Estação Moda".
 *
 * Três problemas de propósito: título pulando de h1 para h3 (sem h2), um
 * texto de pouco contraste (.frete-gratis) e um link de rede social sem
 * texto nem aria-label.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_ESTACAO = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Estação Moda</title>`;

const BODY_ESTACAO = `<header>
  <h1>Estação Moda</h1>
  <p class="frete-gratis">Frete grátis em compras acima de R$ 150</p>
</header>
<main>
  <h3>Coleção de inverno</h3>
  <p>Casacos, blusas de lã e botas, com até 30% de desconto.</p>
  <a class="rede-social" href="https://instagram.com/estacaomoda"><span class="icone"></span></a>
</main>
<footer>
  <p>Rua da Moda, 88</p>
</footer>`;

const CSS_ESTACAO = `body {
  margin: 0;
  font-family: Arial, sans-serif;
  color: #1e1b4b;
  background-color: #fff;
}

header {
  padding: 20px 28px;
  background-color: #4338ca;
  color: white;
}

.frete-gratis {
  color: #a5b4fc;
  margin: 4px 0 0;
}

main {
  padding: 20px 28px;
}

.rede-social {
  display: inline-block;
  width: 32px;
  height: 32px;
  background-color: #4338ca;
  border-radius: 50%;
}

.icone {
  display: block;
  width: 100%;
  height: 100%;
}

footer {
  padding: 14px 28px;
  background-color: #1e1b4b;
  color: #c7d2fe;
}`;

export const LOJA_ESTACAO_MODA: SiteAlvo = {
  url: "estacaomoda.com.br",
  titulo: "Estação Moda",
  head: HEAD_ESTACAO,
  body: BODY_ESTACAO,
  css: CSS_ESTACAO,
};
