import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_FUNCOES_U4_F1 } from "./fase-1";
import { FASE_FUNCOES_U4_F2 } from "./fase-2";
import { FASE_FUNCOES_U4_F3 } from "./fase-3";
export const FASES_UNIDADE_FUNCOES_U4: readonly Fase[] = [FASE_FUNCOES_U4_F1, FASE_FUNCOES_U4_F2, FASE_FUNCOES_U4_F3];
export const UNIDADE_FUNCOES_U4: Unidade = {
  "id": "logica-funcoes-u4",
  "ilha": "Ilha Lógica",
  "zona": "Funções",
  "numero": 4,
  "titulo": "Arrow functions",
  "meta": {
    "enunciado": "Você reconhece e escreve funções com seta, com retorno implícito ou explícito, para converter medidas de uma receita.",
    "desafioId": "logica-funcoes-u4-f3"
  },
  "fases": [
    "logica-funcoes-u4-f1",
    "logica-funcoes-u4-f2",
    "logica-funcoes-u4-f3"
  ]
};
