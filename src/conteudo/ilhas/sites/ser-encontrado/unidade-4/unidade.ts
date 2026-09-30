/*
 * S4: "Medir quem chega". Quarta unidade da zona opcional "Ser encontrado".
 *
 * Fase 1 (Buffet Festa Certa): eventos e conversão (aba Medição, Analytics
 * como conceito). Fase 2 (Loja Vale Verde): o Search Console como conceito.
 * Fase 3 (Doceria Mel & Cravo): links rastreáveis (utm). Fase 4, desafio
 * (Casa de Sucos Vitamina, site novo): qual divulgação trouxe clientes.
 *
 * A medição é simulada (o site-alvo não roda JavaScript); a tela diz isso.
 * O passo a passo do Search Console mora em
 * src/conteudo/plataformas-marketing.ts (conferido em 30/09/2026).
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_S4_F1 } from "./fase-1-eventos";
import { FASE_S4_F2 } from "./fase-2-search-console";
import { FASE_S4_F3 } from "./fase-3-utm";
import { FASE_S4_F4 } from "./fase-4-desafio";

export const FASES_UNIDADE_S4: readonly Fase[] = [FASE_S4_F1, FASE_S4_F2, FASE_S4_F3, FASE_S4_F4];

export const UNIDADE_S4: Unidade = {
  id: "sites-ser-encontrado-u4",
  ilha: "Ilha Sites",
  zona: "Ser encontrado",
  numero: 4,
  titulo: "Medir quem chega",
  meta: {
    enunciado:
      "No fim desta unidade, você sabe de onde vêm as visitas e o que elas fazem: eventos de conversão, links rastreáveis e o que o Search Console e o Analytics mostram.",
    desafioId: FASE_S4_F4.id,
  },
  fases: FASES_UNIDADE_S4.map((fase) => fase.id),
};
