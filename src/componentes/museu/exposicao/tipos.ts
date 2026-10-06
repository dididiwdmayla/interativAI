import type { AcaoExposicao } from "@/motor/exposicao/modelo";

/** O que toda estação recebe: os dados, o estado dela, o mexer e o "onde olhar" da ajuda. */
export type PropsEstacao<D, E> = {
  estacao: D;
  estado: E;
  mexer: (acao: AcaoExposicao) => boolean;
  /** Tela de toque (os textos dizem "toque"). */
  toque: boolean;
  /** O degrau 3 da ajuda apontando esta estação (e, com `peca`, uma peça dela). */
  destaque: { peca?: string } | null;
};
