import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_LISTAS_U4_F1 } from "./fase-1";
import { FASE_LISTAS_U4_F2 } from "./fase-2";
import { FASE_LISTAS_U4_F3 } from "./fase-3";
import { FASE_LISTAS_U4_F4 } from "./fase-4";
export const FASES_UNIDADE_LISTAS_U4: readonly Fase[] = [FASE_LISTAS_U4_F1, FASE_LISTAS_U4_F2, FASE_LISTAS_U4_F3, FASE_LISTAS_U4_F4];
export const UNIDADE_LISTAS_U4: Unidade = {
  "id": "logica-listas-e-objetos-u4",
  "ilha": "Ilha Lógica",
  "zona": "Listas e objetos",
  "numero": 4,
  "titulo": "Listas de objetos",
  "meta": {
    "enunciado": "Você calcula o pedido de uma pizzaria e seleciona opções a partir de listas de fichas.",
    "desafioId": "logica-listas-e-objetos-u4-f4"
  },
  "fases": [
    "logica-listas-e-objetos-u4-f1",
    "logica-listas-e-objetos-u4-f2",
    "logica-listas-e-objetos-u4-f3",
    "logica-listas-e-objetos-u4-f4"
  ]
};
