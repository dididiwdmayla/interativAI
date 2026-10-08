/*
 * As capas: o computadorzinho grande e curioso, o mundo de noite ao fundo
 * (um quadro da tomada T03, public/capa/mundo-noite.jpg, extraído pelo
 * scripts/finalizar.mjs) e o título. Nada mais.
 */
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONTE_UI } from "../fontes";
import { MascoteVideo } from "../pecas/MascoteVideo";

type Props = { formato: "16x9" | "9x16" };

export function Capa({ formato }: Props) {
  const vertical = formato === "9x16";
  const l = vertical ? 1080 : 1280;
  const a = vertical ? 1920 : 720;
  // O fundo cobre o quadro, sem as barras do topo do jogo (os 104 px de cima da gravação de 1920 x 1080).
  const escala = a / 976;
  const fundo = vertical ? { left: -420 * escala, top: -104 * escala } : { left: (l - 1920 * escala) / 2, top: -104 * escala };
  const letra = vertical ? 118 : 86;
  const mascote = vertical ? 760 : 470;
  return (
    <AbsoluteFill data-theme="doce" style={{ background: "var(--cor-mar-fundo)", overflow: "hidden" }}>
      <Img src={staticFile("capa/mundo-noite.jpg")} style={{ position: "absolute", ...fundo, width: 1920 * escala, height: 1080 * escala }} />
      <div style={vertical ? { position: "absolute", left: (l - 120 - mascote) / 2 + 40, top: 330 } : { position: "absolute", right: 70, top: 130 }}>
        <div style={{ filter: "drop-shadow(0 18px 0 var(--cor-veu))" }}>
          <MascoteVideo tamanho={mascote} expressao="curioso" quadro={0} respira={false} semente={3} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          ...(vertical ? { left: 60, top: 1150, width: l - 120 - 100 } : { left: 64, top: 196, width: 640 }),
          boxSizing: "border-box",
          padding: vertical ? "56px 60px 64px" : "40px 46px 46px",
          borderRadius: vertical ? 64 : 48,
          border: `${vertical ? 9 : 7}px solid var(--cor-borda)`,
          background: "var(--cor-superficie)",
          boxShadow: `0 ${vertical ? 20 : 14}px 0 var(--cor-veu)`,
          fontFamily: FONTE_UI,
          fontSize: letra,
          fontWeight: 900,
          lineHeight: 1.04,
          letterSpacing: "-0.02em",
          color: "var(--cor-texto)",
          transform: `rotate(${vertical ? -2 : -2.5}deg)`,
        }}
      >
        <div>Aprenda</div>
        <div>programação</div>
        <div style={{ color: "var(--cor-primaria)" }}>jogando</div>
      </div>
    </AbsoluteFill>
  );
}
