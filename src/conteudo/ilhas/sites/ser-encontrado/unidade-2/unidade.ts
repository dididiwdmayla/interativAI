/*
 * S2: "SEO na página". Segunda unidade da zona opcional "Ser encontrado".
 *
 * Fase 1 (Barbearia Navalha de Ouro): o h1. Fase 2 (Vidraçaria Prisma): o
 * texto que responde e o enchimento de palavra-chave. Fase 3 (Livraria
 * Página Viva): o texto dos links e o alt das fotos. Fase 4 (Estúdio Foco):
 * velocidade e imagem preguiçosa. Fase 5, desafio (Casa de Chá Lótus, site
 * novo): tudo junto.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_S2_F1 } from "./fase-1-h1";
import { FASE_S2_F2 } from "./fase-2-texto";
import { FASE_S2_F3 } from "./fase-3-links-e-fotos";
import { FASE_S2_F4 } from "./fase-4-velocidade";
import { FASE_S2_F5 } from "./fase-5-desafio";

export const FASES_UNIDADE_S2: readonly Fase[] = [FASE_S2_F1, FASE_S2_F2, FASE_S2_F3, FASE_S2_F4, FASE_S2_F5];

export const UNIDADE_S2: Unidade = {
  id: "sites-ser-encontrado-u2",
  ilha: "Ilha Sites",
  zona: "Ser encontrado",
  numero: 2,
  titulo: "SEO na página",
  meta: {
    enunciado:
      "No fim desta unidade, você deixa uma página boa para quem busca: um h1 claro, texto que responde, links e fotos que se explicam e uma página que abre rápido.",
    desafioId: FASE_S2_F5.id,
  },
  fases: FASES_UNIDADE_S2.map((fase) => fase.id),
};
