"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useEffect, useId, useRef } from "react";

type Props = {
  aberto: boolean;
  titulo: string;
  aoFechar: () => void;
  children: ReactNode;
  className?: string;
};

const FOCAVEIS = 'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Janela sobreposta com foco no primeiro botão, Esc para fechar e foco preso dentro. */
export function Modal({ aberto, titulo, aoFechar, children, className = "" }: Props) {
  const idTitulo = useId();
  const caixa = useRef<HTMLDivElement>(null);
  const focoAnterior = useRef<Element | null>(null);

  useEffect(() => {
    if (!aberto) return;
    focoAnterior.current = document.activeElement;
    const temporizador = setTimeout(() => {
      caixa.current?.querySelector<HTMLElement>(FOCAVEIS)?.focus();
    }, 30);
    return () => {
      clearTimeout(temporizador);
      const anterior = focoAnterior.current;
      if (anterior instanceof HTMLElement) anterior.focus();
    };
  }, [aberto]);

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4"
          style={{ backgroundColor: "color-mix(in srgb, var(--cor-texto) 45%, transparent)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) aoFechar();
          }}
        >
          <motion.div
            ref={caixa}
            role="dialog"
            aria-modal="true"
            aria-labelledby={idTitulo}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            onKeyDown={(evento) => {
              if (evento.key === "Escape") {
                evento.stopPropagation();
                aoFechar();
                return;
              }
              if (evento.key !== "Tab") return;
              const itens = Array.from(caixa.current?.querySelectorAll<HTMLElement>(FOCAVEIS) ?? []);
              if (itens.length === 0) return;
              const primeiro = itens[0];
              const ultimo = itens[itens.length - 1];
              if (evento.shiftKey && document.activeElement === primeiro) {
                evento.preventDefault();
                ultimo.focus();
              } else if (!evento.shiftKey && document.activeElement === ultimo) {
                evento.preventDefault();
                primeiro.focus();
              }
            }}
            className={`w-full max-w-lg rounded-3xl border-2 border-borda bg-superficie p-6 text-texto shadow-[0_10px_0_var(--cor-sombra)] ${className}`}
          >
            <h2 id={idTitulo} className="sr-only">
              {titulo}
            </h2>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
