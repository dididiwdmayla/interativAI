/*
 * Unidade 4: "Links, imagens, id e class".
 *
 * - fase 1, 2 e 3: micro-passos no site do Coral Vozes da Vila, cada
 *   habilidade primeiro guiada e depois sozinho, em outra situação;
 * - fase 4: o desafio no site da banda Trovão de Lata (site novo), que
 *   junta tudo sem passo a passo e é a meta mostrada com antes/depois no
 *   começo.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_U4_F1 } from "./fase-1-links";
import { FASE_U4_F2 } from "./fase-2-imagens";
import { FASE_U4_F3 } from "./fase-3-id-class";
import { FASE_U4_F4 } from "./fase-4-desafio";

export const FASES_UNIDADE_4: readonly Fase[] = [FASE_U4_F1, FASE_U4_F2, FASE_U4_F3, FASE_U4_F4];

export const UNIDADE_4: Unidade = {
  id: "sites-elementos-u4",
  ilha: "Ilha Sites",
  zona: "Elementos",
  numero: 4,
  titulo: "Links, imagens, id e class",
  meta: {
    enunciado:
      "No fim desta unidade, você conserta um site sozinho: arruma links quebrados, escreve descrições de imagem e organiza elementos com id e class.",
    desafioId: FASE_U4_F4.id,
  },
  fases: FASES_UNIDADE_4.map((fase) => fase.id),
};
