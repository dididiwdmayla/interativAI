/*
 * O computadorzinho do vídeo. O corpo (moldura, tela, pescoço e base) e as
 * bochechas vêm direto do jogo; o rosto e os enfeites são recriados aqui,
 * com a mesma geometria, porque os do jogo animam com Framer Motion (que no
 * render sai fora de sincronia). Tudo aqui anda pelo quadro.
 *
 * Originais: src/componentes/mascote/Mascote.tsx, partes/RostoMascote.tsx,
 * partes/OlhosRedondos.tsx, partes/BracoApontando.tsx, partes/Confete.tsx,
 * partes/GotaSuor.tsx, partes/ZzzSono.tsx e partes/BalaoPensamento.tsx.
 */
import type { ReactNode } from "react";
import { Bochechas } from "@jogo/componentes/mascote/partes/Bochechas";
import { CorpoMonitor } from "@jogo/componentes/mascote/partes/CorpoMonitor";
import { FPS, type Expressao } from "../roteiro";
import { sorteio } from "../lib/tempo";

export type Direcao = "esquerda" | "direita" | "cima";

/** A tela do monitor, no viewBox do CorpoMonitor (140 x 130). */
export const TELA = { x: 30, y: 32, l: 80, a: 58, rx: 15 } as const;
export const VIEWBOX = { l: 140, a: 130 } as const;

const TRACO = { fill: "none", stroke: "var(--cor-mascote-rosto)", strokeWidth: 3.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const PISCA_EM: readonly Expressao[] = ["feliz", "curioso", "pensativo", "apontando", "preocupado"];
const OLHAR: Record<Direcao, { x: number; y: number }> = { esquerda: { x: -4, y: 0 }, direita: { x: 4, y: 0 }, cima: { x: -2, y: -4 } };

/** Pisca em momentos determinísticos: a cada 2,5 a 5 s, por 0,14 s (a semente fixa a sequência). */
export function piscada(segundos: number, semente = 7): number {
  const sorte = sorteio(semente);
  let t = 1.2 + sorte() * 1.5;
  while (t < segundos - 0.2) t += 2.5 + sorte() * 2.5;
  const dentro = segundos - t;
  if (dentro < 0 || dentro > 0.14) return 1;
  // Fecha e abre: 1 -> 0,12 -> 1.
  const meio = Math.abs(dentro - 0.07) / 0.07;
  return 0.12 + 0.88 * meio;
}

function Olhos({ esquerdo, direito, raio, fechar, brilho = false }: { esquerdo: { x: number; y: number }; direito: { x: number; y: number }; raio: number; fechar: number; brilho?: boolean }) {
  const meioY = (esquerdo.y + direito.y) / 2;
  return (
    <g transform={`translate(0 ${meioY}) scale(1 ${fechar}) translate(0 ${-meioY})`}>
      {[esquerdo, direito].map((olho) => (
        <g key={olho.x}>
          <circle cx={olho.x} cy={olho.y} r={raio} fill="var(--cor-mascote-rosto)" />
          {brilho && <circle cx={olho.x + raio * 0.35} cy={olho.y - raio * 0.35} r={raio * 0.32} fill="var(--cor-mascote-tela)" />}
        </g>
      ))}
    </g>
  );
}

/** A boca falando: abre com os apitos da voz de modem. */
function BocaFalando({ x, y, abertura }: { x: number; y: number; abertura: number }) {
  return <ellipse cx={x} cy={y} rx={5 + abertura * 2.5} ry={1.6 + abertura * 4.6} fill="var(--cor-mascote-rosto)" />;
}

function Rosto({ expressao, fechar, direcao, boca }: { expressao: Expressao; fechar: number; direcao: Direcao; boca: number | null }) {
  const falando = boca !== null && boca > 0.05;
  switch (expressao) {
    case "feliz":
      return (
        <g>
          <Olhos esquerdo={{ x: 57, y: 57 }} direito={{ x: 83, y: 57 }} raio={5.5} fechar={fechar} />
          {falando ? <BocaFalando x={70} y={72} abertura={boca} /> : <path d="M59 69 Q70 79 81 69" {...TRACO} />}
          <Bochechas />
        </g>
      );
    case "curioso":
      return (
        <g>
          <Olhos esquerdo={{ x: 57, y: 58 }} direito={{ x: 83, y: 57 }} raio={7.5} fechar={fechar} brilho />
          <path d="M75 44 Q83 38 91 43" {...TRACO} strokeWidth={3} />
          <path d="M50 47 L63 47" {...TRACO} strokeWidth={3} />
          {falando ? <BocaFalando x={70} y={75.5} abertura={boca * 0.8} /> : <circle cx="70" cy="75" r="3.4" {...TRACO} strokeWidth={3} />}
        </g>
      );
    case "pensativo":
      return (
        <g>
          <Olhos esquerdo={{ x: 61, y: 54 }} direito={{ x: 87, y: 54 }} raio={5} fechar={fechar} />
          {falando ? <BocaFalando x={70} y={73} abertura={boca * 0.8} /> : <path d="M62 73 L78 73" {...TRACO} />}
        </g>
      );
    case "apontando": {
      const olhar = OLHAR[direcao];
      return (
        <g>
          <Olhos esquerdo={{ x: 57 + olhar.x, y: 57 + olhar.y }} direito={{ x: 83 + olhar.x, y: 57 + olhar.y }} raio={5.5} fechar={fechar} />
          {falando ? <BocaFalando x={70} y={72.5} abertura={boca} /> : <path d="M61 70 Q70 77 79 70" {...TRACO} />}
          <Bochechas />
        </g>
      );
    }
    case "comemorando": {
      // A boca aberta do original; falando, ela abre e fecha um pouco.
      const fundo = 86 - (falando ? (1 - boca) * 9 : 0);
      return (
        <g>
          <path d="M50 60 L57 53 L64 60" {...TRACO} />
          <path d="M76 60 L83 53 L90 60" {...TRACO} />
          <path d={`M58 66 Q70 ${fundo} 82 66 Z`} fill="var(--cor-mascote-rosto)" stroke="var(--cor-mascote-rosto)" strokeWidth={2} strokeLinejoin="round" />
          <ellipse cx="70" cy={fundo - 10} rx="5.5" ry="3" fill="var(--cor-mascote-bochecha)" />
          <Bochechas />
        </g>
      );
    }
    case "preocupado":
      return (
        <g>
          <Olhos esquerdo={{ x: 57, y: 59 }} direito={{ x: 83, y: 59 }} raio={5} fechar={fechar} />
          <path d="M49 50 L62 46" {...TRACO} strokeWidth={3} />
          <path d="M78 46 L91 50" {...TRACO} strokeWidth={3} />
          {falando ? <BocaFalando x={70} y={75} abertura={boca * 0.7} /> : <path d="M57 76 q3.25 -4 6.5 0 t6.5 0 t6.5 0 t6.5 0" {...TRACO} strokeWidth={3} />}
        </g>
      );
    case "dormindo":
      return (
        <g>
          <path d="M50 58 Q57 64 64 58" {...TRACO} />
          <path d="M76 58 Q83 64 90 58" {...TRACO} />
          <ellipse cx="70" cy="74" rx="3" ry="2.2" {...TRACO} strokeWidth={2.6} />
        </g>
      );
  }
}

const BRACOS: Record<Direcao, { braco: string; seta: string; vai: { x: number; y: number } }> = {
  esquerda: { braco: "M20 70 Q12 69 8 63", seta: "M1.5 56 L12.5 58 L5 66 Z", vai: { x: -3, y: -2 } },
  direita: { braco: "M120 70 Q128 69 132 63", seta: "M138.5 56 L127.5 58 L135 66 Z", vai: { x: 3, y: -2 } },
  cima: { braco: "M21 45 Q12 38 11 26", seta: "M11 15 L17 25 L5 25 Z", vai: { x: 0, y: -3 } },
};

const CONFETE = [
  { forma: "circulo", x: 10, y: 20, cor: "var(--cor-primaria)", atraso: 0, giro: 180 },
  { forma: "triangulo", x: 28, y: 6, cor: "var(--cor-destaque)", atraso: 0.25, giro: 120 },
  { forma: "quadrado", x: 50, y: 12, cor: "var(--cor-secundaria)", atraso: 0.5, giro: -90 },
  { forma: "circulo", x: 92, y: 8, cor: "var(--cor-sucesso)", atraso: 0.15, giro: 180 },
  { forma: "triangulo", x: 112, y: 18, cor: "var(--cor-alerta)", atraso: 0.4, giro: -140 },
  { forma: "quadrado", x: 130, y: 6, cor: "var(--cor-primaria)", atraso: 0.65, giro: 100 },
  { forma: "circulo", x: 132, y: 44, cor: "var(--cor-destaque)", atraso: 0.35, giro: 180 },
  { forma: "quadrado", x: 6, y: 50, cor: "var(--cor-sucesso)", atraso: 0.55, giro: 80 },
] as const;

/** Vai e volta suave (0 -> 1 -> 0) num ciclo de `periodo` segundos. */
const onda = (segundos: number, periodo: number, atraso = 0): number => 0.5 - 0.5 * Math.cos(((segundos - atraso) / periodo) * Math.PI * 2);

function Extras({ expressao, direcao, segundos }: { expressao: Expressao; direcao: Direcao; segundos: number }) {
  switch (expressao) {
    case "apontando": {
      const forma = BRACOS[direcao];
      const p = onda(segundos, 0.9);
      return (
        <g transform={`translate(${forma.vai.x * p} ${forma.vai.y * p})`}>
          <path d={forma.braco} fill="none" stroke="var(--cor-mascote-moldura-sombra)" strokeWidth={5} strokeLinecap="round" />
          <path d={forma.seta} fill="var(--cor-destaque)" stroke="var(--cor-mascote-moldura-sombra)" strokeWidth={1.6} strokeLinejoin="round" />
        </g>
      );
    }
    case "comemorando":
      return (
        <g>
          {CONFETE.map((peca) => {
            const p = onda(segundos, 1.6, peca.atraso);
            return (
              <g key={`${peca.x}-${peca.y}`} transform={`translate(${peca.x} ${peca.y + 14 * p}) rotate(${peca.giro * p})`} opacity={1 - 0.15 * p}>
                {peca.forma === "circulo" ? <circle r={3} fill={peca.cor} /> : peca.forma === "quadrado" ? <rect x={-3} y={-3} width={6} height={6} rx={1} fill={peca.cor} /> : <path d="M0 -4 L3.6 2.6 L-3.6 2.6 Z" fill={peca.cor} />}
              </g>
            );
          })}
        </g>
      );
    case "preocupado": {
      const p = onda(segundos, 1.8);
      return <path d="M125 26 q-5 7 0 10.5 q5 -3.5 0 -10.5z" fill="var(--cor-secundaria)" stroke="var(--cor-mascote-moldura-sombra)" strokeWidth={1} transform={`translate(0 ${6 * p})`} opacity={1 - 0.4 * p} />;
    }
    case "pensativo":
      return (
        <g>
          <circle cx="108" cy="23" r="2.4" fill="var(--cor-superficie)" stroke="var(--cor-mascote-moldura-sombra)" strokeWidth={1.4} />
          <circle cx="115" cy="16.5" r="3.4" fill="var(--cor-superficie)" stroke="var(--cor-mascote-moldura-sombra)" strokeWidth={1.4} />
          <rect x="103" y="1" width="36" height="13" rx="6.5" fill="var(--cor-superficie)" stroke="var(--cor-mascote-moldura-sombra)" strokeWidth={1.4} />
          {[112, 121, 130].map((x, indice) => (
            <circle key={x} cx={x} cy={7.5} r={2} fill="var(--cor-texto)" opacity={0.25 + 0.75 * onda(segundos, 1.2, indice * 0.2)} />
          ))}
        </g>
      );
    case "dormindo": {
      const z = (atraso: number) => {
        const ciclo = (((segundos - atraso) % 2.4) + 2.4) % 2.4 / 2.4;
        return { y: 4 - 8 * ciclo, opacidade: 0.35 + 0.65 * Math.sin(ciclo * Math.PI) };
      };
      const grande = z(0);
      const pequeno = z(0.8);
      return (
        <g fill="none" stroke="var(--cor-secundaria)" strokeLinecap="round" strokeLinejoin="round">
          <path d="M98 12h11l-11 12h11" strokeWidth={3} transform={`translate(0 ${grande.y})`} opacity={grande.opacidade} />
          <path d="M117 2h7l-7 8h7" strokeWidth={2.4} transform={`translate(0 ${pequeno.y})`} opacity={pequeno.opacidade} />
        </g>
      );
    }
    default:
      return null;
  }
}

/** Só o rosto, sobre a cor da tela, ocupando a tela inteira do monitor (para o mergulho: o rosto some e a cena aparece). */
export function RostoNaTela({ expressao, opacidade }: { expressao: Expressao; opacidade: number }) {
  return (
    <svg viewBox={`${TELA.x} ${TELA.y} ${TELA.l} ${TELA.a}`} width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: opacidade }}>
      <rect x={TELA.x} y={TELA.y} width={TELA.l} height={TELA.a} fill="var(--cor-mascote-tela)" />
      <Rosto expressao={expressao} fechar={1} direcao="cima" boca={null} />
    </svg>
  );
}

type Props = {
  /** Largura em px (a altura segue o viewBox 140 x 130). */
  tamanho: number;
  expressao: Expressao;
  /** O quadro atual (para piscar, respirar e animar os enfeites). */
  quadro: number;
  /** Abertura da boca, de 0 a 1, vinda dos eventos da voz. null: boca da expressão. */
  boca?: number | null;
  direcao?: Direcao;
  /** A expressão anterior e quanto da troca já passou (0 a 1): o rosto troca num fundido curto, como no jogo. */
  anterior?: Expressao;
  troca?: number;
  /** Quanto do rosto aparece (0: tela ligada mas sem rosto; 1: rosto inteiro). */
  rosto?: number;
  /** Mostra os enfeites da expressão (bracinho, confete, gota, Zzz). */
  enfeites?: boolean;
  /** O que vai dentro da tela, no lugar do rosto (em unidades do viewBox, já recortado na tela). */
  naTela?: ReactNode;
  semente?: number;
  /** Respira (2% de escala num ciclo de 3 s). Um número entre 0 e 1 dosa o respiro (0: parado). */
  respira?: boolean | number;
};

export function MascoteVideo({ tamanho, expressao, quadro, boca = null, direcao = "cima", anterior, troca = 1, rosto = 1, enfeites = true, naTela, semente = 7, respira = true }: Props) {
  const segundos = quadro / FPS;
  const fechar = PISCA_EM.includes(expressao) ? piscada(segundos, semente) : 1;
  const respiro = 1 + 0.02 * Number(respira) * (0.5 - 0.5 * Math.cos((segundos / 3) * Math.PI * 2));
  const inclinacao = expressao === "curioso" ? -7 * troca : anterior === "curioso" ? -7 * (1 - troca) : 0;
  const pulo = expressao === "comemorando" ? -9 * Math.abs(Math.sin((segundos / 0.55) * Math.PI)) : 0;
  const id = `tela-${semente}`;
  return (
    <svg viewBox={`0 0 ${VIEWBOX.l} ${VIEWBOX.a}`} width={tamanho} height={(tamanho * VIEWBOX.a) / VIEWBOX.l} overflow="visible" style={{ transform: `scale(${respiro})`, transformOrigin: "50% 100%", display: "block" }}>
      <defs>
        <clipPath id={id}>
          <rect x={TELA.x} y={TELA.y} width={TELA.l} height={TELA.a} rx={TELA.rx} />
        </clipPath>
      </defs>
      <g transform={`translate(0 ${pulo}) rotate(${inclinacao} 70 124)`}>
        <CorpoMonitor />
        {naTela ? <g clipPath={`url(#${id})`}>{naTela}</g> : null}
        {rosto > 0 && anterior && troca < 1 ? (
          <g opacity={rosto * (1 - troca)}>
            <Rosto expressao={anterior} fechar={1} direcao={direcao} boca={null} />
          </g>
        ) : null}
        {rosto > 0 ? (
          <g opacity={rosto * (anterior ? troca : 1)}>
            <Rosto expressao={expressao} fechar={fechar} direcao={direcao} boca={boca} />
          </g>
        ) : null}
      </g>
      {enfeites && rosto > 0.5 ? (
        <g opacity={anterior ? troca : 1}>
          <Extras expressao={expressao} direcao={direcao} segundos={segundos} />
        </g>
      ) : null}
    </svg>
  );
}
