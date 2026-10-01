"use client";

/*
 * A aba Fontes com o Snippet (Fontes > Snippets, no Chrome): um editor de
 * JavaScript com Executar (Ctrl+Enter, Cmd+Enter no Mac) e, embaixo, a
 * gaveta do Console, onde aparece o que o programa mostrou (no Chrome, o
 * Console sobe como gaveta quando o snippet roda).
 *
 * Com o depurador (fase com as ferramentas dele), a barra lateral do Chrome
 * fica ao lado do editor: controles, Observar, Pontos de parada, Escopo e
 * Pilha de chamadas. No celular, um terceiro botão (Depurador) mostra os
 * painéis em abas e os controles ficam numa barra embaixo.
 */
import { type ReactNode, type RefObject, useState } from "react";
import type { OpcoesDepuradorEditor } from "@/componentes/painel/editor/extensoesDepurador";
import { PainelLadoALado } from "@/componentes/painel/PainelLadoALado";
import { IconeExecutar } from "@/componentes/icones/IconeExecutar";
import { IconeSnippet } from "@/componentes/icones/IconeSnippet";
import { BarraSimbolos } from "@/componentes/painel/console/BarraSimbolos";
import { type ApiEditor, EditorCodigo } from "@/componentes/painel/editor/EditorCodigo";
import { PainelDividido } from "@/componentes/painel/PainelDividido";
import { SeletorSegmentado } from "@/componentes/ui/SeletorSegmentado";

type Props = {
  nome: string;
  textoInicial: string;
  editorRef: RefObject<ApiEditor | null>;
  aoMudar: (texto: string) => void;
  aoExecutar: () => void;
  /** O Console (mesmas linhas da aba Console), na gaveta de baixo. */
  gaveta: ReactNode;
  /** O botão Executar embrulhado (para a apresentação e a Caixa de Ferramentas). */
  alvoExecutar: (botao: ReactNode) => ReactNode;
  toque: boolean;
  movel: boolean;
  ocupado: boolean;
  aoFocar?: () => void;
  /** O depurador da aba Fontes (só nas fases com as ferramentas dele). */
  depurador?: {
    /** A barra lateral (computador) ou os painéis em abas (celular). */
    painel: ReactNode;
    /** A barra de controles de baixo (celular). */
    barra: ReactNode;
    opcoesEditor: OpcoesDepuradorEditor;
    pausado: boolean;
    /** Ctrl+B (Cmd+B): ponto de parada na linha do cursor. */
    aoPontoNoCursor: () => void;
    /** O editor embrulhado (a apresentação dos pontos de parada aponta o editor). */
    alvoEditor: (editor: ReactNode) => ReactNode;
    /** No celular, o jogo pede o que mostrar (a apresentação de uma ferramenta). `vez` muda a cada pedido. */
    pedido?: { mostrar: "cima" | "depurador" | "baixo"; vez: number } | null;
  };
};

export function PainelFontes({ nome, textoInicial, editorRef, aoMudar, aoExecutar, gaveta, alvoExecutar, toque, movel, ocupado, aoFocar, depurador }: Props) {
  const [escolha, setMostrar] = useState<"cima" | "depurador" | "baixo">("cima");
  // No computador não há o botão Depurador (a barra lateral fica sempre à vista).
  const mostrar = !movel && escolha === "depurador" ? "cima" : escolha;
  const pausado = depurador?.pausado ?? false;
  const pedido = depurador?.pedido ?? null;
  const [pedidoVisto, setPedidoVisto] = useState(pedido?.vez ?? 0);
  if (pedido && pedido.vez !== pedidoVisto) {
    setPedidoVisto(pedido.vez);
    setMostrar(pedido.mostrar);
  }
  const executar = () => {
    aoExecutar();
    if (movel) setMostrar("baixo");
  };
  // Pausou: no celular, o código volta para a frente (a linha pausada acesa e os controles embaixo).
  const [pausaConhecida, setPausaConhecida] = useState(pausado);
  if (pausaConhecida !== pausado) {
    setPausaConhecida(pausado);
    if (pausado && movel && mostrar === "baixo") setMostrar("cima");
  }
  const botao = (
    <button
      type="button"
      onClick={executar}
      disabled={ocupado}
      title="Executar (Ctrl+Enter)"
      className="inline-flex h-7 items-center gap-1 rounded-full border-2 border-primaria bg-primaria px-3 text-xs font-black text-sobre-primaria hover:brightness-110 disabled:opacity-60 pointer-coarse:h-11"
      data-executar-snippet
    >
      <IconeExecutar tamanho={12} />
      Executar
    </button>
  );
  return (
    <div className="flex h-full min-h-0 flex-col" data-fontes>
      <div className="flex shrink-0 items-center gap-2 border-b-2 border-borda bg-painel px-2 py-1">
        <span className="hidden text-xs font-bold text-texto-suave sm:inline">Snippets</span>
        <span className="inline-flex min-w-0 items-center gap-1 rounded-md bg-superficie px-2 py-0.5 text-xs font-bold text-texto" data-nome-snippet>
          <IconeSnippet tamanho={14} />
          <span className="truncate">{nome}</span>
        </span>
        <span className="flex-1" />
        {!toque && <span className="hidden text-[11px] text-texto-suave lg:inline">Ctrl+Enter</span>}
        {alvoExecutar(botao)}
      </div>
      {movel && (
        <div className="flex shrink-0 border-b-2 border-borda bg-painel px-2 py-1.5">
          <SeletorSegmentado
            rotulo="Mostrar na aba Fontes"
            opcoes={[
              { id: "cima", rotulo: "Snippet" },
              ...(depurador ? [{ id: "depurador" as const, rotulo: "Depurador" }] : []),
              { id: "baixo", rotulo: "Console" },
            ]}
            valor={mostrar}
            aoTrocar={(novo) => setMostrar(novo)}
            className="w-full"
          />
        </div>
      )}
      <div className="flex min-h-0 flex-1 flex-col">
        {(() => {
          const editor = (
            <div className="min-h-0 flex-1">
              <EditorCodigo
                ref={editorRef}
                linguagem="javascript"
                textoInicial={textoInicial}
                aoMudar={aoMudar}
                quebrarLinhas
                aoFocar={aoFocar}
                rotulo={`Editor do snippet ${nome}`}
                depurador={depurador?.opcoesEditor}
                somenteLeitura={pausado}
              />
            </div>
          );
          const dividido = (
            <PainelDividido
              rotulo="Redimensionar o Snippet e o Console"
              proporcaoInicial={0.62}
              mostrar={movel ? (mostrar === "baixo" ? "baixo" : "cima") : "ambas"}
              cima={
                <div
                  className="flex h-full min-h-0 flex-col"
                  data-editor-snippet
                  data-snippet-pausado={pausado ? "sim" : "nao"}
                  onKeyDownCapture={(evento) => {
                    if ((evento.ctrlKey || evento.metaKey) && evento.key === "Enter") {
                      evento.preventDefault();
                      evento.stopPropagation();
                      executar();
                    }
                    // Ctrl+B (Cmd+B): ponto de parada na linha do cursor, como no Chrome.
                    if (depurador && (evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === "b") {
                      evento.preventDefault();
                      evento.stopPropagation();
                      depurador.aoPontoNoCursor();
                    }
                  }}
                >
                  {depurador ? depurador.alvoEditor(editor) : editor}
                  {pausado && <p className="shrink-0 border-t-2 border-borda bg-painel px-2 py-0.5 text-[11px] text-texto-suave">Pausado: o código fica só para ler até o programa terminar.</p>}
                  {toque && !pausado && <BarraSimbolos aoInserir={(simbolo) => editorRef.current?.inserirNoCursor(simbolo)} />}
                </div>
              }
              baixo={gaveta}
            />
          );
          if (!depurador) return dividido;
          if (movel) {
            return (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className={`min-h-0 flex-1 flex-col ${mostrar === "depurador" ? "hidden" : "flex"}`}>{dividido}</div>
                {mostrar === "depurador" && <div className="flex min-h-0 flex-1 flex-col">{depurador.painel}</div>}
                {depurador.barra}
              </div>
            );
          }
          return (
            <PainelLadoALado
              rotulo="Redimensionar o código e o depurador"
              proporcaoInicial={0.58}
              esquerda={<div className="flex h-full min-h-0 flex-col">{dividido}</div>}
              direita={depurador.painel}
            />
          );
        })()}
      </div>
    </div>
  );
}
