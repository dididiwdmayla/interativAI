/*
 * O executor por linguagem SÍNCRONO, para simular as fases fora da tela (o
 * testar:conteudo e as checagens): JavaScript no núcleo síncrono do
 * executor (src/motor/executor/fabrica.ts) e Python num Pyodide já
 * carregado, quando alguém registrou um (os testes registram o do Node:
 * python/node.ts). Sem Python registrado, e nas linguagens simuladas, vale
 * a saída que o conteúdo declara (conferida contra o Pyodide de verdade em
 * testes/conteudo/linguagens.test.ts).
 */
import { criarNucleoSincrono } from "../executor/fabrica";
import type { ResultadoExecucao } from "../executor/tipos";
import type { ResumoExecucao } from "../programa";
import { executarPython, type PythonCarregado } from "./python/nucleo";
import { type Linguagem, type ResultadoLinguagem, resultadoSimulado, textosDaSaida } from "./tipos";

let python: PythonCarregado | null = null;

/** Registra (ou tira, com null) o Python síncrono das simulações. */
export function definirPythonSincrono(novo: PythonCarregado | null): void {
  python = novo;
}

/** O resultado do executor de JavaScript no formato do executor por linguagem. */
export function resultadoDoJavaScript(resultado: Pick<ResultadoExecucao, "codigo" | "saidas" | "erro">): ResultadoLinguagem {
  return { linguagem: "javascript", codigo: resultado.codigo, saidas: resultado.saidas, erro: resultado.erro, simulado: false };
}

/** Roda já, sem esperar: a simulação dos testes. `saidaDeclarada`: a saída que o conteúdo diz que sai. */
export function executarNaLinguagemSincrono(linguagem: Linguagem, codigo: string, saidaDeclarada: readonly string[]): ResultadoLinguagem {
  if (linguagem === "javascript") {
    const nucleo = criarNucleoSincrono();
    if (nucleo) return resultadoDoJavaScript(nucleo.executar(codigo, "snippet"));
  }
  if (linguagem === "python" && python) return executarPython(python, codigo);
  return resultadoSimulado(linguagem, codigo, saidaDeclarada);
}

/**
 * O resumo do evento `executouCodigo`: os validadores de saída (saida,
 * semErro, erroDoTipo) funcionam igual para qualquer linguagem.
 */
export function resumoDaLinguagem(resultado: ResultadoLinguagem): ResumoExecucao {
  return {
    origem: "snippet",
    codigo: resultado.codigo,
    saidas: textosDaSaida(resultado),
    erro: resultado.erro ? { tipo: resultado.erro.tipo, nome: resultado.erro.nome, mensagem: resultado.erro.mensagem, linha: resultado.erro.linha } : null,
    sintaxes: [],
    resposta: null,
    totalPassos: 0,
    estruturas: {},
  };
}
