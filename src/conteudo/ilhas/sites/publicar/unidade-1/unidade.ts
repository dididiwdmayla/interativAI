/*
 * P1: "Acessibilidade e Lighthouse". Primeira unidade da zona Publicar
 * (a P2, "Do jogo pro mundo", já estava publicada desde a Rodada 12; a
 * P1 vem ANTES dela na ordem do currículo).
 *
 * Fase 1 (Clínica Sorriso Novo): a aba Lighthouse e o alt. Fase 2 (Loja
 * Estação Moda): ordem dos títulos, contraste e rótulo acessível. Fase
 * 3, desafio (Livraria Capítulo Final, site novo): os quatro juntos, até
 * uma nota alta.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_P1_F1 } from "./fase-1-lighthouse";
import { FASE_P1_F2 } from "./fase-2-consertos-de-acessibilidade";
import { FASE_P1_F3 } from "./fase-3-desafio";

export const FASES_UNIDADE_P1: readonly Fase[] = [FASE_P1_F1, FASE_P1_F2, FASE_P1_F3];

export const UNIDADE_P1: Unidade = {
  id: "sites-publicar-u1",
  ilha: "Ilha Sites",
  zona: "Publicar",
  numero: 1,
  titulo: "Acessibilidade e Lighthouse",
  meta: {
    enunciado:
      "No fim desta unidade, você usa o Lighthouse para achar e consertar problemas de acessibilidade e leva qualquer site de nota baixa a nota alta.",
    desafioId: FASE_P1_F3.id,
  },
  fases: FASES_UNIDADE_P1.map((fase) => fase.id),
};
