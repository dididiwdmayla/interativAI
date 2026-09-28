import type { SiteAlvo } from "@/conteudo/tipos";

/**
 * P2, Fase 1: o Cantinho da Bia, o site pessoal de uma menina que desenha.
 * Já vem pronto e bem feito (head completo, header, main, footer, uma
 * @media para telas estreitas e notas altas no Lighthouse): a fase não é
 * sobre consertar, é sobre CONFERIR e LEVAR PRO MUNDO. O CSS mora na
 * folha editável, que vira o style.css do .zip.
 */
export const SITE_CANTINHO_DA_BIA: SiteAlvo = {
  url: "cantinhodabia.site",
  titulo: "Cantinho da Bia",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cantinho da Bia</title>`,
  body: `<header>
  <h1>Cantinho da Bia</h1>
  <p>Desenhos, gatos e histórias em quadrinhos.</p>
</header>
<main>
  <section>
    <h2>Meus desenhos</h2>
    <p>Eu desenho todo dia depois da escola. Meu favorito é o gato astronauta.</p>
  </section>
  <section>
    <h2>Quem sou eu</h2>
    <p>Tenho 12 anos, moro com dois gatos e quero fazer jogos quando crescer.</p>
  </section>
</main>
<footer>
  <p>Feito pela Bia, com HTML e CSS.</p>
</footer>`,
  css: `body {
  margin: 0;
  font-family: Verdana, sans-serif;
  color: #2b2d42;
  background-color: #fdf8f0;
}

header {
  padding: 24px;
  background-color: #ffe3c2;
}

h1 {
  margin: 0;
  color: #8a3b12;
  font-size: 2.4rem;
}

main {
  padding: 16px 24px;
}

footer {
  padding: 16px 24px;
  background-color: #2b2d42;
  color: #ffffff;
}

@media (max-width: 600px) {
  h1 {
    font-size: 1.6rem;
  }
}
`,
};
