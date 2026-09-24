"use client";

import { type KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconeApagar } from "@/componentes/icones/IconeApagar";
import { IconeDuplicar } from "@/componentes/icones/IconeDuplicar";
import { IconeEditar } from "@/componentes/icones/IconeEditar";
import { IconeEsconder } from "@/componentes/icones/IconeEsconder";
import type { AcoesNo } from "./tipos";

type Props = {
  /** Onde abrir (coordenadas da tela). */
  x: number;
  y: number;
  /** Nome do nó, para o rótulo do menu. */
  rotulo: string;
  acoes: AcoesNo;
  /** Mouse: mostra os atalhos do F12 ao lado de cada item. */
  mostrarAtalhos: boolean;
  aoFechar: () => void;
};

const MARGEM = 8;
const ESPERA_ROLAGEM_MS = 500;

/**
 * Menu do botão direito (ou do toque longo) num nó da árvore, como o do
 * F12: Editar, Esconder, Apagar e Duplicar.
 */
export function MenuNo({ x, y, rotulo, acoes, mostrarAtalhos, aoFechar }: Props) {
  const caixa = useRef<HTMLDivElement>(null);
  const [posicao, setPosicao] = useState({ x, y });
  const itens = [
    { id: "editar", nome: "Editar texto", atalho: "Enter", Icone: IconeEditar, ativo: acoes.podeEditar, fazer: acoes.editar },
    {
      id: "esconder",
      nome: acoes.escondido ? "Mostrar de novo" : "Esconder",
      atalho: "H",
      Icone: IconeEsconder,
      ativo: acoes.podeEsconder,
      fazer: acoes.esconder,
    },
    { id: "apagar", nome: "Apagar", atalho: "Delete", Icone: IconeApagar, ativo: acoes.podeApagar, fazer: acoes.apagar },
    {
      id: "duplicar",
      nome: "Duplicar",
      atalho: "Shift+Alt+↓",
      Icone: IconeDuplicar,
      ativo: acoes.podeDuplicar,
      fazer: acoes.duplicar,
    },
  ];

  // Cabe na tela: encosta nas bordas se precisar.
  useLayoutEffect(() => {
    const elemento = caixa.current;
    if (!elemento) return;
    const { offsetWidth: largura, offsetHeight: altura } = elemento;
    setPosicao({
      x: Math.max(MARGEM, Math.min(x, window.innerWidth - largura - MARGEM)),
      y: Math.max(MARGEM, Math.min(y, window.innerHeight - altura - MARGEM)),
    });
  }, [x, y]);

  useEffect(() => {
    caixa.current?.querySelector<HTMLButtonElement>("button:not([disabled])")?.focus({ preventScroll: true });
    const aoApertarFora = (evento: PointerEvent) => {
      if (evento.target instanceof Node && caixa.current?.contains(evento.target)) return;
      aoFechar();
    };
    // Abrir o menu seleciona o nó, e a árvore rola até ele: essa rolagem não fecha o menu.
    const abertoEm = performance.now();
    const aoRolar = (evento: Event) => {
      if (performance.now() - abertoEm < ESPERA_ROLAGEM_MS) return;
      if (evento.target instanceof Node && caixa.current?.contains(evento.target)) return;
      aoFechar();
    };
    window.addEventListener("pointerdown", aoApertarFora, true);
    window.addEventListener("scroll", aoRolar, true);
    window.addEventListener("resize", aoFechar);
    return () => {
      window.removeEventListener("pointerdown", aoApertarFora, true);
      window.removeEventListener("scroll", aoRolar, true);
      window.removeEventListener("resize", aoFechar);
    };
  }, [aoFechar]);

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    evento.stopPropagation();
    const botoes = Array.from(caixa.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? []);
    const atual = botoes.indexOf(document.activeElement as HTMLButtonElement);
    if (evento.key === "Escape" || evento.key === "Tab") {
      evento.preventDefault();
      aoFechar();
    } else if (evento.key === "ArrowDown") {
      evento.preventDefault();
      botoes[(atual + 1) % botoes.length]?.focus();
    } else if (evento.key === "ArrowUp") {
      evento.preventDefault();
      botoes[(atual - 1 + botoes.length) % botoes.length]?.focus();
    }
  };

  return createPortal(
    <div
      ref={caixa}
      role="menu"
      aria-label={`Ações de ${rotulo}`}
      data-menu-no
      onKeyDown={aoTeclar}
      onContextMenu={(evento) => evento.preventDefault()}
      className="fixed z-[70] min-w-48 rounded-2xl border-2 border-borda bg-superficie p-1.5 text-texto shadow-[0_6px_0_var(--cor-sombra)]"
      style={{ left: posicao.x, top: posicao.y }}
    >
      <p className="truncate px-2 pb-1 pt-0.5 font-codigo text-xs text-texto-suave">{rotulo}</p>
      {itens.map(({ id, nome, atalho, Icone, ativo, fazer }) => (
        <button
          key={id}
          type="button"
          role="menuitem"
          data-acao={id}
          disabled={!ativo}
          onClick={() => {
            aoFechar();
            fazer();
          }}
          className="flex min-h-9 w-full items-center gap-2 rounded-xl px-2 text-left text-sm font-bold hover:bg-hover focus-visible:bg-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent pointer-coarse:min-h-11"
        >
          <Icone tamanho={16} />
          <span className="flex-1">{nome}</span>
          {mostrarAtalhos && <kbd className="font-codigo text-[11px] font-normal text-texto-suave">{atalho}</kbd>}
        </button>
      ))}
    </div>,
    document.body,
  );
}
