/* U3: micro-passos em contexto único; desafio novo, meta em mini-palcos. */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_LOGICA_U3_F1 } from "./fase-1";
import { FASE_LOGICA_U3_F2 } from "./fase-2";
import { FASE_LOGICA_U3_F3 } from "./fase-3";
import { FASE_LOGICA_U3_F4 } from "./fase-4";
import { FASE_LOGICA_U3_F5 } from "./fase-5";
import { FASE_LOGICA_U3_F6 } from "./fase-6";
export const FASES_UNIDADE_LOGICA_U3: readonly Fase[] = [FASE_LOGICA_U3_F1, FASE_LOGICA_U3_F2, FASE_LOGICA_U3_F3, FASE_LOGICA_U3_F4, FASE_LOGICA_U3_F5, FASE_LOGICA_U3_F6];
export const UNIDADE_LOGICA_U3: Unidade = {
  "id": "logica-primeiros-comandos-u3",
  "ilha": "Ilha Lógica",
  "zona": "Primeiros comandos",
  "numero": 3,
  "titulo": "Tipos",
  "meta": {
    "enunciado": "Você descobre tipos, converte a conta recebida como texto e calcula e mostra uma gorjeta sem juntar algarismos.",
    "desafioId": "logica-primeiros-comandos-u3-f6"
  },
  "fases": FASES_UNIDADE_LOGICA_U3.map((fase) => fase.id)
};
