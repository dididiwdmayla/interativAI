import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bochechas } from "@jogo/componentes/mascote/partes/Bochechas";
import { CorpoMonitor } from "@jogo/componentes/mascote/partes/CorpoMonitor";
import { FONTE_CODIGO, FONTE_UI } from "../fontes";

/** Prova de fogo: o corpo do computadorzinho importado do jogo, tokens do Doce, as duas fontes. */
export function ProvaDeFogo() {
  const quadro = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame: quadro, fps, config: { damping: 14 } });
  const piscar = interpolate(quadro, [30, 32, 34], [1, 0.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "var(--cor-fundo)", alignItems: "center", justifyContent: "center", gap: 40, fontFamily: FONTE_UI }}>
      <svg viewBox="0 0 140 130" width={520} height={(520 * 130) / 140} style={{ transform: `scale(${entrada})` }} overflow="visible">
        <CorpoMonitor />
        <g style={{ transformOrigin: "70px 57px", transformBox: "view-box", transform: `scaleY(${piscar})` }}>
          <circle cx={57} cy={57} r={5.5} fill="var(--cor-mascote-rosto)" />
          <circle cx={83} cy={57} r={5.5} fill="var(--cor-mascote-rosto)" />
        </g>
        <path d="M59 69 Q70 79 81 69" fill="none" stroke="var(--cor-mascote-rosto)" strokeWidth={3.5} strokeLinecap="round" />
        <Bochechas />
      </svg>
      <div style={{ fontSize: 96, fontWeight: 800, color: "var(--cor-texto)" }}>Prova de fogo: ação, ç, ã, é</div>
      <div style={{ fontFamily: FONTE_CODIGO, fontSize: 44, color: "var(--cor-codigo-tag)" }}>{'<a href="#">código</a>'}</div>
    </AbsoluteFill>
  );
}
