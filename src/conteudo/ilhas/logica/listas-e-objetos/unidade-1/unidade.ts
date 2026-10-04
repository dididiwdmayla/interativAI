import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_LISTAS_U1_F1 } from "./fase-1";
import { FASE_LISTAS_U1_F2 } from "./fase-2";
import { FASE_LISTAS_U1_F3 } from "./fase-3";
import { FASE_LISTAS_U1_F4 } from "./fase-4";
export const FASES_UNIDADE_LISTAS_U1: readonly Fase[] = [FASE_LISTAS_U1_F1, FASE_LISTAS_U1_F2, FASE_LISTAS_U1_F3, FASE_LISTAS_U1_F4];
export const UNIDADE_LISTAS_U1: Unidade = {
  "id": "logica-listas-e-objetos-u1",
  "ilha": "Ilha Lógica",
  "zona": "Listas e objetos",
  "numero": 1,
  "titulo": "Listas",
  "meta": {
    "enunciado": "Você organiza e edita a playlist de uma festa, usando posições, tamanho e duas variáveis apontando para a mesma lista.",
    "desafioId": "logica-listas-e-objetos-u1-f4"
  },
  "fases": [
    "logica-listas-e-objetos-u1-f1",
    "logica-listas-e-objetos-u1-f2",
    "logica-listas-e-objetos-u1-f3",
    "logica-listas-e-objetos-u1-f4"
  ]
};
