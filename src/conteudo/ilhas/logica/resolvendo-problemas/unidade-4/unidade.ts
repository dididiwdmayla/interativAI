import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_RESOLVER_U4_F1 } from "./fase-1";
import { FASE_RESOLVER_U4_F2 } from "./fase-2";
export const FASES_UNIDADE_RESOLVER_U4: readonly Fase[] = [FASE_RESOLVER_U4_F1, FASE_RESOLVER_U4_F2];
export const UNIDADE_RESOLVER_U4: Unidade = {
  "id": "logica-resolvendo-problemas-u4",
  "ilha": "Ilha Lógica",
  "zona": "Resolvendo problemas",
  "numero": 4,
  "titulo": "Testar com exemplos",
  "meta": {
    "enunciado": "Resolva um problema inteiro: entenda os dados, monte o plano, escreva a função e teste suas bordas.",
    "desafioId": "logica-resolvendo-problemas-u4-f2"
  },
  "fases": [
    "logica-resolvendo-problemas-u4-f1",
    "logica-resolvendo-problemas-u4-f2"
  ]
};
