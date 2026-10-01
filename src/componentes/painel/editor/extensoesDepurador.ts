/*
 * O depurador dentro do editor do Snippet (aba Fontes), como no Chrome:
 * - clicar (ou tocar) no número da linha liga e desliga o ponto de
 *   parada, que aparece como uma etiqueta em cima do número; os pontos
 *   andam junto quando o jogador escreve linhas acima deles;
 * - a linha onde o programa está pausado fica acesa (e, com outra função
 *   escolhida na Pilha de chamadas, a linha dela também, mais suave);
 * - passar o mouse numa variável, pausado, mostra o valor dela;
 * - pausado, o editor fica só para ler.
 */
import { Compartment, EditorState, type Extension, RangeSet, StateEffect, StateField } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView, GutterMarker, hoverTooltip, lineNumberMarkers, lineNumbers } from "@codemirror/view";

export type OpcoesDepuradorEditor = {
  /** O jogador clicou no número da linha (a tela decide onde o ponto fica). */
  aoClicarNumero: (linha: number) => void;
  /** Os pontos andaram com a edição (linhas novas, de 1 em diante). */
  aoMudarPontos: (linhas: number[]) => void;
  /** O valor de um nome no momento pausado, em texto (null: não está pausado ou não existe). */
  valorNaPausa: (nome: string) => string | null;
};

/** Troca os pontos de parada (linhas de 1 em diante). */
export const definirPontos = StateEffect.define<readonly number[]>();

/** A linha pausada e, opcionalmente, a linha do quadro escolhido na Pilha de chamadas. */
export const definirPausa = StateEffect.define<{ linha: number | null; doQuadro: number | null }>();

class MarcaPonto extends GutterMarker {
  elementClass = "cm-ponto-de-parada";
}
const marcaPonto = new MarcaPonto();

class MarcaPausada extends GutterMarker {
  elementClass = "cm-numero-pausado";
}
const marcaPausada = new MarcaPausada();

function marcasDasLinhas(state: EditorState, linhas: readonly number[]): RangeSet<GutterMarker> {
  const total = state.doc.lines;
  const validas = [...new Set(linhas)].filter((linha) => linha >= 1 && linha <= total).sort((a, b) => a - b);
  return RangeSet.of(validas.map((linha) => marcaPonto.range(state.doc.line(linha).from)));
}

const campoPontos = StateField.define<RangeSet<GutterMarker>>({
  create: () => RangeSet.empty,
  update(marcas, transacao) {
    let atual = marcas.map(transacao.changes);
    for (const efeito of transacao.effects) if (efeito.is(definirPontos)) atual = marcasDasLinhas(transacao.state, efeito.value);
    return atual;
  },
  provide: (campo) => lineNumberMarkers.from(campo),
});

/** As linhas com ponto de parada agora (sem repetir, em ordem). */
export function linhasDosPontos(state: EditorState): number[] {
  const linhas = new Set<number>();
  const cursor = state.field(campoPontos, false)?.iter();
  if (!cursor) return [];
  for (; cursor.value; cursor.next()) linhas.add(state.doc.lineAt(cursor.from).number);
  return [...linhas].sort((a, b) => a - b);
}

const decoPausada = Decoration.line({ class: "cm-linha-pausada" });
const decoQuadro = Decoration.line({ class: "cm-linha-do-quadro" });

const campoPausa = StateField.define<{ decoracoes: DecorationSet; numeros: RangeSet<GutterMarker> }>({
  create: () => ({ decoracoes: Decoration.none, numeros: RangeSet.empty }),
  update(valor, transacao) {
    let atual = { decoracoes: valor.decoracoes.map(transacao.changes), numeros: valor.numeros.map(transacao.changes) };
    for (const efeito of transacao.effects) {
      if (!efeito.is(definirPausa)) continue;
      const total = transacao.state.doc.lines;
      const ok = (linha: number | null): linha is number => linha !== null && linha >= 1 && linha <= total;
      const { linha, doQuadro } = efeito.value;
      const decoracoes = [
        ...(ok(doQuadro) && doQuadro !== linha ? [{ linha: doQuadro, deco: decoQuadro }] : []),
        ...(ok(linha) ? [{ linha, deco: decoPausada }] : []),
      ].sort((a, b) => a.linha - b.linha);
      atual = {
        decoracoes: Decoration.set(decoracoes.map((d) => d.deco.range(transacao.state.doc.line(d.linha).from))),
        numeros: ok(linha) ? RangeSet.of([marcaPausada.range(transacao.state.doc.line(linha).from)]) : RangeSet.empty,
      };
    }
    return atual;
  },
  provide: (campo) => [EditorView.decorations.from(campo, (v) => v.decoracoes), lineNumberMarkers.from(campo, (v) => v.numeros)],
});

/** Somente leitura enquanto pausado. */
export const compartimentoLeitura = new Compartment();

export function somenteLeitura(ligado: boolean): Extension {
  return ligado ? EditorState.readOnly.of(true) : [];
}

const IDENTIFICADOR = /[A-Za-z_$][\w$]*/y;

/**
 * As extensões do depurador. `opcoes` é lido na hora (a tela troca as
 * funções sem recriar o editor).
 */
const aparenciaDepurador = EditorView.theme({
  ".cm-lineNumbers .cm-gutterElement": { cursor: "pointer", position: "relative" },
  // A etiqueta do ponto de parada, como o marcador azul em cima do número no Chrome.
  ".cm-lineNumbers .cm-gutterElement.cm-ponto-de-parada": {
    backgroundColor: "var(--cor-secundaria)",
    color: "var(--cor-texto-sobre-secundaria)",
    fontWeight: "700",
    clipPath: "polygon(0 8%, calc(100% - 7px) 8%, 100% 50%, calc(100% - 7px) 92%, 0 92%)",
  },
  ".cm-lineNumbers .cm-gutterElement.cm-numero-pausado": { boxShadow: "inset 3px 0 0 var(--cor-sucesso)" },
  ".cm-linha-pausada": {
    backgroundColor: "color-mix(in srgb, var(--cor-sucesso) 22%, transparent)",
    boxShadow: "inset 4px 0 0 var(--cor-sucesso)",
  },
  ".cm-linha-do-quadro": { backgroundColor: "color-mix(in srgb, var(--cor-sucesso) 10%, transparent)" },
  ".cm-valor-pausado": { padding: "4px 8px", fontFamily: "var(--fonte-codigo), ui-monospace, monospace", fontSize: "12.5px" },
  ".cm-valor-pausado-nome": { color: "var(--cor-codigo-atributo)", fontWeight: "700" },
});

export function extensoesDepurador(opcoes: { current: OpcoesDepuradorEditor | null }): Extension {
  return [
    aparenciaDepurador,
    campoPontos,
    campoPausa,
    lineNumbers({
      domEventHandlers: {
        mousedown(view, bloco, evento) {
          if ((evento as MouseEvent).button !== 0) return false;
          opcoes.current?.aoClicarNumero(view.state.doc.lineAt(bloco.from).number);
          return true;
        },
      },
    }),
    EditorView.updateListener.of((atualizacao) => {
      if (!atualizacao.docChanged) return;
      const antes = linhasDosPontos(atualizacao.startState);
      const depois = linhasDosPontos(atualizacao.state);
      if (antes.join(",") !== depois.join(",")) opcoes.current?.aoMudarPontos(depois);
    }),
    hoverTooltip((view, posicao) => {
      const linha = view.state.doc.lineAt(posicao);
      const texto = linha.text;
      // O nome inteiro debaixo do mouse (letras, números, _ e $).
      let inicio = posicao - linha.from;
      while (inicio > 0 && /[\w$]/.test(texto[inicio - 1])) inicio -= 1;
      IDENTIFICADOR.lastIndex = inicio;
      const achado = IDENTIFICADOR.exec(texto);
      if (!achado || inicio + achado[0].length < posicao - linha.from) return null;
      const nome = achado[0];
      const valor = opcoes.current?.valorNaPausa(nome) ?? null;
      if (valor === null) return null;
      return {
        pos: linha.from + inicio,
        end: linha.from + inicio + nome.length,
        above: true,
        create: () => {
          const dom = document.createElement("div");
          dom.className = "cm-valor-pausado";
          dom.setAttribute("data-valor-hover", nome);
          const rotulo = document.createElement("span");
          rotulo.className = "cm-valor-pausado-nome";
          rotulo.textContent = `${nome}: `;
          dom.append(rotulo, document.createTextNode(valor));
          return { dom };
        },
      };
    }),
  ];
}
