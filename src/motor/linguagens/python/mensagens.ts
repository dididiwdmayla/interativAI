/* As mensagens entre a página e o Web Worker do Python. */
import type { CargaPython, ResultadoLinguagem } from "../tipos";

export type PedidoPython = { id: number; tipo: "carregar"; endereco: string } | { id: number; tipo: "executar"; codigo: string };

export type RespostaPython =
  /** O andamento da carga (id 0: não responde a nenhum pedido). */
  | { id: 0; tipo: "carga"; carga: CargaPython }
  | { id: number; tipo: "pronto" }
  | { id: number; tipo: "executar"; resultado: ResultadoLinguagem }
  | { id: number; tipo: "falha"; mensagem: string };
