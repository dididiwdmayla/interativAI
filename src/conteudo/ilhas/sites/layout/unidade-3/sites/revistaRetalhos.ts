/*
 * Site-alvo dos micro-passos da L3: "Revista Retalhos".
 *
 * Três seções para os três atos da unidade: .destaques (colunas e fr),
 * .galeria (linhas e gap) e .capa/.creditos (áreas nomeadas). As peças de
 * .capa e .creditos já têm grid-area nas próprias regras (a ligação entre
 * o nome da área e o filho): o jogador só precisa desenhar o mapa com
 * grid-template-areas no container, o que ataca direto a confusão "cada
 * filho também precisa ganhar alguma coisa nova" (não precisa: já está
 * pronto).
 *
 * Âncoras naturais: .destaques, .galeria, .capa, .creditos,
 * .capa-titulo/.capa-texto/.capa-imagem, .creditos-texto/.creditos-redes.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_REVISTA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Revista Retalhos</title>`;

const BODY_REVISTA = `<header>
  <h1>Revista Retalhos</h1>
</header>
<main>
  <h2>Destaques da edição</h2>
  <div class="destaques">
    <article class="materia"><h3>Moda de rua em alta</h3><p>Como misturar estampas sem medo.</p></article>
    <article class="materia"><h3>Receita: torta rústica</h3><p>Aproveite as sobras da geladeira.</p></article>
    <article class="materia"><h3>Plantas de apartamento</h3><p>Três espécies fáceis de cuidar.</p></article>
  </div>

  <h2>Galeria de capas antigas</h2>
  <div class="galeria">
    <div class="foto">Edição 12</div>
    <div class="foto">Edição 13</div>
    <div class="foto">Edição 14</div>
    <div class="foto">Edição 15</div>
  </div>

  <h2>Capa desta edição</h2>
  <div class="capa">
    <div class="capa-titulo">RETALHOS</div>
    <div class="capa-texto">Matéria de capa: economia criativa nos bairros</div>
    <div class="capa-imagem">Foto de capa</div>
  </div>

  <div class="creditos">
    <p class="creditos-texto">Edição de setembro</p>
    <p class="creditos-redes">Siga a revista nas redes</p>
  </div>
</main>
<footer>
  <p>Revista Retalhos, edição digital</p>
</footer>`;

export const CSS_REVISTA = `body {
  font-family: Arial, sans-serif;
  color: #2f2f2f;
  background-color: #fbf9f6;
  margin: 0;
}

header {
  background-color: #14213d;
  color: white;
  padding: 16px 24px;
}

h1 {
  margin: 0;
  font-size: 24px;
}

main {
  padding: 8px 24px;
}

h2 {
  color: #14213d;
  font-size: 20px;
}

.destaques {
  margin: 0 0 24px;
}

.materia {
  background-color: white;
  border: 2px solid #dfe3ec;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.materia h3 {
  margin: 0 0 4px;
  font-size: 16px;
}

.materia p {
  margin: 0;
  font-size: 14px;
}

.galeria {
  margin: 0 0 24px;
}

.foto {
  background-color: #fca311;
  color: white;
  text-align: center;
  padding: 40px 0;
  margin-bottom: 8px;
  border-radius: 8px;
  font-weight: bold;
}

.capa {
  margin: 0 0 16px;
}

.capa-titulo {
  grid-area: titulo;
  background-color: #14213d;
  color: white;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  padding: 24px 0;
}

.capa-texto {
  grid-area: texto;
  background-color: #e5e5e5;
  padding: 16px;
}

.capa-imagem {
  grid-area: imagem;
  background-color: #fca311;
  color: white;
  text-align: center;
  padding: 40px 0;
  font-weight: bold;
}

.creditos {
  margin: 0;
}

.creditos-texto {
  grid-area: texto;
  background-color: #e5e5e5;
  padding: 8px 12px;
  margin: 0;
}

.creditos-redes {
  grid-area: redes;
  background-color: #dfe3ec;
  padding: 8px 12px;
  margin: 0;
}

footer {
  background-color: #14213d;
  color: #cbd3e6;
  font-size: 14px;
  padding: 12px 24px;
}`;

export const REVISTA_RETALHOS: SiteAlvo = {
  url: "retalhos.revista.site",
  titulo: "Revista Retalhos",
  head: HEAD_REVISTA,
  body: BODY_REVISTA,
  css: CSS_REVISTA,
};
