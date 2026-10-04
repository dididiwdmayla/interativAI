/*
 * Cenas programáveis: o que os validadores e o executor precisam saber da
 * fase. As outras linhas do tempo (validador variosCenarios) rodam junto com
 * cada Executar, no Web Worker do jogo e no vm dos testes.
 */
import type { Fase } from "@/conteudo/tipos";
import type { AcontecimentoCena } from "./modelo";

/** As outras linhas do tempo que a fase pede (nenhuma, por enquanto: o validador variosCenarios chega depois). */
export function cenariosDaFase(fase: Fase): AcontecimentoCena[][] {
  return fase.programa ? [] : [];
}
