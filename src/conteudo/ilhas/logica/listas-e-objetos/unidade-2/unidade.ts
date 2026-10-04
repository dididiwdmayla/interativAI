import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_LISTAS_U2_F1 } from "./fase-1";
import { FASE_LISTAS_U2_F2 } from "./fase-2";
import { FASE_LISTAS_U2_F3 } from "./fase-3";
import { FASE_LISTAS_U2_F4 } from "./fase-4";
import { FASE_LISTAS_U2_F5 } from "./fase-5";
export const FASES_UNIDADE_LISTAS_U2: readonly Fase[] = [FASE_LISTAS_U2_F1, FASE_LISTAS_U2_F2, FASE_LISTAS_U2_F3, FASE_LISTAS_U2_F4, FASE_LISTAS_U2_F5];
export const UNIDADE_LISTAS_U2: Unidade = {
  "id": "logica-listas-e-objetos-u2",
  "ilha": "Ilha Lógica",
  "zona": "Listas e objetos",
  "numero": 2,
  "titulo": "Percorrer listas",
  "meta": {
    "enunciado": "Você soma, transforma e seleciona os votos de uma turma, escolhendo entre map, filter e find.",
    "desafioId": "logica-listas-e-objetos-u2-f5"
  },
  "fases": [
    "logica-listas-e-objetos-u2-f1",
    "logica-listas-e-objetos-u2-f2",
    "logica-listas-e-objetos-u2-f3",
    "logica-listas-e-objetos-u2-f4",
    "logica-listas-e-objetos-u2-f5"
  ]
};
