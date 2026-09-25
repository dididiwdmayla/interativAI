"use client";

import { motion } from "framer-motion";
import { useAnimarMapa } from "./useAnimarMapa";

/** Brilho suave atrás de uma ilha disponível. Centro em (0, 0). */
export function BrilhoIlha() {
  const animar = useAnimarMapa();
  return (
    <motion.ellipse
      cx="0"
      cy="10"
      rx="132"
      ry="84"
      fill="var(--cor-destaque)"
      animate={animar ? { opacity: [0.18, 0.4, 0.18] } : { opacity: 0.3 }}
      transition={animar ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" } : undefined}
    />
  );
}

/** Computadorzinho de brinquedo, dormindo (em SVG, para morar dentro do mapa). */
export function ComputadorzinhoDormindo({ x, y, escala = 1 }: { x: number; y: number; escala?: number }) {
  const animar = useAnimarMapa();
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <rect x="-9" y="10" width="18" height="4" rx="2" fill="var(--cor-mascote-base)" />
      <rect x="-16" y="-12" width="32" height="24" rx="8" fill="var(--cor-mascote-moldura)" />
      <rect x="-12" y="-8" width="24" height="16" rx="5" fill="var(--cor-mascote-tela)" />
      <path d="M-8-1q2.5 2 5 0M3-1q2.5 2 5 0M-2 4h4" fill="none" stroke="var(--cor-mascote-rosto)" strokeWidth="1.6" strokeLinecap="round" />
      <motion.g
        animate={animar ? { opacity: [0, 1, 0], y: [4, -4, -8] } : { opacity: 1 }}
        transition={animar ? { duration: 2.4, repeat: Infinity } : undefined}
      >
        <text x="16" y="-14" fontSize="10" fontWeight="900" fill="var(--cor-texto-suave)">
          z
        </text>
      </motion.g>
    </g>
  );
}

/** Andaimes por cima da ilha e o computadorzinho dormindo: em construção. */
export function AndaimesIlha() {
  const traco = { stroke: "var(--cor-madeira)", strokeWidth: 4, strokeLinecap: "round" as const };
  return (
    <g>
      <g opacity="0.95">
        <line x1="-70" y1="30" x2="-70" y2="-70" {...traco} />
        <line x1="-20" y1="30" x2="-20" y2="-70" {...traco} />
        <line x1="30" y1="30" x2="30" y2="-70" {...traco} />
        <line x1="-78" y1="-66" x2="38" y2="-66" {...traco} />
        <line x1="-78" y1="-20" x2="38" y2="-20" {...traco} />
        <line x1="-70" y1="-66" x2="-20" y2="-20" {...traco} strokeWidth={2.5} />
        <line x1="-20" y1="-66" x2="30" y2="-20" {...traco} strokeWidth={2.5} />
      </g>
      <ComputadorzinhoDormindo x={66} y={10} escala={1.2} />
    </g>
  );
}

/** Cadeado em SVG (corpo e alça). */
export function CadeadoMapa({ x, y, tamanho = 1 }: { x: number; y: number; tamanho?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${tamanho})`}>
      <path d="M-9-6v-7a9 9 0 0 1 18 0v7" fill="none" stroke="var(--cor-texto)" strokeWidth="4" />
      <rect x="-14" y="-7" width="28" height="22" rx="5" fill="var(--cor-destaque)" stroke="var(--cor-texto)" strokeWidth="2.5" />
      <circle cx="0" cy="2" r="3" fill="var(--cor-texto)" />
      <rect x="-1.2" y="3" width="2.4" height="6" rx="1" fill="var(--cor-texto)" />
    </g>
  );
}

/** Névoa por cima da ilha bloqueada, com o cadeado. */
export function NevoaIlha() {
  const animar = useAnimarMapa();
  return (
    <g>
      <motion.g
        animate={animar ? { x: [-6, 6, -6] } : { x: 0 }}
        transition={animar ? { duration: 7, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <ellipse cx="-40" cy="-10" rx="70" ry="42" fill="var(--cor-nevoa)" opacity="0.85" />
        <ellipse cx="40" cy="-24" rx="66" ry="40" fill="var(--cor-nevoa)" opacity="0.8" />
        <ellipse cx="0" cy="22" rx="104" ry="36" fill="var(--cor-nevoa)" opacity="0.85" />
      </motion.g>
      <CadeadoMapa x={0} y={-8} tamanho={1.4} />
    </g>
  );
}
