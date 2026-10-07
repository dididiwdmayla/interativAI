/*
 * O Python no Node (testes): o Pyodide do node_modules, carregado uma vez.
 * Só para os testes de conteúdo e unitários; o jogo usa o Web Worker
 * (sessao.ts). Não importe daqui no código do navegador.
 */
import { prepararPython, type PythonCarregado } from "./nucleo";

let carregado: Promise<PythonCarregado> | null = null;

export function carregarPythonNode(): Promise<PythonCarregado> {
  carregado ??= import("pyodide").then(async ({ loadPyodide }) => {
    const python = (await loadPyodide()) as unknown as PythonCarregado;
    prepararPython(python);
    return python;
  });
  return carregado;
}
