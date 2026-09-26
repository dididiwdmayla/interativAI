/*
 * E3: "Modelo de caixa".
 *
 * Primeira unidade a usar a aba Calculado (painel-calculado e
 * modelo-de-caixa): o diagrama entra no primeiro objetivo, antes de
 * qualquer edição. Estrutura, igual às outras unidades de CSS:
 * - fases 1 e 2: micro-passos na MESMA confeitaria, cada camada guiada e
 *   depois sozinha (ou revisitada) em outra situação;
 * - fase 3: o desafio num site DIFERENTE (uma barbearia), "consertar
 *   cards espremidos" como o mapa curricular descreve.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_E3_F1 } from "./fase-1-padding-e-border";
import { FASE_E3_F2 } from "./fase-2-margin-e-box-sizing";
import { FASE_E3_F3 } from "./fase-3-desafio";

export const FASES_UNIDADE_E3: readonly Fase[] = [FASE_E3_F1, FASE_E3_F2, FASE_E3_F3];

export const UNIDADE_E3: Unidade = {
  id: "sites-estilos-u3",
  ilha: "Ilha Sites",
  zona: "Estilos",
  numero: 3,
  titulo: "Modelo de caixa",
  meta: {
    enunciado:
      "No fim desta unidade, você lê e mexe nas quatro camadas da caixa (padding, border, margin e box-sizing) e conserta cards espremidos.",
    desafioId: FASE_E3_F3.id,
  },
  fases: FASES_UNIDADE_E3.map((fase) => fase.id),
};
