/*
 * O protocolo entre a página do jogo e o Web Worker do executor. Só JSON.
 */
import type { AcontecimentoCena, DadosCena } from "../cena/modelo";
import type { CasoFuncao, FotoMemoria, InstantePausa, MedicaoPassos, OrigemCodigo, ResultadoAvaliacao, ResultadoExecucao, ResultadoTesteFuncao, ValorEsperado } from "./tipos";

export type PedidoExecutor =
  | { id: number; tipo: "executar"; codigo: string; origem: OrigemCodigo; cenarios?: AcontecimentoCena[][] }
  /** (Cena programável) Os dispositivos e o esperar no reino do código (null: tira). Resposta não é esperada. */
  | { id: number; tipo: "definirCena"; dados: DadosCena | null }
  | { id: number; tipo: "testarFuncao"; nome: string; casos: CasoFuncao[] }
  /** O depurador pausado: expressões avaliadas na memória de um passo, no quadro escolhido. */
  | { id: number; tipo: "avaliarNaFoto"; expressoes: string[]; foto: FotoMemoria; quadro: number; instante?: InstantePausa }
  /** O gráfico de desempenho: quantos passos a função dá com cada chamada. */
  | { id: number; tipo: "medirPassos"; nome: string; chamadas: { tamanho: number; args: ValorEsperado[] }[] }
  /** Depois de um estouro de tempo (worker novo): roda de novo o que tinha dado certo, sem gravar. */
  | { id: number; tipo: "repetir"; entradas: { codigo: string; origem: OrigemCodigo }[]; cenarios?: AcontecimentoCena[][] };

export type RespostaExecutor =
  | { id: number; tipo: "executar"; resultado: ResultadoExecucao }
  | { id: number; tipo: "testarFuncao"; resultado: ResultadoTesteFuncao }
  | { id: number; tipo: "avaliarNaFoto"; resultados: ResultadoAvaliacao[] }
  | { id: number; tipo: "medirPassos"; medicoes: MedicaoPassos[] }
  | { id: number; tipo: "repetir" }
  | { id: number; tipo: "definirCena" }
  | { id: number; tipo: "falha"; mensagem: string };
