"use client";

/*
 * O celular: o computador que cabe no bolso. Corpo de cantos arredondados,
 * tela clara com o rosto (tranquilo, de olhos meio fechados de quem já viu
 * de tudo), a câmera em cima e a bolinha vermelha de notificação no canto,
 * que pula a cada frase. Embaixo, os ícones dos apps.
 */
import { motion } from "framer-motion";
import { Boca, Braco, CONTORNO, Olhos, type PropsCorpo } from "./partes";

export function Celular({ expressao, piscando, boca, falando, animar, passos }: PropsCorpo) {
  return (
    <motion.g
      animate={animar ? { rotate: falando ? [-2, 2, -2] : [-3, -1, -3] } : { rotate: -2 }}
      transition={animar ? { duration: falando ? 0.5 : 4, repeat: Infinity, ease: "easeInOut" } : undefined}
      style={{ originX: "80px", originY: "160px", ["--palpebra" as string]: "var(--cor-ante-celular-tela)" }}
    >
      {/* Os bracinhos: um no bolso (escondido atrás) e o outro acenando de leve */}
      <Braco de={{ x: 46, y: 96 }} cotovelo={{ x: 28, y: 110 }} mao={{ x: 34, y: 126 }} cor="var(--cor-ante-celular)" />
      <Braco de={{ x: 114, y: 92 }} cotovelo={{ x: 136, y: 86 }} mao={{ x: 134, y: 64 }} cor="var(--cor-ante-celular)" acenando={expressao !== "dormindo"} animar={animar} />
      {/* O corpo e a tela */}
      <rect x="44" y="16" width="72" height="146" rx="16" fill="var(--cor-ante-celular)" {...CONTORNO} />
      <rect x="50" y="24" width="60" height="128" rx="11" fill="var(--cor-ante-celular-tela)" />
      <circle cx="80" cy="31" r="2.6" fill="var(--cor-ante-celular)" />
      {/* O rosto: tranquilo, de quem já viu de tudo */}
      <Olhos x1={69} x2={91} y={70} raio={4.6} cor="var(--cor-ante-rosto)" expressao={expressao} piscando={piscando} palpebra={expressao === "feliz" ? 0.3 : 0} />
      <Boca x={80} y={88} largura={13} cor="var(--cor-ante-rosto)" expressao={expressao} forma={boca} />
      {/* Os ícones dos apps, embaixo */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={55 + i * 13} y="128" width="10" height="10" rx="3" fill={["var(--cor-ante-fio-a)", "var(--cor-ante-globo)", "var(--cor-ante-led)", "var(--cor-ante-fio-c)"][i]} />
      ))}
      <rect x="70" y="144" width="20" height="3" rx="1.5" fill="var(--cor-ante-celular)" opacity="0.5" />
      {/* A bolinha de notificação: pula a cada frase */}
      {expressao !== "dormindo" && (
        <motion.g key={passos} initial={animar ? { scale: 0.4 } : false} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 420, damping: 12 }} style={{ originX: "114px", originY: "18px" }}>
          <circle cx="114" cy="18" r="9" fill="var(--cor-ante-notificacao)" {...CONTORNO} strokeWidth={1.6} />
          <text x="114" y="21.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="var(--cor-ante-branco)">
            {Math.max(1, Math.min(9, passos || 1))}
          </text>
        </motion.g>
      )}
    </motion.g>
  );
}
