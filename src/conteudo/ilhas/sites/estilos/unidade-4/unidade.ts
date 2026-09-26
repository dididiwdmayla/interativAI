/*
 * E4: "Por que minha regra não pega?".
 *
 * A última unidade da zona Estilos: junta tudo o que as três anteriores
 * ensinaram (seletores, especificidade implícita nas classes/ids) numa
 * explicação explícita da cascata. Estrutura, igual às outras:
 * - fases 1 e 2: micro-passos na MESMA loja de instrumentos, cada
 *   conceito guiado e depois sozinho (ou revisitado) em outra situação;
 * - fase 3: o desafio num site DIFERENTE (uma academia), "três regras que
 *   não pegam", como o mapa curricular descreve.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_E4_F1 } from "./fase-1-ordem-e-especificidade";
import { FASE_E4_F2 } from "./fase-2-heranca-e-important";
import { FASE_E4_F3 } from "./fase-3-desafio";

export const FASES_UNIDADE_E4: readonly Fase[] = [FASE_E4_F1, FASE_E4_F2, FASE_E4_F3];

export const UNIDADE_E4: Unidade = {
  id: "sites-estilos-u4",
  ilha: "Ilha Sites",
  zona: "Estilos",
  numero: 4,
  titulo: "Por que minha regra não pega?",
  meta: {
    enunciado:
      "No fim desta unidade, você acha sozinho por que uma regra CSS não pega: cascata, ordem, especificidade, herança e !important.",
    desafioId: FASE_E4_F3.id,
  },
  fases: FASES_UNIDADE_E4.map((fase) => fase.id),
};
