"use client";

import { motion } from "framer-motion";
import { Cursor, MoldeDemo } from "./MoldeDemo";

const CICLO = { duration: 3.4, repeat: Infinity, ease: "easeOut" } as const;

/** Dois cliques no texto abrem a caixinha de edição, e o texto muda. */
export function DemoEditarDuploClique() {
  return (
    <MoldeDemo rotulo="Animação: dois cliques no texto da árvore abrem a edição e o texto muda">
      <text x="14" y="40" fontSize="11" fontFamily="var(--fonte-codigo), monospace" fill="var(--cor-codigo-tag)">
        &lt;h1&gt;
      </text>
      <text x="126" y="40" fontSize="11" fontFamily="var(--fonte-codigo), monospace" fill="var(--cor-codigo-tag)">
        &lt;/h1&gt;
      </text>
      <motion.rect
        x="46"
        y="28"
        width="76"
        height="17"
        rx="4"
        fill="var(--cor-superficie)"
        stroke="var(--cor-primaria)"
        strokeWidth="2"
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ ...CICLO, times: [0, 0.35, 0.4, 0.9, 1] }}
      />
      <motion.text
        x="50"
        y="40"
        fontSize="11"
        fontFamily="var(--fonte-codigo), monospace"
        fill="var(--cor-codigo-texto)"
        animate={{ opacity: [1, 1, 0, 0, 1] }}
        transition={{ ...CICLO, times: [0, 0.35, 0.4, 0.97, 1] }}
      >
        Padaria
      </motion.text>
      <motion.text
        x="50"
        y="40"
        fontSize="11"
        fontFamily="var(--fonte-codigo), monospace"
        fill="var(--cor-codigo-texto)"
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ ...CICLO, times: [0, 0.55, 0.6, 0.9, 1] }}
      >
        Meu site
      </motion.text>
      {[0.12, 0.24].map((instante) => (
        <motion.circle
          key={instante}
          cx="70"
          cy="37"
          fill="none"
          stroke="var(--cor-destaque)"
          strokeWidth="2"
          animate={{ r: [0, 0, 12, 12], opacity: [0, 0, 0.9, 0] }}
          transition={{ ...CICLO, times: [0, instante, instante + 0.08, instante + 0.12] }}
        />
      ))}
      <motion.g animate={{ x: [100, 70, 70, 100], y: [70, 38, 38, 70] }} transition={{ ...CICLO, times: [0, 0.1, 0.9, 1] }}>
        <Cursor />
      </motion.g>
      <rect x="14" y="60" width="132" height="16" rx="5" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="1.5" />
      <motion.text
        x="22"
        y="72"
        fontSize="10"
        fontWeight="800"
        fill="var(--cor-texto)"
        animate={{ opacity: [1, 1, 0, 0, 1] }}
        transition={{ ...CICLO, times: [0, 0.6, 0.62, 0.97, 1] }}
      >
        Padaria
      </motion.text>
      <motion.text
        x="22"
        y="72"
        fontSize="10"
        fontWeight="800"
        fill="var(--cor-primaria)"
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ ...CICLO, times: [0, 0.6, 0.62, 0.9, 1] }}
      >
        Meu site
      </motion.text>
    </MoldeDemo>
  );
}
