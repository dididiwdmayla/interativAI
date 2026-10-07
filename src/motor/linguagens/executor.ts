/*
 * O executor por linguagem no navegador (assíncrono): a mesma pergunta
 * ("roda este programa nesta linguagem") e a mesma resposta (saída e erro
 * no formato do Console do jogo) para todas as linguagens.
 *
 * - JavaScript: uma sessão nova do executor de sempre (Web Worker isolado).
 * - Python: o Pyodide no Web Worker próprio (python/sessao.ts), carregado
 *   na primeira vez que alguém pede. `aoCarregar` acompanha a carga.
 * - As outras: a saída declarada, marcada como simulada.
 *
 * A futura Ilha Python usa este mesmo módulo.
 */
import { SessaoNavegador } from "../executor/sessaoNavegador";
import { sessaoPython } from "./python/sessao";
import { resultadoDoJavaScript } from "./sincrono";
import { type CargaPython, type Linguagem, type ResultadoLinguagem, resultadoSimulado } from "./tipos";

export type OpcoesExecutar = {
  /** A saída que o conteúdo declara (as linguagens simuladas mostram esta). */
  saidaDeclarada: readonly string[];
  /** (Python) O andamento da carga, enquanto ela acontece. */
  aoCarregar?: (carga: CargaPython | null) => void;
};

export async function executarNaLinguagem(linguagem: Linguagem, codigo: string, opcoes: OpcoesExecutar): Promise<ResultadoLinguagem> {
  if (linguagem === "javascript") {
    const sessao = new SessaoNavegador();
    try {
      return resultadoDoJavaScript(await sessao.executar(codigo, "snippet"));
    } finally {
      sessao.encerrar();
    }
  }
  if (linguagem === "python") {
    const sessao = sessaoPython();
    const parar = opcoes.aoCarregar ? sessao.ouvir(opcoes.aoCarregar) : null;
    if (opcoes.aoCarregar) opcoes.aoCarregar(sessao.carga);
    try {
      return await sessao.executar(codigo);
    } finally {
      parar?.();
    }
  }
  return resultadoSimulado(linguagem, codigo, opcoes.saidaDeclarada);
}

/** O Python já está acordado (o Rodar não espera carga). */
export function pythonPronto(): boolean {
  return sessaoPython().carga?.etapa === "pronto";
}
