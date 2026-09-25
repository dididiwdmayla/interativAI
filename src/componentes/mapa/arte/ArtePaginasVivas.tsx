"use client";

import { motion } from "framer-motion";
import { ChaoIlha } from "./ChaoIlha";
import { useAnimarMapa } from "./useAnimarMapa";

function Faisca({ x, y, atraso }: { x: number; y: number; atraso: number }) {
  const animar = useAnimarMapa();
  return (
    <motion.path
      d={`M${x} ${y - 7}L${x + 2} ${y - 2}L${x + 7} ${y}L${x + 2} ${y + 2}L${x} ${y + 7}L${x - 2} ${y + 2}L${x - 7} ${y}L${x - 2} ${y - 2}Z`}
      fill="var(--cor-destaque)"
      animate={animar ? { opacity: [0.2, 1, 0.2], scale: [0.7, 1.1, 0.7] } : { opacity: 1 }}
      transition={animar ? { duration: 1.6, repeat: Infinity, delay: atraso } : undefined}
    />
  );
}

/** Páginas vivas: peças que se mexem, faíscas e botões. */
export function ArtePaginasVivas() {
  const animar = useAnimarMapa();
  const pular = (atraso: number) =>
    animar ? { animate: { y: [0, -12, 0] }, transition: { duration: 1.2, repeat: Infinity, delay: atraso } } : {};
  return (
    <g>
      <ChaoIlha />
      <motion.g {...pular(0)}>
        <rect x="-62" y="-40" width="26" height="26" rx="5" fill="var(--cor-primaria)" />
      </motion.g>
      <motion.g {...pular(0.3)}>
        <rect x="-26" y="-58" width="22" height="22" rx="11" fill="var(--cor-secundaria)" />
      </motion.g>
      <motion.g {...pular(0.6)}>
        <rect x="8" y="-44" width="24" height="24" rx="4" fill="var(--cor-sucesso)" />
      </motion.g>
      {/* Botão */}
      <rect x="20" y="-8" width="54" height="22" rx="11" fill="var(--cor-destaque)" stroke="var(--cor-madeira)" strokeWidth="2" />
      <rect x="32" y="1" width="30" height="4" rx="2" fill="var(--cor-texto-sobre-destaque)" opacity="0.7" />
      <Faisca x={-78} y={-58} atraso={0} />
      <Faisca x={48} y={-58} atraso={0.5} />
      <Faisca x={-6} y={-78} atraso={1} />
    </g>
  );
}
