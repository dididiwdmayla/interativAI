"use client";

import { motion } from "framer-motion";
import { MoldeDemo } from "./MoldeDemo";

const CICLO = { duration: 3.6, repeat: Infinity, ease: "easeOut" } as const;

/** Um card vira dois: a cópia nasce logo depois do original, já selecionada. */
export function DemoDuplicar() {
  return (
    <MoldeDemo rotulo="Animação: o card é duplicado e a cópia aparece logo depois dele, selecionada">
      <rect x="18" y="20" width="56" height="50" rx="6" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="1.5" />
      <rect x="25" y="28" width="40" height="7" rx="3" fill="var(--cor-codigo-tag)" opacity="0.55" />
      <rect x="25" y="40" width="30" height="5" rx="2.5" fill="var(--cor-borda)" />
      <motion.g
        animate={{ x: [0, 0, 66, 66, 0], opacity: [0, 0, 1, 1, 0] }}
        transition={{ ...CICLO, times: [0, 0.25, 0.45, 0.9, 1] }}
      >
        <rect x="18" y="20" width="56" height="50" rx="6" fill="var(--cor-superficie)" stroke="var(--cor-realce-inspecao)" strokeWidth="2.5" />
        <rect x="25" y="28" width="40" height="7" rx="3" fill="var(--cor-codigo-tag)" opacity="0.55" />
        <rect x="25" y="40" width="30" height="5" rx="2.5" fill="var(--cor-borda)" />
      </motion.g>
    </MoldeDemo>
  );
}
