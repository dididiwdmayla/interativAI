"use client";

import { useEffect, useRef } from "react";
import { IconeEntradaConsole } from "@/componentes/icones/IconeEntradaConsole";
import { IconeExecutar } from "@/componentes/icones/IconeExecutar";
import { IconeLimpar } from "@/componentes/icones/IconeLimpar";
import type { LinhaConsole } from "@/componentes/jogo/usePrograma";
import { BarraSimbolos } from "./BarraSimbolos";
import { type ApiEntradaConsole, EntradaConsole } from "./EntradaConsole";
import { LinhaDoConsole } from "./LinhaDoConsole";

type Props = {
  linhas: readonly LinhaConsole[];
  historico: readonly string[];
  aoExecutar: (codigo: string) => void;
  aoLimpar: () => void;
  /** Tela de toque: botão Rodar e a barra de símbolos. */
  toque: boolean;
  ocupado: boolean;
  /** Degrau 3 da ajuda: a linha de digitar pisca. */
  destacado: boolean;
  aoFocar?: () => void;
};

/** A aba Console: as linhas (o que rodou, as respostas, as saídas e os erros) e a linha de digitar. */
export function PainelConsole({ linhas, historico, aoExecutar, aoLimpar, toque, ocupado, destacado, aoFocar }: Props) {
  const rolagem = useRef<HTMLDivElement>(null);
  const entradaInterna = useRef<ApiEntradaConsole | null>(null);

  useEffect(() => {
    const caixa = rolagem.current;
    if (caixa) caixa.scrollTop = caixa.scrollHeight;
  }, [linhas]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-codigo-fundo" data-console data-console-ocupado={ocupado ? "sim" : "nao"}>
      <div className="flex shrink-0 items-center gap-2 border-b-2 border-borda bg-painel px-2 py-1">
        <button
          type="button"
          onClick={aoLimpar}
          aria-label="Limpar o console"
          title="Limpar o console"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-texto-suave hover:bg-hover hover:text-texto pointer-coarse:h-11 pointer-coarse:w-11"
          data-limpar-console
        >
          <IconeLimpar />
        </button>
        <span className="text-xs font-bold text-texto-suave">Console</span>
      </div>
      <div ref={rolagem} className="min-h-0 flex-1 overflow-y-auto font-mono text-[13px] leading-relaxed" aria-live="polite" data-linhas-console>
        {linhas.map((linha) => (
          <LinhaDoConsole key={linha.id} linha={linha} />
        ))}
        <div
          className={`flex items-start gap-1.5 px-2 py-1 ${destacado ? "animate-pulse rounded-md bg-codigo-destaque-linha shadow-[inset_4px_0_0_var(--cor-destaque)]" : ""}`}
          data-ferramenta-console-entrada
          data-destaque-console={destacado ? "sim" : "nao"}
          onClick={() => entradaInterna.current?.focar()}
        >
          <span className="mt-1 flex w-3.5 shrink-0 justify-center text-secundaria">
            <IconeEntradaConsole />
          </span>
          <EntradaConsole ref={entradaInterna} historico={historico} aoEnviar={aoExecutar} aoFocar={aoFocar} toque={toque} />
          {toque && (
            <button
              type="button"
              onPointerDown={(evento) => evento.preventDefault()}
              onClick={() => entradaInterna.current?.enviar()}
              className="inline-flex h-11 shrink-0 items-center gap-1 rounded-full border-2 border-primaria bg-primaria px-3 text-sm font-black text-sobre-primaria"
              data-rodar-console
            >
              <IconeExecutar />
              Rodar
            </button>
          )}
        </div>
      </div>
      {toque && <BarraSimbolos aoInserir={(simbolo) => entradaInterna.current?.inserir(simbolo)} />}
    </div>
  );
}
