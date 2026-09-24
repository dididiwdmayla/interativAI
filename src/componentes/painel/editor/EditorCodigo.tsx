"use client";

import { autocompletion, closeBrackets, completionKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import { Annotation, Compartment, EditorState } from "@codemirror/state";
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import { type Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { AlvoCodigo } from "@/lib/caminhoElementos";
import { definirLinhasDestacadas, destaqueLinhas } from "./destaqueLinhas";
import { definirTrechoSelecionado, destaqueTrecho } from "./destaqueTrecho";
import { alvoNaPosicao, trechoDoAlvo } from "./mapaElementos";
import { calcularTrocaMinima } from "./diferencaTexto";
import { temaEditor } from "./temaEditor";

export type ApiEditor = {
  /** Troca o texto vindo de fora (árvore, solução). Não dispara aoMudar. */
  definirTexto: (texto: string) => void;
  /** Destaca linhas (a partir de 1) com animação. Lista vazia limpa. */
  destacarLinhas: (linhas: readonly number[]) => void;
  /**
   * Destaca o trecho inteiro de um elemento (abertura ao fechamento) e,
   * se pedido, rola até ele. Não mexe no cursor. Null ou alvo que não
   * existe no código limpa o destaque. Devolve se achou o trecho.
   */
  destacarElemento: (alvo: AlvoCodigo | null, opcoes?: { rolar?: boolean }) => boolean;
  /** Linhas (a partir de 1) que o trecho do elemento ocupa; vazio se não achar. */
  linhasDoAlvo: (alvo: AlvoCodigo) => number[];
  obterTexto: () => string;
};

type Props = {
  textoInicial: string;
  aoMudar: (texto: string) => void;
  quebrarLinhas: boolean;
  rotulo: string;
  /** Cursor posto pelo jogador (clique, toque, setas), já com espera de 150 ms. */
  aoMoverCursor?: (alvo: AlvoCodigo | null) => void;
  /** O editor ganhou foco (o teclado virtual vai abrir no celular). */
  aoFocar?: () => void;
  ref?: Ref<ApiEditor>;
};

const ESPERA_CURSOR_MS = 150;

/** Marca transações que vieram de fora do editor, para não voltar em loop. */
const origemExterna = Annotation.define<boolean>();

export function EditorCodigo({ textoInicial, aoMudar, quebrarLinhas, rotulo, aoMoverCursor, aoFocar, ref }: Props) {
  const hospedeiro = useRef<HTMLDivElement>(null);
  const visao = useRef<EditorView | null>(null);
  const aoMudarAtual = useRef(aoMudar);
  const aoMoverCursorAtual = useRef(aoMoverCursor);
  const aoFocarAtual = useRef(aoFocar);
  const esperaCursor = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textoInicialRef = useRef(textoInicial);
  const quebrarInicialRef = useRef(quebrarLinhas);
  const rotuloRef = useRef(rotulo);
  const [compartimentoQuebra] = useState(() => new Compartment());

  useEffect(() => {
    aoMudarAtual.current = aoMudar;
  }, [aoMudar]);

  useEffect(() => {
    aoMoverCursorAtual.current = aoMoverCursor;
  }, [aoMoverCursor]);

  useEffect(() => {
    aoFocarAtual.current = aoFocar;
  }, [aoFocar]);

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
          destaqueTrecho,
          compartimentoQuebra.of(quebrarInicialRef.current ? EditorView.lineWrapping : []),
          EditorView.contentAttributes.of({ "aria-label": rotuloRef.current }),
          EditorView.domEventHandlers({
            focus: () => {
              aoFocarAtual.current?.();
            },
          }),
          EditorView.updateListener.of((atualizacao) => {
            const deFora = atualizacao.transactions.some((tr) => tr.annotation(origemExterna));
            if (atualizacao.docChanged && !deFora) aoMudarAtual.current(atualizacao.state.doc.toString());
            // Só cursor posto pelo jogador vira seleção; mudanças vindas de fora
            // (árvore, solução) não voltam, então não há laço.
            if (atualizacao.selectionSet && !atualizacao.docChanged && !deFora) {
              if (esperaCursor.current !== null) clearTimeout(esperaCursor.current);
              esperaCursor.current = setTimeout(() => {
                esperaCursor.current = null;
                const view = visao.current;
                if (!view) return;
                const posicao = view.state.selection.main.head;
                aoMoverCursorAtual.current?.(alvoNaPosicao(view.state, posicao));
              }, ESPERA_CURSOR_MS);
            }
          }),
        ],
      }),
    });
    visao.current = view;
    return () => {
      if (esperaCursor.current !== null) clearTimeout(esperaCursor.current);
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
      destacarElemento(alvo, opcoes) {
        const view = visao.current;
        if (!view) return false;
        const trecho = alvo ? trechoDoAlvo(view.state, alvo) : null;
        const efeitos = [definirTrechoSelecionado.of(trecho)];
        if (trecho && opcoes?.rolar) {
          const linhas = view.state.doc.lineAt(trecho.ate).number - view.state.doc.lineAt(trecho.de).number;
          const cabe = linhas * view.defaultLineHeight < view.scrollDOM.clientHeight * 0.8;
          view.dispatch({
            effects: [...efeitos, EditorView.scrollIntoView(trecho.de, { y: cabe ? "center" : "start", yMargin: 24 })],
            annotations: origemExterna.of(true),
          });
        } else {
          view.dispatch({ effects: efeitos, annotations: origemExterna.of(true) });
        }
        return trecho !== null;
      },
      linhasDoAlvo(alvo) {
        const view = visao.current;
        const trecho = view ? trechoDoAlvo(view.state, alvo) : null;
        if (!view || !trecho) return [];
        const primeira = view.state.doc.lineAt(trecho.de).number;
        const ultima = view.state.doc.lineAt(trecho.ate).number;
        return Array.from({ length: ultima - primeira + 1 }, (_, indice) => primeira + indice);
      },
      obterTexto() {
        return visao.current?.state.doc.toString() ?? "";
      },
    }),
    [],
  );

  return <div ref={hospedeiro} className="h-full min-h-0 overflow-hidden" />;
}
