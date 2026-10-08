// Respostas locais para o next/font/google, usadas SÓ para gerar o build de
// produção do jogo numa máquina sem acesso ao Google Fonts (como a sessão de
// nuvem em que o vídeo foi gravado). O Next lê este arquivo quando a variável
// NEXT_FONT_GOOGLE_MOCKED_RESPONSES aponta para ele (gancho do próprio Next).
// As fontes são as mesmas do jogo (Nunito e JetBrains Mono variáveis), vindas
// dos pacotes @fontsource-variable instalados em video/node_modules.
// O Turbopack busca cada arquivo de fonte por HTTP, então o build-do-jogo.mjs
// sobe um servidor local com os arquivos e passa o endereço em FONTES_URL.
// Uso: node video/scripts/build-do-jogo.mjs (não chame este arquivo direto).
const base = process.env.FONTES_URL ?? "http://127.0.0.1:4173";
const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT = "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";

function folha(familia, pacote, arquivo, pesos) {
  const face = (subconjunto, faixa) => `/* ${subconjunto} */
@font-face {
  font-family: '${familia}';
  font-style: normal;
  font-weight: ${pesos};
  font-display: swap;
  src: url(${base}/${pacote}/${arquivo}-${subconjunto}-wght-normal.woff2) format('woff2');
  unicode-range: ${faixa};
}
`;
  return face("latin-ext", LATIN_EXT) + face("latin", LATIN);
}

module.exports = {
  "https://fonts.googleapis.com/css2?family=Nunito:wght@200..1000&display=swap": folha("Nunito", "nunito", "nunito", "200 1000"),
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap": folha("JetBrains Mono", "jetbrains-mono", "jetbrains-mono", "100 800"),
};
