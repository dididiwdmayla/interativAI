import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_DEPURACAO_U1_F1 } from "./fase-1";
import { FASE_DEPURACAO_U1_F2 } from "./fase-2";
import { FASE_DEPURACAO_U1_F3 } from "./fase-3";
export const FASES_DEPURACAO_U1: readonly Fase[] = [FASE_DEPURACAO_U1_F1, FASE_DEPURACAO_U1_F2, FASE_DEPURACAO_U1_F3];
export const UNIDADE_DEPURACAO_U1: Unidade = {
  "id": "logica-depuracao-u1",
  "ilha": "Ilha Lógica",
  "zona": "Depuração",
  "numero": 1,
  "titulo": "Ler a mensagem de erro",
  "meta": {
    "enunciado": "Ler tipo, mensagem e linha, formular uma hipótese e consertar a causa.",
    "desafioId": "logica-depuracao-u1-f3"
  },
  "fases": [
    "logica-depuracao-u1-f1",
    "logica-depuracao-u1-f2",
    "logica-depuracao-u1-f3"
  ]
};
