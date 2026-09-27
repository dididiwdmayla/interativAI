/*
 * L2: "Flexbox". Fases 1 a 3: micro-passos na Livraria Página Virada
 * (display: flex e flex-direction, justify-content e align-items, gap e
 * flex-wrap), cada habilidade guiada e depois sozinho, com uma previsão
 * por fase. Fase 4: o desafio no Brechó Segunda Chance, site novo.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_L2_F1 } from "./fase-1-flexbox";
import { FASE_L2_F2 } from "./fase-2-alinhar";
import { FASE_L2_F3 } from "./fase-3-gap-wrap";
import { FASE_L2_F4 } from "./fase-4-desafio";

export const FASES_UNIDADE_L2: readonly Fase[] = [FASE_L2_F1, FASE_L2_F2, FASE_L2_F3, FASE_L2_F4];

export const UNIDADE_L2: Unidade = {
  id: "sites-layout-u2",
  ilha: "Ilha Sites",
  zona: "Layout",
  numero: 2,
  titulo: "Flexbox",
  meta: {
    enunciado:
      "No fim desta unidade, você monta menus e fileiras de cards com flexbox: em linha, espalhados, alinhados, com espaço certo e sem sair da tela.",
    desafioId: FASE_L2_F4.id,
  },
  fases: FASES_UNIDADE_L2.map((fase) => fase.id),
};
