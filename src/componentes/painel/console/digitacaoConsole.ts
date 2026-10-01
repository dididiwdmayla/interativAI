/*
 * A digitação do Console, linha a linha, como no Chrome (developer.chrome.com,
 * Console e Preferences > "Auto closing brackets"):
 * - digitar `{` já fecha a chave (o closeBrackets do CodeMirror);
 * - Enter com o cursor no meio do texto (entre `{` e `}`, por exemplo) ou
 *   com o código incompleto (`if (x) {` sem fechar) pula linha e indenta,
 *   em vez de rodar; com o cursor no fim e o código completo, roda. Ctrl+Enter
 *   (Cmd+Enter) roda de qualquer jeito, e Shift+Enter sempre pula linha;
 * - digitar `}` quando a chave que o Console fechou sozinho já está logo
 *   depois (na mesma linha ou nas linhas de baixo, só com espaços no
 *   caminho) passa por cima dela, em vez de duplicar. Só quando as chaves já
 *   estão equilibradas: se ainda falta fechar alguma, a chave nova entra.
 *
 * Funções puras sobre o EditorState: a tela (EntradaConsole) e os testes
 * (testes/conteudo/console.test.ts) usam as mesmas.
 */
import { insertBracket } from "@codemirror/autocomplete";
import type { EditorState, Transaction, TransactionSpec } from "@codemirror/state";
import { analisarCodigo } from "@/motor/executor/instrumentar";

/**
 * Quantas chaves `{` ficaram abertas (negativo: sobrou `}`), sem contar as
 * que estão dentro de textos, templates e comentários.
 */
export function chavesAbertas(codigo: string): number {
  let saldo = 0;
  let i = 0;
  while (i < codigo.length) {
    const c = codigo[i];
    if (c === "/" && codigo[i + 1] === "/") {
      const fim = codigo.indexOf("\n", i);
      i = fim < 0 ? codigo.length : fim;
      continue;
    }
    if (c === "/" && codigo[i + 1] === "*") {
      const fim = codigo.indexOf("*/", i + 2);
      i = fim < 0 ? codigo.length : fim + 2;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      i += 1;
      while (i < codigo.length && codigo[i] !== c) {
        if (codigo[i] === "\\") i += 1;
        // Aspas simples e duplas não atravessam a linha.
        if (c !== "`" && codigo[i] === "\n") break;
        i += 1;
      }
      i += 1;
      continue;
    }
    if (c === "{") saldo += 1;
    else if (c === "}") saldo -= 1;
    i += 1;
  }
  return saldo;
}

/**
 * O código ainda não terminou (falta fechar algo): o erro de leitura cai no
 * fim do texto. É o que o Chrome confere antes de rodar com Enter.
 */
export function codigoIncompleto(codigo: string): boolean {
  if (!codigo.trim()) return false;
  const lido = analisarCodigo(codigo);
  if (lido.ok) return false;
  const linhas = codigo.trimEnd().split("\n");
  const ultima = linhas.length;
  const colunaFinal = linhas[ultima - 1].length + 1;
  return lido.erro.linha > ultima || (lido.erro.linha === ultima && lido.erro.coluna >= colunaFinal);
}

/** O que o Enter faz agora: rodar ou pular linha (com indentação). */
export function acaoDoEnter(state: EditorState): "rodar" | "nova-linha" {
  const texto = state.doc.toString();
  const { head, empty } = state.selection.main;
  if (!empty) return "rodar";
  // Cursor no meio (entre { e }, por exemplo): pula linha, como no Chrome.
  if (texto.slice(head).trim() !== "") return "nova-linha";
  return codigoIncompleto(texto) ? "nova-linha" : "rodar";
}

/**
 * Digitar `}`: se a chave fechada pelo Console está logo depois do cursor
 * (só espaços no caminho) e as chaves já estão equilibradas, o cursor passa
 * por cima dela. Se a linha do cursor só tem espaços, ela some (a chave já
 * está na linha de baixo). Null: digitar normalmente.
 */
export function passarPorCimaDaChave(state: EditorState): TransactionSpec | null {
  const { head, empty } = state.selection.main;
  if (!empty || state.selection.ranges.length > 1) return null;
  const texto = state.doc.toString();
  const depois = /^\s*\}/.exec(texto.slice(head));
  if (!depois) return null;
  if (chavesAbertas(texto) > 0) return null;
  const chave = head + depois[0].length - 1;
  const linha = state.doc.lineAt(head);
  const linhaDaChave = state.doc.lineAt(chave);
  // Na mesma linha (`{ x |}`): só anda.
  if (linhaDaChave.number === linha.number) return { selection: { anchor: chave + 1 }, scrollIntoView: true, userEvent: "input.type" };
  // A linha do cursor só tem espaços: ela sai, e o cursor fica depois da chave de baixo.
  if (linha.text.trim() === "" && linha.number > 1) {
    const de = linha.from - 1;
    const ate = linha.to;
    const removidos = ate - de;
    return { changes: { from: de, to: ate }, selection: { anchor: chave + 1 - removidos }, scrollIntoView: true, userEvent: "input.type" };
  }
  // Tem texto antes do cursor nesta linha: anda até depois da chave de baixo.
  if (texto.slice(linha.from, head).trim() !== "" && texto.slice(head, linha.to).trim() === "") {
    return { selection: { anchor: chave + 1 }, scrollIntoView: true, userEvent: "input.type" };
  }
  return null;
}

/**
 * Escreve um símbolo como se ele fosse digitado (a barra de símbolos do
 * celular): `}` passa por cima da chave fechada e `{ ( [` fecham sozinhos,
 * como no teclado. O resto entra no lugar da seleção.
 */
export function digitarSimbolo(state: EditorState, simbolo: string): Transaction | TransactionSpec {
  if (simbolo === "}") {
    const porCima = passarPorCimaDaChave(state);
    if (porCima) return porCima;
  }
  if (simbolo.length === 1 && "{}()[]\"'".includes(simbolo)) {
    const transacao = insertBracket(state, simbolo);
    if (transacao) return transacao;
  }
  return state.replaceSelection(simbolo);
}
