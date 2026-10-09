/* O carimbo "FASE CONCLUÍDA", no espírito da comemoração do jogo: entra batendo, torto, com a cor de sucesso. */
import { spring } from "remotion";
import { FONTE_UI } from "../../fontes";
import { FPS } from "../../roteiro";
import { rampa, sai } from "../../lib/tempo";

type Props = { linhas: readonly string[]; t: number; ate: number; letra?: number; giro?: number };

export function Carimbo({ linhas, t, ate, letra = 84, giro = -9 }: Props) {
  if (t < 0 || t > ate + 0.2) return null;
  const entrada = spring({ frame: Math.round(t * FPS), fps: FPS, config: { damping: 9, stiffness: 300, mass: 0.6 } });
  const saida = 1 - rampa(t, ate, ate + 0.16, sai);
  return (
    <div
      style={{
        display: "inline-block",
        padding: `${letra * 0.16}px ${letra * 0.38}px ${letra * 0.22}px`,
        borderRadius: letra * 0.3,
        border: `${Math.round(letra * 0.11)}px solid var(--cor-sucesso)`,
        outline: `${Math.round(letra * 0.05)}px solid var(--cor-superficie)`,
        background: "var(--cor-superficie)",
        boxShadow: `0 ${Math.round(letra * 0.13)}px 0 var(--cor-sucesso)`,
        fontFamily: FONTE_UI,
        fontSize: letra,
        fontWeight: 900,
        lineHeight: 1.02,
        letterSpacing: "0.02em",
        textAlign: "center",
        color: "var(--cor-sucesso)",
        whiteSpace: "nowrap",
        transform: `rotate(${giro}deg) scale(${(2.2 - 1.2 * entrada) * (0.9 + 0.1 * saida)})`,
        opacity: Math.min(1, entrada * 2.5) * saida,
      }}
    >
      {linhas.map((linha) => (
        <div key={linha}>{linha}</div>
      ))}
    </div>
  );
}
