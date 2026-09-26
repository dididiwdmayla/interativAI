/*
 * Site-alvo do desafio da E4: "Academia Corpo Ativo".
 *
 * Três regras que não pegam, exatamente como o mapa curricular pede:
 * - #marca (prata) vence h1 (laranja), mesmo vindo antes no arquivo;
 * - .titulo-plano (azul-marinho) vence main h2 (vermelho), de novo sem
 *   ser por ordem;
 * - .valor tem color: gray !important, travado.
 *
 * Âncoras: header, h1#marca, main, h2.titulo-plano, article.plano, h3,
 * .valor, footer.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_ACADEMIA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Academia Corpo Ativo</title>`;

const BODY_ACADEMIA = `<header>
  <h1 id="marca">Academia Corpo Ativo</h1>
</header>
<main>
  <h2 class="titulo-plano">Planos disponíveis</h2>
  <article class="plano">
    <h3>Plano Mensal</h3>
    <p class="valor">R$ 89</p>
  </article>
</main>
<footer>
  <p>Academia Corpo Ativo, Rua do Ginásio, 20</p>
</footer>`;

export const CSS_ACADEMIA = `body {
  font-family: Arial, sans-serif;
  color: #222222;
  margin: 0;
}

header {
  background-color: #1b998b;
  padding: 16px 24px;
}

#marca {
  color: silver;
}

h1 {
  color: orange;
}

main {
  padding: 8px 24px;
}

.titulo-plano {
  color: navy;
}

main h2 {
  color: crimson;
}

.plano {
  background-color: #ffffff;
  padding: 16px;
  border: 2px solid #1b998b;
  margin-bottom: 16px;
}

.plano h3 {
  margin: 0;
  font-size: 16px;
}

.valor {
  color: gray !important;
  font-weight: bold;
  margin: 0;
}

footer {
  background-color: #1b998b;
  color: #ffffff;
  font-size: 12px;
  padding: 10px 24px;
}`;

export const ACADEMIA_CORPO_ATIVO: SiteAlvo = {
  url: "corpoativo.academia.site",
  titulo: "Site da Academia Corpo Ativo",
  head: HEAD_ACADEMIA,
  body: BODY_ACADEMIA,
  css: CSS_ACADEMIA,
};
