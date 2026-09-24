"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Carinha } from "@/componentes/mascote/Carinha";

type Props = {
  /** Sobe a cada objetivo sozinho concluído; cada valor novo mostra a comemoração. */
  vez: number;
};

const DURACAO_MS = 2400;

/** "Fez sozinho!": um selo grande que pula no meio da tela e some sozinho. */
export function ComemoracaoSozinho({ vez }: Props) {
  const [mostrando, setMostrando] = useState<number | null>(null);
  const [conhecida, setConhecida] = useState(vez);
  if (vez !== conhecida) {
    setConhecida(vez);
    if (vez > 0) setMostrando(vez);
  }

  useEffect(() => {
    if (mostrando === null) return;
    const temporizador = setTimeout(() => setMostrando(null), DURACAO_MS);
    return () => clearTimeout(temporizador);
  }, [mostrando]);

  return (
    <AnimatePresence>
      {mostrando !== null && (
        <motion.div
          key={mostrando}
          role="status"
          data-fez-sozinho
          className="pointer-events-none fixed inset-x-0 top-1/3 z-[65] flex justify-center"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: [0.6, 1.12, 1], y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center gap-3 rounded-3xl border-4 border-secundaria bg-superficie px-6 py-4 shadow-[0_10px_0_var(--cor-sombra)]">
            <motion.span
              animate={{ rotate: [0, -12, 12, -6, 0] }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="inline-flex"
            >
              <Carinha variante="determinada" tom="primaria" tamanho={56} />
            </motion.span>
            <p className="text-3xl font-black text-secundaria">Fez sozinho!</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
