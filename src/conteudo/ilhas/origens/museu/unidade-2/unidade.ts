import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_ORIGENS_U2_F1 } from "./fase-1-cartoes-e-valvulas";
import { FASE_ORIGENS_U2_F2 } from "./fase-2-casa-e-bolso";
import { FASE_ORIGENS_U2_F3 } from "./fase-3-desafio";

export const FASES_ORIGENS_U2: readonly Fase[] = [FASE_ORIGENS_U2_F1, FASE_ORIGENS_U2_F2, FASE_ORIGENS_U2_F3];

export const UNIDADE_ORIGENS_U2: Unidade = {
  id: "origens-museu-u2",
  ilha: "Ilha Origens",
  zona: "Museu",
  numero: 2,
  titulo: "Linha do tempo",
  meta: {
    enunciado: "No fim desta sala, você põe a família do computador na ordem, do tear à IA, e sabe o que cada geração mudou.",
    desafioId: FASE_ORIGENS_U2_F3.id,
  },
  fases: FASES_ORIGENS_U2.map((fase) => fase.id),
};
