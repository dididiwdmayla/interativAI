"use client";

import { motion } from "framer-motion";
import { ChaoIlha } from "./ChaoIlha";
import { useAnimarMapa } from "./useAnimarMapa";

/** Um bloco de montar com pininhos em cima. */
function Bloco({ x, y, largura, cor }: { x: number; y: number; largura: number; cor: string }) {
  const pinos = Math.max(2, Math.round(largura / 14));
  return (
    <g>
      {Array.from({ length: pinos }, (_, indice) => (
        <rect key={indice} x={x + 4 + (indice * (largura - 8)) / pinos} y={y - 5} width={(largura - 8) / pinos - 3} height="6" rx="2" fill={cor} />
      ))}
      <rect x={x} y={y} width={largura} height="16" rx="3" fill={cor} stroke="var(--cor-texto)" strokeOpacity="0.2" strokeWidth="1.5" />
    </g>
  );
}

/** Frameworks: blocos montados, e o de cima descendo e encaixando de novo (montar é juntar peças prontas). */
export function ArteFrameworks() {
  const animar = useAnimarMapa();
  return (
    <g>
      <ChaoIlha />
      <Bloco x={-52} y={-4} largura={56} cor="var(--cor-secundaria)" />
      <Bloco x={6} y={-4} largura={42} cor="var(--cor-primaria)" />
      <Bloco x={-36} y={-25} largura={56} cor="var(--cor-destaque)" />
      <Bloco x={-14} y={-46} largura={42} cor="var(--cor-sucesso)" />
      <motion.g
        initial={false}
        animate={animar ? { y: [-30, 0, -4, 0, 0, -30], opacity: [0, 1, 1, 1, 1, 0] } : { y: 0, opacity: 1 }}
        transition={animar ? { duration: 5, repeat: Infinity, times: [0, 0.18, 0.24, 0.3, 0.86, 1], ease: "easeOut" } : undefined}
      >
        <Bloco x={-4} y={-67} largura={28} cor="var(--cor-alerta)" />
      </motion.g>
    </g>
  );
}
