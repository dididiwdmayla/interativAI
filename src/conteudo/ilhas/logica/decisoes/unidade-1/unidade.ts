/* Decisões U1: Verdadeiro ou falso. */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_DECISOES_U1_F1 } from "./fase-1";
import { FASE_DECISOES_U1_F2 } from "./fase-2";
import { FASE_DECISOES_U1_F3 } from "./fase-3";
import { FASE_DECISOES_U1_F4 } from "./fase-4";
import { FASE_DECISOES_U1_F5 } from "./fase-5";
import { FASE_DECISOES_U1_F6 } from "./fase-6";
export const FASES_UNIDADE_DECISOES_U1: readonly Fase[] = [FASE_DECISOES_U1_F1, FASE_DECISOES_U1_F2, FASE_DECISOES_U1_F3, FASE_DECISOES_U1_F4, FASE_DECISOES_U1_F5, FASE_DECISOES_U1_F6];
export const UNIDADE_DECISOES_U1: Unidade = {
  "id": "logica-decisoes-u1",
  "ilha": "Ilha Lógica",
  "zona": "Decisões",
  "numero": 1,
  "titulo": "Verdadeiro ou falso",
  "meta": {
    "enunciado": "Você faz perguntas ao programa com comparações, distingue =, == e === e transforma as regras de uma loja em respostas true e false.",
    "desafioId": "logica-decisoes-u1-f6"
  },
  "fases": FASES_UNIDADE_DECISOES_U1.map((fase) => fase.id)
};
