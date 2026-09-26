/*
 * E1: "A aba Estilos". A UNIDADE-MODELO DE CSS.
 *
 * Esta pasta é a referência para produzir as unidades de CSS (Estilos e
 * Layout; veja "Como escrever fases de CSS" no docs/GUIA-DE-CONTEUDO.md).
 * Estrutura, igual à da Unidade 2:
 * - fases 1, 2 e 3: micro-passos no MESMO site (Floricultura Pétala Azul),
 *   cada habilidade primeiro guiada e depois sozinho, em outra situação,
 *   com uma previsão por fase atacando uma confusão de leigo;
 * - fase 4: o desafio num site DIFERENTE (Café Cantinho do Grão), que junta
 *   tudo sem passo a passo e é a meta mostrada com antes e depois.
 *
 * As ferramentas do painel Estilos entram uma a uma, no primeiro objetivo
 * que precisa de cada: painel, editar valor e caixinha (Fase 1), setas
 * (Fase 2), seletor de cor e regra nova (Fase 3). O Calculado fica para a
 * E3 (Modelo de caixa).
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_E1_F1 } from "./fase-1-regras";
import { FASE_E1_F2 } from "./fase-2-texto";
import { FASE_E1_F3 } from "./fase-3-cores-regras";
import { FASE_E1_F4 } from "./fase-4-desafio";

export const FASES_UNIDADE_E1: readonly Fase[] = [FASE_E1_F1, FASE_E1_F2, FASE_E1_F3, FASE_E1_F4];

export const UNIDADE_E1: Unidade = {
  id: "sites-estilos-u1",
  ilha: "Ilha Sites",
  zona: "Estilos",
  numero: 1,
  titulo: "A aba Estilos",
  meta: {
    enunciado:
      "No fim desta unidade, você repagina um site sozinho pela folha de estilo: cores, tamanhos, fonte e regras novas, sem tocar no HTML.",
    desafioId: FASE_E1_F4.id,
  },
  fases: FASES_UNIDADE_E1.map((fase) => fase.id),
};
