/*
 * O chefão de "O chefão": o bug, um besourinho original feito de pedaços de
 * interface. O casco é uma janela (com a barra de título e os três botões), a
 * cabeça é um painel, os olhos são dois sinais de "!", as patas são colchetes
 * "[" e "]" e a antena termina num cursor de texto piscando. Tem um pouco de
 * glitch: duas cópias do contorno, deslocadas, nas cores secundária e primária
 * do tema. É ameaçador de um jeito engraçado, nunca nojento, e se reconhece
 * com 300 px de largura. Tudo pelo quadro e só com tokens do tema.
 */
import { FPS } from "../../roteiro";
import { sorteio } from "../../lib/tempo";

export const VISTA_DO_CHEFAO = { l: 220, a: 200 } as const;

const PATAS = [84, 112, 140];

/** O contorno do besouro (casco, cabeça, patas e antena), para o desenho e para as cópias do glitch. */
function Contorno({ cor, largura, patas, preenchido = false }: { cor: string; largura: number; patas: number[]; preenchido?: boolean }) {
  return (
    <g fill="none" stroke={cor} strokeWidth={largura} strokeLinecap="round" strokeLinejoin="round">
      {PATAS.map((y, i) => (
        <g key={y}>
          <path d={`M46 ${y - 12} H28 V${y + 12} H46 M46 ${y} H60`} transform={`translate(${-patas[i]} 0)`} />
          <path d={`M174 ${y - 12} H192 V${y + 12} H174 M174 ${y} H160`} transform={`translate(${patas[i]} 0)`} />
        </g>
      ))}
      <path d="M120 24 Q124 8 138 6" />
      <rect x={58} y={62} width={104} height={106} rx={26} fill={preenchido ? "var(--cor-painel)" : "none"} />
      <rect x={72} y={20} width={76} height={54} rx={17} fill={preenchido ? "var(--cor-superficie)" : "none"} />
    </g>
  );
}

type Props = {
  /** Largura em px (a altura segue o viewBox 220 x 200). */
  tamanho: number;
  quadro: number;
  /** O clarão de quando ele leva um golpe (0 a 1). */
  dano?: number;
  /** Quanto o glitch aparece (0: nenhum; 1: o normal; mais: um surto). */
  glitch?: number;
  /** Os olhos espremidos (0 a 1), no golpe. */
  aperto?: number;
  /** A duração do vídeo em laço (s): os movimentos dele fecham ciclos inteiros nesse tempo, para o último quadro emendar no primeiro. */
  laco?: number;
};

export function Chefao({ tamanho, quadro, dano = 0, glitch = 1, aperto = 0, laco }: Props) {
  const segundos = quadro / FPS;
  /** Uma frequência perto da pedida que dá voltas inteiras no laço. */
  const hz = (pedida: number): number => (laco ? Math.max(1, Math.round(pedida * laco)) / laco : pedida);
  // As patas mexem, cada par no seu tempo.
  const patas = PATAS.map((_, i) => 3 * Math.sin(segundos * Math.PI * 2 * hz(1.4) + i * 1.9));
  // O glitch: quase sempre pequeno, com um tranco de dois quadros de vez em quando (a semente fixa a sequência).
  const sorte = sorteio(900 + Math.floor(quadro / 2));
  // Nos primeiros e nos últimos quadros do laço não há tranco: o quadro 0 e o último ficam iguais.
  const naEmenda = laco !== undefined && (quadro < 4 || quadro > laco * FPS - 5);
  const tranco = !naEmenda && sorte() < 0.16 ? 1 : 0;
  const desvio = (2.6 + 7 * tranco) * glitch;
  const sobe = (sorte() - 0.5) * 6 * tranco * glitch;
  const cursor = Math.floor(segundos * hz(1.25) * 2) % 2 === 0 ? 1 : 0.15;
  const balanca = 2.2 * Math.sin(segundos * Math.PI * 2 * hz(0.7));
  const olhos = 1 - 0.55 * aperto;
  const v = VISTA_DO_CHEFAO;
  return (
    <svg viewBox={`0 -8 ${v.l} ${v.a}`} width={tamanho} height={(tamanho * v.a) / v.l} overflow="visible" style={{ display: "block" }}>
      <g transform={`translate(0 ${balanca})`}>
        {glitch > 0 ? (
          <>
            <g transform={`translate(${-desvio} ${sobe})`} opacity={0.75}>
              <Contorno cor="var(--cor-secundaria)" largura={6} patas={patas} />
            </g>
            <g transform={`translate(${desvio} ${-sobe})`} opacity={0.75}>
              <Contorno cor="var(--cor-destaque)" largura={6} patas={patas} />
            </g>
          </>
        ) : null}
        {/* As patas: colchetes. */}
        <g fill="none" stroke="var(--cor-secundaria)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
          {PATAS.map((y, i) => (
            <g key={y}>
              <path d={`M46 ${y - 12} H28 V${y + 12} H46 M46 ${y} H60`} transform={`translate(${-patas[i]} 0)`} />
              <path d={`M174 ${y - 12} H192 V${y + 12} H174 M174 ${y} H160`} transform={`translate(${patas[i]} 0)`} />
            </g>
          ))}
        </g>
        {/* A antena, com o cursor de texto piscando na ponta. */}
        <path d="M120 24 Q124 8 138 6" fill="none" stroke="var(--cor-primaria)" strokeWidth={5} strokeLinecap="round" />
        <path d="M136 -6 H150 M143 -6 V16 M136 16 H150" fill="none" stroke="var(--cor-destaque)" strokeWidth={5} strokeLinecap="round" opacity={cursor} />
        {/* O casco: uma janela, com a barra de título e a divisão das asas. */}
        <rect x={58} y={62} width={104} height={106} rx={26} fill="var(--cor-painel)" stroke="var(--cor-primaria)" strokeWidth={7} />
        <path d="M61.5 88 V86 A22.5 22.5 0 0 1 84 65.5 H136 A22.5 22.5 0 0 1 158.5 86 V88 Z" fill="var(--cor-borda)" />
        <circle cx={78} cy={77} r={4.2} fill="var(--cor-erro)" />
        <circle cx={91} cy={77} r={4.2} fill="var(--cor-alerta)" />
        <circle cx={104} cy={77} r={4.2} fill="var(--cor-sucesso)" />
        <path d="M110 90 V166" stroke="var(--cor-primaria)" strokeWidth={4} strokeLinecap="round" />
        {/* Em cada asa: linhas de "código" e o sublinhado torto de erro. */}
        <g stroke="var(--cor-texto-suave)" strokeWidth={5} strokeLinecap="round" opacity={0.8}>
          <path d="M72 104 H98 M72 118 H90 M122 104 H140 M122 118 H148" />
        </g>
        <g fill="none" stroke="var(--cor-erro)" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M70 138 q4 -6 8 0 t8 0 t8 0 t8 0" />
          <path d="M120 138 q4 -6 8 0 t8 0 t8 0 t8 0" />
        </g>
        {/* A cabeça: os olhos são dois "!", bravos. */}
        <rect x={72} y={20} width={76} height={54} rx={17} fill="var(--cor-superficie)" stroke="var(--cor-primaria)" strokeWidth={7} />
        <g fill="var(--cor-destaque)" transform={`translate(0 ${45}) scale(1 ${olhos}) translate(0 ${-45})`}>
          <rect x={91} y={29} width={10} height={20} rx={5} />
          <circle cx={96} cy={57} r={5} />
          <rect x={119} y={29} width={10} height={20} rx={5} />
          <circle cx={124} cy={57} r={5} />
        </g>
        <g stroke="var(--cor-erro)" strokeWidth={5} strokeLinecap="round">
          <path d="M84 27 L104 33" />
          <path d="M136 27 L116 33" />
        </g>
        <path d="M98 67 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4" fill="none" stroke="var(--cor-primaria)" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
        {/* O clarão do golpe. */}
        {dano > 0 ? (
          <g opacity={dano}>
            <rect x={58} y={62} width={104} height={106} rx={26} fill="var(--cor-texto)" />
            <rect x={72} y={20} width={76} height={54} rx={17} fill="var(--cor-texto)" />
          </g>
        ) : null}
      </g>
    </svg>
  );
}
