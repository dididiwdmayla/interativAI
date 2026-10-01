"use client";

/*
 * A linha de digitar do Console, como a do Chrome (developer.chrome.com,
 * Console reference): Enter roda (com o cursor no fim e o código completo;
 * senão pula linha e indenta), Ctrl+Enter roda de qualquer jeito,
 * Shift+Enter pula linha, seta para cima na primeira linha traz o comando
 * anterior (e para baixo, na última, o seguinte). As chaves fecham sozinhas
 * e o `}` digitado passa por cima da chave já fechada (digitacaoConsole.ts).
 * Um CodeMirror sem números de linha, com JavaScript colorido.
 */
import { closeBrackets } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap, insertNewlineAndIndent } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { bracketMatching } from "@codemirror/language";
import { EditorState, Prec, Transaction } from "@codemirror/state";
import { drawSelection, EditorView, keymap, placeholder } from "@codemirror/view";
import { type Ref, useEffect, useImperativeHandle, useRef } from "react";
import { tocarTecla } from "@/audio/motor";
import { temaEditor } from "@/componentes/painel/editor/temaEditor";
import { acaoDoEnter, digitarSimbolo, passarPorCimaDaChave } from "./digitacaoConsole";

export type ApiEntradaConsole = {
  definirTexto: (texto: string) => void;
  /** Escreve no lugar do cursor (a barra de símbolos do celular). */
  inserir: (texto: string) => void;
  obterTexto: () => string;
  focar: () => void;
  /** Roda o que está escrito (o botão Rodar do celular). */
  enviar: () => void;
};

type Props = {
  historico: readonly string[];
  aoEnviar: (codigo: string) => void;
  aoFocar?: () => void;
  desativada?: boolean;
  /** Tela de toque: a dica fala do botão Rodar em vez do Enter. */
  toque?: boolean;
  ref?: Ref<ApiEntradaConsole>;
};

const aparenciaEntrada = EditorView.theme({
  "&": { backgroundColor: "transparent", height: "auto" },
  ".cm-content": { padding: "2px 0", paddingBottom: "2px" },
  ".cm-line": { padding: "0" },
  ".cm-activeLine": { backgroundColor: "transparent" },
  ".cm-placeholder": { color: "var(--cor-texto-suave)" },
});

export function EntradaConsole({ historico, aoEnviar, aoFocar, desativada = false, toque = false, ref }: Props) {
  const hospedeiro = useRef<HTMLDivElement>(null);
  const visao = useRef<EditorView | null>(null);
  const historicoAtual = useRef(historico);
  const aoEnviarAtual = useRef(aoEnviar);
  const aoFocarAtual = useRef(aoFocar);
  const desativadaAtual = useRef(desativada);
  /** Posição no histórico enquanto o jogador anda com as setas (null: digitando algo novo). */
  const posicao = useRef<number | null>(null);
  const rascunho = useRef("");
  const toqueInicial = useRef(toque);

  useEffect(() => {
    historicoAtual.current = historico;
    aoEnviarAtual.current = aoEnviar;
    aoFocarAtual.current = aoFocar;
    desativadaAtual.current = desativada;
  }, [historico, aoEnviar, aoFocar, desativada]);

  useEffect(() => {
    const pai = hospedeiro.current;
    if (!pai) return;
    const trocar = (view: EditorView, texto: string) => {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: texto }, selection: { anchor: texto.length } });
    };
    const enviar = (view: EditorView) => {
      const codigo = view.state.doc.toString();
      if (!codigo.trim() || desativadaAtual.current) return true;
      posicao.current = null;
      rascunho.current = "";
      trocar(view, "");
      aoEnviarAtual.current(codigo);
      return true;
    };
    const view = new EditorView({
      parent: pai,
      state: EditorState.create({
        doc: "",
        extensions: [
          history(),
          drawSelection(),
          bracketMatching(),
          closeBrackets(),
          javascript(),
          EditorView.lineWrapping,
          placeholder(toqueInicial.current ? "Escreva um comando e toque em Rodar" : "Escreva um comando e aperte Enter"),
          Prec.highest(
            keymap.of([
              { key: "Enter", run: (v) => (acaoDoEnter(v.state) === "rodar" ? enviar(v) : insertNewlineAndIndent(v)) },
              { key: "Mod-Enter", run: enviar },
              { key: "Shift-Enter", run: insertNewlineAndIndent },
              {
                key: "ArrowUp",
                run: (v) => {
                  const lista = historicoAtual.current;
                  if (!lista.length || v.state.doc.lineAt(v.state.selection.main.head).number !== 1) return false;
                  if (posicao.current === null) {
                    rascunho.current = v.state.doc.toString();
                    posicao.current = lista.length;
                  }
                  if (posicao.current === 0) return true;
                  posicao.current -= 1;
                  trocar(v, lista[posicao.current]);
                  return true;
                },
              },
              {
                key: "ArrowDown",
                run: (v) => {
                  if (posicao.current === null || v.state.doc.lineAt(v.state.selection.main.head).number !== v.state.doc.lines) return false;
                  const lista = historicoAtual.current;
                  posicao.current += 1;
                  if (posicao.current >= lista.length) {
                    posicao.current = null;
                    trocar(v, rascunho.current);
                  } else trocar(v, lista[posicao.current]);
                  return true;
                },
              },
            ]),
          ),
          keymap.of([...defaultKeymap, ...historyKeymap]),
          // O `}` digitado passa por cima da chave que o Console fechou sozinho (antes do closeBrackets).
          Prec.highest(
            EditorView.inputHandler.of((v, de, ate, texto) => {
              if (texto !== "}" || de !== ate || de !== v.state.selection.main.head) return false;
              const porCima = passarPorCimaDaChave(v.state);
              if (!porCima) return false;
              v.dispatch(porCima);
              return true;
            }),
          ),
          temaEditor,
          aparenciaEntrada,
          EditorView.contentAttributes.of({ "aria-label": "Linha de comando do Console", "data-entrada-console": "" }),
          EditorView.domEventHandlers({
            focus: () => {
              aoFocarAtual.current?.();
            },
            keydown: (evento) => {
              if (evento.ctrlKey || evento.metaKey || evento.altKey) return;
              tocarTecla(evento.key, evento.repeat);
            },
          }),
        ],
      }),
    });
    visao.current = view;
    return () => {
      view.destroy();
      visao.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      definirTexto(texto) {
        const view = visao.current;
        if (!view) return;
        view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: texto }, selection: { anchor: texto.length } });
      },
      inserir(texto) {
        const view = visao.current;
        if (!view) return;
        // Como o teclado: { fecha sozinha e } passa por cima da chave fechada.
        const digitado = digitarSimbolo(view.state, texto);
        if (digitado instanceof Transaction) view.dispatch(digitado);
        else view.dispatch(digitado);
        view.focus();
      },
      obterTexto() {
        return visao.current?.state.doc.toString() ?? "";
      },
      focar() {
        visao.current?.focus();
      },
      enviar() {
        const view = visao.current;
        if (!view) return;
        const codigo = view.state.doc.toString();
        if (!codigo.trim() || desativadaAtual.current) return;
        posicao.current = null;
        view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: "" } });
        aoEnviarAtual.current(codigo);
      },
    }),
    [],
  );

  return <div ref={hospedeiro} className="min-w-0 flex-1" />;
}
