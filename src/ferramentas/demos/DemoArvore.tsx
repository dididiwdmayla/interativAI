"use client";

import { motion } from "framer-motion";
import { Cursor, MoldeDemo } from "./MoldeDemo";

const CICLO = { duration: 3.6, repeat: Infinity, ease: "easeInOut" } as const;
const LINHAS = [18, 34, 50, 66];

/** O mouse desce pela árvore e cada item acende a peça dele na tela. */
export function DemoArvore() {
  return (
    <MoldeDemo rotulo="Animação: o mouse passa pelos itens da árvore e a peça de cada um acende na tela">
      {LINHAS.map((y) => (
        <rect key={y} x="12" y={y} width={y === 34 || y === 50 ? 44 : 54} height="8" rx="3" fill="var(--cor-codigo-tag)" opacity="0.55" />
      ))}
      <rect x="84" y="12" width="64" height="66" rx="6" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="1.5" />
      {LINHAS.map((y, indice) => (
        <motion.rect
          key={`tela-${y}`}
          x="90"
          y={18 + indice * 14}
          width="52"
          height="10"
          rx="3"
          fill="var(--cor-realce-inspecao)"
          animate={{ opacity: indice === 0 ? [0.9, 0.9, 0.2, 0.2, 0.2, 0.9] : [0.2, ...Array.from({ length: 4 }, (_, passo) => (passo + 1 === indice ? 0.9 : 0.2)), 0.2] }}
          transition={{ ...CICLO, times: [0, 0.2, 0.25, 0.5, 0.75, 1] }}
        />
      ))}
      <motion.g animate={{ y: [22, 22, 38, 54, 70, 22] }} transition={{ ...CICLO, times: [0, 0.2, 0.45, 0.7, 0.95, 1] }}>
        <g transform="translate(58 0)">
          <Cursor />
        </g>
      </motion.g>
    </MoldeDemo>
  );
}
