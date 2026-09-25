"use client";

import { motion } from "framer-motion";
import { ChaoIlha } from "./ChaoIlha";
import { useAnimarMapa } from "./useAnimarMapa";

/** Os nós da constelação (a "rede" de um modelo), em cima da ilha. */
const NOS = [
  { x: -78, y: -18 },
  { x: -58, y: -62 },
  { x: -30, y: -30 },
  { x: -18, y: -86 },
  { x: 8, y: -54 },
  { x: 14, y: -8 },
] as const;

/** Quem liga com quem (índices de NOS). */
const LIGACOES: readonly (readonly [number, number])[] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [2, 5],
  [4, 5],
];

/** Topo do farol, de onde sai o sinal. */
const LUZ = { x: 53, y: -58 };

/** IA: nós ligados como uma constelação e um farolzinho mandando sinal. */
export function ArteIA() {
  const animar = useAnimarMapa();
  const arco = (raio: number, lado: 1 | -1, atraso: number) => (
    <motion.path
      key={`${lado}-${raio}`}
      d={`M${lado * raio * 0.5} ${-raio * 0.866}A${raio} ${raio} 0 0 ${lado === 1 ? 1 : 0} ${lado * raio * 0.5} ${raio * 0.866}`}
      fill="none"
      stroke="var(--cor-destaque)"
      strokeWidth="3"
      strokeLinecap="round"
      animate={animar ? { opacity: [0, 1, 0] } : { opacity: 0.8 }}
      transition={animar ? { duration: 2, repeat: Infinity, delay: atraso } : undefined}
    />
  );
  return (
    <g>
      <ChaoIlha />
      {/* O sinal do farol chega na constelação */}
      <path
        d={`M${LUZ.x - 6} ${LUZ.y}L${NOS[4].x} ${NOS[4].y}`}
        stroke="var(--cor-destaque)"
        strokeWidth="2"
        strokeDasharray="2 6"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Constelação */}
      {LIGACOES.map(([a, b]) => (
        <path
          key={`${a}-${b}`}
          d={`M${NOS[a].x} ${NOS[a].y}L${NOS[b].x} ${NOS[b].y}`}
          stroke="var(--cor-secundaria)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.75"
        />
      ))}
      {NOS.map((no, indice) => (
        <g key={indice} transform={`translate(${no.x} ${no.y})`}>
          <motion.circle
            r={indice === 3 ? 8 : 6}
            fill={indice % 2 === 0 ? "var(--cor-secundaria)" : "var(--cor-primaria)"}
            stroke="var(--cor-superficie)"
            strokeWidth="2"
            animate={animar ? { scale: [1, 1.25, 1] } : undefined}
            transition={animar ? { duration: 2.4, repeat: Infinity, delay: indice * 0.35 } : undefined}
          />
        </g>
      ))}
      {/* Farolzinho */}
      <path d="M40 12L46-52H60L66 12Z" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M41.5-4L42.6-16H63.4L64.5-4Z" fill="var(--cor-primaria)" />
      <path d="M43.8-28L44.9-40H61.1L62.2-28Z" fill="var(--cor-primaria)" />
      <rect x="49" y="-2" width="8" height="14" rx="3" fill="var(--cor-madeira)" />
      <rect x="43" y="-54" width="20" height="4" rx="2" fill="var(--cor-texto-suave)" />
      <rect x="46" y="-65" width="14" height="11" rx="3" fill="var(--cor-destaque)" stroke="var(--cor-borda)" strokeWidth="1.5" />
      <path d="M43-65L53-75 63-65Z" fill="var(--cor-primaria)" stroke="var(--cor-borda)" strokeWidth="1.5" strokeLinejoin="round" />
      <g transform={`translate(${LUZ.x} ${LUZ.y})`}>
        {[14, 24].map((raio, indice) => arco(raio, 1, indice * 0.4))}
        {[14, 24].map((raio, indice) => arco(raio, -1, indice * 0.4 + 0.2))}
      </g>
    </g>
  );
}
