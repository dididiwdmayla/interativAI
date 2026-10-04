import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_LISTAS_U3_F1 } from "./fase-1";
import { FASE_LISTAS_U3_F2 } from "./fase-2";
import { FASE_LISTAS_U3_F3 } from "./fase-3";
export const FASES_UNIDADE_LISTAS_U3: readonly Fase[] = [FASE_LISTAS_U3_F1, FASE_LISTAS_U3_F2, FASE_LISTAS_U3_F3];
export const UNIDADE_LISTAS_U3: Unidade = {
  "id": "logica-listas-e-objetos-u3",
  "ilha": "Ilha Lógica",
  "zona": "Listas e objetos",
  "numero": 3,
  "titulo": "Objetos",
  "meta": {
    "enunciado": "Você lê e atualiza a ficha de um pet, usando chaves e valores sem confundir um objeto com uma lista.",
    "desafioId": "logica-listas-e-objetos-u3-f3"
  },
  "fases": [
    "logica-listas-e-objetos-u3-f1",
    "logica-listas-e-objetos-u3-f2",
    "logica-listas-e-objetos-u3-f3"
  ]
};
