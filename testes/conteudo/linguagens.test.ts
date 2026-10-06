/*
 * O executor por linguagem (src/motor/linguagens): o Python de verdade no
 * Pyodide do Node, os erros no formato do executor, o resumo para os
 * validadores de saída e a versão servida pelo jogo.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { carregarPythonNode } from "@/motor/linguagens/python/node";
import { executarPython, type PythonCarregado } from "@/motor/linguagens/python/nucleo";
import { erroDoTraceback, explicarErroPython } from "@/motor/linguagens/python/erros";
import { definirPythonSincrono, executarNaLinguagemSincrono, resumoDaLinguagem } from "@/motor/linguagens/sincrono";
import { textosDaSaida, VERSAO_PYODIDE } from "@/motor/linguagens/tipos";

let python: PythonCarregado;

beforeAll(async () => {
  python = await carregarPythonNode();
}, 60_000);

describe("Python no Pyodide", () => {
  it("a versão servida é a do pacote instalado", () => {
    const pacote = JSON.parse(readFileSync(resolve(process.cwd(), "node_modules/pyodide/package.json"), "utf8")) as { version: string };
    expect(pacote.version).toBe(VERSAO_PYODIDE);
  });

  it("roda e devolve as linhas do print", () => {
    const resultado = executarPython(python, 'total = 12 + 8 + 20\ntotal = total - 5\nprint("Total:", total)\nfor i in range(1, 3):\n    print(i)');
    expect(resultado.erro).toBeNull();
    expect(textosDaSaida(resultado)).toEqual(["Total: 35", "1", "2"]);
  });

  it("cada execução começa com a memória vazia", () => {
    executarPython(python, "x = 1");
    const resultado = executarPython(python, "print(x)");
    expect(resultado.erro?.nome).toBe("NameError");
  });

  it("os erros têm nome, mensagem, linha e tipo, como os do JavaScript", () => {
    const nome = executarPython(python, "a = 1\nprint(b)");
    expect(nome.erro).toMatchObject({ tipo: "execucao", nome: "NameError", mensagem: "name 'b' is not defined", linha: 2 });
    const sintaxe = executarPython(python, "if True\n    print(1)");
    expect(sintaxe.erro).toMatchObject({ tipo: "sintaxe", nome: "SyntaxError", linha: 1 });
    expect(explicarErroPython(sintaxe.erro!)?.titulo).toBe("Faltaram os dois-pontos");
    const recuo = executarPython(python, "for i in range(2):\nprint(i)");
    expect(recuo.erro?.nome).toBe("IndentationError");
    const texto = executarPython(python, 'print("Total: " + 35)');
    expect(texto.erro?.nome).toBe("TypeError");
    expect(explicarErroPython(texto.erro!)?.titulo).toBe("Texto com número");
  });

  it("a saída que veio antes do erro fica", () => {
    const resultado = executarPython(python, 'print("antes")\nprint(1 / 0)');
    expect(textosDaSaida(resultado)).toEqual(["antes"]);
    expect(resultado.erro?.nome).toBe("ZeroDivisionError");
  });

  it("sem o navegador e sem teclado: o módulo js e o input dão erro", () => {
    expect(executarPython(python, "import js").erro?.nome).toBe("ModuleNotFoundError");
    expect(executarPython(python, "input()").erro).not.toBeNull();
  });

  it("lê o traceback mesmo sem a linha do programa", () => {
    expect(erroDoTraceback("Traceback (most recent call last):\nValueError: ruim")).toMatchObject({ nome: "ValueError", mensagem: "ruim", linha: null });
  });
});

describe("executor por linguagem (síncrono, das simulações)", () => {
  it("JavaScript roda no núcleo de sempre", () => {
    const resultado = executarNaLinguagemSincrono("javascript", 'console.log("Total: " + (12 + 8))', []);
    expect(resultado.simulado).toBe(false);
    expect(textosDaSaida(resultado)).toEqual(["Total: 20"]);
  });

  it("Python: o de verdade quando registrado; senão, a saída declarada", () => {
    definirPythonSincrono(null);
    expect(executarNaLinguagemSincrono("python", "print(2)", ["declarada"]).simulado).toBe(true);
    definirPythonSincrono(python);
    const real = executarNaLinguagemSincrono("python", "print(2)", ["declarada"]);
    expect(real.simulado).toBe(false);
    expect(textosDaSaida(real)).toEqual(["2"]);
    definirPythonSincrono(null);
  });

  it("as simuladas mostram a saída declarada, e o resumo serve aos validadores de saída", () => {
    const cobol = executarNaLinguagemSincrono("cobol", "DISPLAY 'OI'.", ["OI"]);
    expect(cobol.simulado).toBe(true);
    const resumo = resumoDaLinguagem(executarPython(python, 'print("oi")\nprint(x)'));
    expect(resumo.saidas).toEqual(["oi"]);
    expect(resumo.erro?.nome).toBe("NameError");
  });
});
