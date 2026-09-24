"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { IconeMenu } from "@/componentes/icones/IconeMenu";

type Props = { children: ReactNode };

/**
 * Menu da barra superior no celular (tema, som, Ferramentas, recomeçar).
 * Fecha com toque fora ou Esc; toques numa janela aberta a partir dele
 * (como a confirmação de recomeçar, em portal) não contam como fora.
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
      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1 flex w-60 flex-col items-stretch gap-3 rounded-2xl border-2 border-borda bg-superficie p-3 shadow-[0_6px_0_var(--cor-sombra)]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
