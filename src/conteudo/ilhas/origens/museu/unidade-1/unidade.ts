import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_ORIGENS_U1_F1 } from "./fase-1-tear";
import { FASE_ORIGENS_U1_F2 } from "./fase-2-binario";
import { FASE_ORIGENS_U1_F3 } from "./fase-3-camadas";
import { FASE_ORIGENS_U1_F4 } from "./fase-4-cores";
import { FASE_ORIGENS_U1_F5 } from "./fase-5-desafio";

export const FASES_ORIGENS_U1: readonly Fase[] = [FASE_ORIGENS_U1_F1, FASE_ORIGENS_U1_F2, FASE_ORIGENS_U1_F3, FASE_ORIGENS_U1_F4, FASE_ORIGENS_U1_F5];

export const UNIDADE_ORIGENS_U1: Unidade = {
  id: "origens-museu-u1",
  ilha: "Ilha Origens",
  zona: "Museu",
  numero: 1,
  titulo: "Como o computador entende",
  meta: {
    enunciado: "No fim desta sala, você tece com cartões, escreve uma letra num byte e monta uma cor em hexadecimal, entendendo o que a máquina lê.",
    desafioId: FASE_ORIGENS_U1_F5.id,
  },
  fases: FASES_ORIGENS_U1.map((fase) => fase.id),
};
