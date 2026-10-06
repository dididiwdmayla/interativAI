/*
 * Depuração, U5: o primeiro chamado. Na fase 1, o aquecimento (reproduzir o
 * defeito e achar a causa raiz); na fase 2, o contrato do Mercadinho Estrela,
 * um trabalho de manutenção no formato contrato (guia, seção 31).
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_DEPURACAO_U5_F1 } from "./fase-1";
import { FASE_DEPURACAO_U5_F2 } from "./fase-2-contrato";

export const FASES_DEPURACAO_U5: readonly Fase[] = [FASE_DEPURACAO_U5_F1, FASE_DEPURACAO_U5_F2];

export const UNIDADE_DEPURACAO_U5: Unidade = {
  id: "logica-depuracao-u5",
  ilha: "Ilha Lógica",
  zona: "Depuração",
  numero: 5,
  titulo: "Chamado: o estoque que não fecha",
  meta: {
    enunciado: "O Mercadinho Estrela chama você: reproduzir o defeito, achar a causa, consertar sem quebrar o resto e entregar um relatório do conserto.",
    desafioId: "logica-depuracao-u5-f2",
  },
  fases: FASES_DEPURACAO_U5.map((fase) => fase.id),
};
