import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_RESOLVER_U1_F1 } from "./fase-1";
import { FASE_RESOLVER_U1_F2 } from "./fase-2";
import { FASE_RESOLVER_U1_F3 } from "./fase-3";
import { FASE_RESOLVER_U1_F4 } from "./fase-4";
export const FASES_UNIDADE_RESOLVER_U1: readonly Fase[] = [FASE_RESOLVER_U1_F1, FASE_RESOLVER_U1_F2, FASE_RESOLVER_U1_F3, FASE_RESOLVER_U1_F4];
export const UNIDADE_RESOLVER_U1: Unidade = {
  "id": "logica-resolvendo-problemas-u1",
  "ilha": "Ilha Lógica",
  "zona": "Resolvendo problemas",
  "numero": 1,
  "titulo": "Decompor um problema",
  "meta": {
    "enunciado": "Resolva um problema inteiro: entenda os dados, monte o plano, escreva a função e teste suas bordas.",
    "desafioId": "logica-resolvendo-problemas-u1-f4"
  },
  "fases": [
    "logica-resolvendo-problemas-u1-f1",
    "logica-resolvendo-problemas-u1-f2",
    "logica-resolvendo-problemas-u1-f3",
    "logica-resolvendo-problemas-u1-f4"
  ]
};
