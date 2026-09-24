import type { EventoFase } from "./eventos";

export type OuvinteEvento = (evento: EventoFase) => void;

export type Barramento = {
  emitir: (evento: EventoFase) => void;
  assinar: (ouvinte: OuvinteEvento) => () => void;
};

/** Canal simples para o painel avisar o motor sobre o que o jogador fez. */
export function criarBarramento(): Barramento {
  const ouvintes = new Set<OuvinteEvento>();
  return {
    emitir(evento) {
      for (const ouvinte of ouvintes) ouvinte(evento);
    },
    assinar(ouvinte) {
      ouvintes.add(ouvinte);
      return () => {
        ouvintes.delete(ouvinte);
      };
    },
  };
}
