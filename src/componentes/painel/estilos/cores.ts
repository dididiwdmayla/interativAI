/*
 * A amostra de cor do painel Estilos: acha a primeira cor dentro de um
 * valor (#d9b99b em "2px solid #d9b99b") e troca por outra, do jeito que o
 * seletor de cor devolve.
 */
import { CORES_COM_NOME, corEmHex, lerCor, type Rgba } from "@/motor/css/valores";

const PADRAO_COR = new RegExp(
  `#[0-9a-fA-F]{3,8}\\b|(?:rgba?|hsla?)\\([^)]*\\)|\\b(?:transparent|${Object.keys(CORES_COM_NOME).join("|")})\\b`,
  "gi",
);

export type CorNoValor = { inicio: number; fim: number; rgba: Rgba };

/** A primeira cor que o motor sabe ler dentro do valor. */
export function acharCor(valor: string): CorNoValor | null {
  for (const achado of valor.matchAll(PADRAO_COR)) {
    const rgba = lerCor(achado[0]);
    if (rgba) return { inicio: achado.index ?? 0, fim: (achado.index ?? 0) + achado[0].length, rgba };
  }
  return null;
}

/** O valor do <input type="color"> (#rrggbb, sem transparência). */
export function hexDoSeletor(rgba: Rgba): string {
  return corEmHex([rgba[0], rgba[1], rgba[2], 1]);
}

/** Troca a cor no valor pela escolhida, mantendo a transparência que ela tinha. */
export function trocarCor(valor: string, cor: CorNoValor, hexEscolhido: string): string {
  const [r, g, b] = [1, 3, 5].map((inicio) => parseInt(hexEscolhido.slice(inicio, inicio + 2), 16));
  const alfa = cor.rgba[3];
  const nova = alfa < 1 ? `rgba(${r}, ${g}, ${b}, ${Math.round(alfa * 100) / 100})` : hexEscolhido.toLowerCase();
  return valor.slice(0, cor.inicio) + nova + valor.slice(cor.fim);
}
