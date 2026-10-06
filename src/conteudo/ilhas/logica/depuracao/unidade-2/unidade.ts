import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_DEPURACAO_U2_F1 } from "./fase-1";
import { FASE_DEPURACAO_U2_F2 } from "./fase-2";
import { FASE_DEPURACAO_U2_F3 } from "./fase-3";
export const FASES_DEPURACAO_U2: readonly Fase[] = [FASE_DEPURACAO_U2_F1, FASE_DEPURACAO_U2_F2, FASE_DEPURACAO_U2_F3];
export const UNIDADE_DEPURACAO_U2: Unidade = {
  "id": "logica-depuracao-u2",
  "ilha": "Ilha Lógica",
  "zona": "Depuração",
  "numero": 2,
  "titulo": "Pontos de parada",
  "meta": {
    "enunciado": "Pausar, comparar os valores com uma hipótese e corrigir bugs silenciosos.",
    "desafioId": "logica-depuracao-u2-f3"
  },
  "fases": [
    "logica-depuracao-u2-f1",
    "logica-depuracao-u2-f2",
    "logica-depuracao-u2-f3"
  ]
};
