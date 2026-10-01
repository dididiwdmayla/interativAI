import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_REPETICAO_U2_F1 } from "./fase-1";
import { FASE_REPETICAO_U2_F2 } from "./fase-2";
import { FASE_REPETICAO_U2_F3 } from "./fase-3";
import { FASE_REPETICAO_U2_F4 } from "./fase-4";
export const FASES_UNIDADE_REPETICAO_U2: readonly Fase[] = [FASE_REPETICAO_U2_F1, FASE_REPETICAO_U2_F2, FASE_REPETICAO_U2_F3, FASE_REPETICAO_U2_F4];
export const UNIDADE_REPETICAO_U2: Unidade = {
  "id": "logica-repeticao-u2",
  "ilha": "Ilha Lógica",
  "zona": "Repetição",
  "numero": 2,
  "titulo": "for e for...of",
  "meta": {
    "enunciado": "Você faz tabuadas com for, percorre letras com for...of e prepara as etiquetas de uma gráfica.",
    "desafioId": "logica-repeticao-u2-f4"
  },
  "fases": FASES_UNIDADE_REPETICAO_U2.map((fase) => fase.id)
};
