/*
 * O protocolo entre a página do jogo e o Web Worker do executor. Só JSON.
 */
import type { CasoFuncao, OrigemCodigo, ResultadoExecucao, ResultadoTesteFuncao } from "./tipos";

export type PedidoExecutor =
  | { id: number; tipo: "executar"; codigo: string; origem: OrigemCodigo }
  | { id: number; tipo: "testarFuncao"; nome: string; casos: CasoFuncao[] }
  /** Depois de um estouro de tempo (worker novo): roda de novo o que tinha dado certo, sem gravar. */
  | { id: number; tipo: "repetir"; entradas: { codigo: string; origem: OrigemCodigo }[] };

export type RespostaExecutor =
  | { id: number; tipo: "executar"; resultado: ResultadoExecucao }
  | { id: number; tipo: "testarFuncao"; resultado: ResultadoTesteFuncao }
  | { id: number; tipo: "repetir" }
  | { id: number; tipo: "falha"; mensagem: string };
