"use client";

/*
 * O terminal verde: um monitor de tubo com tela preta e o rosto desenhado
 * em fósforo verde, de blocos, como as letras dele. Rabugento: as
 * sobrancelhas sempre caídas para dentro e os olhos meio fechados. Embaixo
 * do rosto, o cursor piscando. O teclado vem junto, encaixado na base.
 */
import { motion } from "framer-motion";
import { Boca, CONTORNO, type PropsCorpo } from "./partes";

const FOSFORO = "var(--cor-ante-terminal-fosforo)";

export function Terminal({ expressao, piscando, boca, animar }: PropsCorpo) {
  const fechado = piscando || expressao === "dormindo";
  // Olhos de bloco, meio fechados (rabugento); orgulhoso, só um tiquinho mais abertos.
  const alturaOlho = fechado ? 1.6 : expressao === "orgulhoso" ? 7 : expressao === "curioso" ? 8 : 5;
  return (
    <g>
      {/* A caixa do monitor, funda, e o pé */}
      <path d="M26 30h108a8 8 0 0 1 8 8v74a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8V38a8 8 0 0 1 8-8z" fill="var(--cor-ante-terminal-casca)" {...CONTORNO} />
      <path d="M40 120h80l6 12H34z" fill="var(--cor-ante-terminal-casca-sombra)" {...CONTORNO} />
      {/* A tela de tubo, com as linhas de varredura */}
      <rect x="30" y="40" width="100" height="70" rx="12" fill="var(--cor-ante-terminal-tela)" stroke="var(--cor-ante-terminal-casca-sombra)" strokeWidth="3" />
      {Array.from({ length: 11 }, (_, i) => (
        <path key={i} d={`M34 ${46 + i * 6}h92`} stroke={FOSFORO} strokeOpacity="0.07" strokeWidth="1" />
      ))}
      {/* O rosto em fósforo: sobrancelhas de rabugento, olhos de bloco e a boca reta */}
      <path d="M48 56l14 4M112 56l-14 4" stroke={FOSFORO} strokeWidth="3" strokeLinecap="square" />
      <rect x="51" y={66 - alturaOlho / 2} width="10" height={alturaOlho} fill={FOSFORO} />
      <rect x="99" y={66 - alturaOlho / 2} width="10" height={alturaOlho} fill={FOSFORO} />
      <Boca x={80} y={85} largura={22} cor={FOSFORO} expressao={expressao === "feliz" ? "dormindo" : expressao} forma={boca} reta />
      {/* O cursor piscando, embaixo do rosto */}
      <motion.rect
        x="74"
        y="96"
        width="7"
        height="9"
        fill={FOSFORO}
        animate={animar ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
        transition={animar ? { duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] } : undefined}
      />
      {/* O teclado, com as fileiras de teclas */}
      <path d="M16 138h128l8 22H8z" fill="var(--cor-ante-terminal-casca)" {...CONTORNO} />
      {[0, 1, 2].map((fileira) =>
        Array.from({ length: 12 - fileira }, (_, i) => (
          <rect key={`${fileira}-${i}`} x={22 + fileira * 4 + i * 10} y={142 + fileira * 5.5} width="8" height="4" rx="1" fill="var(--cor-ante-terminal-casca-sombra)" />
        )),
      )}
      {/* Os braços cruzados por cima do teclado: rabugento */}
      <path d="M22 126C40 150 96 150 116 134" fill="none" stroke="var(--cor-ante-contorno)" strokeWidth="9" strokeLinecap="round" />
      <path d="M22 126C40 150 96 150 116 134" fill="none" stroke="var(--cor-ante-terminal-casca-sombra)" strokeWidth="6" strokeLinecap="round" />
      <path d="M138 126C120 150 64 150 44 134" fill="none" stroke="var(--cor-ante-contorno)" strokeWidth="9" strokeLinecap="round" />
      <path d="M138 126C120 150 64 150 44 134" fill="none" stroke="var(--cor-ante-terminal-casca)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="116" cy="134" r="5" fill="var(--cor-ante-terminal-casca-sombra)" stroke="var(--cor-ante-contorno)" strokeWidth="1.8" />
      <circle cx="44" cy="134" r="5" fill="var(--cor-ante-terminal-casca)" stroke="var(--cor-ante-contorno)" strokeWidth="1.8" />
      {/* A luzinha de ligado */}
      <circle cx="124" cy="114" r="2.2" fill={FOSFORO} />
    </g>
  );
}
