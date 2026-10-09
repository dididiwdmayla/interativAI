/* O fundo do tema Doce com manchas suaves, para as cenas sem gravação. */
import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";

export function Fundo({ children }: { children?: ReactNode }) {
  return (
    <AbsoluteFill style={{ background: "var(--cor-fundo)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "-12%", top: "-22%", width: "58%", aspectRatio: "1", borderRadius: "50%", background: "var(--cor-fundo-padrao)", opacity: 0.9 }} />
      <div style={{ position: "absolute", right: "-16%", bottom: "-30%", width: "66%", aspectRatio: "1", borderRadius: "50%", background: "var(--cor-hover)", opacity: 0.75 }} />
      <div style={{ position: "absolute", right: "8%", top: "9%", width: "9%", aspectRatio: "1", borderRadius: "50%", background: "var(--cor-selecao)" }} />
      {children}
    </AbsoluteFill>
  );
}
