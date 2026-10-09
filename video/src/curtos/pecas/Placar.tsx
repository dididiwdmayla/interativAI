/*
 * O placar de estrelas de "O aprendiz", no visual do contador do cabeçalho do
 * jogo (a estrela do jogo e o número), e as três estrelas que voam até ele a
 * cada fase vencida. Estrela é coisa real do jogo; não há XP nem nível.
 */
import { spring } from "remotion";
import { IconeEstrela } from "@jogo/componentes/icones/IconeEstrela";
import { FONTE_UI } from "../../fontes";
import { FPS } from "../../roteiro";
import { mistura, rampa, vaiEVolta } from "../../lib/tempo";

/** Quanto tempo uma estrela leva voando (s) e o intervalo entre elas. */
export const VOO_DA_ESTRELA = 0.42;
export const INTERVALO_DAS_ESTRELAS = 0.17;

export type Chegada = { t: number };

type PropsPlacar = {
  /** Os instantes (s do vídeo) em que cada estrela chega na pílula. */
  chegadas: number[];
  t: number;
  /** Tamanho da letra do número (pelo menos 60). */
  letra?: number;
};

/** A pílula: a estrela e quantas já chegaram. Ela pulsa a cada estrela que entra. */
export function Placar({ chegadas, t, letra = 68 }: PropsPlacar) {
  const total = chegadas.filter((chegada) => t >= chegada).length;
  const ultima = chegadas.filter((chegada) => t >= chegada).at(-1);
  const pulso = ultima === undefined ? 0 : 1 - spring({ frame: Math.round((t - ultima) * FPS), fps: FPS, config: { damping: 10, stiffness: 260, mass: 0.5 } });
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: letra * 0.2,
        padding: `${letra * 0.16}px ${letra * 0.42}px ${letra * 0.16}px ${letra * 0.3}px`,
        borderRadius: 999,
        border: `${Math.round(letra * 0.11)}px solid var(--cor-texto)`,
        background: "var(--cor-superficie)",
        boxShadow: `0 ${Math.round(letra * 0.14)}px 0 var(--cor-texto)`,
        fontFamily: FONTE_UI,
        fontSize: letra,
        fontWeight: 900,
        lineHeight: 1,
        color: "var(--cor-texto)",
        transform: `scale(${1 + 0.16 * pulso})`,
        transformOrigin: "70% 50%",
      }}
    >
      <IconeEstrela tamanho={letra * 1.12} cheia />
      <span style={{ fontVariantNumeric: "tabular-nums", minWidth: letra * 0.62, textAlign: "right" }}>{total}</span>
    </div>
  );
}

type PropsEstrelas = {
  /** Os instantes de chegada das três estrelas desta fase. */
  chegadas: number[];
  t: number;
  de: { x: number; y: number };
  ate: { x: number; y: number };
  tamanho?: number;
};

/** As estrelas no ar, do carimbo até a pílula, num arco. */
export function EstrelasVoando({ chegadas, t, de, ate, tamanho = 110 }: PropsEstrelas) {
  return (
    <>
      {chegadas.map((chegada, i) => {
        const saida = chegada - VOO_DA_ESTRELA;
        if (t < saida - 0.12 || t >= chegada) return null;
        const nasce = rampa(t, saida - 0.12, saida);
        const p = rampa(t, saida, chegada, vaiEVolta);
        const x = mistura(de.x + (i - 1) * 70, ate.x, p);
        const y = mistura(de.y, ate.y, p) - Math.sin(p * Math.PI) * (140 + i * 40);
        const lado = tamanho * (0.5 + 0.5 * nasce) * (1 - 0.45 * p);
        return (
          <div key={chegada} style={{ position: "absolute", left: x - lado / 2, top: y - lado / 2, width: lado, height: lado, transform: `rotate(${p * 300 + i * 30}deg)`, filter: "drop-shadow(0 6px 0 var(--cor-sombra))" }}>
            <IconeEstrela tamanho={lado} cheia />
          </div>
        );
      })}
    </>
  );
}
