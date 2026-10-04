import { FASES_UNIDADE_FUNCOES_U2, UNIDADE_FUNCOES_U2 } from "./ilhas/logica/funcoes/unidade-2/unidade";
import { FASES_UNIDADE_FUNCOES_U1, UNIDADE_FUNCOES_U1 } from "./ilhas/logica/funcoes/unidade-1/unidade";
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
import { FASES_UNIDADE_E2, UNIDADE_E2 } from "./ilhas/sites/estilos/unidade-2/unidade";
import { FASES_UNIDADE_E3, UNIDADE_E3 } from "./ilhas/sites/estilos/unidade-3/unidade";
import { FASES_UNIDADE_E4, UNIDADE_E4 } from "./ilhas/sites/estilos/unidade-4/unidade";
import { FASES_UNIDADE_E5, UNIDADE_E5 } from "./ilhas/sites/estilos/unidade-5/unidade";
import { FASES_UNIDADE_L1, UNIDADE_L1 } from "./ilhas/sites/layout/unidade-1/unidade";
import { FASES_UNIDADE_L2, UNIDADE_L2 } from "./ilhas/sites/layout/unidade-2/unidade";
import { FASES_UNIDADE_L3, UNIDADE_L3 } from "./ilhas/sites/layout/unidade-3/unidade";
import { FASES_UNIDADE_L4, UNIDADE_L4 } from "./ilhas/sites/layout/unidade-4/unidade";
import { FASES_UNIDADE_P1, UNIDADE_P1 } from "./ilhas/sites/publicar/unidade-1/unidade";
import { FASES_UNIDADE_P2, UNIDADE_P2 } from "./ilhas/sites/publicar/unidade-2/unidade";
import { FASES_UNIDADE_R1, UNIDADE_R1 } from "./ilhas/sites/responsivo/unidade-1/unidade";
import { FASES_UNIDADE_R2, UNIDADE_R2 } from "./ilhas/sites/responsivo/unidade-2/unidade";
import { FASES_UNIDADE_S1, UNIDADE_S1 } from "./ilhas/sites/ser-encontrado/unidade-1/unidade";
import { FASES_UNIDADE_S2, UNIDADE_S2 } from "./ilhas/sites/ser-encontrado/unidade-2/unidade";
import { FASES_UNIDADE_S3, UNIDADE_S3 } from "./ilhas/sites/ser-encontrado/unidade-3/unidade";
import { FASES_UNIDADE_S4, UNIDADE_S4 } from "./ilhas/sites/ser-encontrado/unidade-4/unidade";
import { FASES_UNIDADE_S5, UNIDADE_S5 } from "./ilhas/sites/ser-encontrado/unidade-5/unidade";
import { FASES_UNIDADE_LOGICA_U1, UNIDADE_LOGICA_U1 } from "./ilhas/logica/primeiros-comandos/unidade-1/unidade";
import { FASES_UNIDADE_LOGICA_U2, UNIDADE_LOGICA_U2 } from "./ilhas/logica/primeiros-comandos/unidade-2/unidade";
import { FASES_UNIDADE_LOGICA_U3, UNIDADE_LOGICA_U3 } from "./ilhas/logica/primeiros-comandos/unidade-3/unidade";
import { FASES_UNIDADE_DECISOES_U1, UNIDADE_DECISOES_U1 } from "./ilhas/logica/decisoes/unidade-1/unidade";
import { FASES_UNIDADE_DECISOES_U2, UNIDADE_DECISOES_U2 } from "./ilhas/logica/decisoes/unidade-2/unidade";
import { FASES_UNIDADE_DECISOES_U3, UNIDADE_DECISOES_U3 } from "./ilhas/logica/decisoes/unidade-3/unidade";
import { FASES_UNIDADE_DECISOES_U4, UNIDADE_DECISOES_U4 } from "./ilhas/logica/decisoes/unidade-4/unidade";
import { FASES_UNIDADE_REPETICAO_U1, UNIDADE_REPETICAO_U1 } from "./ilhas/logica/repeticao/unidade-1/unidade";
import { FASES_UNIDADE_REPETICAO_U2, UNIDADE_REPETICAO_U2 } from "./ilhas/logica/repeticao/unidade-2/unidade";
import { FASES_UNIDADE_REPETICAO_U3, UNIDADE_REPETICAO_U3 } from "./ilhas/logica/repeticao/unidade-3/unidade";
import type { Fase, Unidade } from "./tipos";

export const UNIDADES: readonly Unidade[] = [
  UNIDADE_1,
  UNIDADE_2,
  UNIDADE_3,
  UNIDADE_4,
  UNIDADE_5,
  UNIDADE_6,
  UNIDADE_E1,
  UNIDADE_E2,
  UNIDADE_E3,
  UNIDADE_E4,
  UNIDADE_E5,
  UNIDADE_L1,
  UNIDADE_L2,
  UNIDADE_L3,
  UNIDADE_L4,
  UNIDADE_R1,
  UNIDADE_R2,
  UNIDADE_P1,
  UNIDADE_P2,
  UNIDADE_S1,
  UNIDADE_S2,
  UNIDADE_S3,
  UNIDADE_S4,
  UNIDADE_S5,
  UNIDADE_LOGICA_U1,
  UNIDADE_LOGICA_U2,
  UNIDADE_LOGICA_U3,
  UNIDADE_DECISOES_U1,
  UNIDADE_DECISOES_U2,
  UNIDADE_DECISOES_U3,
  UNIDADE_DECISOES_U4,
  UNIDADE_REPETICAO_U1,
  UNIDADE_REPETICAO_U2,
  UNIDADE_REPETICAO_U3,
  UNIDADE_FUNCOES_U1,
  UNIDADE_FUNCOES_U2,
];

/** Todas as fases, na ordem das unidades. */
export const FASES: readonly Fase[] = [
  ...FASES_UNIDADE_1,
  ...FASES_UNIDADE_2,
  ...FASES_UNIDADE_3,
  ...FASES_UNIDADE_4,
  ...FASES_UNIDADE_5,
  ...FASES_UNIDADE_6,
  ...FASES_UNIDADE_E1,
  ...FASES_UNIDADE_E2,
  ...FASES_UNIDADE_E3,
  ...FASES_UNIDADE_E4,
  ...FASES_UNIDADE_E5,
  ...FASES_UNIDADE_L1,
  ...FASES_UNIDADE_L2,
  ...FASES_UNIDADE_L3,
  ...FASES_UNIDADE_L4,
  ...FASES_UNIDADE_R1,
  ...FASES_UNIDADE_R2,
  ...FASES_UNIDADE_P1,
  ...FASES_UNIDADE_P2,
  ...FASES_UNIDADE_S1,
  ...FASES_UNIDADE_S2,
  ...FASES_UNIDADE_S3,
  ...FASES_UNIDADE_S4,
  ...FASES_UNIDADE_S5,
  ...FASES_UNIDADE_LOGICA_U1,
  ...FASES_UNIDADE_LOGICA_U2,
  ...FASES_UNIDADE_LOGICA_U3,
  ...FASES_UNIDADE_DECISOES_U1,
  ...FASES_UNIDADE_DECISOES_U2,
  ...FASES_UNIDADE_DECISOES_U3,
  ...FASES_UNIDADE_DECISOES_U4,
  ...FASES_UNIDADE_REPETICAO_U1,
  ...FASES_UNIDADE_REPETICAO_U2,
  ...FASES_UNIDADE_REPETICAO_U3,
  ...FASES_UNIDADE_FUNCOES_U1,
  ...FASES_UNIDADE_FUNCOES_U2,
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
