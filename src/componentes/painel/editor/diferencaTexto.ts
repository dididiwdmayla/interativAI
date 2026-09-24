/**
 * Menor trecho que muda entre dois textos (prefixo e sufixo comuns).
 * Usado para atualizar o editor sem mexer no resto do documento.
 */
export function calcularTrocaMinima(
  antigo: string,
  novo: string,
): { de: number; ate: number; inserir: string } | null {
  if (antigo === novo) return null;
  let inicio = 0;
  const limite = Math.min(antigo.length, novo.length);
  while (inicio < limite && antigo[inicio] === novo[inicio]) inicio++;
  let fimAntigo = antigo.length;
  let fimNovo = novo.length;
  while (fimAntigo > inicio && fimNovo > inicio && antigo[fimAntigo - 1] === novo[fimNovo - 1]) {
    fimAntigo--;
    fimNovo--;
  }
  return { de: inicio, ate: fimAntigo, inserir: novo.slice(inicio, fimNovo) };
}
