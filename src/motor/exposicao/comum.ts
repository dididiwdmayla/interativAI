/* Peças comuns dos modelos das estações (puras, sem React). */

export const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

export function textos(valor: unknown, maximo = 64): string[] {
  return Array.isArray(valor) ? valor.filter((item): item is string => typeof item === "string").slice(0, maximo) : [];
}

export function semRepetir<T>(lista: readonly T[]): T[] {
  return [...new Set(lista)];
}

export function repetidos(ids: readonly string[]): string[] {
  return [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
}

export function tamanho(problemas: string[], onde: string, texto: string, maximo: number): void {
  if (!texto.trim()) problemas.push(`${onde} está vazio`);
  else if (texto.length > maximo) problemas.push(`${onde} tem ${texto.length} caracteres (máximo ${maximo})`);
}

/**
 * Uma ordem embaralhada, mas sempre igual (para os testes e para quem
 * volta): intercala o fim e o começo e gira pelo tamanho do primeiro texto.
 * Nunca a ordem certa nem a inversa, a partir de 3 itens.
 */
export function embaralharFixo(ids: readonly string[], semente: number): string[] {
  const resultado: string[] = [];
  let de = 0;
  let ate = ids.length - 1;
  let vez = 1;
  while (de <= ate) {
    resultado.push(vez % 2 === 1 ? ids[de++] : ids[ate--]);
    vez += 1;
  }
  const giro = semente % Math.max(1, resultado.length);
  const girado = [...resultado.slice(giro), ...resultado.slice(0, giro)];
  // O giro pode devolver a ordem certa (com 2 itens, sempre): então inverte.
  return girado.every((id, i) => id === ids[i]) ? [...girado].reverse() : girado;
}

/**
 * O item está no lugar certo em relação a todos os outros da fila agora
 * (os de antes vêm antes na ordem certa, os de depois, depois).
 */
export function noLugarCerto(certa: readonly string[], fila: readonly string[], item: string): boolean {
  const aqui = fila.indexOf(item);
  if (aqui < 0) return false;
  const minha = certa.indexOf(item);
  return fila.every((outro, i) => i === aqui || (i < aqui ? certa.indexOf(outro) < minha : certa.indexOf(outro) > minha));
}

/** Põe (ou muda de lugar) o item na fila, na posição (sem ela, no fim). */
export function porNaFila(fila: readonly string[], item: string, posicao?: number): string[] {
  const sem = fila.filter((id) => id !== item);
  const lugar = Math.max(0, Math.min(posicao ?? sem.length, sem.length));
  return [...sem.slice(0, lugar), item, ...sem.slice(lugar)];
}

/** A fila tem os itens pedidos, na ordem certa entre eles. */
export function filaEmOrdem(certa: readonly string[], fila: readonly string[], pedidos: readonly string[] = certa): { passou: boolean; detalhe: string } {
  const faltam = pedidos.filter((id) => !fila.includes(id));
  if (faltam.length) return { passou: false, detalhe: `fora do lugar: ${faltam.join(", ")}` };
  const naFila = fila.filter((id) => pedidos.includes(id));
  const fora = naFila.filter((id, i) => i > 0 && certa.indexOf(naFila[i - 1]) > certa.indexOf(id));
  return fora.length ? { passou: false, detalhe: `fora de ordem perto de: ${fora.join(", ")}` } : { passou: true, detalhe: "na ordem certa" };
}
