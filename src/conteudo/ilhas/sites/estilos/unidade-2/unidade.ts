/*
 * E2: "Seletores".
 *
 * Estrutura, igual à das outras unidades de CSS:
 * - fases 1 e 2: micro-passos na MESMA livraria, cada seletor guiado e
 *   depois sozinho (ou revisitado) em outra situação;
 * - fase 3: o desafio num site DIFERENTE (um mercadinho), que junta os
 *   quatro seletores sem passo a passo e é a meta mostrada com antes e
 *   depois.
 *
 * Nenhuma ferramenta nova: a caixinha de hover no seletor do painel
 * Estilos (acender as peças na prévia ao passar o mouse) já existe desde
 * a rodada 9 e vale sozinha aqui.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_E2_F1 } from "./fase-1-tag-e-classe";
import { FASE_E2_F2 } from "./fase-2-id-e-descendente";
import { FASE_E2_F3 } from "./fase-3-desafio";

export const FASES_UNIDADE_E2: readonly Fase[] = [FASE_E2_F1, FASE_E2_F2, FASE_E2_F3];

export const UNIDADE_E2: Unidade = {
  id: "sites-estilos-u2",
  ilha: "Ilha Sites",
  zona: "Estilos",
  numero: 2,
  titulo: "Seletores",
  meta: {
    enunciado:
      "No fim desta unidade, você escolhe o seletor certo pra cada job: tag, classe, id ou descendente, sem estilizar peças que não devia.",
    desafioId: FASE_E2_F3.id,
  },
  fases: FASES_UNIDADE_E2.map((fase) => fase.id),
};
