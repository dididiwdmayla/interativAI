import { ensureSyntaxTree } from "@codemirror/language";
import type { EditorState } from "@codemirror/state";
import type { AlvoCodigo } from "@/lib/caminhoElementos";

/** Tempo máximo para o parser terminar a árvore do documento todo. */
const TEMPO_PARSER_MS = 40;

type SyntaxNode = NonNullable<ReturnType<typeof ensureSyntaxTree>>["topNode"];

export type Trecho = { de: number; ate: number };

function nomeDaTag(state: EditorState, elemento: SyntaxNode): string | null {
  const abertura = elemento.getChild("OpenTag") ?? elemento.getChild("SelfClosingTag");
  const nome = abertura?.getChild("TagName");
  return nome ? state.sliceDoc(nome.from, nome.to).toLowerCase() : null;
}

function filhosElemento(no: SyntaxNode): SyntaxNode[] {
  return no.getChildren("Element");
}

function raiz(state: EditorState): SyntaxNode | null {
  const arvore = ensureSyntaxTree(state, state.doc.length, TEMPO_PARSER_MS);
  return arvore ? arvore.topNode : null;
}

/**
 * Elemento mais interno que contém a posição, como alvo de caminho.
 * Null quando a posição está fora de qualquer elemento ou o código está
 * quebrado demais para entender.
 */
export function alvoNaPosicao(state: EditorState, posicao: number): AlvoCodigo | null {
  try {
    const topo = raiz(state);
    if (!topo) return null;
    const caminho: number[] = [];
    const tags: string[] = [];
    let atual = topo;
    for (;;) {
      const filhos = filhosElemento(atual);
      const indice = filhos.findIndex((filho) => filho.from <= posicao && posicao <= filho.to && filho.from < posicao);
      if (indice < 0) break;
      const filho = filhos[indice];
      const tag = nomeDaTag(state, filho);
      if (!tag) return null;
      caminho.push(indice);
      tags.push(tag);
      atual = filho;
    }
    return caminho.length > 0 ? { caminho, tags } : null;
  } catch {
    return null;
  }
}

/** Trecho do código (da tag de abertura à de fechamento) de um alvo, se as tags baterem. */
export function trechoDoAlvo(state: EditorState, alvo: AlvoCodigo): Trecho | null {
  try {
    const topo = raiz(state);
    if (!topo || alvo.caminho.length === 0) return null;
    let atual = topo;
    for (let passo = 0; passo < alvo.caminho.length; passo++) {
      const filho = filhosElemento(atual)[alvo.caminho[passo]];
      if (!filho || nomeDaTag(state, filho) !== alvo.tags[passo]) return null;
      atual = filho;
    }
    return { de: atual.from, ate: atual.to };
  } catch {
    return null;
  }
}
