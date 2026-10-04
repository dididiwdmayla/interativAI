/** As expressões de um cliente (o rosto muda junto com a fala). */
export const EXPRESSOES_CLIENTE = ["feliz", "pensativo", "preocupado", "empolgado", "satisfeito"] as const;

export type ExpressaoCliente = (typeof EXPRESSOES_CLIENTE)[number];

export function ehExpressaoCliente(valor: unknown): valor is ExpressaoCliente {
  return typeof valor === "string" && (EXPRESSOES_CLIENTE as readonly string[]).includes(valor);
}

/** Como o leitor de tela descreve cada expressão. */
export const DESCRICAO_EXPRESSAO_CLIENTE: Record<ExpressaoCliente, string> = {
  feliz: "sorrindo",
  pensativo: "pensando, com a mão no queixo",
  preocupado: "preocupado",
  empolgado: "empolgado, de olhos brilhando",
  satisfeito: "satisfeito, de olhos fechados e sorriso largo",
};

/** A forma da boca falando, pela letra que acabou de aparecer (null: a boca da expressão, entre as palavras). */
export type FormaBoca = "a" | "e" | "o" | "m" | null;

export function formaDaLetra(letra: string | undefined): FormaBoca {
  if (!letra) return null;
  const simples = letra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (simples === "a") return "a";
  if (simples === "e" || simples === "i") return "e";
  if (simples === "o" || simples === "u") return "o";
  if (/[a-z]/.test(simples)) return "m";
  return null;
}
