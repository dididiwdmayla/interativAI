/*
 * Registro de todo o conteúdo do jogo, na ordem em que se joga.
 * Unidade nova: importe o `unidade.ts` dela e acrescente nas duas listas.
 */
import { FASES_UNIDADE_1, UNIDADE_1 } from "./ilhas/sites/elementos/unidade-1/unidade";
import { FASES_UNIDADE_2, UNIDADE_2 } from "./ilhas/sites/elementos/unidade-2/unidade";
import { FASES_UNIDADE_3, UNIDADE_3 } from "./ilhas/sites/elementos/unidade-3/unidade";
import { FASES_UNIDADE_4, UNIDADE_4 } from "./ilhas/sites/elementos/unidade-4/unidade";
import { FASES_UNIDADE_5, UNIDADE_5 } from "./ilhas/sites/elementos/unidade-5/unidade";
import { FASES_UNIDADE_6, UNIDADE_6 } from "./ilhas/sites/elementos/unidade-6/unidade";
import { FASES_UNIDADE_E1, UNIDADE_E1 } from "./ilhas/sites/estilos/unidade-1/unidade";
import type { Fase, Unidade } from "./tipos";

export const UNIDADES: readonly Unidade[] = [UNIDADE_1, UNIDADE_2, UNIDADE_3, UNIDADE_4, UNIDADE_5, UNIDADE_6, UNIDADE_E1];

/** Todas as fases, na ordem das unidades. */
export const FASES: readonly Fase[] = [
  ...FASES_UNIDADE_1,
  ...FASES_UNIDADE_2,
  ...FASES_UNIDADE_3,
  ...FASES_UNIDADE_4,
  ...FASES_UNIDADE_5,
  ...FASES_UNIDADE_6,
  ...FASES_UNIDADE_E1,
];

export const FASE_INICIAL: Fase = FASES[0];

export function faseDoId(id: string): Fase | undefined {
  return FASES.find((fase) => fase.id === id);
}

export function unidadeDoId(id: string): Unidade | undefined {
  return UNIDADES.find((unidade) => unidade.id === id);
}

/** Onde a fase fica: unidade, número dentro da unidade e posição geral. */
export type LocalDaFase = {
  fase: Fase;
  unidade: Unidade;
  /** Número da fase dentro da unidade (a partir de 1). */
  numero: number;
  /** Posição na lista geral (a partir de 0). */
  indice: number;
};

export function localDaFase(fase: Fase): LocalDaFase {
  const unidade = unidadeDoId(fase.unidadeId);
  if (!unidade) throw new Error(`A fase ${fase.id} aponta para a unidade ${fase.unidadeId}, que não existe.`);
  return {
    fase,
    unidade,
    numero: unidade.fases.indexOf(fase.id) + 1,
    indice: FASES.indexOf(fase),
  };
}

/** A fase que vem depois na ordem das unidades, se houver. */
export function proximaFase(fase: Fase): Fase | null {
  const indice = FASES.indexOf(fase);
  return indice >= 0 && indice < FASES.length - 1 ? FASES[indice + 1] : null;
}
