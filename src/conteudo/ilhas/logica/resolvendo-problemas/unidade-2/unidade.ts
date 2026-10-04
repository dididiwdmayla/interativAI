import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_RESOLVER_U2_F1 } from "./fase-1";
import { FASE_RESOLVER_U2_F2 } from "./fase-2";
import { FASE_RESOLVER_U2_F3 } from "./fase-3";
export const FASES_UNIDADE_RESOLVER_U2: readonly Fase[] = [FASE_RESOLVER_U2_F1, FASE_RESOLVER_U2_F2, FASE_RESOLVER_U2_F3];
export const UNIDADE_RESOLVER_U2: Unidade = {
  "id": "logica-resolvendo-problemas-u2",
  "ilha": "Ilha Lógica",
  "zona": "Resolvendo problemas",
  "numero": 2,
  "titulo": "Pseudocódigo",
  "meta": {
    "enunciado": "Resolva um problema inteiro: entenda os dados, monte o plano, escreva a função e teste suas bordas.",
    "desafioId": "logica-resolvendo-problemas-u2-f3"
  },
  "fases": [
    "logica-resolvendo-problemas-u2-f1",
    "logica-resolvendo-problemas-u2-f2",
    "logica-resolvendo-problemas-u2-f3"
  ]
};
