/*
 * Uma gravação do jogo nos curtos: o vídeo da tomada em tela cheia (1080 x 1920),
 * com a câmera do roteiro (um ponto da página vai para a âncora do quadro, com
 * zoom) e o dedo redesenhado a partir do take.json. Diferente da câmera da
 * apresentação, esta pode mostrar além da borda da gravação: o que sobra é o
 * fundo do tema, a mesma cor do fundo das telas do jogo.
 */
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { FPS } from "../../roteiro";
import { mistura, rampa, vaiEVolta } from "../../lib/tempo";
import { instante, takeDe } from "../../lib/tomadas";
import { Cursor } from "../../pecas/Cursor";
import { JANELAS, type CorteCurto, type IdCurto, type QuadroCurto } from "../roteiro";

const ANCORA = { x: 540, y: 880 };
export type VistaCurta = { x: number; y: number; zoom: number; ancora: { x: number; y: number } };

/** A câmera no instante `b` (batidas desde o começo do corte), entre os quadros do roteiro. */
export function cameraEm(quadros: QuadroCurto[], b: number): VistaCurta {
  const de = (quadro: QuadroCurto): VistaCurta => ({ x: quadro.x, y: quadro.y, zoom: quadro.zoom, ancora: quadro.ancora ?? ANCORA });
  let vista = de(quadros[0]);
  for (let i = 1; i < quadros.length; i++) {
    const quadro = quadros[i];
    const leva = quadro.leva ?? 0.5;
    const p = rampa(b, quadro.em - leva, quadro.em, vaiEVolta);
    if (p <= 0) break;
    const alvo = de(quadro);
    // O zoom anda em escala logarítmica: a aproximação parece constante.
    vista = { x: mistura(vista.x, alvo.x, p), y: mistura(vista.y, alvo.y, p), zoom: Math.exp(mistura(Math.log(vista.zoom), Math.log(alvo.zoom), p)), ancora: { x: mistura(vista.ancora.x, alvo.ancora.x, p), y: mistura(vista.ancora.y, alvo.ancora.y, p) } };
  }
  return vista;
}

type Props = {
  curto: IdCurto;
  corte: CorteCurto;
  /** Um tranco na câmera (px), para os golpes. */
  tremor?: { x: number; y: number };
  /** Um zoom a mais (1: nenhum), para o soco de câmera dos golpes. */
  soco?: number;
};

export function TomadaCurta({ curto, corte, tremor, soco = 1 }: Props) {
  const quadro = useCurrentFrame();
  const take = takeDe(corte.tomada);
  const velocidade = corte.velocidade ?? 1;
  const de = instante(take, corte.inicio);
  const local = quadro / FPS;
  const tempo = Math.min(take.duracao - 0.05, de + local * velocidade);
  const vista = cameraEm(corte.camera, local / JANELAS[curto].batida);
  const zoom = vista.zoom * soco;
  // Px da página gravada -> px do quadro (a tomada de celular tem a largura do quadro).
  const k = take.saida.largura / take.pagina.largura;
  const x = vista.ancora.x - vista.x * k * zoom + (tremor?.x ?? 0);
  const y = vista.ancora.y - vista.y * k * zoom + (tremor?.y ?? 0);
  return (
    <AbsoluteFill style={{ background: "var(--cor-fundo)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: take.saida.largura, height: take.saida.altura, transformOrigin: "0 0", transform: `translate(${x}px, ${y}px) scale(${zoom})` }}>
        <OffthreadVideo src={staticFile(`takes/${corte.tomada}.mp4`)} startFrom={Math.max(0, Math.round(de * FPS))} playbackRate={velocidade} muted style={{ position: "absolute", left: 0, top: 0, width: take.saida.largura, height: take.saida.altura }} />
        {corte.dedo === false ? null : <Cursor take={take} tempo={tempo} velocidade={velocidade} escala={k} zoom={zoom} />}
      </div>
    </AbsoluteFill>
  );
}
