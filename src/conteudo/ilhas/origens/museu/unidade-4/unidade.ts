import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_ORIGENS_U4_F1 } from "./fase-1-memoria";
import { FASE_ORIGENS_U4_F2 } from "./fase-2-processador";
import { FASE_ORIGENS_U4_F3 } from "./fase-3-gerente";
import { FASE_ORIGENS_U4_F4 } from "./fase-4-arquivos";
import { FASE_ORIGENS_U4_F5 } from "./fase-5-cabos-do-gigante";
import { FASE_ORIGENS_U4_F6 } from "./fase-6-portoes";
import { FASE_ORIGENS_U4_F7 } from "./fase-7-desafio";

export const FASES_ORIGENS_U4: readonly Fase[] = [FASE_ORIGENS_U4_F1, FASE_ORIGENS_U4_F2, FASE_ORIGENS_U4_F3, FASE_ORIGENS_U4_F4, FASE_ORIGENS_U4_F5, FASE_ORIGENS_U4_F6, FASE_ORIGENS_U4_F7];

export const UNIDADE_ORIGENS_U4: Unidade = {
  id: "origens-museu-u4",
  ilha: "Ilha Origens",
  zona: "Museu",
  numero: 4,
  titulo: "Por baixo do capô",
  meta: {
    enunciado: "No fim desta sala, você roda um processador, divide o computador entre programas, arruma pastas e monta com portões um circuito que soma e um que lembra.",
    desafioId: FASE_ORIGENS_U4_F7.id,
  },
  fases: FASES_ORIGENS_U4.map((fase) => fase.id),
};
