import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_ALGORITMOS_U2_F1 } from "./fase-1";
import { FASE_ALGORITMOS_U2_F2 } from "./fase-2";
import { FASE_ALGORITMOS_U2_F3 } from "./fase-3";
import { FASE_ALGORITMOS_U2_F4 } from "./fase-4";
export const FASES_ALGORITMOS_U2: readonly Fase[] = [FASE_ALGORITMOS_U2_F1, FASE_ALGORITMOS_U2_F2, FASE_ALGORITMOS_U2_F3, FASE_ALGORITMOS_U2_F4];
export const UNIDADE_ALGORITMOS_U2: Unidade = {
  "id": "logica-algoritmos-essenciais-u2",
  "ilha": "Ilha Lógica",
  "zona": "Algoritmos essenciais",
  "numero": 2,
  "titulo": "Ordenar",
  "meta": {
    "enunciado": "Organizar as distâncias do passeio em ordem numérica.",
    "desafioId": "logica-algoritmos-essenciais-u2-f4"
  },
  "fases": [
    "logica-algoritmos-essenciais-u2-f1",
    "logica-algoritmos-essenciais-u2-f2",
    "logica-algoritmos-essenciais-u2-f3",
    "logica-algoritmos-essenciais-u2-f4"
  ]
};
