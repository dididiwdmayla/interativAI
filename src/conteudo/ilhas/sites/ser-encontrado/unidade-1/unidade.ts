/*
 * S1: "Como o Google acha seu site". Primeira unidade da zona opcional
 * "Ser encontrado" (unidade-modelo da zona, com a ferramenta nova
 * Resultado na busca).
 *
 * Fase 1 (Ateliê Linha Fina): rastreamento, indexação e o title como o
 * título do resultado. Fase 2 (Floricultura Jardim Suspenso): a meta
 * description e o corte. Fase 3 (Escola de Dança Passo Leve): o noindex.
 * Fase 4, desafio (Casa de Farinha Seu Dito, site novo): os três juntos.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_S1_F1 } from "./fase-1-titulo";
import { FASE_S1_F2 } from "./fase-2-descricao";
import { FASE_S1_F3 } from "./fase-3-noindex";
import { FASE_S1_F4 } from "./fase-4-desafio";

export const FASES_UNIDADE_S1: readonly Fase[] = [FASE_S1_F1, FASE_S1_F2, FASE_S1_F3, FASE_S1_F4];

export const UNIDADE_S1: Unidade = {
  id: "sites-ser-encontrado-u1",
  ilha: "Ilha Sites",
  zona: "Ser encontrado",
  numero: 1,
  titulo: "Como o Google acha seu site",
  meta: {
    enunciado:
      "No fim desta unidade, você faz uma página aparecer do jeito certo na busca: título e descrição que convidam, sem corte e sem noindex esquecido.",
    desafioId: FASE_S1_F4.id,
  },
  fases: FASES_UNIDADE_S1.map((fase) => fase.id),
};
