/* A tecla F12, em SVG, com profundidade. `aperto` vai de 0 (solta) a 1 (afundada). */
import { FONTE_CODIGO } from "../fontes";

type Props = { tamanho: number; aperto: number };

export function TeclaF12({ tamanho, aperto }: Props) {
  const curso = 16 * aperto;
  return (
    <svg viewBox="0 0 220 200" width={tamanho} height={(tamanho * 200) / 220} overflow="visible" style={{ display: "block" }}>
      {/* A sombra no chão encolhe quando a tecla desce. */}
      <ellipse cx="110" cy="186" rx={92 - 8 * aperto} ry={10 - 3 * aperto} fill="var(--cor-sombra)" />
      {/* A base e a lateral da tecla. */}
      <rect x="14" y="44" width="192" height="138" rx="30" fill="var(--cor-mascote-moldura-sombra)" />
      <rect x="14" y="36" width="192" height="138" rx="30" fill="var(--cor-borda)" />
      {/* O topo, que afunda. */}
      <g transform={`translate(0 ${curso})`}>
        <rect x="26" y="14" width="168" height="130" rx="24" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="4" />
        <rect x="40" y="26" width="46" height="9" rx="4.5" fill="var(--cor-hover)" />
        <text x="110" y="104" textAnchor="middle" fontFamily={FONTE_CODIGO} fontSize="58" fontWeight="800" fill="var(--cor-texto)" style={{ fontVariantLigatures: "none" }}>
          F12
        </text>
      </g>
    </svg>
  );
}
