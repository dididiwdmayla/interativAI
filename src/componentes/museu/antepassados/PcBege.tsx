"use client";

/*
 * O computador bege: monitor quadradão em cima do gabinete, com a tela azul
 * onde mora o rosto (olhos quadrados e boca grande, sempre animado). No
 * gabinete, a gaveta do disquete com um disquete metade para fora e a
 * luzinha que pisca lendo; do lado, a pilha de disquetes que ele não larga.
 * Falando, ele quica.
 */
import { motion } from "framer-motion";
import { Boca, Braco, CONTORNO, Olhos, type PropsCorpo } from "./partes";

function Disquete({ x, y, rotacao = 0 }: { x: number; y: number; rotacao?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotacao})`}>
      <rect width="20" height="20" rx="1.5" fill="var(--cor-ante-disquete)" {...CONTORNO} strokeWidth={1.2} />
      <rect x="5" y="1" width="10" height="6" fill="var(--cor-ante-gabinete)" />
      <rect x="3" y="10" width="14" height="9" rx="1" fill="var(--cor-ante-disquete-etiqueta)" />
    </g>
  );
}

export function PcBege({ expressao, piscando, boca, falando, animar }: PropsCorpo) {
  const tela = "var(--cor-ante-pc-texto)";
  return (
    <motion.g
      animate={animar && falando ? { y: [0, -3, 0] } : { y: 0 }}
      transition={animar && falando ? { duration: 0.34, repeat: Infinity } : { duration: 0.2 }}
      style={{ ["--palpebra" as string]: "var(--cor-ante-pc-tela)" }}
    >
      {/* O gabinete, com a gaveta do disquete e a luz de leitura */}
      <rect x="18" y="112" width="124" height="36" rx="4" fill="var(--cor-ante-bege)" {...CONTORNO} />
      <rect x="18" y="142" width="124" height="6" rx="2" fill="var(--cor-ante-bege-sombra)" />
      <rect x="84" y="122" width="46" height="7" rx="1.5" fill="var(--cor-ante-bege-sombra)" {...CONTORNO} strokeWidth={1.2} />
      <rect x="96" y="118" width="22" height="6" fill="var(--cor-ante-disquete)" />
      <motion.circle
        cx="30"
        cy="128"
        r="2.6"
        fill="var(--cor-ante-led)"
        animate={animar && falando ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
        transition={animar && falando ? { duration: 0.25, repeat: Infinity } : undefined}
      />
      <path d="M40 134h30" stroke="var(--cor-ante-bege-sombra)" strokeWidth="2" strokeLinecap="round" />
      {/* O monitor quadradão, com a tela azul */}
      <rect x="30" y="20" width="100" height="88" rx="8" fill="var(--cor-ante-bege)" {...CONTORNO} />
      <rect x="40" y="29" width="80" height="62" rx="5" fill="var(--cor-ante-pc-tela)" stroke="var(--cor-ante-bege-sombra)" strokeWidth="3" />
      <rect x="70" y="106" width="20" height="8" fill="var(--cor-ante-bege-sombra)" />
      <path d="M44 98h18M110 98a2 2 0 1 0 0.1 0" stroke="var(--cor-ante-bege-sombra)" strokeWidth="2.4" strokeLinecap="round" />
      {/* O rosto na tela azul: olhos quadrados e a boca grande */}
      <Olhos x1={66} x2={94} y={52} raio={5.2} cor={tela} expressao={expressao} piscando={piscando} quadrados brilho={null} />
      <Boca x={80} y={74} largura={18} cor={tela} dentro="var(--cor-ante-disquete)" expressao={expressao === "feliz" ? "orgulhoso" : expressao} forma={boca} />
      {/* Os bracinhos: um acenando, o outro mostrando um disquete */}
      <Braco de={{ x: 32, y: 66 }} cotovelo={{ x: 14, y: 60 }} mao={{ x: 12, y: 40 }} cor="var(--cor-ante-bege)" acenando={expressao !== "dormindo"} animar={animar} />
      <Braco de={{ x: 128, y: 70 }} cotovelo={{ x: 146, y: 80 }} mao={{ x: 142, y: 96 }} cor="var(--cor-ante-bege)" />
      <Disquete x={136} y={88} rotacao={-14} />
      {/* A pilha de disquetes */}
      <Disquete x={132} y={126} rotacao={-6} />
    </motion.g>
  );
}
