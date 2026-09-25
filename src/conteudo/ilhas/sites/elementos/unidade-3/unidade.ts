/*
 * Unidade 3: "Títulos e textos".
 *
 * - fase 1, 2 e 3: micro-passos no Blog da Horta Comunitária, cada
 *   habilidade primeiro guiada e depois sozinho, em outra situação;
 * - fase 4: o desafio na Receita da Vovó (site novo), que junta tudo sem
 *   passo a passo e é a meta mostrada com antes/depois no começo.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_U3_F1 } from "./fase-1-hierarquia";
import { FASE_U3_F2 } from "./fase-2-enfase";
import { FASE_U3_F3 } from "./fase-3-listas";
import { FASE_U3_F4 } from "./fase-4-desafio";

export const FASES_UNIDADE_3: readonly Fase[] = [FASE_U3_F1, FASE_U3_F2, FASE_U3_F3, FASE_U3_F4];

export const UNIDADE_3: Unidade = {
  id: "sites-elementos-u3",
  ilha: "Ilha Sites",
  zona: "Elementos",
  numero: 3,
  titulo: "Títulos e textos",
  meta: {
    enunciado:
      "No fim desta unidade, você organiza um artigo bagunçado sozinho: acerta a hierarquia dos títulos, usa negrito e itálico de verdade, e numera listas quando a ordem importa.",
    desafioId: FASE_U3_F4.id,
  },
  fases: FASES_UNIDADE_3.map((fase) => fase.id),
};
