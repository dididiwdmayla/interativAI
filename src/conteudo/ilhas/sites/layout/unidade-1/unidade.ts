/*
 * L1: "Display". A unidade-modelo da zona Layout (segue o formato da E1,
 * "A aba Estilos"; veja "Como escrever fases de CSS" no
 * docs/GUIA-DE-CONTEUDO.md).
 *
 * Fases 1 a 3: micro-passos na Papelaria Ponto de Luz (block, inline-block
 * e none), cada habilidade guiada e depois sozinho, com uma previsão por
 * fase. A Fase 3 revisa DIRETO a ferramenta Esconder da U2 (visibility:
 * hidden) contra display: none, a confusão pedida nesta rodada. Fase 4: o
 * desafio na Oficina Conserta Tudo, site novo.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_L1_F1 } from "./fase-1-block";
import { FASE_L1_F2 } from "./fase-2-inline-block";
import { FASE_L1_F3 } from "./fase-3-display-none";
import { FASE_L1_F4 } from "./fase-4-desafio";

export const FASES_UNIDADE_L1: readonly Fase[] = [FASE_L1_F1, FASE_L1_F2, FASE_L1_F3, FASE_L1_F4];

export const UNIDADE_L1: Unidade = {
  id: "sites-layout-u1",
  ilha: "Ilha Sites",
  zona: "Layout",
  numero: 1,
  titulo: "Display",
  meta: {
    enunciado:
      "No fim desta unidade, você organiza qualquer layout com display: faz peças ocuparem a linha toda, ficarem lado a lado ou sumirem de vez.",
    desafioId: FASE_L1_F4.id,
  },
  fases: FASES_UNIDADE_L1.map((fase) => fase.id),
};
