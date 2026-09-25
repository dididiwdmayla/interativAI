"use client";

import { motion } from "framer-motion";
import { ChaoIlha } from "./ChaoIlha";
import { useAnimarMapa } from "./useAnimarMapa";

/** Origens: museu com colunas, um cartão perfurado e um terminal antigo. */
export function ArteOrigens() {
  const animar = useAnimarMapa();
  return (
    <g>
      <ChaoIlha />
      {/* Museu */}
      <g transform="translate(-8 -4)">
        <rect x="-44" y="-8" width="88" height="10" rx="2" fill="var(--cor-pedra-sombra)" />
        {[-34, -14, 6, 26].map((x) => (
          <rect key={x} x={x} y="-48" width="9" height="40" rx="2" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="1.5" />
        ))}
        <rect x="-46" y="-54" width="92" height="8" rx="2" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="1.5" />
        <path d="M-50-54L0-80 50-54Z" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="0" cy="-64" r="5" fill="var(--cor-destaque)" />
      </g>
      {/* Cartão perfurado */}
      <g transform="translate(-86 0) rotate(-10)">
        <rect x="0" y="-26" width="32" height="22" rx="2" fill="var(--cor-destaque)" stroke="var(--cor-madeira)" strokeWidth="1.5" />
        {[5, 11, 17, 23].map((x) =>
          [-21, -15, -9].map((y) => (x + y) % 3 !== 0 && <rect key={`${x}${y}`} x={x} y={y} width="3" height="4" fill="var(--cor-madeira)" />),
        )}
      </g>
      {/* Terminal antigo */}
      <g transform="translate(60 -2)">
        <rect x="-4" y="-34" width="40" height="32" rx="5" fill="var(--cor-pedra-sombra)" />
        <rect x="1" y="-30" width="30" height="22" rx="3" fill="var(--cor-terminal-fundo)" />
        <path d="M5-24h12M5-19h18M5-14h8" stroke="var(--cor-terminal-texto)" strokeWidth="2" strokeLinecap="round" />
        <motion.g
          animate={animar ? { opacity: [1, 0, 1] } : { opacity: 1 }}
          transition={animar ? { duration: 1.1, repeat: Infinity } : undefined}
        >
          <rect x="15" y="-16" width="5" height="4" fill="var(--cor-terminal-texto)" />
        </motion.g>
        <rect x="6" y="-2" width="20" height="4" rx="1" fill="var(--cor-pedra-sombra)" />
      </g>
    </g>
  );
}
