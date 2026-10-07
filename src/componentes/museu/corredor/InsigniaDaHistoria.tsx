"use client";

/*
 * A insígnia da história (as seis salas do museu concluídas): uma medalha
 * de latão presa no canto do retrato do aluno, na árvore da família. Dentro
 * dela, uma arvorezinha em relevo com um pontinho por antepassado e, no
 * alto, um pontinho mais claro: o aluno. As fitas têm as cores dos fios da
 * tecelã, a primeira da família. Discreta: só brilha uma vez ao chegar.
 */
import { motion, useReducedMotion } from "framer-motion";
import { ORDEM_DO_CORREDOR } from "@/motor/exposicao/antepassados";

/** As folhas da arvorezinha: um pontinho por antepassado, em volta da copa. */
const FOLHAS = ORDEM_DO_CORREDOR.slice(0, 7).map((_, i) => {
  const angulo = Math.PI + (Math.PI * (i + 0.5)) / 7;
  return { x: 20 + Math.cos(angulo) * 7.5, y: 19 + Math.sin(angulo) * 7.5 };
});

export function InsigniaDaHistoria({ revelar }: { revelar: boolean }) {
  const reduzir = useReducedMotion();
  const animar = revelar && !reduzir;
  return (
    <motion.div
      className="pointer-events-none absolute -bottom-1 -right-3 z-10 h-14 w-12"
      initial={animar ? { y: -60, scale: 0.3, rotate: -40, opacity: 0 } : false}
      animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 170, damping: 11, delay: animar ? 0.5 : 0 }}
      role="img"
      aria-label="Insígnia da história: você conhece a família inteira"
      data-insignia-museu
    >
      <svg viewBox="0 0 40 48" className="h-full w-full drop-shadow-[0_2px_0_var(--cor-sombra)]">
        <defs>
          <radialGradient id="latao-da-insignia" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="var(--cor-ante-latao-brilho)" />
            <stop offset="0.6" stopColor="var(--cor-ante-latao)" />
            <stop offset="1" stopColor="var(--cor-ante-latao-sombra)" />
          </radialGradient>
          <clipPath id="disco-da-insignia">
            <circle cx="20" cy="18" r="14" />
          </clipPath>
        </defs>
        {/* As fitas, nas cores dos fios da tecelã. */}
        <path d="M13 26 L9 46 L14 42 L18 46 L19 28 Z" fill="var(--cor-ante-fio-a)" stroke="var(--cor-ante-contorno)" strokeWidth="1" />
        <path d="M27 26 L31 46 L26 42 L22 46 L21 28 Z" fill="var(--cor-ante-fio-b)" stroke="var(--cor-ante-contorno)" strokeWidth="1" />
        {/* O disco de latão, com a borda serrilhada de medalha. */}
        <circle cx="20" cy="18" r="16" fill="var(--cor-ante-latao-sombra)" />
        <circle cx="20" cy="18" r="14" fill="url(#latao-da-insignia)" stroke="var(--cor-ante-latao-sombra)" strokeWidth="1.2" />
        <circle cx="20" cy="18" r="11.5" fill="none" stroke="var(--cor-ante-latao-sombra)" strokeWidth="0.6" strokeDasharray="1 1.4" />
        {/* A arvorezinha em relevo: tronco, galhos e uma folha por antepassado. */}
        <path d="M20 29 V20 M20 23 L15.5 19.5 M20 22 L24.5 18.5" stroke="var(--cor-ante-madeira-sombra)" strokeWidth="1.6" strokeLinecap="round" />
        {FOLHAS.map((folha, i) => (
          <circle key={i} cx={folha.x} cy={folha.y} r="1.6" fill="var(--cor-ante-madeira)" />
        ))}
        {/* O aluno: o pontinho mais alto e mais claro da árvore. */}
        <motion.circle
          cx="20"
          cy="9.5"
          r="2.1"
          fill="var(--cor-ante-valvula-brilho)"
          stroke="var(--cor-ante-latao-sombra)"
          strokeWidth="0.6"
          initial={animar ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          transition={{ delay: animar ? 1.3 : 0, type: "spring", stiffness: 300, damping: 10 }}
        />
        {/* O brilho que passa uma vez pela medalha. */}
        {animar && (
          <g clipPath="url(#disco-da-insignia)">
            <motion.rect x="-10" y="0" width="6" height="40" fill="var(--cor-ante-branco)" opacity="0.55" transform="rotate(25 20 18)" initial={{ x: -10 }} animate={{ x: 50 }} transition={{ delay: 1.1, duration: 0.9, ease: "easeInOut" }} />
          </g>
        )}
      </svg>
    </motion.div>
  );
}
