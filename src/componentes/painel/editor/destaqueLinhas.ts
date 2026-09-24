import { StateEffect, StateField, type Extension } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView } from "@codemirror/view";

/** Efeito para destacar linhas (números de 1 em diante). Lista vazia limpa. */
export const definirLinhasDestacadas = StateEffect.define<readonly number[]>();

const decoracaoLinha = Decoration.line({ class: "cm-linha-destacada" });

const campoDestaque = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(decoracoes, transacao) {
    let atual = decoracoes.map(transacao.changes);
    for (const efeito of transacao.effects) {
      if (!efeito.is(definirLinhasDestacadas)) continue;
      const total = transacao.state.doc.lines;
      const linhas = [...new Set(efeito.value)]
        .filter((linha) => linha >= 1 && linha <= total)
        .sort((a, b) => a - b);
      atual = Decoration.set(
        linhas.map((linha) => decoracaoLinha.range(transacao.state.doc.line(linha).from)),
      );
    }
    return atual;
  },
  provide: (campo) => EditorView.decorations.from(campo),
});

export const destaqueLinhas: Extension = campoDestaque;
