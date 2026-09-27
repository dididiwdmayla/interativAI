/*
 * Site-alvo do desafio da L3: "Revista Ventania" (viagem e estilo de
 * vida). Site NOVO: outro assunto e outros nomes (.reportagens, .mapas,
 * .abertura/.creditos-abertura), mas o mesmo tipo de desafio anunciado no
 * mapa curricular: layout de revista.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_VENTANIA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Revista Ventania</title>`;

const BODY_VENTANIA = `<header>
  <h1>Revista Ventania</h1>
</header>
<main>
  <h2>Reportagens da edição</h2>
  <div class="reportagens">
    <article class="reportagem"><h3>Trilhas da Serra Azul</h3><p>Um roteiro de dois dias a pé.</p></article>
    <article class="reportagem"><h3>Cafés escondidos</h3><p>Cinco endereços fora do circuito turístico.</p></article>
    <article class="reportagem"><h3>Malas leves</h3><p>Como viajar uma semana só com bagagem de mão.</p></article>
  </div>

  <h2>Mapas da edição</h2>
  <div class="mapas">
    <div class="mapa">Roteiro 1</div>
    <div class="mapa">Roteiro 2</div>
    <div class="mapa">Roteiro 3</div>
    <div class="mapa">Roteiro 4</div>
  </div>

  <h2>Abertura desta edição</h2>
  <div class="abertura">
    <div class="abertura-titulo">VENTANIA</div>
    <div class="abertura-texto">Reportagem de abertura: o silêncio das estradas de terra</div>
    <div class="abertura-imagem">Foto de abertura</div>
  </div>
</main>
<footer>
  <p>Revista Ventania, edição digital</p>
</footer>`;

const CSS_VENTANIA = `body {
  font-family: Arial, sans-serif;
  color: #2f2f2f;
  background-color: #f6f8fb;
  margin: 0;
}

header {
  background-color: #073b4c;
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
  color: #073b4c;
  font-size: 20px;
}

.reportagens {
  margin: 0 0 24px;
}

.reportagem {
  background-color: white;
  border: 2px solid #d8e2e8;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.reportagem h3 {
  margin: 0 0 4px;
  font-size: 16px;
}

.reportagem p {
  margin: 0;
  font-size: 14px;
}

.mapas {
  margin: 0 0 24px;
}

.mapa {
  background-color: #06a77d;
  color: white;
  text-align: center;
  padding: 40px 0;
  margin-bottom: 8px;
  border-radius: 8px;
  font-weight: bold;
}

.abertura {
  margin: 0;
}

.abertura-titulo {
  grid-area: titulo;
  background-color: #073b4c;
  color: white;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  padding: 24px 0;
}

.abertura-texto {
  grid-area: texto;
  background-color: #e3e9ec;
  padding: 16px;
}

.abertura-imagem {
  grid-area: imagem;
  background-color: #06a77d;
  color: white;
  text-align: center;
  padding: 40px 0;
  font-weight: bold;
}

footer {
  background-color: #073b4c;
  color: #c7d6dc;
  font-size: 14px;
  padding: 12px 24px;
}`;

export const REVISTA_VENTANIA: SiteAlvo = {
  url: "ventania.revista.site",
  titulo: "Revista Ventania",
  head: HEAD_VENTANIA,
  body: BODY_VENTANIA,
  css: CSS_VENTANIA,
};
