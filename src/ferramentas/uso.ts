import type { IdFerramenta } from "./ids";

type Ouvinte = (id: IdFerramenta) => void;

const ouvintes = new Set<Ouvinte>();

/** A interface avisa que o jogador usou uma ferramenta de verdade. */
export function sinalizarUso(id: IdFerramenta): void {
  for (const ouvinte of ouvintes) ouvinte(id);
}

export function assinarUso(ouvinte: Ouvinte): () => void {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}
