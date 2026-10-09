/*
 * Uma tomada do jogo no vídeo: a gravação (public/takes/<id>.mp4), a câmera
 * (aproximação até as caixas do take.json), o cursor redesenhado e, quando o
 * corte pede, o mergulho na tela do computadorzinho no começo.
 */
import type { ReactNode } from "react";
import { AbsoluteFill, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";
import { FPS, type Corte, type Expressao } from "../roteiro";
import { transformDaVista, vistaEm, type Vista, ZOOM_MAXIMO } from "../lib/camera";
import type { Area } from "../roteiro";
import { elastico, rampa } from "../lib/tempo";
import { caixa, escalaDa, instante, takeDe, type Take } from "../lib/tomadas";
import { Cursor } from "./Cursor";
import { RostoNaTela } from "./MascoteVideo";
import { MergulhoNaTela } from "./MergulhoNaTela";

/** O mergulho: uns quadros com o monitor inteiro e depois a descida (18 a 24 quadros, spring suave). */
export const ESPERA_DO_MERGULHO = 5;
export const QUADROS_DO_MERGULHO = 22;
export const DURACAO_DO_MERGULHO = (ESPERA_DO_MERGULHO + QUADROS_DO_MERGULHO) / FPS;

export function progressoDoMergulho(quadro: number): number {
  return spring({ frame: quadro - ESPERA_DO_MERGULHO, fps: FPS, durationInFrames: QUADROS_DO_MERGULHO, config: { damping: 200 } });
}

type Props = {
  corte: Corte;
  largura: number;
  altura: number;
  /** O teto do zoom (1,8 no 16:9). */
  teto?: number;
  /** O que vai por cima da gravação, dentro da câmera (em px do vídeo da tomada). */
  children?: (contexto: { take: Take; tempo: number; vista: Vista; escala: number }) => ReactNode;
  /** No mergulho, o rosto que some da tela do monitor quando a cena aparece. */
  rosto?: Expressao;
};

/** Um anel pulsando em volta de uma caixa da gravação (o cadeado do tema secreto, por exemplo). */
function Anel({ area, escala, t, zoom }: { area: Area; escala: number; t: number; zoom: number }) {
  const folga = 16 / zoom;
  const entra = rampa(t, 0, 0.3, elastico);
  const pulso = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 1.5);
  const lado = Math.max(area.l, area.a) * escala + folga * 2;
  return (
    <div
      style={{
        position: "absolute",
        left: (area.x + area.l / 2) * escala - lado / 2,
        top: (area.y + area.a / 2) * escala - lado / 2,
        width: lado,
        height: lado,
        boxSizing: "border-box",
        borderRadius: "50%",
        border: `${6 / zoom}px solid var(--cor-destaque)`,
        boxShadow: `0 0 ${(14 + 26 * pulso) / zoom}px var(--cor-destaque)`,
        transform: `scale(${entra * (1 + 0.14 * pulso)})`,
      }}
    />
  );
}

/** A gravação com a câmera e o cursor, sem o mergulho. */
export function CenaDaTomada({ corte, largura, altura, teto = ZOOM_MAXIMO, children }: Props) {
  const quadro = useCurrentFrame();
  const take = takeDe(corte.tomada);
  const velocidade = corte.velocidade ?? 1;
  const de = instante(take, corte.de);
  const local = quadro / FPS;
  const tempo = Math.min(take.duracao - 0.05, de + local * velocidade);
  const vista = vistaEm(take, corte.camera, local, largura, altura, teto);
  const escala = escalaDa(take);
  return (
    <AbsoluteFill style={{ background: "var(--cor-fundo)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: largura, height: altura, transformOrigin: "0 0", transform: transformDaVista(vista, largura, altura) }}>
        <OffthreadVideo src={staticFile(`takes/${corte.tomada}.mp4`)} startFrom={Math.round(de * FPS)} playbackRate={velocidade} muted style={{ position: "absolute", left: 0, top: 0, width: largura, height: altura }} />
        {children ? children({ take, tempo, vista, escala }) : null}
        {corte.realce && local >= corte.realce.de ? <Anel area={caixa(take, corte.realce.caixa)} escala={escala} t={local - corte.realce.de} zoom={vista.zoom} /> : null}
        {corte.cursor === false ? null : <Cursor take={take} tempo={tempo} velocidade={velocidade} escala={escala} zoom={vista.zoom} />}
      </div>
    </AbsoluteFill>
  );
}

export function Tomada(props: Props) {
  const quadro = useCurrentFrame();
  if (!props.corte.mergulho) return <CenaDaTomada {...props} />;
  const p = progressoDoMergulho(quadro);
  const rosto = 1 - Math.min(1, quadro / ESPERA_DO_MERGULHO);
  return (
    <MergulhoNaTela p={p} largura={props.largura} altura={props.altura} porCima={rosto > 0 ? <RostoNaTela expressao={props.rosto ?? "feliz"} opacidade={rosto} /> : null}>
      <CenaDaTomada {...props} />
    </MergulhoNaTela>
  );
}
