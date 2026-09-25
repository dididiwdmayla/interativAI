/*
 * Setas nos números do painel Estilos, como no Chrome (developer.chrome.com,
 * "Change enumerable values with keyboard shortcuts"):
 * - seta: 1, ou 0,1 se o número está entre -1 e 1;
 * - Shift + seta: 10;
 * - Alt (Option no Mac) + seta: 0,1;
 * - Ctrl+Shift+Page Up/Down (Shift+Cmd+seta no Mac): 100.
 * O número mexido é o que está no cursor (ou o primeiro do valor), e a
 * unidade fica: 32px vira 33px.
 */

const NUMERO = /[+-]?(\d+\.?\d*|\.\d+)/g;

export type Passo = { base: number; direcao: 1 | -1 };

/** O tamanho do passo pelas teclas apertadas; null se a tecla não é de número. */
export function passoDaTecla(evento: {
  key: string;
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}): Passo | null {
  const { key, shiftKey, altKey, ctrlKey, metaKey } = evento;
  if (key === "PageUp" || key === "PageDown") {
    if (ctrlKey && shiftKey) return { base: 100, direcao: key === "PageUp" ? 1 : -1 };
    return null;
  }
  if (key !== "ArrowUp" && key !== "ArrowDown") return null;
  const direcao = key === "ArrowUp" ? 1 : -1;
  if (shiftKey && metaKey) return { base: 100, direcao };
  if (shiftKey) return { base: 10, direcao };
  if (altKey) return { base: 0.1, direcao };
  return { base: 1, direcao };
}

/** Arredonda sem o lixo do ponto flutuante (0.1 + 0.2). */
function arredondar(numero: number): string {
  const texto = String(Math.round(numero * 1000) / 1000);
  return texto === "-0" ? "0" : texto;
}

/**
 * Soma o passo ao número do cursor. Devolve o valor novo e onde o cursor
 * fica (no fim do número mexido), ou null se não há número no valor.
 */
export function incrementarNumero(valor: string, cursor: number, passo: Passo): { valor: string; cursor: number } | null {
  const achados = [...valor.matchAll(NUMERO)].filter((achado) => {
    // Não mexe em números que são parte de um nome (h1, #f00, var(--x2)).
    const antes = valor[(achado.index ?? 0) - 1];
    return antes === undefined || !/[a-zA-Z_#-]/.test(antes) || achado[0].startsWith("-");
  });
  if (achados.length === 0) return null;
  const alvo =
    achados.find((achado) => {
      const inicio = achado.index ?? 0;
      return cursor >= inicio && cursor <= inicio + achado[0].length;
    }) ?? achados[0];
  const inicio = alvo.index ?? 0;
  const atual = parseFloat(alvo[0]);
  const tamanho = passo.base === 1 && atual > -1 && atual < 1 ? 0.1 : passo.base;
  const novo = arredondar(atual + passo.direcao * tamanho);
  return {
    valor: valor.slice(0, inicio) + novo + valor.slice(inicio + alvo[0].length),
    cursor: inicio + novo.length,
  };
}
