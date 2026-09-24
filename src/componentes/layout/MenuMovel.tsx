"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { IconeMenu } from "@/componentes/icones/IconeMenu";

type Props = { children: ReactNode };

/**
 * Menu da barra superior no celular (tema, som, Ferramentas, recomeçar).
 * Fecha ao escolher um item, com toque fora ou Esc. O conteúdo fica sempre
 * montado (só escondido), para janelas abertas a partir dele, como a
 * confirmação de recomeçar, continuarem vivas depois que ele fecha.
 */
export function MenuMovel({ children }: Props) {
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const aoTocarFora = (evento: PointerEvent) => {
      const alvo = evento.target;
      if (alvo instanceof Node && caixa.current?.contains(alvo)) return;
      // Janelas em portal (modal) contam como dentro.
      if (alvo instanceof Element && alvo.closest("[role=dialog]")) return;
      setAberto(false);
    };
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAberto(false);
    };
    window.addEventListener("pointerdown", aoTocarFora, true);
    window.addEventListener("keydown", aoTeclar);
    return () => {
      window.removeEventListener("pointerdown", aoTocarFora, true);
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  return (
    <div ref={caixa} className="relative">
      <button
        type="button"
        aria-expanded={aberto}
        aria-label="Mais opções"
        onClick={() => setAberto((valor) => !valor)}
        className="grid h-11 w-11 place-items-center rounded-full text-texto hover:bg-hover"
      >
        <IconeMenu />
      </button>
      <div
        onClick={(evento) => {
          if (evento.target instanceof Element && evento.target.closest("button")) setAberto(false);
        }}
        className={`absolute right-0 top-full z-50 mt-1 w-60 flex-col items-stretch gap-3 rounded-2xl border-2 border-borda bg-superficie p-3 shadow-[0_6px_0_var(--cor-sombra)] ${
          aberto ? "flex" : "hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
