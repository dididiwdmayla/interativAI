/*
 * O Python na própria página (sem worker), só para o /lab: as checagens
 * de conteúdo são síncronas e o comparador do museu tem objetivos que
 * rodam Python de verdade. O jogo usa o Web Worker (sessao.ts).
 */
import { prepararPython, type PythonCarregado } from "./nucleo";
import { ENDERECO_PYODIDE } from "../tipos";

let carregado: Promise<PythonCarregado> | null = null;

export function carregarPythonNaPagina(): Promise<PythonCarregado> {
  carregado ??= (async () => {
    const base = new URL(ENDERECO_PYODIDE, window.location.origin).href;
    const modulo = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ `${base}pyodide.mjs`)) as {
      loadPyodide(opcoes: { indexURL: string }): Promise<PythonCarregado>;
    };
    const python = await modulo.loadPyodide({ indexURL: base });
    prepararPython(python);
    return python;
  })();
  return carregado;
}
