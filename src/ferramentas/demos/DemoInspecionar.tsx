"use client";

import { motion } from "framer-motion";
import { Cursor, MoldeDemo } from "./MoldeDemo";

const CICLO = { duration: 3.2, repeat: Infinity, ease: "easeInOut" } as const;

/** O mouse aponta um botão na tela e a árvore pula para a peça dele. */
export function DemoInspecionar() {
  return (
    <MoldeDemo rotulo="Animação: a setinha aponta um botão na tela e a árvore marca a peça dele">
      <rect x="10" y="12" width="60" height="66" rx="6" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="1.5" />
      {[20, 34, 48, 62].map((y) => (
        <rect key={y} x="16" y={y} width="44" height="7" rx="3" fill="var(--cor-codigo-tag)" opacity="0.5" />
      ))}
      <motion.rect
        x="13"
        y="45"
        width="54"
        height="13"
        rx="4"
        fill="var(--cor-selecao)"
        stroke="var(--cor-primaria)"
        strokeWidth="1.5"
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ ...CICLO, times: [0, 0.55, 0.62, 0.9, 1] }}
      />
      <rect x="84" y="12" width="64" height="66" rx="6" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="1.5" />
      <rect x="92" y="22" width="48" height="8" rx="3" fill="var(--cor-texto-suave)" opacity="0.4" />
      <rect x="98" y="44" width="36" height="14" rx="7" fill="var(--cor-primaria)" />
      <motion.rect
        x="95"
        y="41"
        width="42"
        height="20"
        rx="4"
        fill="none"
        stroke="var(--cor-realce-inspecao)"
        strokeWidth="2"
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ ...CICLO, times: [0, 0.35, 0.45, 0.9, 1] }}
      />
      <motion.g
        animate={{ x: [150, 150, 118, 118, 150], y: [80, 80, 52, 52, 80], scale: [1, 1, 1, 0.85, 1] }}
        transition={{ ...CICLO, times: [0, 0.1, 0.45, 0.55, 1] }}
      >
        <Cursor />
      </motion.g>
    </MoldeDemo>
  );
}
