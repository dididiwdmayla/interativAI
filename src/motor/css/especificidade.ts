/*
 * Especificidade de seletores, escrita aqui (sem biblioteca), seguindo o
 * Selectors Level 4 (https://www.w3.org/TR/selectors-4/#specificity-rules):
 *
 * - A: ids (#menu);
 * - B: classes (.card), atributos ([href]) e pseudo-classes (:first-child);
 * - C: tags (p) e pseudo-elementos (::before);
 * - * e os combinadores (espaço, >, +, ~) não contam;
 * - :is(), :not() e :has() valem o argumento mais específico da lista;
 *   :where() vale zero;
 * - :nth-child(An+B of S) vale uma pseudo-classe mais o S mais específico.
 *
 * É o número que o Chrome mostra ao passar o mouse num seletor do painel
 * Estilos ("Specificity: (0,1,1)").
 */

export type Especificidade = readonly [number, number, number];

export const ESPECIFICIDADE_ZERO: Especificidade = [0, 0, 0];

/** Pseudo-elementos antigos, escritos com um dois-pontos só. */
const PSEUDO_ELEMENTOS_ANTIGOS = new Set(["before", "after", "first-line", "first-letter"]);

/** Pseudo-classes que valem o argumento mais específico. */
const PSEUDO_LISTA = new Set(["is", "not", "has", "matches", "-webkit-any", "-moz-any"]);

function ehInicioDeNome(caractere: string | undefined): boolean {
  return caractere !== undefined && /[a-zA-Z_\-\\ -￿]/.test(caractere);
}

/** Lê um identificador (com escapes) a partir de `inicio`; devolve o fim. */
function fimDoNome(texto: string, inicio: number): number {
  let i = inicio;
  while (i < texto.length) {
    const c = texto[i];
    if (c === "\\") i += 2;
    else if (/[a-zA-Z0-9_\- -￿]/.test(c)) i++;
    else break;
  }
  return i;
}

/** Fim de um trecho entre `abre` e o fechamento correspondente (fora de strings). */
function fimDoPar(texto: string, inicio: number, abre: string, fecha: string): number {
  let profundidade = 0;
  let i = inicio;
  while (i < texto.length) {
    const c = texto[i];
    if (c === "\\") {
      i += 2;
      continue;
    }
    if (c === '"' || c === "'") {
      const aspa = c;
      i++;
      while (i < texto.length && texto[i] !== aspa) i += texto[i] === "\\" ? 2 : 1;
      i++;
      continue;
    }
    if (c === abre) profundidade++;
    else if (c === fecha) {
      profundidade--;
      if (profundidade === 0) return i + 1;
    }
    i++;
  }
  return -1;
}

/**
 * Divide uma lista de seletores ("h1, .a > p") nas vírgulas de fora de
 * parênteses, colchetes e strings. Cada item vem aparado.
 */
export function dividirListaDeSeletores(lista: string): string[] {
  const itens: string[] = [];
  let profundidade = 0;
  let inicio = 0;
  let i = 0;
  while (i < lista.length) {
    const c = lista[i];
    if (c === "\\") {
      i += 2;
      continue;
    }
    if (c === '"' || c === "'") {
      const aspa = c;
      i++;
      while (i < lista.length && lista[i] !== aspa) i += lista[i] === "\\" ? 2 : 1;
      i++;
      continue;
    }
    if (c === "(" || c === "[") profundidade++;
    else if ((c === ")" || c === "]") && profundidade > 0) profundidade--;
    else if (c === "," && profundidade === 0) {
      itens.push(lista.slice(inicio, i).trim());
      inicio = i + 1;
    }
    i++;
  }
  itens.push(lista.slice(inicio).trim());
  return itens.filter((item) => item.length > 0);
}

export function somarEspecificidade(a: Especificidade, b: Especificidade): Especificidade {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

/** Negativo se a < b, positivo se a > b, zero se iguais. */
export function compararEspecificidade(a: Especificidade, b: Especificidade): number {
  return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
}

function maiorDaLista(lista: string): Especificidade | null {
  let maior: Especificidade | null = null;
  for (const item of dividirListaDeSeletores(lista)) {
    const valor = especificidade(item);
    if (valor === null) return null;
    if (maior === null || compararEspecificidade(valor, maior) > 0) maior = valor;
  }
  return maior ?? ESPECIFICIDADE_ZERO;
}

/**
 * Especificidade de UM seletor (sem vírgula de fora). Devolve null se não
 * dá para ler o seletor (o motor, então, não arrisca).
 */
export function especificidade(seletor: string): Especificidade | null {
  const texto = seletor.trim();
  if (texto.length === 0) return null;
  let a = 0;
  let b = 0;
  let c = 0;
  let i = 0;
  while (i < texto.length) {
    const atual = texto[i];
    if (atual === " " || atual === "\n" || atual === "\t" || atual === ">" || atual === "+" || atual === "~" || atual === "*") {
      i++;
      continue;
    }
    if (atual === "|") {
      // Namespace (ns|tag) ou a coluna (||): não conta.
      i++;
      continue;
    }
    if (atual === "#") {
      const fim = fimDoNome(texto, i + 1);
      if (fim === i + 1) return null;
      a++;
      i = fim;
      continue;
    }
    if (atual === ".") {
      const fim = fimDoNome(texto, i + 1);
      if (fim === i + 1) return null;
      b++;
      i = fim;
      continue;
    }
    if (atual === "[") {
      const fim = fimDoPar(texto, i, "[", "]");
      if (fim < 0) return null;
      b++;
      i = fim;
      continue;
    }
    if (atual === ":") {
      const elemento = texto[i + 1] === ":";
      const inicioNome = i + (elemento ? 2 : 1);
      const fimNome = fimDoNome(texto, inicioNome);
      if (fimNome === inicioNome) return null;
      const nome = texto.slice(inicioNome, fimNome).toLowerCase();
      let argumento: string | null = null;
      let fim = fimNome;
      if (texto[fimNome] === "(") {
        const fecha = fimDoPar(texto, fimNome, "(", ")");
        if (fecha < 0) return null;
        argumento = texto.slice(fimNome + 1, fecha - 1);
        fim = fecha;
      }
      if (elemento || PSEUDO_ELEMENTOS_ANTIGOS.has(nome)) {
        c++;
      } else if (nome === "where") {
        // vale zero
      } else if (PSEUDO_LISTA.has(nome) && argumento !== null) {
        const maior = maiorDaLista(argumento);
        if (maior === null) return null;
        a += maior[0];
        b += maior[1];
        c += maior[2];
      } else if ((nome === "nth-child" || nome === "nth-last-child") && argumento !== null && /\sof\s/i.test(argumento)) {
        const lista = argumento.slice(argumento.search(/\sof\s/i) + 4);
        const maior = maiorDaLista(lista);
        if (maior === null) return null;
        b += 1 + maior[1];
        a += maior[0];
        c += maior[2];
      } else {
        b++;
      }
      i = fim;
      continue;
    }
    if (atual === "&") {
      // Aninhamento: o motor não sabe o que o & vale aqui.
      return null;
    }
    if (ehInicioDeNome(atual)) {
      const fim = fimDoNome(texto, i);
      c++;
      i = fim;
      continue;
    }
    return null;
  }
  return [a, b, c];
}

/** "(0,1,1)", como o Chrome mostra. */
export function formatarEspecificidade(valor: Especificidade): string {
  return `(${valor[0]},${valor[1]},${valor[2]})`;
}
