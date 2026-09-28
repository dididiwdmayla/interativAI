/*
 * R2: "Media queries e mobile first". Última unidade da zona Responsivo.
 *
 * Fase 1 (Estúdio Passo Leve, desktop first): a sintaxe de @media e o
 * breakpoint. Fase 2 (Loja Verde Vivo, mobile first): imagem responsiva
 * e min-width, o oposto de max-width. Fase 3, desafio (Restaurante Sabor
 * da Vila, site novo, desktop first): junta tudo sem passo a passo.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_R2_F1 } from "./fase-1-primeira-media-query";
import { FASE_R2_F2 } from "./fase-2-mobile-first";
import { FASE_R2_F3 } from "./fase-3-desafio";

export const FASES_UNIDADE_R2: readonly Fase[] = [FASE_R2_F1, FASE_R2_F2, FASE_R2_F3];

export const UNIDADE_R2: Unidade = {
  id: "sites-responsivo-u2",
  ilha: "Ilha Sites",
  zona: "Responsivo",
  numero: 2,
  titulo: "Media queries e mobile first",
  meta: {
    enunciado:
      "No fim desta unidade, você escreve media queries de verdade (max-width e min-width) e imagens responsivas, deixando qualquer site bom em qualquer tela.",
    desafioId: FASE_R2_F3.id,
  },
  fases: FASES_UNIDADE_R2.map((fase) => fase.id),
};
