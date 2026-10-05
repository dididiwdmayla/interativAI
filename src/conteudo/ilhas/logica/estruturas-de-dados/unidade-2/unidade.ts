import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_ESTRUTURAS_U2_F1 } from "./fase-1";
import { FASE_ESTRUTURAS_U2_F2 } from "./fase-2";
import { FASE_ESTRUTURAS_U2_F3 } from "./fase-3";
export const FASES_ESTRUTURAS_U2: readonly Fase[] = [ FASE_ESTRUTURAS_U2_F1, FASE_ESTRUTURAS_U2_F2, FASE_ESTRUTURAS_U2_F3 ];
export const UNIDADE_ESTRUTURAS_U2: Unidade = {
  "id": "logica-estruturas-de-dados-u2",
  "ilha": "Ilha Lógica",
  "zona": "Estruturas de dados",
  "numero": 2,
  "titulo": "Fila",
  "meta": {
    "enunciado": "Atender pela ordem de chegada e evitar mover uma lista enorme a cada retirada.",
    "desafioId": "logica-estruturas-de-dados-u2-f3"
  },
  "fases": [
    "logica-estruturas-de-dados-u2-f1",
    "logica-estruturas-de-dados-u2-f2",
    "logica-estruturas-de-dados-u2-f3"
  ]
};
