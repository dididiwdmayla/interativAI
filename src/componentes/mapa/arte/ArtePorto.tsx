"use client";

import { motion } from "framer-motion";
import { useAnimarMapa } from "./useAnimarMapa";

/**
 * O Porto da revisão: um pier de madeira sobre o mar, um barco atracado
 * (é dali que se sai para rever as ilhas) e a casinha do porto com a
 * bandeirola. Desenhado em volta de (0, 0), só com tokens.
 */
export function ArtePorto({ comItens }: { comItens: boolean }) {
  const animar = useAnimarMapa();
  return (
    <g>
      {/* Faixa de areia onde o pier nasce */}
      <ellipse cx="-30" cy="18" rx="70" ry="22" fill="var(--cor-areia)" stroke="var(--cor-areia-sombra)" strokeWidth="3" />
      <ellipse cx="-34" cy="12" rx="52" ry="14" fill="var(--cor-grama)" />
      {/* Pier */}
      <path d="M0 18h78" stroke="var(--cor-madeira)" strokeWidth="12" strokeLinecap="round" />
      {[12, 30, 48, 66].map((x) => (
        <path key={x} d={`M${x} 24v14`} stroke="var(--cor-madeira)" strokeWidth="4" strokeLinecap="round" />
      ))}
      {[8, 20, 32, 44, 56, 68].map((x) => (
        <path key={x} d={`M${x} 13v10`} stroke="var(--cor-areia-sombra)" strokeWidth="1.5" opacity="0.6" />
      ))}
      {/* Casinha do porto */}
      <rect x="-62" y="-26" width="44" height="34" rx="4" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="3" />
      <path d="M-68 -24l28 -22 28 22z" fill="var(--cor-primaria)" stroke="var(--cor-borda)" strokeWidth="3" strokeLinejoin="round" />
      <rect x="-46" y="-10" width="12" height="18" rx="2" fill="var(--cor-madeira)" />
      <rect x="-58" y="-16" width="9" height="9" rx="1.5" fill="var(--cor-destaque)" opacity={comItens ? 1 : 0.35} />
      {/* Mastro com bandeirola */}
      <path d="M-4 16V-52" stroke="var(--cor-madeira)" strokeWidth="3" strokeLinecap="round" />
      <motion.path
        d="M-3 -52l24 7-24 7z"
        fill="var(--cor-secundaria)"
        style={{ transformOrigin: "-3px -45px" }}
        animate={animar ? { scaleX: [1, 0.8, 1] } : undefined}
        transition={animar ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
      />
      {/* Barco atracado, balançando */}
      <motion.g
        animate={animar ? { rotate: [-3, 3, -3], y: [0, -2, 0] } : undefined}
        transition={animar ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <path d="M58 40h46l-8 12H66z" fill="var(--cor-madeira)" stroke="var(--cor-borda)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M80 39V6" stroke="var(--cor-madeira)" strokeWidth="2.5" />
        <path d="M82 8l18 28H82z" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="1.5" />
        <path d="M78 12L64 36h14z" fill="var(--cor-primaria)" />
      </motion.g>
      {/* Corda amarrando o barco no pier */}
      <path d="M70 22q6 10 0 20" fill="none" stroke="var(--cor-areia-sombra)" strokeWidth="2" />
    </g>
  );
}
