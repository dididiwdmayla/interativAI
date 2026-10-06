"use client";

/*
 * A internet discada: a cabeça é um globo com os meridianos e os
 * continentes, de bochechas coradas e boca grande (tagarela); o corpo é o
 * modem dos anos 1990, com as luzinhas piscando, e o fio de telefone em
 * espiral que vai até a tomada. Falando, saem ondinhas de chiado.
 */
import { motion } from "framer-motion";
import { Boca, Bochechas, Braco, CONTORNO, Olhos, type PropsCorpo } from "./partes";

export function Internet({ expressao, piscando, boca, falando, animar }: PropsCorpo) {
  return (
    <g style={{ ["--palpebra" as string]: "var(--cor-ante-globo)" }}>
      {/* O fio de telefone em espiral, até a tomada */}
      <path
        d="M40 146c-6 0-6-8 0-8s6 8 0 8c-6 0-6-8 0-8M32 142c-6 0-6-8 0-8s6 8 0 8M24 146c-6 0-6-8 0-8"
        fill="none"
        stroke="var(--cor-ante-modem)"
        strokeWidth="2"
      />
      <rect x="8" y="150" width="14" height="12" rx="2" fill="var(--cor-ante-branco)" {...CONTORNO} strokeWidth={1.4} />
      {/* O modem: a caixa com as luzinhas */}
      <rect x="40" y="116" width="96" height="34" rx="6" fill="var(--cor-ante-modem)" {...CONTORNO} />
      <rect x="40" y="144" width="96" height="6" rx="2" fill="var(--cor-ante-contorno)" opacity="0.4" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.circle
          key={i}
          cx={54 + i * 12}
          cy="131"
          r="2.6"
          fill="var(--cor-ante-led)"
          animate={animar ? { opacity: falando ? [1, 0.15, 1] : [1, 0.5, 1] } : { opacity: 1 }}
          transition={animar ? { duration: falando ? 0.18 + i * 0.05 : 1.8 + i * 0.3, repeat: Infinity } : undefined}
        />
      ))}
      {/* Os braços: tagarela gesticula com os dois */}
      <Braco de={{ x: 42, y: 124 }} cotovelo={{ x: 22, y: 116 }} mao={{ x: 26, y: 96 }} cor="var(--cor-ante-modem)" acenando={falando} animar={animar} />
      <Braco de={{ x: 134, y: 124 }} cotovelo={{ x: 154, y: 116 }} mao={{ x: 150, y: 98 }} cor="var(--cor-ante-modem)" acenando={expressao !== "dormindo"} animar={animar} />
      {/* O pescoço */}
      <rect x="80" y="104" width="16" height="14" rx="3" fill="var(--cor-ante-modem)" />
      {/* O globo: oceano, continentes e meridianos */}
      <circle cx="88" cy="62" r="44" fill="var(--cor-ante-globo)" {...CONTORNO} />
      <path d="M60 36c8-6 18-4 22 2s-2 10-10 10-14 4-16 0 0-8 4-12zM98 28c10 0 20 6 22 14s-6 6-12 4-14-4-14-10 0-8 4-8zM108 82c8-2 14 4 10 10s-12 8-16 2 0-10 6-12z" fill="var(--cor-ante-globo-terra)" />
      <g fill="none" stroke="var(--cor-ante-branco)" strokeOpacity="0.45" strokeWidth="1.3">
        <ellipse cx="88" cy="62" rx="20" ry="44" />
        <path d="M44 62h88M50 40h76M50 84h76" />
      </g>
      {/* O rosto: tagarela, de bochechas coradas */}
      <Olhos x1={74} x2={102} y={58} raio={5.5} cor="var(--cor-ante-rosto)" expressao={expressao} piscando={piscando} />
      <Bochechas x1={66} x2={110} y={72} raio={6} />
      <Boca x={88} y={78} largura={18} cor="var(--cor-ante-rosto)" expressao={expressao === "feliz" ? "orgulhoso" : expressao} forma={boca} />
      {/* As ondinhas de chiado quando ela fala */}
      {falando &&
        [14, 24, 34].map((raio, i) => (
          <motion.path
            key={raio}
            d={`M${138} ${62 - raio * 0.6}a${raio} ${raio} 0 0 1 0 ${raio * 1.2}`}
            fill="none"
            stroke="var(--cor-ante-led)"
            strokeWidth="2.4"
            strokeLinecap="round"
            animate={animar ? { opacity: [0, 1, 0] } : { opacity: 0.8 }}
            transition={animar ? { duration: 0.9, repeat: Infinity, delay: i * 0.18 } : undefined}
          />
        ))}
    </g>
  );
}
