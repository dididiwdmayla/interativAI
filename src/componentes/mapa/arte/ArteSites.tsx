"use client";

import { motion, type Transition } from "framer-motion";
import { ChaoIlha } from "./ChaoIlha";
import { useAnimarMapa } from "./useAnimarMapa";

/** O ciclo do guindaste: desce o bloco, solta na pilha, sobe vazio e volta com outro. */
const CICLO: Transition = { duration: 6, repeat: Infinity, ease: "easeInOut", times: [0, 0.38, 0.55, 0.88, 1] };

/** O guindaste montando a página, bloco por bloco: a lança, o cabo e o bloco pendurado. */
function Guindaste() {
  const animar = useAnimarMapa();
  // Em cima da pilha (o bloco laranja termina em -36): o bloco novo encosta em -50.
  const alturas = [-68, -50, -50, -68, -68];
  return (
    <g data-guindaste>
      {/* A torre treliçada e a lança */}
      <path d="M30 10V-78M38 10V-78M30-68l8 12M38-56l-8 12M30-44l8 12M38-32l-8 12M30-20l8 12" stroke="var(--cor-alerta)" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M-14-79H58" stroke="var(--cor-alerta)" strokeWidth="4" strokeLinecap="round" />
      <rect x="50" y="-83" width="12" height="9" rx="2" fill="var(--cor-pedra-sombra)" />
      <rect x="-3" y="-82" width="8" height="5" rx="1.5" fill="var(--cor-texto-suave)" />
      {animar ? (
        <>
          <motion.line x1="1" y1="-77" x2="1" stroke="var(--cor-texto-suave)" strokeWidth="1.4" initial={false} animate={{ y2: alturas }} transition={CICLO} />
          {/* O bloco no gancho: some quando encosta na pilha (e o da pilha aparece) e volta lá em cima. */}
          <motion.g initial={false} animate={{ y: alturas.map((y) => y + 68), opacity: [1, 1, 0, 0, 1] }} transition={CICLO}>
            <rect x="-7" y="-68" width="16" height="14" rx="2" fill="var(--cor-secundaria)" stroke="var(--cor-mascote-base)" strokeWidth="1.2" />
          </motion.g>
          <motion.g initial={false} animate={{ opacity: [0, 0, 1, 1, 0] }} transition={CICLO}>
            <rect x="-7" y="-50" width="16" height="14" rx="2" fill="var(--cor-secundaria)" stroke="var(--cor-mascote-base)" strokeWidth="1.2" />
          </motion.g>
        </>
      ) : (
        <>
          <line x1="1" y1="-77" x2="1" y2="-66" stroke="var(--cor-texto-suave)" strokeWidth="1.4" />
          <rect x="-7" y="-66" width="16" height="14" rx="2" fill="var(--cor-secundaria)" stroke="var(--cor-mascote-base)" strokeWidth="1.2" />
        </>
      )}
    </g>
  );
}

/** Sites: prédios em forma de < e >, blocos empilhados e o guindaste montando a página. */
export function ArteSites() {
  const janelas = (x: number, y: number) =>
    [0, 12].map((dy) => <rect key={dy} x={x} y={y + dy} width="7" height="6" rx="1.5" fill="var(--cor-superficie)" opacity="0.8" />);
  return (
    <g>
      <ChaoIlha />
      <Guindaste />
      {/* Prédio "<" */}
      <path
        d="M-44-74L-92-32-44 10-26 10-68-32-26-74Z"
        fill="var(--cor-primaria)"
        stroke="var(--cor-mascote-moldura-sombra)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {janelas(-78, -38)}
      {/* Prédio ">" */}
      <path
        d="M44-74L92-32 44 10 26 10 68-32 26-74Z"
        fill="var(--cor-secundaria)"
        stroke="var(--cor-mascote-base)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {janelas(71, -38)}
      {/* Blocos empilhados no meio, como peças de uma página */}
      <rect x="-16" y="-6" width="32" height="16" rx="3" fill="var(--cor-destaque)" stroke="var(--cor-madeira)" strokeWidth="1.5" />
      <rect x="-11" y="-22" width="22" height="16" rx="3" fill="var(--cor-sucesso)" />
      <rect x="-7" y="-36" width="14" height="14" rx="2" fill="var(--cor-alerta)" />
    </g>
  );
}
