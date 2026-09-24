import type { Expressao } from "./expressao";

/*
 * Tipos básicos do motor. Os tipos do conteúdo (Fase, Objetivo, Unidade,
 * Validador, Acao...) moram em src/conteudo/tipos.ts.
 */

export type Fala = { texto: string; expressao: Expressao };

export type DegrauAjuda = 0 | 1 | 2 | 3 | 4;

export const ESTRELAS_INICIAIS = 3;
export const ESTRELAS_MINIMAS = 1;
