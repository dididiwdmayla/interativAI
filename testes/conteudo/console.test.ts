/*
 * Digitação do Console linha a linha (src/componentes/painel/console/
 * digitacaoConsole.ts): a chave fecha sozinha, Enter entre { e } abre um
 * bloco indentado, o } digitado passa por cima da chave já fechada e o
 * código só roda com o cursor no fim e o código completo. A jornada de
 * navegador (testes/console.mjs) confere o mesmo no teclado e no toque.
 */
import { closeBrackets } from "@codemirror/autocomplete";
import { insertNewlineAndIndent } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState, Transaction, type TransactionSpec } from "@codemirror/state";
import { describe, expect, it } from "vitest";
import { acaoDoEnter, chavesAbertas, codigoIncompleto, digitarSimbolo, passarPorCimaDaChave } from "@/componentes/painel/console/digitacaoConsole";

function novo(): EditorState {
  return EditorState.create({ doc: "", extensions: [closeBrackets(), javascript()] });
}

function aplicar(state: EditorState, spec: Transaction | TransactionSpec): EditorState {
  return spec instanceof Transaction ? spec.state : state.update(spec).state;
}

/** Digita como o jogador: letras, { (fecha sozinha), } (passa por cima) e Enter. Devolve o estado e o que rodou. */
function digitar(texto: string, inicial = novo()): { state: EditorState; rodou: string[] } {
  let state = inicial;
  const rodou: string[] = [];
  for (const c of texto) {
    if (c === "\n") {
      if (acaoDoEnter(state) === "rodar") {
        rodou.push(state.doc.toString());
        state = EditorState.create({ doc: "", extensions: [closeBrackets(), javascript()] });
      } else {
        insertNewlineAndIndent({ state, dispatch: (tr) => (state = tr.state) });
      }
      continue;
    }
    if ("{}()[]".includes(c)) {
      state = aplicar(state, digitarSimbolo(state, c));
      continue;
    }
    state = aplicar(state, state.replaceSelection(c));
  }
  return { state, rodou };
}

describe("Console: digitar linha a linha", () => {
  it("um if digitado linha a linha não duplica a chave e roda no fim", () => {
    const { state, rodou } = digitar("let x = 5\n");
    expect(rodou).toEqual(["let x = 5"]);
    const passo = digitar("if (x > 3) {\nconsole.log('grande')\n}", state);
    const texto = passo.state.doc.toString();
    expect(texto).toBe("if (x > 3) {\n  console.log('grande')\n}");
    expect(chavesAbertas(texto)).toBe(0);
    expect(passo.state.selection.main.head).toBe(texto.length);
    expect(acaoDoEnter(passo.state)).toBe("rodar");
  });

  it("Enter entre { e } abre um bloco indentado (não roda)", () => {
    const { state, rodou } = digitar("if (true) {\n");
    expect(rodou).toEqual([]);
    expect(state.doc.toString()).toBe("if (true) {\n  \n}");
    expect(state.doc.lineAt(state.selection.main.head).number).toBe(2);
  });

  it("if com else, linha a linha, fecha cada chave uma vez só", () => {
    const { state } = digitar("if (n > 0) {\nr = 'positivo'\n} else {\nr = 'outro'\n}");
    expect(state.doc.toString()).toBe("if (n > 0) {\n  r = 'positivo'\n} else {\n  r = 'outro'\n}");
  });

  it("blocos um dentro do outro: cada } passa por cima da sua chave", () => {
    const { state } = digitar("for (let i = 0; i < 3; i++) {\nif (i > 0) {\nconsole.log(i)\n}\n}");
    expect(state.doc.toString()).toBe("for (let i = 0; i < 3; i++) {\n  if (i > 0) {\n    console.log(i)\n  }\n}");
    expect(acaoDoEnter(state)).toBe("rodar");
  });

  it("chave que ainda falta fechar entra normalmente", () => {
    const base = EditorState.create({ doc: "if (a) {\n  if (b) {\n    x\n  ", selection: { anchor: 25 }, extensions: [closeBrackets(), javascript()] });
    expect(chavesAbertas(base.doc.toString())).toBe(2);
    expect(passarPorCimaDaChave(base)).toBeNull();
  });

  it("código incompleto pula linha; completo roda; texto ou comentário não contam chave", () => {
    expect(codigoIncompleto("if (x) {")).toBe(true);
    expect(codigoIncompleto("let lista = [1, 2,")).toBe(true);
    expect(codigoIncompleto("let x = 1")).toBe(false);
    expect(codigoIncompleto("let x = )")).toBe(false);
    expect(chavesAbertas("let t = '{'; // {\n/* } */ {")).toBe(1);
  });

  it("a barra de símbolos do celular digita como o teclado", () => {
    let state = EditorState.create({ doc: "if (ok) ", selection: { anchor: 8 }, extensions: [closeBrackets(), javascript()] });
    state = aplicar(state, digitarSimbolo(state, "{"));
    expect(state.doc.toString()).toBe("if (ok) {}");
    insertNewlineAndIndent({ state, dispatch: (tr) => (state = tr.state) });
    state = aplicar(state, state.replaceSelection("x = 1"));
    insertNewlineAndIndent({ state, dispatch: (tr) => (state = tr.state) });
    state = aplicar(state, digitarSimbolo(state, "}"));
    expect(state.doc.toString()).toBe("if (ok) {\n  x = 1\n}");
  });
});
