import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_FUNCOES_U3_F1 } from "./fase-1";
import { FASE_FUNCOES_U3_F2 } from "./fase-2";
import { FASE_FUNCOES_U3_F3 } from "./fase-3";
import { FASE_FUNCOES_U3_F4 } from "./fase-4";
export const FASES_UNIDADE_FUNCOES_U3: readonly Fase[] = [FASE_FUNCOES_U3_F1, FASE_FUNCOES_U3_F2, FASE_FUNCOES_U3_F3, FASE_FUNCOES_U3_F4];
export const UNIDADE_FUNCOES_U3: Unidade = {
  "id": "logica-funcoes-u3",
  "ilha": "Ilha Lógica",
  "zona": "Funções",
  "numero": 3,
  "titulo": "Escopo",
  "meta": {
    "enunciado": "Você distingue variáveis globais, de função e de bloco, e conserta um contador de visitas que sempre zera.",
    "desafioId": "logica-funcoes-u3-f4"
  },
  "fases": [
    "logica-funcoes-u3-f1",
    "logica-funcoes-u3-f2",
    "logica-funcoes-u3-f3",
    "logica-funcoes-u3-f4"
  ]
};
