/*
 * L4: "Posição e camadas". Fases 1 a 3: micro-passos na Loja Retrô Vinil
 * (relative, absolute ancorado no pai, fixed/sticky e z-index), cada
 * habilidade guiada e depois sozinho, com uma previsão por fase. Fase 4:
 * o desafio na Confeitaria Doce Instante, site novo. Última unidade da
 * zona Layout.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_L4_F1 } from "./fase-1-relative";
import { FASE_L4_F2 } from "./fase-2-absolute";
import { FASE_L4_F3 } from "./fase-3-fixed-sticky-z";
import { FASE_L4_F4 } from "./fase-4-desafio";

export const FASES_UNIDADE_L4: readonly Fase[] = [FASE_L4_F1, FASE_L4_F2, FASE_L4_F3, FASE_L4_F4];

export const UNIDADE_L4: Unidade = {
  id: "sites-layout-u4",
  ilha: "Ilha Sites",
  zona: "Layout",
  numero: 4,
  titulo: "Posição e camadas",
  meta: {
    enunciado:
      "No fim desta unidade, você posiciona qualquer peça: desliza sem sair do lugar, gruda um selo no canto de um card, fixa um botão na tela e resolve quem fica por cima.",
    desafioId: FASE_L4_F4.id,
  },
  fases: FASES_UNIDADE_L4.map((fase) => fase.id),
};
