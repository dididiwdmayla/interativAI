"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = { ativo: boolean; children: ReactNode; className?: string };

/** O computadorzinho esbarra: balança, pula e quase cai (momento roteirizado "esbarrao"). */
export function Tropeco({ ativo, children, className = "" }: Props) {
  const reduzir = useReducedMotion() ?? false;
  const animar = ativo && !reduzir;
  return (
    <motion.div
      className={`inline-flex ${className}`}
      animate={
        animar
          ? { rotate: [0, -16, 22, -12, 8, -4, 0], x: [0, -10, 16, -6, 4, 0, 0], y: [0, -14, 2, -8, 0, -3, 0] }
          : { rotate: 0, x: 0, y: 0 }
      }
      transition={animar ? { duration: 1.05, ease: "easeInOut" } : { duration: 0.2 }}
      style={{ originX: 0.5, originY: 1 }}
    >
      {children}
    </motion.div>
  );
}
