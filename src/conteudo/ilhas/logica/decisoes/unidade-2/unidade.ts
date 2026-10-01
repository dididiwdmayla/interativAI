/* Decisões U2: Portões lógicos. */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_DECISOES_U2_F1 } from "./fase-1";
import { FASE_DECISOES_U2_F2 } from "./fase-2";
import { FASE_DECISOES_U2_F3 } from "./fase-3";
import { FASE_DECISOES_U2_F4 } from "./fase-4";
import { FASE_DECISOES_U2_F5 } from "./fase-5";
import { FASE_DECISOES_U2_F6 } from "./fase-6";
export const FASES_UNIDADE_DECISOES_U2: readonly Fase[] = [FASE_DECISOES_U2_F1, FASE_DECISOES_U2_F2, FASE_DECISOES_U2_F3, FASE_DECISOES_U2_F4, FASE_DECISOES_U2_F5, FASE_DECISOES_U2_F6];
export const UNIDADE_DECISOES_U2: Unidade = {
  "id": "logica-decisoes-u2",
  "ilha": "Ilha Lógica",
  "zona": "Decisões",
  "numero": 2,
  "titulo": "Portões lógicos",
  "meta": {
    "enunciado": "Você monta portões E, OU e NÃO, vê o circuito virar código com &&, || e ! e escreve a decisão da catraca de uma academia no Console.",
    "desafioId": "logica-decisoes-u2-f6"
  },
  "fases": FASES_UNIDADE_DECISOES_U2.map((fase) => fase.id)
};
