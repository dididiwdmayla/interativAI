"use client";

import { motion } from "framer-motion";
import { MoldeDemo } from "./MoldeDemo";

const CICLO = { duration: 2.4, repeat: Infinity, ease: "easeInOut" } as const;
const PULSO = { opacity: [0.25, 1, 0.25] };

/** Árvore, código e tela acendem a mesma peça ao mesmo tempo. */
export function DemoSincronia() {
  return (
    <MoldeDemo rotulo="Animação: árvore, código e tela acendem a mesma peça juntos">
      {[
        { x: 8, titulo: "árvore" },
        { x: 58, titulo: "código" },
        { x: 108, titulo: "tela" },
      ].map(({ x, titulo }) => (
        <g key={titulo}>
          <rect x={x} y="12" width="44" height="56" rx="6" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="1.5" />
          {[20, 32, 44, 56].map((y) => (
            <rect key={y} x={x + 6} y={y} width="32" height="6" rx="3" fill="var(--cor-texto-suave)" opacity="0.3" />
          ))}
          <motion.rect x={x + 3} y="29" width="38" height="12" rx="4" fill="var(--cor-realce-inspecao)" animate={PULSO} transition={CICLO} />
          <text x={x + 22} y="82" fontSize="9" fontWeight="800" textAnchor="middle" fill="var(--cor-texto-suave)">
            {titulo}
          </text>
        </g>
      ))}
    </MoldeDemo>
  );
}
