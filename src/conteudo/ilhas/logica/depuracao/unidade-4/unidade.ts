import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_DEPURACAO_U4_F1 } from "./fase-1";
import { FASE_DEPURACAO_U4_F2 } from "./fase-2";
import { FASE_DEPURACAO_U4_F3 } from "./fase-3";
export const FASES_DEPURACAO_U4: readonly Fase[] = [FASE_DEPURACAO_U4_F1, FASE_DEPURACAO_U4_F2, FASE_DEPURACAO_U4_F3];
export const UNIDADE_DEPURACAO_U4: Unidade = {
  "id": "logica-depuracao-u4",
  "ilha": "Ilha Lógica",
  "zona": "Depuração",
  "numero": 4,
  "titulo": "Observar variáveis",
  "meta": {
    "enunciado": "Comparar valor, tipo e alcance, investigar mudanças na lista e confirmar o conserto.",
    "desafioId": "logica-depuracao-u4-f3"
  },
  "fases": [
    "logica-depuracao-u4-f1",
    "logica-depuracao-u4-f2",
    "logica-depuracao-u4-f3"
  ]
};
