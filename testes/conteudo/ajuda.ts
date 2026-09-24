/** Falha com todos os problemas listados, um por linha, para ler de uma vez. */
export function semProblemas(problemas: readonly string[]): void {
  if (problemas.length === 0) return;
  const lista = problemas.map((problema) => `  - ${problema.replace(/\n/g, "\n    ")}`).join("\n");
  throw new Error(`${problemas.length} problema(s):\n${lista}`);
}
