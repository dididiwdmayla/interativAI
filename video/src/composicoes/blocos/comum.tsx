/* O que os blocos têm em comum: medidas dos dois formatos e o computadorzinho grande, no meio da tela, com o balão em cima. */
import { createContext, useContext } from "react";
import { AbsoluteFill } from "remotion";
import { FALAS, FPS, type BlocoNoTempo, type Expressao } from "../../roteiro";
import { duracaoDaVoz, duracaoDoBalao } from "../../lib/voz";
import { Balao } from "../../pecas/Balao";
import { MascoteVideo, TELA, VIEWBOX, type Direcao } from "../../pecas/MascoteVideo";
import { centroInicial, unidadeInicial } from "../../pecas/MergulhoNaTela";
import { expressaoEm, falaEm, type FalaAtiva } from "../../pecas/Narrador";

export { Fundo } from "../../pecas/Fundo";

export type Formato = "16x9" | "9x16";
export const medidas = (formato: Formato): { l: number; a: number } => (formato === "16x9" ? { l: 1920, a: 1080 } : { l: 1080, a: 1920 });

export type PropsDoBloco = { bloco: BlocoNoTempo; formato: Formato };

/** Todas as falas do vídeo, com o instante absoluto (a montagem fornece). */
export const FalasDoVideo = createContext<FalaAtiva[]>([]);

/**
 * As falas com o instante relativo ao começo do bloco. Vêm todas as do vídeo, não só as do bloco:
 * um balão que começa no fim de um bloco continua na tela no começo do seguinte.
 */
export function useFalasDoBloco(bloco: BlocoNoTempo): FalaAtiva[] {
  const todas = useContext(FalasDoVideo);
  return todas.map((item) => ({ ...item, inicio: item.inicio - bloco.inicio }));
}

/**
 * A tela apagada (o começo e o fim do vídeo). O preto vem do fundo do tema
 * Fliperama, para nenhuma cor do vídeo ficar fora dos tokens.
 */
export function TelaApagada() {
  return <AbsoluteFill data-theme="fliperama" style={{ background: "var(--cor-fundo)" }} />;
}

type PropsDoMascote = {
  formato: Formato;
  /** Quadro do vídeo (para piscar e respirar sem pular entre os blocos). */
  quadro: number;
  /** Segundos desde o começo do bloco. */
  t: number;
  falas: FalaAtiva[];
  descanso?: Expressao;
  direcao?: Direcao;
  /** Escala em torno do centro da tela do monitor (1: o tamanho de onde o mergulho começa). */
  escala?: number;
  /** Deslocamento em px. */
  dx?: number;
  dy?: number;
  rosto?: number;
  /** Força uma expressão (ignora as falas). */
  expressao?: Expressao;
  boca?: number | null;
  enfeites?: boolean;
  /** Esconde o balão (o bloco desenha o dele). */
  semBalao?: boolean;
  /** Quanto ele respira (0 a 1). Perto do mergulho na tela tem de ser 0, para o monitor ficar exatamente no lugar. */
  respiro?: number;
};

/**
 * O computadorzinho grande, exatamente onde o mergulho na tela começa (a tela
 * dele no mesmo lugar e do mesmo tamanho), com o balão da fala em cima.
 */
export function MascoteGrande({ formato, quadro, t, falas, descanso = "feliz", direcao = "cima", escala = 1, dx = 0, dy = 0, rosto = 1, expressao, boca, enfeites = true, semBalao = false, respiro = 0 }: PropsDoMascote) {
  const { l, a } = medidas(formato);
  const u = unidadeInicial(l, a) * escala;
  const centro = centroInicial(l, a);
  const estado = expressaoEm(falas, t, descanso);
  const ativa = falaEm(falas, t);
  const meioX = TELA.x + TELA.l / 2;
  const meioY = TELA.y + TELA.a / 2;
  const esquerda = centro.x + dx - meioX * u;
  const topo = centro.y + dy - meioY * u;
  const vertical = formato === "9x16";
  const letra = vertical ? 56 : 48;
  return (
    <>
      <div style={{ position: "absolute", left: esquerda, top: topo, width: VIEWBOX.l * u }}>
        <MascoteVideo
          tamanho={VIEWBOX.l * u}
          expressao={expressao ?? estado.expressao}
          anterior={expressao ? undefined : estado.anterior}
          troca={expressao ? 1 : estado.troca}
          boca={boca === undefined ? estado.boca : boca}
          quadro={quadro}
          direcao={direcao}
          rosto={rosto}
          enfeites={enfeites}
          respira={respiro}
        />
      </div>
      {ativa && !semBalao ? (
        <div style={{ position: "absolute", left: 0, width: l, bottom: a - (topo + 22 * u) + letra * 0.7, display: "flex", justifyContent: "center", paddingRight: vertical ? 80 : 0, boxSizing: "border-box" }}>
          <Balao texto={FALAS[ativa.fala].texto} t={ativa.local} voz={duracaoDaVoz(ativa.fala)} duracao={duracaoDoBalao(ativa.fala)} letra={letra} larguraMaxima={vertical ? 820 : 1300} rabo="baixo" />
        </div>
      ) : null}
    </>
  );
}

export const tempoDoBloco = (quadro: number): number => quadro / FPS;
