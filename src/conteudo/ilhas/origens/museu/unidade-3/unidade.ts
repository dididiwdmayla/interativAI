import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_ORIGENS_U3_F1 } from "./fase-1-mesmo-programa";
import { FASE_ORIGENS_U3_F2 } from "./fase-2-cada-uma";
import { FASE_ORIGENS_U3_F3 } from "./fase-3-mesmo-laco";
import { FASE_ORIGENS_U3_F4 } from "./fase-4-traduzir";
import { FASE_ORIGENS_U3_F5 } from "./fase-5-desafio";

export const FASES_ORIGENS_U3: readonly Fase[] = [FASE_ORIGENS_U3_F1, FASE_ORIGENS_U3_F2, FASE_ORIGENS_U3_F3, FASE_ORIGENS_U3_F4, FASE_ORIGENS_U3_F5];

export const UNIDADE_ORIGENS_U3: Unidade = {
  id: "origens-museu-u3",
  ilha: "Ilha Origens",
  zona: "Museu",
  numero: 3,
  titulo: "Por que existem tantas linguagens",
  meta: {
    enunciado: "No fim desta sala, você lê o mesmo programa em várias linguagens, roda Python de verdade e sabe por que cada linguagem existe.",
    desafioId: FASE_ORIGENS_U3_F5.id,
  },
  fases: FASES_ORIGENS_U3.map((fase) => fase.id),
};
