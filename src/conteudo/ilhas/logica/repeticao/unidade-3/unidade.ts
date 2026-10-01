import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_REPETICAO_U3_F1 } from "./fase-1";
import { FASE_REPETICAO_U3_F2 } from "./fase-2";
import { FASE_REPETICAO_U3_F3 } from "./fase-3";
import { FASE_REPETICAO_U3_F4 } from "./fase-4";
import { FASE_REPETICAO_U3_F5 } from "./fase-5";
export const FASES_UNIDADE_REPETICAO_U3: readonly Fase[] = [FASE_REPETICAO_U3_F1, FASE_REPETICAO_U3_F2, FASE_REPETICAO_U3_F3, FASE_REPETICAO_U3_F4, FASE_REPETICAO_U3_F5];
export const UNIDADE_REPETICAO_U3: Unidade = {
  "id": "logica-repeticao-u3",
  "ilha": "Ilha Lógica",
  "zona": "Repetição",
  "numero": 3,
  "titulo": "Contar e somar",
  "meta": {
    "enunciado": "Você distingue contador e acumulador, conta casos, encontra extremos e calcula a média para fechar o caixa de uma sorveteria.",
    "desafioId": "logica-repeticao-u3-f5"
  },
  "fases": FASES_UNIDADE_REPETICAO_U3.map((fase) => fase.id)
};
