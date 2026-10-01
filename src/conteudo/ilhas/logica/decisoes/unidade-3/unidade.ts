/* Decisões U3: Se, senão. */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_DECISOES_U3_F1 } from "./fase-1";
import { FASE_DECISOES_U3_F2 } from "./fase-2";
import { FASE_DECISOES_U3_F3 } from "./fase-3";
import { FASE_DECISOES_U3_F4 } from "./fase-4";
import { FASE_DECISOES_U3_F5 } from "./fase-5";
export const FASES_UNIDADE_DECISOES_U3: readonly Fase[] = [FASE_DECISOES_U3_F1, FASE_DECISOES_U3_F2, FASE_DECISOES_U3_F3, FASE_DECISOES_U3_F4, FASE_DECISOES_U3_F5];
export const UNIDADE_DECISOES_U3: Unidade = {
  "id": "logica-decisoes-u3",
  "ilha": "Ilha Lógica",
  "zona": "Decisões",
  "numero": 3,
  "titulo": "Se, senão",
  "meta": {
    "enunciado": "Você faz o programa escolher um caminho com if, else if e else, junta condições com && e || e classifica pedidos de uma lanchonete.",
    "desafioId": "logica-decisoes-u3-f5"
  },
  "fases": FASES_UNIDADE_DECISOES_U3.map((fase) => fase.id)
};
