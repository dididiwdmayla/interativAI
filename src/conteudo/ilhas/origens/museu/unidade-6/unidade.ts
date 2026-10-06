import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_ORIGENS_U6_F1 } from "./fase-1-cidade";
import { FASE_ORIGENS_U6_F2 } from "./fase-2-desafio";

export const FASES_ORIGENS_U6: readonly Fase[] = [FASE_ORIGENS_U6_F1, FASE_ORIGENS_U6_F2];

export const UNIDADE_ORIGENS_U6: Unidade = {
  id: "origens-museu-u6",
  ilha: "Ilha Origens",
  zona: "Museu",
  numero: 6,
  titulo: "Onde a programação vive",
  meta: {
    enunciado: "No fim desta sala, você acha o programa escondido nas coisas da rua e sabe quem programa cada uma.",
    desafioId: FASE_ORIGENS_U6_F2.id,
  },
  fases: FASES_ORIGENS_U6.map((fase) => fase.id),
};
