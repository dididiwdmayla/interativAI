import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_FUNCOES_U1_F1 } from "./fase-1";
import { FASE_FUNCOES_U1_F2 } from "./fase-2";
import { FASE_FUNCOES_U1_F3 } from "./fase-3";
export const FASES_UNIDADE_FUNCOES_U1: readonly Fase[] = [FASE_FUNCOES_U1_F1, FASE_FUNCOES_U1_F2, FASE_FUNCOES_U1_F3];
export const UNIDADE_FUNCOES_U1: Unidade = {
  "id": "logica-funcoes-u1",
  "ilha": "Ilha Lógica",
  "zona": "Funções",
  "numero": 1,
  "titulo": "Criar e chamar",
  "meta": {
    "enunciado": "Você guarda instruções em funções e escolhe quando executá-las, para abrir e fechar uma loja.",
    "desafioId": "logica-funcoes-u1-f3"
  },
  "fases": [
    "logica-funcoes-u1-f1",
    "logica-funcoes-u1-f2",
    "logica-funcoes-u1-f3"
  ]
};
