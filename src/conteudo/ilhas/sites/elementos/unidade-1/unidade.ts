/*
 * Unidade 1: "O site é seu".
 *
 * Fase 1: micro-passos guiados (não muda: preserva o progresso salvo e os
 * testes que já existiam). Fase 2: as mesmas 4 habilidades, sozinho, numa
 * página diferente da mesma padaria. Fase 3: o desafio, na Lanchonete
 * Sabor Rápido (site novo), juntando as quatro sem passo a passo.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_U1_F1 } from "./fase-1";
import { FASE_U1_F2 } from "./fase-2";
import { FASE_U1_F3 } from "./fase-3-desafio";

export const FASES_UNIDADE_1: readonly Fase[] = [FASE_U1_F1, FASE_U1_F2, FASE_U1_F3];

export const UNIDADE_1: Unidade = {
  id: "sites-elementos-u1",
  ilha: "Ilha Sites",
  zona: "Elementos",
  numero: 1,
  titulo: "O site é seu",
  meta: {
    enunciado:
      "No fim desta unidade, você mexe em qualquer site sozinho: acha peças pela árvore ou pela setinha, troca textos e cria itens novos pelo código.",
    desafioId: FASE_U1_F3.id,
  },
  fases: FASES_UNIDADE_1.map((fase) => fase.id),
};
