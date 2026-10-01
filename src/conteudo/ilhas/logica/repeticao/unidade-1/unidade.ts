import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_REPETICAO_U1_F1 } from "./fase-1";
import { FASE_REPETICAO_U1_F2 } from "./fase-2";
import { FASE_REPETICAO_U1_F3 } from "./fase-3";
import { FASE_REPETICAO_U1_F4 } from "./fase-4";
export const FASES_UNIDADE_REPETICAO_U1: readonly Fase[] = [FASE_REPETICAO_U1_F1, FASE_REPETICAO_U1_F2, FASE_REPETICAO_U1_F3, FASE_REPETICAO_U1_F4];
export const UNIDADE_REPETICAO_U1: Unidade = {
  "id": "logica-repeticao-u1",
  "ilha": "Ilha Lógica",
  "zona": "Repetição",
  "numero": 1,
  "titulo": "Enquanto for verdade",
  "meta": {
    "enunciado": "Você repete tarefas com while, acompanha o contador no palco e resolve a fila de senhas da farmácia.",
    "desafioId": "logica-repeticao-u1-f4"
  },
  "fases": FASES_UNIDADE_REPETICAO_U1.map((fase) => fase.id)
};
