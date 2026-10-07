import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_ORIGENS_U5_F1 } from "./fase-1-clique";
import { FASE_ORIGENS_U5_F2 } from "./fase-2-front-e-back";
import { FASE_ORIGENS_U5_F3 } from "./fase-3-pacote";
import { FASE_ORIGENS_U5_F4 } from "./fase-4-aba-rede";
import { FASE_ORIGENS_U5_F5 } from "./fase-5-desafio";

export const FASES_ORIGENS_U5: readonly Fase[] = [FASE_ORIGENS_U5_F1, FASE_ORIGENS_U5_F2, FASE_ORIGENS_U5_F3, FASE_ORIGENS_U5_F4, FASE_ORIGENS_U5_F5];

export const UNIDADE_ORIGENS_U5: Unidade = {
  id: "origens-museu-u5",
  ilha: "Ilha Origens",
  zona: "Museu",
  numero: 5,
  titulo: "Front, back e o caminho de um clique",
  meta: {
    enunciado: "No fim desta sala, você sabe o caminho de um clique, do DNS aos cabos no fundo do mar, separa front de back e lê a aba Rede.",
    desafioId: FASE_ORIGENS_U5_F5.id,
  },
  fases: FASES_ORIGENS_U5.map((fase) => fase.id),
};
