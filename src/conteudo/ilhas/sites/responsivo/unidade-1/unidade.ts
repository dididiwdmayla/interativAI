/*
 * R1: "Modo dispositivo". Primeira unidade da zona Responsivo (motor
 * pronto desde a Rodada 12: ver docs/GUIA-DE-CONTEUDO.md, seção 16).
 *
 * Fases 1 e 2: micro-passos (Padaria Trigo Dourado, depois Pet Shop
 * Focinho Feliz, no modo documento). Fase 3: o desafio, num site novo
 * (Academia Corpo em Movimento), sem passo a passo.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_R1_F1 } from "./fase-1-modo-dispositivo";
import { FASE_R1_F2 } from "./fase-2-viewport";
import { FASE_R1_F3 } from "./fase-3-desafio";

export const FASES_UNIDADE_R1: readonly Fase[] = [FASE_R1_F1, FASE_R1_F2, FASE_R1_F3];

export const UNIDADE_R1: Unidade = {
  id: "sites-responsivo-u1",
  ilha: "Ilha Sites",
  zona: "Responsivo",
  numero: 1,
  titulo: "Modo dispositivo",
  meta: {
    enunciado:
      "No fim desta unidade, você vê qualquer site como um celular, um tablet ou um notebook veem ele, e diagnostica os problemas mais comuns de tela pequena.",
    desafioId: FASE_R1_F3.id,
  },
  fases: FASES_UNIDADE_R1.map((fase) => fase.id),
};
