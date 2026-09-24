/*
 * Unidade 2: "Faxina no site". A UNIDADE-MODELO.
 *
 * Esta pasta é a referência para produzir unidades novas (veja
 * docs/GUIA-DE-CONTEUDO.md). Estrutura:
 * - fase 1, 2 e 3: micro-passos no MESMO site (Jornal da Vila), cada
 *   habilidade primeiro guiada e depois sozinho, em outra situação;
 * - fase 4: o desafio num site DIFERENTE (Brinquedos Arco-Íris), que junta
 *   tudo sem passo a passo e é a meta mostrada com antes/depois no começo.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_U2_F1 } from "./fase-1-familia";
import { FASE_U2_F2 } from "./fase-2-esconder-apagar";
import { FASE_U2_F3 } from "./fase-3-duplicar";
import { FASE_U2_F4 } from "./fase-4-desafio";

export const FASES_UNIDADE_2: readonly Fase[] = [FASE_U2_F1, FASE_U2_F2, FASE_U2_F3, FASE_U2_F4];

export const UNIDADE_2: Unidade = {
  id: "sites-elementos-u2",
  ilha: "Ilha Sites",
  zona: "Elementos",
  numero: 2,
  titulo: "Faxina no site",
  meta: {
    enunciado:
      "No fim desta unidade, você limpa um site bagunçado sozinho: some com pop-ups, esconde banners, reorganiza produtos e navega pela família de elementos.",
    desafioId: FASE_U2_F4.id,
  },
  fases: FASES_UNIDADE_2.map((fase) => fase.id),
};
