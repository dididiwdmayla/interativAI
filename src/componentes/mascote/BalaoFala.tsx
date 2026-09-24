"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import type { Fala } from "@/motor/tipos";

type Props = {
  fala: Fala;
  children?: ReactNode;
};

/** Balão de fala do computadorzinho, com rabinho apontando para ele. */
export function BalaoFala({ fala, children }: Props) {
  return (
    <div className="relative flex min-h-[5.5rem] flex-1 flex-col justify-between gap-2 rounded-2xl border-2 border-borda bg-painel px-4 py-3">
      <span
        className="absolute -left-[9px] bottom-6 h-4 w-4 rotate-45 border-b-2 border-l-2 border-borda bg-painel"
        aria-hidden="true"
      />
      <div aria-live="polite" className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={fala.texto}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-[15px] font-bold leading-snug text-texto"
          >
            {fala.texto}
          </motion.p>
        </AnimatePresence>
      </div>
      {children && <div className="relative flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
