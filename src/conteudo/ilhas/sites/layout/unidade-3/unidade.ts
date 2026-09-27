/*
 * L3: "Grid". Fases 1 a 3: micro-passos na Revista Retalhos (display:
 * grid, colunas com fr; linhas com grid-template-rows e gap; áreas com
 * nome), cada habilidade guiada e depois sozinho, com uma previsão por
 * fase. Fase 4: o desafio na Revista Ventania, site novo.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_L3_F1 } from "./fase-1-grid-colunas";
import { FASE_L3_F2 } from "./fase-2-linhas-gap";
import { FASE_L3_F3 } from "./fase-3-areas";
import { FASE_L3_F4 } from "./fase-4-desafio";

export const FASES_UNIDADE_L3: readonly Fase[] = [FASE_L3_F1, FASE_L3_F2, FASE_L3_F3, FASE_L3_F4];

export const UNIDADE_L3: Unidade = {
  id: "sites-layout-u3",
  ilha: "Ilha Sites",
  zona: "Layout",
  numero: 3,
  titulo: "Grid",
  meta: {
    enunciado:
      "No fim desta unidade, você monta grades de verdade com CSS Grid: colunas e linhas com fr, espaço com gap e layouts inteiros desenhados por nome, com grid-template-areas.",
    desafioId: FASE_L3_F4.id,
  },
  fases: FASES_UNIDADE_L3.map((fase) => fase.id),
};
