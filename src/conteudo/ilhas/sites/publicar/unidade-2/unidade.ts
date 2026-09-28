/*
 * P2: "Do jogo pro mundo". A última unidade da Ilha Sites e o MODELO do
 * tipo de fase projeto-ponte (ver docs/GUIA-DE-CONTEUDO.md).
 *
 * - Fase 1 (prática): o site pronto da Bia sai do jogo. Conferir no
 *   celular e no Lighthouse, entender os dois arquivos (index.html e
 *   style.css, ligados pelo <link>) e baixar o .zip.
 * - Fase 2 (projeto-ponte): o site do próprio jogador, do zero, com
 *   checklist de requisitos, salvo em Meus projetos e levado pro mundo.
 *
 * Sem desafio: o projeto-ponte ocupa o lugar dele (a meta da unidade é o
 * site do jogador, que não tem "depois" pronto para mostrar). Concluir a
 * unidade acende a ilha inteira no mapa.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_P2_F1 } from "./fase-1-arquivos";
import { FASE_P2_F2 } from "./fase-2-projeto";

export const FASES_UNIDADE_P2: readonly Fase[] = [FASE_P2_F1, FASE_P2_F2];

export const UNIDADE_P2: Unidade = {
  id: "sites-publicar-u2",
  ilha: "Ilha Sites",
  zona: "Publicar",
  numero: 2,
  titulo: "Do jogo pro mundo",
  meta: {
    enunciado:
      "No fim desta unidade, você tem o seu próprio site, feito do zero, em arquivos de verdade (index.html e style.css), pronto pra ganhar um link na internet.",
  },
  fases: FASES_UNIDADE_P2.map((fase) => fase.id),
};
