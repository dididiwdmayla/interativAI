"use client";

/*
 * A aba Fontes com o Snippet (Fontes > Snippets, no Chrome): um editor de
 * JavaScript com Executar (Ctrl+Enter, Cmd+Enter no Mac) e, embaixo, a
 * gaveta do Console, onde aparece o que o programa mostrou (no Chrome, o
 * Console sobe como gaveta quando o snippet roda).
 */
import { type ReactNode, type RefObject, useState } from "react";
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
};

export function PainelFontes({ nome, textoInicial, editorRef, aoMudar, aoExecutar, gaveta, alvoExecutar, toque, movel, ocupado, aoFocar }: Props) {
  const [mostrar, setMostrar] = useState<"cima" | "baixo">("cima");
  const executar = () => {
    aoExecutar();
    if (movel) setMostrar("baixo");
  };
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
              { id: "baixo", rotulo: "Console" },
            ]}
            valor={mostrar}
            aoTrocar={(novo) => setMostrar(novo as "cima" | "baixo")}
            className="w-full"
          />
        </div>
      )}
      <div className="min-h-0 flex-1">
        <PainelDividido
          rotulo="Redimensionar o Snippet e o Console"
          proporcaoInicial={0.62}
          mostrar={movel ? mostrar : "ambas"}
          cima={
            <div
              className="flex h-full min-h-0 flex-col"
              data-editor-snippet
              onKeyDownCapture={(evento) => {
                if ((evento.ctrlKey || evento.metaKey) && evento.key === "Enter") {
                  evento.preventDefault();
                  evento.stopPropagation();
                  executar();
                }
              }}
            >
              <div className="min-h-0 flex-1">
                <EditorCodigo
                  ref={editorRef}
                  linguagem="javascript"
                  textoInicial={textoInicial}
                  aoMudar={aoMudar}
                  quebrarLinhas
                  aoFocar={aoFocar}
                  rotulo={`Editor do snippet ${nome}`}
                />
              </div>
              {toque && <BarraSimbolos aoInserir={(simbolo) => editorRef.current?.inserirNoCursor(simbolo)} />}
            </div>
          }
          baixo={gaveta}
        />
      </div>
    </div>
  );
}
