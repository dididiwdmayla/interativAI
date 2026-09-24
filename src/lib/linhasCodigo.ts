/** Todas as linhas que contêm um trecho de texto. */
export function linhasComTexto(texto: string, trecho: string): number[] {
  const alvo = trecho.toLowerCase();
  return texto
    .split("\n")
    .map((linha, indice) => (linha.toLowerCase().includes(alvo) ? indice + 1 : 0))
    .filter((linha) => linha > 0);
}
