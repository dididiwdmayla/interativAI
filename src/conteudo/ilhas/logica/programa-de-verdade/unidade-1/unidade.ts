/*
 * Programa de verdade, U1: "O contrato da padaria". A última unidade da
 * Ilha Lógica e o primeiro CONTRATO do jogo (guia, seção 31): na fase 1, o
 * aluno conhece a vitrine e os aparelhos (relógio, campainha, o loop de
 * controle); na fase 2, a Dona Celeste contrata, muda o pedido no meio e
 * recebe o trabalho, que sai do jogo como um .js (Levar pro mundo).
 *
 * A zona vem depois de Depuração, Algoritmos essenciais e Estruturas de
 * dados no mapa: é o fim da ilha. Enquanto elas não forem produzidas, ela
 * abre logo depois de Resolvendo problemas.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_CONTRATO_LOGICA_F1 } from "./fase-1";
import { FASE_CONTRATO_LOGICA } from "./fase-2-contrato";

export const FASES_UNIDADE_CONTRATO_LOGICA: readonly Fase[] = [FASE_CONTRATO_LOGICA_F1, FASE_CONTRATO_LOGICA];

export const UNIDADE_CONTRATO_LOGICA: Unidade = {
  id: "logica-programa-de-verdade-u1",
  ilha: "Ilha Lógica",
  zona: "Programa de verdade",
  numero: 1,
  titulo: "O contrato da padaria",
  meta: {
    enunciado: "A Padaria Pão de Mel contrata você: entender o pedido, programar a vitrine, aguentar a mudança no meio, entregar e levar o programa pro mundo.",
    desafioId: "logica-programa-de-verdade-u1-f2",
  },
  fases: FASES_UNIDADE_CONTRATO_LOGICA.map((fase) => fase.id),
};
