import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_ESTRUTURAS_U1_F1 } from "./fase-1";
import { FASE_ESTRUTURAS_U1_F2 } from "./fase-2";
import { FASE_ESTRUTURAS_U1_F3 } from "./fase-3";
export const FASES_ESTRUTURAS_U1: readonly Fase[] = [ FASE_ESTRUTURAS_U1_F1, FASE_ESTRUTURAS_U1_F2, FASE_ESTRUTURAS_U1_F3 ];
export const UNIDADE_ESTRUTURAS_U1: Unidade = {
  "id": "logica-estruturas-de-dados-u1",
  "ilha": "Ilha Lógica",
  "zona": "Estruturas de dados",
  "numero": 1,
  "titulo": "Pilha",
  "meta": {
    "enunciado": "Desfazer ações na ordem contrária à entrada e reconhecer o último que sai primeiro.",
    "desafioId": "logica-estruturas-de-dados-u1-f3"
  },
  "fases": [
    "logica-estruturas-de-dados-u1-f1",
    "logica-estruturas-de-dados-u1-f2",
    "logica-estruturas-de-dados-u1-f3"
  ]
};
