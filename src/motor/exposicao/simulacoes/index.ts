/*
 * O registro das estações de simulação do museu (ver tipos.ts): o modelo de
 * cada tipo, pelo nome do tipo.
 */
import { ABA_REDE, type EstacaoAbaRede, type EstadoAbaRede } from "./abaRede";
import { ARQUIVOS, type EstacaoArquivos, type EstadoArquivos } from "./arquivos";
import { CIDADE, type EstacaoCidade, type EstadoCidade } from "./cidade";
import { CLIQUE, type EstacaoClique, type EstadoClique } from "./clique";
import { MEMORIA, type EstacaoMemoria, type EstadoMemoria } from "./memoria";
import { PACOTE, type EstacaoPacote, type EstadoPacote } from "./pacote";
import { PROCESSADOR, type EstacaoProcessador, type EstadoProcessador } from "./processador";
import { SISTEMA, type EstacaoSistema, type EstadoSistema } from "./sistema";
import { TRADUCAO, type EstacaoTraducao, type EstadoTraducao } from "./traducao";
import type { ModeloSimulacao } from "./tipos";

export type EstacaoSimulacao =
  | EstacaoTraducao
  | EstacaoMemoria
  | EstacaoProcessador
  | EstacaoSistema
  | EstacaoArquivos
  | EstacaoClique
  | EstacaoPacote
  | EstacaoAbaRede
  | EstacaoCidade;

export type EstadoSimulacao =
  | EstadoTraducao
  | EstadoMemoria
  | EstadoProcessador
  | EstadoSistema
  | EstadoArquivos
  | EstadoClique
  | EstadoPacote
  | EstadoAbaRede
  | EstadoCidade;

export type TipoSimulacao = EstacaoSimulacao["tipo"];

type Registro = { [T in TipoSimulacao]: ModeloSimulacao<Extract<EstacaoSimulacao, { tipo: T }>, Extract<EstadoSimulacao, { tipo: T }>> };

export const SIMULACOES: Registro = {
  traducao: TRADUCAO,
  memoria: MEMORIA,
  processador: PROCESSADOR,
  sistema: SISTEMA,
  arquivos: ARQUIVOS,
  clique: CLIQUE,
  pacote: PACOTE,
  "aba-rede": ABA_REDE,
  cidade: CIDADE,
};

export const TIPOS_SIMULACAO = Object.keys(SIMULACOES) as TipoSimulacao[];

export function ehTipoSimulacao(tipo: string): tipo is TipoSimulacao {
  return tipo in SIMULACOES;
}

/** O modelo da estação (sem o cast em cada lugar que usa). */
export function modeloDa(estacao: EstacaoSimulacao): ModeloSimulacao<EstacaoSimulacao, EstadoSimulacao> {
  return SIMULACOES[estacao.tipo] as unknown as ModeloSimulacao<EstacaoSimulacao, EstadoSimulacao>;
}

/** O estado só vale para a estação do mesmo tipo (e com a forma dela). */
export function estadoDaSimulacaoCabe(estacao: EstacaoSimulacao, estado: { tipo: string }): estado is EstadoSimulacao {
  return estado.tipo === estacao.tipo && modeloDa(estacao).cabe(estacao, estado as EstadoSimulacao);
}
