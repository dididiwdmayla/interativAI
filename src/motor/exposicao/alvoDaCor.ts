/*
 * A cor pedida em cada mesa de cores, tirada do validador do objetivo
 * ativo (na prática) ou das partes do desafio: a mesa mostra, canal por
 * canal, se o vermelho, o verde e o azul estão no alvo, abaixo ou acima.
 * Puro, testado em testes/conteudo/estacoesNovas.test.ts.
 */
import type { Validador } from "@/conteudo/tipos";
import { canaisDaCor, normalizarHex } from "./modelo";

/** { id da mesa: "#rrggbb" } das cores exatas que os validadores pedem (os de faixa de canal não têm um alvo só). */
export function alvosDeCor(validadores: readonly Validador[]): Record<string, string> {
  const alvos: Record<string, string> = {};
  const juntar = (validador: Validador) => {
    if (validador.tipo === "corHex" && validador.valor) {
      const hex = normalizarHex(validador.valor);
      if (hex && !(validador.estacao in alvos)) alvos[validador.estacao] = hex;
    } else if (validador.tipo === "todos") validador.validadores.forEach(juntar);
  };
  validadores.forEach(juntar);
  return alvos;
}

export type SituacaoDoCanal = "certo" | "abaixo" | "acima";

/** Cada canal da cor montada em relação ao alvo. */
export function canaisNoAlvo(hex: string, alvo: string): Record<"r" | "g" | "b", { valor: number; alvo: number; situacao: SituacaoDoCanal }> {
  const agora = canaisDaCor(hex);
  const pedido = canaisDaCor(alvo);
  const situacao = (valor: number, meta: number): SituacaoDoCanal => (valor === meta ? "certo" : valor < meta ? "abaixo" : "acima");
  return {
    r: { valor: agora.r, alvo: pedido.r, situacao: situacao(agora.r, pedido.r) },
    g: { valor: agora.g, alvo: pedido.g, situacao: situacao(agora.g, pedido.g) },
    b: { valor: agora.b, alvo: pedido.b, situacao: situacao(agora.b, pedido.b) },
  };
}
