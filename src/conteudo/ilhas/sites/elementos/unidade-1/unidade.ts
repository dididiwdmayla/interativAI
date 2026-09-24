/*
 * Unidade 1: "O site é seu".
 *
 * Por enquanto só com a Fase 1 (objetivos guiados). Falta escrever os
 * objetivos sozinho e o desafio, seguindo docs/GUIA-DE-CONTEUDO.md e a
 * Unidade 2 como modelo. Quando o desafio existir, preencha
 * meta.desafioId: a meta com antes/depois passa a aparecer no começo.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_U1_F1 } from "./fase-1";

export const FASES_UNIDADE_1: readonly Fase[] = [FASE_U1_F1];

export const UNIDADE_1: Unidade = {
  id: "sites-elementos-u1",
  ilha: "Ilha Sites",
  zona: "Elementos",
  numero: 1,
  titulo: "O site é seu",
  meta: {
    enunciado:
      "No fim desta unidade, você acha qualquer peça de um site pela árvore ou pela setinha e troca o que ela mostra.",
  },
  fases: FASES_UNIDADE_1.map((fase) => fase.id),
};
