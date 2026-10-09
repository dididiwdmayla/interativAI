// Nunito e JetBrains Mono, as fontes do jogo, de pacotes locais (sem Google
// Fonts no render). O render espera as duas carregarem antes do primeiro quadro.
import "@fontsource-variable/nunito/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import { continueRender, delayRender } from "remotion";

export const FONTE_UI = '"Nunito Variable", system-ui, sans-serif';
export const FONTE_CODIGO = '"JetBrains Mono Variable", ui-monospace, monospace';

if (typeof document !== "undefined") {
  const espera = delayRender("fontes do jogo");
  Promise.all([
    document.fonts.load('400 20px "Nunito Variable"'),
    document.fonts.load('800 20px "Nunito Variable"'),
    document.fonts.load('900 20px "Nunito Variable"'),
    document.fonts.load('500 20px "JetBrains Mono Variable"'),
  ])
    .then(() => document.fonts.ready)
    .then(() => continueRender(espera))
    .catch(() => continueRender(espera));
}
