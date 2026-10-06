"use client";

/*
 * O gigante de válvulas: um armário largo de metal, com três fileiras de
 * válvulas de vidro. Cada palavra que ele fala acende a próxima válvula
 * (laranja, quente). Os olhos são dois mostradores redondos com ponteiro, a
 * boca é a grade do alto-falante, e o bigode é feito de cabos de ligar,
 * plugados de um lado ao outro do painel: era assim que se programava.
 */
import { motion } from "framer-motion";
import { Braco, CONTORNO, type PropsCorpo } from "./partes";

const COLUNAS = 9;
const FILEIRAS = 3;

function Valvula({ x, y, acesa, animar }: { x: number; y: number; acesa: boolean; animar: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {acesa && <circle cx="0" cy="-3" r="8" fill="var(--cor-ante-valvula-brilho)" opacity="0.4" />}
      <path d="M-4 4V-6a4 4 0 0 1 8 0V4z" fill="var(--cor-ante-valvula-vidro)" stroke="var(--cor-ante-contorno)" strokeWidth="1.2" />
      {acesa && <path d="M-4 4V-6a4 4 0 0 1 8 0V4z" fill="var(--cor-ante-valvula-brilho)" opacity="0.5" />}
      <motion.path
        d="M-1.8 2V-4M1.8 2V-4M-1.8 -4h3.6"
        stroke={acesa ? "var(--cor-ante-valvula-brilho)" : "var(--cor-ante-valvula-apagada)"}
        strokeWidth="1.4"
        strokeLinecap="round"
        animate={acesa && animar ? { opacity: [0.75, 1, 0.8] } : { opacity: 1 }}
        transition={acesa && animar ? { duration: 0.6, repeat: Infinity } : undefined}
      />
      <rect x="-5" y="4" width="10" height="4" rx="1" fill="var(--cor-ante-gabinete-sombra)" />
    </g>
  );
}

/** Um olho de mostrador: o ponteiro aponta para onde ele olha; fechado, vira um tracinho. */
function OlhoMostrador({ x, y, fechado, alegre, animar }: { x: number; y: number; fechado: boolean; alegre: boolean; animar: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="12" fill="var(--cor-ante-branco)" stroke="var(--cor-ante-contorno)" strokeWidth="2.4" />
      {[-60, -30, 0, 30, 60].map((graus) => (
        <path key={graus} d="M0 -10.5V-8.5" transform={`rotate(${graus})`} stroke="var(--cor-ante-gabinete)" strokeWidth="1.4" />
      ))}
      {fechado ? (
        <path d="M-6 0h12" stroke="var(--cor-ante-rosto)" strokeWidth="2.6" strokeLinecap="round" />
      ) : alegre ? (
        <path d="M-6 2q6-8 12 0" fill="none" stroke="var(--cor-ante-rosto)" strokeWidth="2.6" strokeLinecap="round" />
      ) : (
        <motion.g animate={animar ? { rotate: [-20, 15, -20] } : { rotate: -10 }} transition={animar ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : undefined}>
          <path d="M0 2V-8" stroke="var(--cor-ante-rosto)" strokeWidth="2.6" strokeLinecap="round" />
          <circle r="3.6" fill="var(--cor-ante-rosto)" />
        </motion.g>
      )}
    </g>
  );
}

export function Valvulas({ expressao, piscando, boca, falando, animar, passos }: PropsCorpo) {
  const total = COLUNAS * FILEIRAS;
  // Acordado e calado, umas válvulas ficam acesas; falando, cada palavra acende mais uma (dando a volta).
  const acesas = expressao === "dormindo" ? 0 : falando ? Math.min(total, passos % (total + 1)) : 7;
  const aberta = boca ? { a: 9, e: 5, o: 7, m: 2 }[boca] : expressao === "orgulhoso" ? 6 : 2.5;
  return (
    <g>
      {/* Os braços grandes, de cabo grosso */}
      <Braco de={{ x: 12, y: 104 }} cotovelo={{ x: -6, y: 120 }} mao={{ x: 2, y: 140 }} cor="var(--cor-ante-gabinete)" />
      <Braco de={{ x: 148, y: 104 }} cotovelo={{ x: 170, y: 96 }} mao={{ x: 164, y: 74 }} cor="var(--cor-ante-gabinete)" acenando={expressao !== "dormindo"} animar={animar} />
      {/* O armário largo, com os pés e a sombra */}
      <rect x="8" y="34" width="144" height="122" rx="10" fill="var(--cor-ante-gabinete)" {...CONTORNO} />
      <rect x="8" y="148" width="144" height="10" rx="4" fill="var(--cor-ante-gabinete-sombra)" />
      <rect x="18" y="156" width="14" height="7" rx="2" fill="var(--cor-ante-gabinete-sombra)" {...CONTORNO} strokeWidth={1.4} />
      <rect x="128" y="156" width="14" height="7" rx="2" fill="var(--cor-ante-gabinete-sombra)" {...CONTORNO} strokeWidth={1.4} />
      {/* O painel do rosto, em cima */}
      <rect x="20" y="42" width="120" height="48" rx="8" fill="var(--cor-ante-gabinete-sombra)" />
      {/* As sobrancelhas grossas: sobem curiosas e descem quando ele se orgulha */}
      <path d={expressao === "curioso" ? "M40 40l26-4M94 36l26 4" : "M40 44l26 1M94 45l26-1"} stroke="var(--cor-ante-contorno)" strokeWidth="5" strokeLinecap="round" />
      <OlhoMostrador x={56} y={60} fechado={piscando || expressao === "dormindo"} alegre={expressao === "orgulhoso"} animar={animar} />
      <OlhoMostrador x={104} y={60} fechado={piscando || expressao === "dormindo"} alegre={expressao === "orgulhoso"} animar={animar} />
      {/* O bigode de cabos, plugado dos dois lados */}
      <path d="M44 78C56 70 72 80 80 74C88 80 104 70 116 78" fill="none" stroke="var(--cor-ante-cabo-a)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="44" cy="78" r="3" fill="var(--cor-ante-contorno)" />
      <circle cx="116" cy="78" r="3" fill="var(--cor-ante-contorno)" />
      {/* A boca: a grade do alto-falante, que abre falando */}
      <rect x="68" y={84 - aberta / 2} width="24" height={aberta + 2} rx="2" fill="var(--cor-ante-contorno)" />
      {/* As válvulas: cada palavra acende uma */}
      {Array.from({ length: total }, (_, i) => (
        <Valvula key={i} x={26 + (i % COLUNAS) * 13.5} y={104 + Math.floor(i / COLUNAS) * 16} acesa={i < acesas} animar={animar} />
      ))}
      {/* O quadro de tomadas com cabos pendurados (a programação de então) */}
      <g>
        {[30, 44, 116, 130].map((x) => (
          <circle key={x} cx={x} cy="40" r="2.4" fill="var(--cor-ante-contorno)" />
        ))}
        <path d="M30 40C24 14 54 12 44 40" fill="none" stroke="var(--cor-ante-cabo-b)" strokeWidth="3" strokeLinecap="round" />
        <path d="M116 40C112 10 140 14 130 40" fill="none" stroke="var(--cor-ante-cabo-c)" strokeWidth="3" strokeLinecap="round" />
      </g>
    </g>
  );
}
