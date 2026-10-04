import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_ALGORITMOS_U4_F1 } from "./fase-1";
import { FASE_ALGORITMOS_U4_F2 } from "./fase-2";
import { FASE_ALGORITMOS_U4_F3 } from "./fase-3";
export const FASES_ALGORITMOS_U4: readonly Fase[] = [FASE_ALGORITMOS_U4_F1, FASE_ALGORITMOS_U4_F2, FASE_ALGORITMOS_U4_F3];
export const UNIDADE_ALGORITMOS_U4: Unidade = {
  "id": "logica-algoritmos-essenciais-u4",
  "ilha": "Ilha Lógica",
  "zona": "Algoritmos essenciais",
  "numero": 4,
  "titulo": "Por que isso trava?",
  "meta": {
    "enunciado": "Conferir os registros sem repetir trabalho e dentro do limite de passos.",
    "desafioId": "logica-algoritmos-essenciais-u4-f3"
  },
  "fases": [
    "logica-algoritmos-essenciais-u4-f1",
    "logica-algoritmos-essenciais-u4-f2",
    "logica-algoritmos-essenciais-u4-f3"
  ]
};
