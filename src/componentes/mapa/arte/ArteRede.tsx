"use client";

import { motion } from "framer-motion";
import { ChaoIlha } from "./ChaoIlha";
import { useAnimarMapa } from "./useAnimarMapa";

/** Os cabos submarinos (Bézier de 4 pontos), do chão da ilha até sumirem na água. */
const CABOS = [
  [{ x: -70, y: 40 }, { x: -100, y: 60 }, { x: -130, y: 50 }, { x: -150, y: 70 }],
  [{ x: 70, y: 44 }, { x: 100, y: 66 }, { x: 128, y: 58 }, { x: 150, y: 78 }],
] as const;

/** Pontos ao longo de um cabo (para o pulso de luz andar por ele). */
function pontosDoCabo([p1, c1, c2, p2]: (typeof CABOS)[number], quantos = 7): { x: number[]; y: number[] } {
  const x: number[] = [];
  const y: number[] = [];
  for (let i = 0; i < quantos; i++) {
    const t = i / (quantos - 1);
    const u = 1 - t;
    x.push(u * u * u * p1.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p2.x);
    y.push(u * u * u * p1.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p2.y);
  }
  return { x, y };
}

/** Um pulso de luz correndo pelo cabo, da ilha para o mar (o pacote saindo para o mundo). */
function Pulso({ cabo, atraso }: { cabo: (typeof CABOS)[number]; atraso: number }) {
  const animar = useAnimarMapa();
  if (!animar) return null;
  const { x, y } = pontosDoCabo(cabo);
  return (
    <motion.circle
      r="3.4"
      fill="var(--cor-destaque)"
      initial={false}
      animate={{ cx: x, cy: y, opacity: [0, 1, 1, 1, 1, 1, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.2, ease: "linear", delay: atraso }}
    />
  );
}

/** Rede e Servidor: antenas com sinal e cabos que descem pro mar, com pulsos de luz correndo por eles. */
export function ArteRede() {
  const animar = useAnimarMapa();
  const onda = (raio: number, atraso: number) => (
    <motion.path
      key={raio}
      d={`M${-raio} ${-raio * 0.2}A${raio} ${raio} 0 0 1 ${raio} ${-raio * 0.2}`}
      fill="none"
      stroke="var(--cor-secundaria)"
      strokeWidth="3"
      strokeLinecap="round"
      animate={animar ? { opacity: [0, 1, 0] } : { opacity: 0.8 }}
      transition={animar ? { duration: 1.8, repeat: Infinity, delay: atraso } : undefined}
    />
  );
  return (
    <g>
      {/* Cabos submarinos, antes do chão: saem da ilha e somem na água */}
      <path d="M-70 40C-100 60-130 50-150 70" fill="none" stroke="var(--cor-madeira)" strokeWidth="4" strokeLinecap="round" />
      <path d="M70 44C100 66 128 58 150 78" fill="none" stroke="var(--cor-madeira)" strokeWidth="4" strokeLinecap="round" />
      <Pulso cabo={CABOS[0]} atraso={0} />
      <Pulso cabo={CABOS[1]} atraso={1.4} />
      <ChaoIlha />
      {/* Antena grande */}
      <g transform="translate(-20 0)">
        <path d="M0-78L-18 10M0-78L18 10M-12-18H12M-7-44H7" stroke="var(--cor-texto-suave)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="0" cy="-80" r="5" fill="var(--cor-primaria)" />
        <g transform="translate(0 -80)">{[14, 24, 34].map((raio, indice) => onda(raio, indice * 0.3))}</g>
      </g>
      {/* Antena pequena */}
      <g transform="translate(46 -2)">
        <path d="M0-40L-10 10M0-40L10 10M-6-12H6" stroke="var(--cor-texto-suave)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="0" cy="-42" r="4" fill="var(--cor-destaque)" />
      </g>
      {/* Servidor */}
      <rect x="-80" y="-22" width="30" height="36" rx="4" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="2" />
      {[-14, -4, 6].map((y) => (
        <g key={y}>
          <rect x="-75" y={y} width="20" height="5" rx="2" fill="var(--cor-pedra-sombra)" />
          <circle cx="-58" cy={y + 2.5} r="1.8" fill="var(--cor-sucesso)" />
        </g>
      ))}
    </g>
  );
}
