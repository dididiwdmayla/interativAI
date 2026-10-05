import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_DEPURACAO_U3_F1 } from "./fase-1";
import { FASE_DEPURACAO_U3_F2 } from "./fase-2";
import { FASE_DEPURACAO_U3_F3 } from "./fase-3";
export const FASES_DEPURACAO_U3: readonly Fase[] = [FASE_DEPURACAO_U3_F1, FASE_DEPURACAO_U3_F2, FASE_DEPURACAO_U3_F3];
export const UNIDADE_DEPURACAO_U3: Unidade = {
  "id": "logica-depuracao-u3",
  "ilha": "Ilha Lógica",
  "zona": "Depuração",
  "numero": 3,
  "titulo": "Passo a passo",
  "meta": {
    "enunciado": "Seguir chamadas, comparar valores locais e devolvidos e testar o conserto.",
    "desafioId": "logica-depuracao-u3-f3"
  },
  "fases": [
    "logica-depuracao-u3-f1",
    "logica-depuracao-u3-f2",
    "logica-depuracao-u3-f3"
  ]
};
