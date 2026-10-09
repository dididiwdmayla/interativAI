/*
 * O narrador durante as tomadas: o computadorzinho num círculo (como o
 * MascoteFlutuante do jogo no celular) com o balão ao lado. A boca acompanha
 * os eventos da voz de modem; a expressão é a da fala.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FALAS, FPS, type Expressao, type IdFala } from "../roteiro";
import { bocaEm, duracaoDaVoz, duracaoDoBalao } from "../lib/voz";
import { elastico, rampa, sai } from "../lib/tempo";
import { Balao } from "./Balao";
import { MascoteVideo } from "./MascoteVideo";

export type FalaAtiva = { fala: IdFala; inicio: number; depois?: { em: number; expressao: Expressao } };

/** A fala que está na tela no instante `t` (s), se houver. */
export function falaEm(falas: FalaAtiva[], t: number): (FalaAtiva & { local: number }) | null {
  for (const item of falas) {
    const local = t - item.inicio;
    if (local >= 0 && local <= duracaoDoBalao(item.fala) + 0.2) return { ...item, local };
  }
  return null;
}

/** A expressão do computadorzinho no instante `t`: a da fala em curso (com a troca do meio), ou a de descanso. */
export function expressaoEm(falas: FalaAtiva[], t: number, descanso: Expressao = "feliz"): { expressao: Expressao; anterior?: Expressao; troca: number; boca: number | null } {
  const ativa = falaEm(falas, t);
  if (!ativa) {
    // Volta ao descanso num fundido curto depois da última fala.
    const ultima = [...falas].reverse().find((item) => t > item.inicio);
    if (ultima) {
      const desde = t - (ultima.inicio + duracaoDoBalao(ultima.fala) + 0.2);
      const final = ultima.depois?.expressao ?? (FALAS[ultima.fala].expressao as Expressao);
      if (desde < 0.25 && final !== descanso) return { expressao: descanso, anterior: final, troca: Math.max(0, desde / 0.25), boca: null };
    }
    return { expressao: descanso, troca: 1, boca: null };
  }
  const base = FALAS[ativa.fala].expressao as Expressao;
  const falando = ativa.local <= duracaoDaVoz(ativa.fala) + 0.05;
  const boca = falando ? bocaEm(ativa.fala, ativa.local) : null;
  if (ativa.depois && ativa.local >= ativa.depois.em) return { expressao: ativa.depois.expressao, anterior: base, troca: Math.min(1, (ativa.local - ativa.depois.em) / 0.22), boca };
  return { expressao: base, anterior: descanso, troca: Math.min(1, ativa.local / 0.2), boca };
}

type Props = {
  /** As falas do vídeo com o instante absoluto (s). */
  falas: FalaAtiva[];
  /** Quando o narrador aparece e some (s absolutos); fora disso, fica escondido. */
  janelas: { de: number; ate: number }[];
  formato: "16x9" | "9x16";
};

export function Narrador({ falas, janelas, formato }: Props) {
  const quadro = useCurrentFrame();
  const t = quadro / FPS;
  const janela = janelas.find((item) => t >= item.de - 0.05 && t <= item.ate + 0.25);
  if (!janela) return null;
  const aparece = rampa(t, janela.de, janela.de + 0.3, elastico) * (1 - rampa(t, janela.ate, janela.ate + 0.2, sai));
  const ativa = falaEm(falas, t);
  const estado = expressaoEm(falas, t);
  const vertical = formato === "9x16";
  const circulo = vertical ? 190 : 196;
  const letra = vertical ? 54 : 44;
  // 9:16: nada essencial nos 380 px de baixo nem nos 120 px da direita.
  const posicao = vertical ? { left: 44, bottom: 400 } : { left: 48, bottom: 44 };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", ...posicao, display: "flex", alignItems: "flex-end", gap: letra * 0.62 }}>
        <div
          style={{
            width: circulo,
            height: circulo,
            flexShrink: 0,
            borderRadius: "50%",
            background: "var(--cor-superficie)",
            border: `${vertical ? 7 : 6}px solid var(--cor-borda)`,
            boxShadow: "0 10px 0 var(--cor-sombra)",
            display: "grid",
            placeItems: "center",
            transform: `scale(${aparece})`,
            transformOrigin: "50% 100%",
          }}
        >
          <div style={{ marginTop: circulo * 0.06 }}>
            <MascoteVideo tamanho={circulo * 0.74} expressao={estado.expressao} anterior={estado.anterior} troca={estado.troca} boca={estado.boca} quadro={quadro} enfeites={false} semente={11} />
          </div>
        </div>
        {ativa ? (
          <div style={{ marginBottom: circulo * 0.16 }}>
            <Balao texto={FALAS[ativa.fala].texto} t={ativa.local} voz={duracaoDaVoz(ativa.fala)} duracao={duracaoDoBalao(ativa.fala)} letra={letra} larguraMaxima={vertical ? 640 : 1020} rabo="esquerda" />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
}
