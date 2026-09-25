"use client";

import { motion } from "framer-motion";
import { ChaoIlha } from "./ChaoIlha";
import { useAnimarMapa } from "./useAnimarMapa";

/** Caminho de uma engrenagem com `dentes` dentes, centro em (0, 0). */
function engrenagem(raio: number, dentes: number): string {
  const pontos: string[] = [];
  const passo = (Math.PI * 2) / dentes;
  for (let i = 0; i < dentes; i++) {
    const a = i * passo;
    const externo = raio + raio * 0.28;
    const angulos = [a - passo * 0.28, a - passo * 0.14, a + passo * 0.14, a + passo * 0.28];
    const raios = [raio, externo, externo, raio];
    angulos.forEach((angulo, j) => {
      pontos.push(`${(Math.cos(angulo) * raios[j]).toFixed(1)} ${(Math.sin(angulo) * raios[j]).toFixed(1)}`);
    });
  }
  return `M${pontos.join("L")}Z`;
}

type Props = { x: number; y: number; raio: number; dentes: number; cor: string; sentido: 1 | -1 };

function Engrenagem({ x, y, raio, dentes, cor, sentido }: Props) {
  const animar = useAnimarMapa();
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g
        animate={animar ? { rotate: 360 * sentido } : { rotate: 0 }}
        transition={animar ? { duration: 14, repeat: Infinity, ease: "linear" } : undefined}
      >
        <path d={engrenagem(raio, dentes)} fill={cor} stroke="var(--cor-texto)" strokeOpacity="0.25" strokeWidth="2" />
        <circle r={raio * 0.35} fill="var(--cor-superficie)" />
      </motion.g>
    </g>
  );
}

/** Lógica: engrenagens. */
export function ArteLogica() {
  return (
    <g>
      <ChaoIlha />
      <Engrenagem x={-26} y={-34} raio={28} dentes={10} cor="var(--cor-secundaria)" sentido={1} />
      <Engrenagem x={24} y={-14} raio={19} dentes={8} cor="var(--cor-destaque)" sentido={-1} />
      <Engrenagem x={52} y={-50} raio={13} dentes={7} cor="var(--cor-primaria)" sentido={1} />
    </g>
  );
}
