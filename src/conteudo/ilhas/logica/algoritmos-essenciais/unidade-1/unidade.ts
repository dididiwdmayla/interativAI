import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_ALGORITMOS_U1_F1 } from "./fase-1";
import { FASE_ALGORITMOS_U1_F2 } from "./fase-2";
import { FASE_ALGORITMOS_U1_F3 } from "./fase-3";
export const FASES_ALGORITMOS_U1: readonly Fase[] = [FASE_ALGORITMOS_U1_F1, FASE_ALGORITMOS_U1_F2, FASE_ALGORITMOS_U1_F3];
export const UNIDADE_ALGORITMOS_U1: Unidade = {
  "id": "logica-algoritmos-essenciais-u1",
  "ilha": "Ilha Lógica",
  "zona": "Algoritmos essenciais",
  "numero": 1,
  "titulo": "Buscar",
  "meta": {
    "enunciado": "Encontrar o ingresso certo sem examinar a lista inteira.",
    "desafioId": "logica-algoritmos-essenciais-u1-f3"
  },
  "fases": [
    "logica-algoritmos-essenciais-u1-f1",
    "logica-algoritmos-essenciais-u1-f2",
    "logica-algoritmos-essenciais-u1-f3"
  ]
};
