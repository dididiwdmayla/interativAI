import { type Extension, StateEffect, StateField } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView } from "@codemirror/view";
import type { Trecho } from "./mapaElementos";

/** Marca o trecho do elemento selecionado. Null limpa. */
export const definirTrechoSelecionado = StateEffect.define<Trecho | null>();

/** Alterna entre duas marcas para a animação de entrada recomeçar a cada seleção. */
const MARCAS = [
  Decoration.mark({ class: "cm-trecho-selecionado", attributes: { "data-vez": "a" } }),
  Decoration.mark({ class: "cm-trecho-selecionado", attributes: { "data-vez": "b" } }),
];
let vez = 0;
const LINHA = Decoration.line({ class: "cm-linha-no-trecho" });

const campoTrecho = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(decoracoes, transacao) {
    let atual = decoracoes.map(transacao.changes);
    for (const efeito of transacao.effects) {
      if (!efeito.is(definirTrechoSelecionado)) continue;
      const trecho = efeito.value;
      const total = transacao.state.doc.length;
      if (!trecho || trecho.de >= trecho.ate || trecho.ate > total) {
        atual = Decoration.none;
        continue;
      }
      // Barrinha na margem de cada linha do trecho, mais o fundo no texto.
      const { doc } = transacao.state;
      const linhas = [];
      for (let numero = doc.lineAt(trecho.de).number; numero <= doc.lineAt(trecho.ate).number; numero++) {
        linhas.push(LINHA.range(doc.line(numero).from));
      }
      vez = 1 - vez;
      atual = Decoration.set([...linhas, MARCAS[vez].range(trecho.de, trecho.ate)], true);
    }
    return atual;
  },
  provide: (campo) => EditorView.decorations.from(campo),
});

export const destaqueTrecho: Extension = campoTrecho;
