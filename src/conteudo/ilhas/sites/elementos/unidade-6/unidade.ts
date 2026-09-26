/*
 * Unidade 6: "Página do zero".
 *
 * Primeira unidade em `modoDocumento`: o editor mostra a página inteira
 * (doctype, html, head e body) e a árvore começa no <html>. Estrutura,
 * igual à das outras unidades:
 * - fases 1 e 2: micro-passos no MESMO assunto (o cartaz da Feira de
 *   Talentos), cada habilidade guiada e depois sozinho (ou revisitada) em
 *   outra situação;
 * - fase 3: o desafio num site DIFERENTE (o cartão do Marcos), que junta
 *   tudo sem passo a passo e é a meta mostrada com antes e depois.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_U6_F1 } from "./fase-1-esqueleto";
import { FASE_U6_F2 } from "./fase-2-charset";
import { FASE_U6_F3 } from "./fase-3-desafio";

export const FASES_UNIDADE_6: readonly Fase[] = [FASE_U6_F1, FASE_U6_F2, FASE_U6_F3];

export const UNIDADE_6: Unidade = {
  id: "sites-elementos-u6",
  ilha: "Ilha Sites",
  zona: "Elementos",
  numero: 6,
  titulo: "Página do zero",
  meta: {
    enunciado:
      "No fim desta unidade, você escreve uma página inteira do zero: title na aba, meta charset, meta viewport e o conteúdo do body.",
    desafioId: FASE_U6_F3.id,
  },
  fases: FASES_UNIDADE_6.map((fase) => fase.id),
};
