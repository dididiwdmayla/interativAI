import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_ESTRUTURAS_U3_F1 } from "./fase-1";
import { FASE_ESTRUTURAS_U3_F2 } from "./fase-2";
import { FASE_ESTRUTURAS_U3_F3 } from "./fase-3";
export const FASES_ESTRUTURAS_U3: readonly Fase[] = [ FASE_ESTRUTURAS_U3_F1, FASE_ESTRUTURAS_U3_F2, FASE_ESTRUTURAS_U3_F3 ];
export const UNIDADE_ESTRUTURAS_U3: Unidade = {
  "id": "logica-estruturas-de-dados-u3",
  "ilha": "Ilha Lógica",
  "zona": "Estruturas de dados",
  "numero": 3,
  "titulo": "Dicionário (Map)",
  "meta": {
    "enunciado": "Guardar e consultar pares de chave e valor e escolher Map para muitas buscas.",
    "desafioId": "logica-estruturas-de-dados-u3-f3"
  },
  "fases": [
    "logica-estruturas-de-dados-u3-f1",
    "logica-estruturas-de-dados-u3-f2",
    "logica-estruturas-de-dados-u3-f3"
  ]
};
