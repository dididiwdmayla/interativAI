/*
 * Peças comuns dos antepassados: os olhos (que piscam e mudam com a
 * expressão) e a boca (que acompanha o texto falando). Cada antepassado
 * desenha o corpo do jeito da época e usa estas peças no rosto, com a cor
 * dele (a tinta do rosto do terminal é o fósforo verde, a do PC é o texto
 * da tela azul...).
 */
import { motion } from "framer-motion";
import type { FormaBoca } from "@/motor/contrato/expressoes";

export type ExpressaoAntepassado = "feliz" | "curioso" | "orgulhoso" | "dormindo";

/** O que todo corpo de antepassado recebe. */
export type PropsCorpo = {
  expressao: ExpressaoAntepassado;
  piscando: boolean;
  /** A boca falando (null: a boca da expressão). */
  boca: FormaBoca;
  falando: boolean;
  /** Anima (sem "menos movimento" e depois de montar). */
  animar: boolean;
  /** Quantos pedaços da fala já saíram (o gigante acende uma válvula por palavra). */
  passos: number;
};

type PropsOlhos = {
  x1: number;
  x2: number;
  y: number;
  raio: number;
  cor: string;
  expressao: ExpressaoAntepassado;
  piscando: boolean;
  /** Olhos quadrados (os de tela: terminal, PC). */
  quadrados?: boolean;
  /** Pálpebra caída (rabugento ou sonhador): cobre a parte de cima do olho. */
  palpebra?: number;
  /** Cor do brilho do olho (null: sem brilho). */
  brilho?: string | null;
};

/** Os dois olhos: abertos, fechados piscando, em arco feliz (orgulhoso) ou fechados dormindo. */
export function Olhos({ x1, x2, y, raio, cor, expressao, piscando, quadrados = false, palpebra = 0, brilho = "var(--cor-ante-branco)" }: PropsOlhos) {
  const fechado = piscando || expressao === "dormindo";
  return (
    <g>
      {[x1, x2].map((x) => {
        if (expressao === "orgulhoso") {
          return <path key={x} d={`M${x - raio} ${y + 1} Q${x} ${y - raio * 1.4} ${x + raio} ${y + 1}`} fill="none" stroke={cor} strokeWidth={Math.max(2.4, raio * 0.6)} strokeLinecap="round" />;
        }
        if (fechado) {
          return (
            <path
              key={x}
              d={expressao === "dormindo" ? `M${x - raio} ${y} Q${x} ${y + raio * 0.9} ${x + raio} ${y}` : `M${x - raio} ${y} L${x + raio} ${y}`}
              fill="none"
              stroke={cor}
              strokeWidth={Math.max(2.2, raio * 0.5)}
              strokeLinecap="round"
            />
          );
        }
        const r = expressao === "curioso" ? raio * 1.18 : raio;
        return (
          <g key={x}>
            {quadrados ? <rect x={x - r * 0.8} y={y - r} width={r * 1.6} height={r * 2} rx={r * 0.2} fill={cor} /> : <circle cx={x} cy={y} r={r} fill={cor} />}
            {brilho && <circle cx={x + r * 0.35} cy={y - r * 0.4} r={r * 0.32} fill={brilho} />}
            {palpebra > 0 && <rect x={x - r - 1} y={y - r - 1} width={r * 2 + 2} height={(r * 2 + 2) * palpebra} fill="var(--palpebra)" />}
          </g>
        );
      })}
    </g>
  );
}

type PropsBoca = {
  x: number;
  y: number;
  largura: number;
  cor: string;
  /** A cor de dentro da boca aberta. */
  dentro?: string;
  expressao: ExpressaoAntepassado;
  forma: FormaBoca;
  /** Boca reta e quadrada (o terminal). */
  reta?: boolean;
};

/** A boca: falando, abre nas vogais e quase fecha nas consoantes; parada, mostra a expressão. */
export function Boca({ x, y, largura, cor, dentro = "var(--cor-cliente-boca)", expressao, forma, reta = false }: PropsBoca) {
  const meia = largura / 2;
  const traco = { fill: "none", stroke: cor, strokeWidth: Math.max(2.2, largura * 0.16), strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (forma) {
    const altura = { a: largura * 0.75, e: largura * 0.42, o: largura * 0.62, m: largura * 0.14 }[forma];
    const larguraBoca = { a: largura * 0.85, e: largura, o: largura * 0.55, m: largura * 0.8 }[forma];
    if (reta) return <rect x={x - larguraBoca / 2} y={y - altura / 2} width={larguraBoca} height={Math.max(2.5, altura)} fill={cor} />;
    return <ellipse cx={x} cy={y} rx={larguraBoca / 2} ry={Math.max(1.4, altura / 2)} fill={dentro} stroke={cor} strokeWidth={traco.strokeWidth * 0.8} />;
  }
  if (reta) {
    if (expressao === "orgulhoso") return <path d={`M${x - meia} ${y - 2}h${largura}v4h${-largura}z`} fill={cor} />;
    return <path d={`M${x - meia} ${y}h${largura}`} {...traco} />;
  }
  switch (expressao) {
    case "feliz":
      return <path d={`M${x - meia} ${y - 2} Q${x} ${y + meia * 0.9} ${x + meia} ${y - 2}`} {...traco} />;
    case "curioso":
      return <circle cx={x} cy={y} r={largura * 0.18} {...traco} />;
    case "orgulhoso":
      return <path d={`M${x - meia} ${y - 3} Q${x} ${y + meia * 1.3} ${x + meia} ${y - 3} Z`} fill={dentro} stroke={cor} strokeWidth={traco.strokeWidth * 0.8} strokeLinejoin="round" />;
    case "dormindo":
      return <ellipse cx={x} cy={y + 1} rx={largura * 0.14} ry={largura * 0.1} {...traco} />;
  }
}

/** As bochechas rosadas (a tecelã, a sonhadora, a internet). */
export function Bochechas({ x1, x2, y, raio }: { x1: number; x2: number; y: number; raio: number }) {
  return (
    <g fill="var(--cor-ante-bochecha)" opacity={0.6}>
      <ellipse cx={x1} cy={y} rx={raio} ry={raio * 0.6} />
      <ellipse cx={x2} cy={y} rx={raio} ry={raio * 0.6} />
    </g>
  );
}

/** Contorno padrão dos antepassados (some no tema escuro como sombra suave). */
export const CONTORNO = { stroke: "var(--cor-ante-contorno)", strokeWidth: 2.2, strokeLinejoin: "round" as const };

type PropsBraco = {
  /** Onde o braço sai do corpo. */
  de: { x: number; y: number };
  /** O cotovelo (controle da curva). */
  cotovelo: { x: number; y: number };
  /** Onde fica a mão. */
  mao: { x: number; y: number };
  cor: string;
  /** Acena (balança a partir do ombro). */
  acenando?: boolean;
  animar?: boolean;
};

/** Um bracinho de desenho, com a mão redonda. Acenando, balança a partir do ombro. */
export function Braco({ de, cotovelo, mao, cor, acenando = false, animar = false }: PropsBraco) {
  const desenho = (
    <g>
      <path d={`M${de.x} ${de.y}Q${cotovelo.x} ${cotovelo.y} ${mao.x} ${mao.y}`} fill="none" stroke="var(--cor-ante-contorno)" strokeWidth="7.5" strokeLinecap="round" />
      <path d={`M${de.x} ${de.y}Q${cotovelo.x} ${cotovelo.y} ${mao.x} ${mao.y}`} fill="none" stroke={cor} strokeWidth="4.5" strokeLinecap="round" />
      <circle cx={mao.x} cy={mao.y} r="4.6" fill={cor} {...CONTORNO} strokeWidth={1.8} />
    </g>
  );
  if (!acenando || !animar) return desenho;
  return (
    <motion.g animate={{ rotate: [0, -14, 0, -10, 0] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4 }} style={{ originX: `${de.x}px`, originY: `${de.y}px` }}>
      {desenho}
    </motion.g>
  );
}
