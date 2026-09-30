/*
 * Lógica U1: "O Console calcula". A UNIDADE-MODELO DA ILHA LÓGICA.
 *
 * Referência para produzir as unidades da ilha (guia, seção 25). Mesma
 * estrutura da U2 e da E1:
 * - fases 1, 2 e 3: micro-passos na mesma situação (a Padaria Pão de Mel),
 *   cada habilidade primeiro guiada e depois sozinho, com uma previsão por
 *   fase atacando uma confusão de leigo ("da esquerda para a direita",
 *   "undefined é erro", "qualquer nome serve");
 * - fase 4: o desafio num contexto DIFERENTE (o Mercadinho do Seu Zé), a
 *   meta mostrada com o palco antes e depois.
 *
 * Fases de programa: `programa: {}` (só o Console; o Snippet entra quando
 * os programas crescerem) e `siteAlvo: SITE_DO_PROGRAMA`. Ferramentas uma
 * por vez: palco (Fase 1, na introdução), Console (Fase 1, primeiro
 * objetivo) e linha do tempo (Fase 3, no programa de várias linhas).
 */
import type { Fase, Unidade } from "@/conteudo/tipos";
import { FASE_LOGICA_U1_F1 } from "./fase-1-calculadora";
import { FASE_LOGICA_U1_F2 } from "./fase-2-let";
import { FASE_LOGICA_U1_F3 } from "./fase-3-const-e-nomes";
import { FASE_LOGICA_U1_F4 } from "./fase-4-desafio";

export const FASES_UNIDADE_LOGICA_U1: readonly Fase[] = [FASE_LOGICA_U1_F1, FASE_LOGICA_U1_F2, FASE_LOGICA_U1_F3, FASE_LOGICA_U1_F4];

export const UNIDADE_LOGICA_U1: Unidade = {
  id: "logica-primeiros-comandos-u1",
  ilha: "Ilha Lógica",
  zona: "Primeiros comandos",
  numero: 1,
  titulo: "O Console calcula",
  meta: {
    enunciado: "No fim desta unidade, você faz as contas de uma loja no Console e guarda os resultados em caixinhas com nomes bons.",
    desafioId: FASE_LOGICA_U1_F4.id,
  },
  fases: FASES_UNIDADE_LOGICA_U1.map((fase) => fase.id),
};
