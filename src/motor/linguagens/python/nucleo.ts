/*
 * O núcleo do Python: roda um programa num Pyodide já carregado, de forma
 * SÍNCRONA, e devolve o resultado no formato do executor por linguagem.
 * O mesmo código serve ao Web Worker do jogo (python.worker.ts) e ao Node
 * dos testes (node.ts): a carga é que muda (assíncrona, nos dois).
 *
 * Cada execução começa com a memória vazia (um dicionário de globais novo),
 * como o Rodar do comparador. A entrada do teclado (input) dá erro: o jogo
 * não tem teclado para o programa.
 */
import { erroDoTraceback, ARQUIVO_DO_PROGRAMA } from "./erros";
import { LIMITES_PYTHON, linhaDeSaida, type ResultadoLinguagem } from "../tipos";
import type { SaidaConsole } from "../../executor/tipos";

/** O pedaço do Pyodide que o núcleo usa (a forma, sem depender do pacote). */
export type PythonCarregado = {
  runPython(codigo: string, opcoes?: { globals?: unknown; filename?: string }): unknown;
  setStdout(opcoes: { batched: (texto: string) => void }): void;
  setStderr(opcoes: { batched: (texto: string) => void }): void;
  setStdin(opcoes: { error: boolean }): void;
  globals: { get(nome: string): unknown };
};

type Destrutivel = { destroy?: () => void };

/** Fecha as portas do Python para fora: sem o módulo js (que alcançaria o navegador) e sem input. */
export function prepararPython(python: PythonCarregado): void {
  python.setStdin({ error: true });
  python.runPython(
    [
      "import sys",
      // O módulo js e o pyodide_js dariam ao programa o navegador inteiro (fetch, armazenamento).
      "for _nome in ('js', 'pyodide_js', 'pyodide.http', 'pyodide.ffi'):",
      "    sys.modules[_nome] = None",
      "del _nome",
    ].join("\n"),
  );
}

/** Roda o programa e devolve a saída e o erro (no formato do executor). */
export function executarPython(python: PythonCarregado, codigo: string): ResultadoLinguagem {
  const saidas: SaidaConsole[] = [];
  const guardar = (nivel: SaidaConsole["nivel"]) => (texto: string) => {
    if (saidas.length < LIMITES_PYTHON.saidas) saidas.push(linhaDeSaida(texto, nivel));
  };
  python.setStdout({ batched: guardar("log") });
  python.setStderr({ batched: guardar("error") });
  const fabricaDict = python.globals.get("dict") as ((...args: unknown[]) => unknown) & Destrutivel;
  const globais = fabricaDict() as Destrutivel;
  try {
    python.runPython(codigo, { globals: globais, filename: ARQUIVO_DO_PROGRAMA });
    return { linguagem: "python", codigo, saidas, erro: null, simulado: false };
  } catch (falha) {
    const texto = falha instanceof Error ? falha.message : String(falha);
    return { linguagem: "python", codigo, saidas, erro: erroDoTraceback(texto), simulado: false };
  } finally {
    globais.destroy?.();
    fabricaDict.destroy?.();
  }
}
