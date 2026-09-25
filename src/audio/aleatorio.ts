/*
 * Sorteio determinístico: a mesma semente dá sempre a mesma sequência. A voz
 * do computadorzinho usa isso para que a mesma frase soe sempre igual.
 */

/** Hash FNV-1a de 32 bits de um texto. */
export function hashTexto(texto: string): number {
  let hash = 0x811c9dc5;
  for (let indice = 0; indice < texto.length; indice++) {
    hash ^= texto.charCodeAt(indice);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Gerador mulberry32: devolve números em [0, 1). */
export function criarSorteio(semente: number): () => number {
  let estado = semente >>> 0;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let valor = estado;
    valor = Math.imul(valor ^ (valor >>> 15), valor | 1);
    valor ^= valor + Math.imul(valor ^ (valor >>> 7), valor | 61);
    return ((valor ^ (valor >>> 14)) >>> 0) / 4294967296;
  };
}
