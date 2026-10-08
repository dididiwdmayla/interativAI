/*
 * A fila de falas do computadorzinho. Uma fala importante nunca some antes
 * de o jogador ler:
 *
 * - a fala importante (conclusão de objetivo, mudança de pedido, aviso de
 *   erro, o que um momento roteirizado conta) espera o jogador: só sai
 *   quando ele toca em Continuar (ou aperta Enter);
 * - a fala automática (a validação, um roteiro, um aviso) espera a vez: se
 *   a de agora espera o jogador, ou se ainda há fila, ela entra no fim; se
 *   a de agora é comum (o enunciado, uma resposta), ela entra na hora;
 * - a fala que o jogador pediu (Me ajuda, Continuar, o tutor, um link que
 *   ele tocou) entra na hora: a de agora conta como lida. A fila continua.
 *
 * Puro. Testado em testes/conteudo/filaDeFalas.test.ts.
 */
import type { Fala } from "./tipos";

export type FalaNaFila = {
  fala: Fala;
  /** Importante: quando chegar a vez dela, espera o jogador. */
  aguarda: boolean;
};

export type EstadoDaFala = {
  /** A fala na tela. */
  fala: Fala;
  /** A fala na tela espera o jogador (Continuar ou Enter) antes de sair. */
  falaAguarda: boolean;
  /** As que esperam a vez, na ordem. */
  filaFalas: FalaNaFila[];
};

/** O jogador pediu (ou uma pausa tomou a cena): a fala entra na hora e a fila continua. */
export function trocarFala<E extends EstadoDaFala>(estado: E, fala: Fala, aguarda = false): E {
  return { ...estado, fala, falaAguarda: aguarda };
}

/** A fala de agora (ou a fila) pede o jogador: mostra Continuar e segura o que viria sozinho. */
export function filaPedeJogador(estado: Pick<EstadoDaFala, "falaAguarda" | "filaFalas">): boolean {
  return estado.falaAguarda || estado.filaFalas.length > 0;
}

/** Fala automática: entra agora, se nada espera o jogador; senão, espera no fim da fila. */
export function enfileirarFala<E extends EstadoDaFala>(estado: E, fala: Fala, aguarda = false): E {
  if (!filaPedeJogador(estado)) return trocarFala(estado, fala, aguarda);
  // A mesma fala duas vezes seguidas não entra de novo.
  const ultima = estado.filaFalas[estado.filaFalas.length - 1]?.fala ?? estado.fala;
  if (ultima.texto === fala.texto) return estado;
  return { ...estado, filaFalas: [...estado.filaFalas, { fala, aguarda }] };
}

/** Várias falas automáticas, na ordem. */
export function enfileirarFalas<E extends EstadoDaFala>(estado: E, falas: readonly FalaNaFila[]): E {
  return falas.reduce((atual, item) => enfileirarFala(atual, item.fala, item.aguarda), estado);
}

/** Continuar: a próxima da fila entra; sem fila, a de agora deixa de esperar (e continua na tela). */
export function avancarFila<E extends EstadoDaFala>(estado: E): E {
  const [proxima, ...resto] = estado.filaFalas;
  if (!proxima) return estado.falaAguarda ? { ...estado, falaAguarda: false } : estado;
  return { ...estado, fala: proxima.fala, falaAguarda: proxima.aguarda, filaFalas: resto };
}

/**
 * Uma pausa toma a cena (a conclusão do objetivo, o fim do desafio): a fala
 * dela entra na hora, esperando o jogador, e o que esperava na fila saiu de
 * moda (o enunciado do objetivo que acabou, as partes que a fala final resume).
 */
export function falaDaPausa<E extends EstadoDaFala>(estado: E, fala: Fala): E {
  return { ...estado, fala, falaAguarda: true, filaFalas: [] };
}
