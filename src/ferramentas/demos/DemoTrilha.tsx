"use client";

import { motion } from "framer-motion";
import { Cursor, MoldeDemo } from "./MoldeDemo";

const CICLO = { duration: 3.6, repeat: Infinity, ease: "easeInOut" } as const;
const ITENS = [
  { x: 12, largura: 26, rotulo: "body" },
  { x: 44, largura: 28, rotulo: "main" },
  { x: 78, largura: 36, rotulo: "article" },
  { x: 120, largura: 26, rotulo: "a" },
];

/** O cursor clica em "article" na trilha e a caixa grande acende na tela. */
export function DemoTrilha() {
  return (
    <MoldeDemo rotulo="Animação: um clique no article da trilha seleciona a notícia inteira em volta do link">
      <rect x="20" y="10" width="120" height="44" rx="6" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="1.5" />
      <rect x="28" y="18" width="70" height="7" rx="3" fill="var(--cor-codigo-tag)" opacity="0.5" />
      <rect x="28" y="30" width="96" height="5" rx="2.5" fill="var(--cor-borda)" />
      <motion.rect
        x="28"
        y="41"
        width="30"
        height="7"
        rx="3"
        fill="var(--cor-realce-inspecao)"
        animate={{ opacity: [0.9, 0.9, 0.25, 0.25, 0.9] }}
        transition={{ ...CICLO, times: [0, 0.45, 0.5, 0.95, 1] }}
      />
      <motion.rect
        x="20"
        y="10"
        width="120"
        height="44"
        rx="6"
        fill="var(--cor-realce-inspecao)"
        animate={{ opacity: [0, 0, 0.35, 0.35, 0] }}
        transition={{ ...CICLO, times: [0, 0.45, 0.5, 0.95, 1] }}
      />
      {ITENS.map((item) => (
        <g key={item.rotulo}>
          <motion.rect
            x={item.x}
            y="64"
            width={item.largura}
            height="14"
            rx="4"
            fill="var(--cor-selecao)"
            animate={{
              opacity:
                item.rotulo === "a" ? [1, 1, 0, 0, 1] : item.rotulo === "article" ? [0, 0, 1, 1, 0] : [0, 0, 0, 0, 0],
            }}
            transition={{ ...CICLO, times: [0, 0.45, 0.5, 0.95, 1] }}
          />
          <text x={item.x + 4} y="74" fontSize="8" fontFamily="var(--fonte-codigo), monospace" fill="var(--cor-codigo-tag)">
            {item.rotulo}
          </text>
        </g>
      ))}
      <motion.g animate={{ x: [140, 96, 96, 140], y: [86, 72, 72, 86] }} transition={{ ...CICLO, times: [0, 0.4, 0.9, 1] }}>
        <Cursor />
      </motion.g>
    </MoldeDemo>
  );
}
