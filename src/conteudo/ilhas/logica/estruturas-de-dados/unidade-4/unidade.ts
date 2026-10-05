import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_ESTRUTURAS_U4_F1 } from "./fase-1";
import { FASE_ESTRUTURAS_U4_F2 } from "./fase-2";
import { FASE_ESTRUTURAS_U4_F3 } from "./fase-3";
export const FASES_ESTRUTURAS_U4: readonly Fase[] = [ FASE_ESTRUTURAS_U4_F1, FASE_ESTRUTURAS_U4_F2, FASE_ESTRUTURAS_U4_F3 ];
export const UNIDADE_ESTRUTURAS_U4: Unidade = {
  "id": "logica-estruturas-de-dados-u4",
  "ilha": "Ilha Lógica",
  "zona": "Estruturas de dados",
  "numero": 4,
  "titulo": "Árvore",
  "meta": {
    "enunciado": "Percorrer nós e filhos com recursão e reconhecer o DOM como estrutura de dados.",
    "desafioId": "logica-estruturas-de-dados-u4-f3"
  },
  "fases": [
    "logica-estruturas-de-dados-u4-f1",
    "logica-estruturas-de-dados-u4-f2",
    "logica-estruturas-de-dados-u4-f3"
  ]
};
