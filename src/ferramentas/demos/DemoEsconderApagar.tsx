"use client";

import { motion } from "framer-motion";
import { MoldeDemo } from "./MoldeDemo";

const CICLO = { duration: 4, repeat: Infinity, ease: "easeInOut" } as const;

type Props = { modo: "esconder" | "apagar" };

/**
 * Três blocos na tela. Esconder: o do meio fica invisível e o buraco
 * continua. Apagar: o do meio some e o de baixo sobe.
 */
export function DemoEsconderApagar({ modo }: Props) {
  const apagar = modo === "apagar";
  return (
    <MoldeDemo
      rotulo={
        apagar
          ? "Animação: o bloco do meio é apagado e o bloco de baixo sobe para o lugar dele"
          : "Animação: o bloco do meio fica invisível, mas o espaço dele continua reservado"
      }
    >
      <rect x="40" y="10" width="80" height="18" rx="4" fill="var(--cor-codigo-tag)" opacity="0.55" />
      <motion.rect
        x="40"
        y="34"
        width="80"
        height="18"
        rx="4"
        fill="var(--cor-destaque)"
        animate={{ opacity: [1, 1, 0, 0, 1] }}
        transition={{ ...CICLO, times: [0, 0.3, 0.4, 0.9, 1] }}
      />
      {!apagar && (
        <motion.rect
          x="40"
          y="34"
          width="80"
          height="18"
          rx="4"
          fill="none"
          stroke="var(--cor-borda)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={{ ...CICLO, times: [0, 0.3, 0.4, 0.9, 1] }}
        />
      )}
      <motion.rect
        x="40"
        width="80"
        height="18"
        rx="4"
        fill="var(--cor-secundaria)"
        opacity="0.6"
        initial={{ y: 58 }}
        animate={{ y: apagar ? [58, 58, 34, 34, 58] : 58 }}
        transition={{ ...CICLO, times: [0, 0.4, 0.55, 0.9, 1] }}
      />
    </MoldeDemo>
  );
}
