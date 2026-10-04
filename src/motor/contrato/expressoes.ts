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
