/*
 * Unidade 5: "Caixas e seções".
 *
 * - fase 1, 2 e 3: micro-passos na Oficina Roda Livre, cada habilidade
 *   primeiro guiada e depois sozinho, em outra situação;
 * - fase 4: o desafio no Pet Shop Focinho Feliz (site novo), que junta
 *   tudo sem passo a passo e é a meta mostrada com antes/depois no começo.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_U5_F1 } from "./fase-1-divs";
import { FASE_U5_F2 } from "./fase-2-section-article";
import { FASE_U5_F3 } from "./fase-3-span";
import { FASE_U5_F4 } from "./fase-4-desafio";

export const FASES_UNIDADE_5: readonly Fase[] = [FASE_U5_F1, FASE_U5_F2, FASE_U5_F3, FASE_U5_F4];

export const UNIDADE_5: Unidade = {
  id: "sites-elementos-u5",
  ilha: "Ilha Sites",
  zona: "Elementos",
  numero: 5,
  titulo: "Caixas e seções",
  meta: {
    enunciado:
      "No fim desta unidade, você dá estrutura a um site feito só de div sozinho: troca por header, footer, section, article e span onde fizer sentido.",
    desafioId: FASE_U5_F4.id,
  },
  fases: FASES_UNIDADE_5.map((fase) => fase.id),
};
