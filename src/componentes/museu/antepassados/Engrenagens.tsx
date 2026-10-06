"use client";

/*
 * A sonhadora de engrenagens: a Máquina Analítica. A cabeça é um mostrador
 * de latão com olhos sonhadores olhando para cima; em cima, duas
 * engrenagens que giram devagar (e depressa quando ela fala). O corpo é a
 * coluna de rodas numeradas: metade de latão, metade só desenho de planta,
 * tracejado, porque ela nunca foi construída inteira. Ao lado, a manivela
 * e os cartões que ela ia ler, iguais aos do tear.
 */
import { motion } from "framer-motion";
import { Boca, Bochechas, CONTORNO, Olhos, type PropsCorpo } from "./partes";

/** Uma engrenagem com `dentes` dentes, centro em (0, 0). */
function caminhoEngrenagem(raio: number, dentes: number): string {
  const pontos: string[] = [];
  for (let i = 0; i < dentes * 2; i += 1) {
    const angulo = (Math.PI * i) / dentes;
    const r = i % 2 === 0 ? raio : raio * 0.78;
    const proximo = (Math.PI * (i + 1)) / dentes;
    pontos.push(`${(r * Math.cos(angulo)).toFixed(2)} ${(r * Math.sin(angulo)).toFixed(2)}`);
    pontos.push(`${(r * Math.cos(proximo)).toFixed(2)} ${(r * Math.sin(proximo)).toFixed(2)}`);
  }
  return `M${pontos.join("L")}Z`;
}

const GRANDE = caminhoEngrenagem(17, 10);
const PEQUENA = caminhoEngrenagem(10, 7);

function Engrenagem({ x, y, caminho, raio, sentido, animar, rapido }: { x: number; y: number; caminho: string; raio: number; sentido: 1 | -1; animar: boolean; rapido: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g
        animate={animar ? { rotate: 360 * sentido } : { rotate: 0 }}
        transition={animar ? { duration: rapido ? 2.2 : 9, repeat: Infinity, ease: "linear" } : undefined}
      >
        <path d={caminho} fill="var(--cor-ante-latao)" {...CONTORNO} strokeWidth={1.6} />
        <circle r={raio * 0.32} fill="var(--cor-ante-latao-sombra)" />
      </motion.g>
    </g>
  );
}

export function Engrenagens({ expressao, piscando, boca, falando, animar }: PropsCorpo) {
  return (
    <g style={{ ["--palpebra" as string]: "var(--cor-ante-latao-brilho)" }}>
      {/* A coluna de rodas numeradas: a metade construída e a metade só de planta */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="52" y={92 + i * 16} width="24" height="13" rx="3" fill="var(--cor-ante-latao)" {...CONTORNO} strokeWidth={1.6} />
          <path d={`M58 ${95 + i * 16}v7M64 ${95 + i * 16}v7M70 ${95 + i * 16}v7`} stroke="var(--cor-ante-latao-sombra)" strokeWidth="1.4" />
          <rect x="76" y={92 + i * 16} width="24" height="13" rx="3" fill="none" stroke="var(--cor-ante-planta)" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <path d={`M82 ${95 + i * 16}v7M88 ${95 + i * 16}v7M94 ${95 + i * 16}v7`} stroke="var(--cor-ante-planta)" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      ))}
      <path d="M50 88h52M50 157h52" stroke="var(--cor-ante-latao-sombra)" strokeWidth="3" strokeLinecap="round" />
      <path d="M76 157h26" stroke="var(--cor-ante-planta)" strokeWidth="3" strokeDasharray="4 3" strokeLinecap="round" />
      {/* As medidas da planta, como num desenho técnico */}
      <path d="M108 92v62M105 92h6M105 154h6" stroke="var(--cor-ante-planta)" strokeWidth="1" opacity="0.8" />
      {/* A manivela */}
      <path d="M50 120h-14v-10" fill="none" stroke="var(--cor-ante-latao-sombra)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="36" cy="108" r="4" fill="var(--cor-ante-madeira)" {...CONTORNO} strokeWidth={1.4} />
      {/* Os cartões que ela ia ler (os mesmos do tear) */}
      <g transform="translate(112 118) rotate(8)">
        <rect width="20" height="13" rx="1.5" fill="var(--cor-ante-cartao)" stroke="var(--cor-ante-cartao-sombra)" strokeWidth="1.2" />
        <circle cx="5" cy="4" r="1.1" fill="var(--cor-ante-madeira-sombra)" />
        <circle cx="11" cy="8" r="1.1" fill="var(--cor-ante-madeira-sombra)" />
        <circle cx="16" cy="4" r="1.1" fill="var(--cor-ante-madeira-sombra)" />
      </g>
      {/* As engrenagens em cima da cabeça, engatadas */}
      <Engrenagem x={62} y={22} caminho={GRANDE} raio={17} sentido={1} animar={animar} rapido={falando} />
      <Engrenagem x={88} y={16} caminho={PEQUENA} raio={10} sentido={-1} animar={animar} rapido={falando} />
      {/* A cabeça: um mostrador de latão */}
      <circle cx="76" cy="58" r="32" fill="var(--cor-ante-latao)" {...CONTORNO} />
      <circle cx="76" cy="58" r="26" fill="var(--cor-ante-latao-brilho)" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        // Arredondado: o seno do servidor e o do navegador diferem na última casa.
        return <path key={i} d={`M${(76 + Math.cos(a) * 27.5).toFixed(2)} ${(58 + Math.sin(a) * 27.5).toFixed(2)}L${(76 + Math.cos(a) * 30.5).toFixed(2)} ${(58 + Math.sin(a) * 30.5).toFixed(2)}`} stroke="var(--cor-ante-latao-sombra)" strokeWidth="1.6" />;
      })}
      {/* Olhos sonhadores, olhando um pouco para cima, e as estrelinhas do sonho */}
      <Olhos x1={65} x2={87} y={52} raio={4.4} cor="var(--cor-ante-rosto)" expressao={expressao} piscando={piscando} palpebra={expressao === "feliz" ? 0.32 : 0} />
      <Bochechas x1={58} x2={94} y={64} raio={4.5} />
      <Boca x={76} y={70} largura={12} cor="var(--cor-ante-rosto)" expressao={expressao} forma={boca} />
      {[
        [118, 30, 0],
        [126, 50, 0.6],
        [30, 34, 1.1],
      ].map(([x, y, atraso]) => (
        <motion.path
          key={`${x}`}
          d={`M${x} ${y - 5}L${x + 1.5} ${y - 1.5}L${x + 5} ${y}L${x + 1.5} ${y + 1.5}L${x} ${y + 5}L${x - 1.5} ${y + 1.5}L${x - 5} ${y}L${x - 1.5} ${y - 1.5}Z`}
          fill="var(--cor-ante-latao-brilho)"
          stroke="var(--cor-ante-latao-sombra)"
          strokeWidth="0.8"
          animate={animar ? { opacity: [0.25, 1, 0.25] } : { opacity: 0.8 }}
          transition={animar ? { duration: 2.4, repeat: Infinity, delay: atraso } : undefined}
        />
      ))}
    </g>
  );
}
