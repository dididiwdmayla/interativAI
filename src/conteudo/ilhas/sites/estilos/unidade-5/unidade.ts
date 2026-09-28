/*
 * E5: "Variáveis e temas". A última unidade da zona Estilos, e a
 * primeira a usar o próprio jogo como site-alvo (SITE_ALVO_DO_JOGO, seção
 * 15 do docs/GUIA-DE-CONTEUDO.md).
 *
 * Fases 1 a 3: micro-passos, todos na maquete do jogo (não há "outro
 * site" possível aqui — ver o comentário no topo da fase 4). Fase 4: o
 * desafio, criar um tema completo e salvar.
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_E5_F1 } from "./fase-1-variavel";
import { FASE_E5_F2 } from "./fase-2-escopo";
import { FASE_E5_F3 } from "./fase-3-salvar-tema";
import { FASE_E5_F4 } from "./fase-4-desafio";

export const FASES_UNIDADE_E5: readonly Fase[] = [FASE_E5_F1, FASE_E5_F2, FASE_E5_F3, FASE_E5_F4];

export const UNIDADE_E5: Unidade = {
  id: "sites-estilos-u5",
  ilha: "Ilha Sites",
  zona: "Estilos",
  numero: 5,
  titulo: "Variáveis e temas",
  meta: {
    enunciado:
      "No fim desta unidade, você usa variáveis CSS para trocar as cores do próprio jogo e salva um tema novo, seu, disponível a qualquer momento.",
    desafioId: FASE_E5_F4.id,
  },
  fases: FASES_UNIDADE_E5.map((fase) => fase.id),
};
