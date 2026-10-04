import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_FUNCOES_U2_F1 } from "./fase-1";
import { FASE_FUNCOES_U2_F2 } from "./fase-2";
import { FASE_FUNCOES_U2_F3 } from "./fase-3";
import { FASE_FUNCOES_U2_F4 } from "./fase-4";
export const FASES_UNIDADE_FUNCOES_U2: readonly Fase[] = [FASE_FUNCOES_U2_F1, FASE_FUNCOES_U2_F2, FASE_FUNCOES_U2_F3, FASE_FUNCOES_U2_F4];
export const UNIDADE_FUNCOES_U2: Unidade = {
  "id": "logica-funcoes-u2",
  "ilha": "Ilha Lógica",
  "zona": "Funções",
  "numero": 2,
  "titulo": "Parâmetros e retorno",
  "meta": {
    "enunciado": "Você entrega argumentos e recebe resultados de funções, para calcular o frete de uma loja.",
    "desafioId": "logica-funcoes-u2-f4"
  },
  "fases": [
    "logica-funcoes-u2-f1",
    "logica-funcoes-u2-f2",
    "logica-funcoes-u2-f3",
    "logica-funcoes-u2-f4"
  ]
};
