import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_ALGORITMOS_U3_F1 } from "./fase-1";
import { FASE_ALGORITMOS_U3_F2 } from "./fase-2";
import { FASE_ALGORITMOS_U3_F3 } from "./fase-3";
export const FASES_ALGORITMOS_U3: readonly Fase[] = [FASE_ALGORITMOS_U3_F1, FASE_ALGORITMOS_U3_F2, FASE_ALGORITMOS_U3_F3];
export const UNIDADE_ALGORITMOS_U3: Unidade = {
  "id": "logica-algoritmos-essenciais-u3",
  "ilha": "Ilha Lógica",
  "zona": "Algoritmos essenciais",
  "numero": 3,
  "titulo": "Recursão",
  "meta": {
    "enunciado": "Somar os volumes das caixas com uma chamada menor a cada vez.",
    "desafioId": "logica-algoritmos-essenciais-u3-f3"
  },
  "fases": [
    "logica-algoritmos-essenciais-u3-f1",
    "logica-algoritmos-essenciais-u3-f2",
    "logica-algoritmos-essenciais-u3-f3"
  ]
};
