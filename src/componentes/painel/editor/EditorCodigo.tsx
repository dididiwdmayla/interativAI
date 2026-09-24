"use client";

import { autocompletion, closeBrackets, completionKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import { Annotation, Compartment, EditorSelection, EditorState } from "@codemirror/state";
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import { type Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { definirLinhasDestacadas, destaqueLinhas } from "./destaqueLinhas";
import { calcularTrocaMinima } from "./diferencaTexto";
import { temaEditor } from "./temaEditor";

export type ApiEditor = {
  /** Troca o texto vindo de fora (árvore, solução). Não dispara aoMudar. */
  definirTexto: (texto: string) => void;
  /** Destaca linhas (a partir de 1) com animação. Lista vazia limpa. */
  destacarLinhas: (linhas: readonly number[]) => void;
  rolarParaLinha: (linha: number) => void;
  obterTexto: () => string;
};

type Props = {
  textoInicial: string;
  aoMudar: (texto: string) => void;
  quebrarLinhas: boolean;
  rotulo: string;
  ref?: Ref<ApiEditor>;
};

/** Marca transações que vieram de fora do editor, para não voltar em loop. */
const origemExterna = Annotation.define<boolean>();

export function EditorCodigo({ textoInicial, aoMudar, quebrarLinhas, rotulo, ref }: Props) {
  const hospedeiro = useRef<HTMLDivElement>(null);
  const visao = useRef<EditorView | null>(null);
  const aoMudarAtual = useRef(aoMudar);
  const textoInicialRef = useRef(textoInicial);
  const quebrarInicialRef = useRef(quebrarLinhas);
  const rotuloRef = useRef(rotulo);
  const [compartimentoQuebra] = useState(() => new Compartment());

  useEffect(() => {
    aoMudarAtual.current = aoMudar;
  }, [aoMudar]);

  useEffect(() => {
    const pai = hospedeiro.current;
    if (!pai) return;
    const view = new EditorView({
      parent: pai,
      state: EditorState.create({
        doc: textoInicialRef.current,
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightActiveLine(),
          history(),
          drawSelection(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          autocompletion(),
          html(),
          keymap.of([...defaultKeymap, ...historyKeymap, ...completionKeymap, indentWithTab]),
          temaEditor,
          destaqueLinhas,
          compartimentoQuebra.of(quebrarInicialRef.current ? EditorView.lineWrapping : []),
          EditorView.contentAttributes.of({ "aria-label": rotuloRef.current }),
          EditorView.updateListener.of((atualizacao) => {
            if (!atualizacao.docChanged) return;
            const deFora = atualizacao.transactions.some((tr) => tr.annotation(origemExterna));
            if (!deFora) aoMudarAtual.current(atualizacao.state.doc.toString());
          }),
        ],
      }),
    });
    visao.current = view;
    return () => {
      view.destroy();
      visao.current = null;
    };
  }, [compartimentoQuebra]);

  useEffect(() => {
    visao.current?.dispatch({
      effects: compartimentoQuebra.reconfigure(quebrarLinhas ? EditorView.lineWrapping : []),
    });
  }, [quebrarLinhas, compartimentoQuebra]);

  useImperativeHandle(
    ref,
    () => ({
      definirTexto(texto) {
        const view = visao.current;
        if (!view) return;
        const troca = calcularTrocaMinima(view.state.doc.toString(), texto);
        if (!troca) return;
        view.dispatch({
          changes: { from: troca.de, to: troca.ate, insert: troca.inserir },
          annotations: origemExterna.of(true),
        });
      },
      destacarLinhas(linhas) {
        const view = visao.current;
        if (!view) return;
        const primeira = linhas.length > 0 ? Math.min(...linhas) : null;
        const efeitos = [definirLinhasDestacadas.of(linhas)];
        if (primeira !== null && primeira <= view.state.doc.lines) {
          const posicao = view.state.doc.line(primeira).from;
          view.dispatch({ effects: [...efeitos, EditorView.scrollIntoView(posicao, { y: "center" })] });
        } else {
          view.dispatch({ effects: efeitos });
        }
      },
      rolarParaLinha(linha) {
        const view = visao.current;
        if (!view || linha < 1 || linha > view.state.doc.lines) return;
        const posicao = view.state.doc.line(linha).from;
        view.dispatch({
          selection: EditorSelection.cursor(posicao),
          effects: EditorView.scrollIntoView(posicao, { y: "center" }),
        });
      },
      obterTexto() {
        return visao.current?.state.doc.toString() ?? "";
      },
    }),
    [],
  );

  return <div ref={hospedeiro} className="h-full min-h-0 overflow-hidden" />;
}
