/* Decisões U4: Verdadeiro disfarçado. */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_DECISOES_U4_F1 } from "./fase-1";
import { FASE_DECISOES_U4_F2 } from "./fase-2";
import { FASE_DECISOES_U4_F3 } from "./fase-3";
import { FASE_DECISOES_U4_F4 } from "./fase-4";
export const FASES_UNIDADE_DECISOES_U4: readonly Fase[] = [FASE_DECISOES_U4_F1, FASE_DECISOES_U4_F2, FASE_DECISOES_U4_F3, FASE_DECISOES_U4_F4];
export const UNIDADE_DECISOES_U4: Unidade = {
  "id": "logica-decisoes-u4",
  "ilha": "Ilha Lógica",
  "zona": "Decisões",
  "numero": 4,
  "titulo": "Verdadeiro disfarçado",
  "meta": {
    "enunciado": "Você prevê quando um valor que não é booleano conta como verdadeiro ou falso num if e valida os campos de um cadastro.",
    "desafioId": "logica-decisoes-u4-f4"
  },
  "fases": FASES_UNIDADE_DECISOES_U4.map((fase) => fase.id)
};
