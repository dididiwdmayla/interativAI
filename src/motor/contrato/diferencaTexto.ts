export type DiferencaTexto = { esperado: string; recebido: string; inicio: number; fimEsperado: number; fimRecebido: number };

/** Prefixo/sufixo comum; a faixa divergente deixa espaço, caixa e acento visíveis. */
export function diferencaTexto(esperado: string, recebido: string): DiferencaTexto {
  let inicio = 0;
  while (inicio < esperado.length && inicio < recebido.length && esperado[inicio] === recebido[inicio]) inicio++;
  let fimEsperado = esperado.length, fimRecebido = recebido.length;
  while (fimEsperado > inicio && fimRecebido > inicio && esperado[fimEsperado - 1] === recebido[fimRecebido - 1]) { fimEsperado--; fimRecebido--; }
  return { esperado, recebido, inicio, fimEsperado, fimRecebido };
}

export function textoComDiferenca(d: DiferencaTexto): string {
  const mostrar = (s: string, fim: number) => JSON.stringify(s.slice(0, d.inicio)) + ' [' + (JSON.stringify(s.slice(d.inicio, fim).replace(/ /g, '␠')) || '""') + '] ' + JSON.stringify(s.slice(fim));
  return `Esperado: ${mostrar(d.esperado, d.fimEsperado)}; recebido: ${mostrar(d.recebido, d.fimRecebido)} (␠ = espaço; "" = ausente)`;
}
