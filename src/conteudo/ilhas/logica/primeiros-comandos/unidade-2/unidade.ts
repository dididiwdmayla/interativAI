/* U2: micro-passos em contexto único; desafio novo, meta em mini-palcos. */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_LOGICA_U2_F1 } from "./fase-1";
import { FASE_LOGICA_U2_F2 } from "./fase-2";
import { FASE_LOGICA_U2_F3 } from "./fase-3";
import { FASE_LOGICA_U2_F4 } from "./fase-4";
import { FASE_LOGICA_U2_F5 } from "./fase-5";
export const FASES_UNIDADE_LOGICA_U2: readonly Fase[] = [FASE_LOGICA_U2_F1, FASE_LOGICA_U2_F2, FASE_LOGICA_U2_F3, FASE_LOGICA_U2_F4, FASE_LOGICA_U2_F5];
export const UNIDADE_LOGICA_U2: Unidade = {
  "id": "logica-primeiros-comandos-u2",
  "ilha": "Ilha Lógica",
  "zona": "Primeiros comandos",
  "numero": 2,
  "titulo": "Textos",
  "meta": {
    "enunciado": "Você monta a confirmação de um pedido da floricultura, encaixa os valores numa frase e confere e mostra o texto.",
    "desafioId": "logica-primeiros-comandos-u2-f5"
  },
  "fases": FASES_UNIDADE_LOGICA_U2.map((fase) => fase.id)
};
