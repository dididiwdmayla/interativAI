/*
 * Bloco 1: tela preta, uma linha horizontal acende como um monitor antigo
 * ligando, a imagem abre, o monitor do computadorzinho surge do centro com o
 * rosto apagado, e ele acorda.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { elastico, rampa, sai, vaiEVolta } from "../../lib/tempo";
import { useFalasDoBloco, Fundo, MascoteGrande, medidas, TelaApagada, tempoDoBloco, type PropsDoBloco } from "./comum";

export function Abertura({ bloco, formato }: PropsDoBloco) {
  const quadro = useCurrentFrame();
  const t = tempoDoBloco(quadro);
  const m = bloco.momentos ?? {};
  const { l, a } = medidas(formato);
  const falas = useFalasDoBloco(bloco);
  // A linha cresce do centro; depois a imagem abre para cima e para baixo.
  const linha = rampa(t, m.linha, m.linha + 0.42, sai);
  const abre = rampa(t, m.abre, m.abre + 0.38, vaiEVolta);
  const alturaVisivel = Math.max(6, a * abre);
  const larguraVisivel = l * (0.06 + 0.94 * linha);
  const surge = rampa(t, m.monitor, m.monitor + 0.55, elastico);
  // Acorda: os olhos fechados aparecem, e logo abrem com um pulinho.
  const rosto = rampa(t, m.acorda - 0.1, m.acorda + 0.12);
  const acordado = t >= m.acorda + 0.42;
  const pulo = acordado ? -34 * Math.sin(rampa(t, m.acorda + 0.42, m.acorda + 0.82) * Math.PI) : 0;
  const clarao = linha * (1 - abre);
  return (
    <AbsoluteFill>
      <TelaApagada />
      {linha > 0 ? (
        <div style={{ position: "absolute", left: (l - larguraVisivel) / 2, top: (a - alturaVisivel) / 2, width: larguraVisivel, height: alturaVisivel, overflow: "hidden", borderRadius: abre < 1 ? 6 : 0 }}>
          <div style={{ position: "absolute", left: -(l - larguraVisivel) / 2, top: -(a - alturaVisivel) / 2, width: l, height: a }}>
            <Fundo>
              <MascoteGrande formato={formato} quadro={quadro} t={t} falas={falas} escala={Math.max(0.001, surge)} dy={pulo} rosto={rosto} expressao={acordado ? undefined : "dormindo"} enfeites={false} respiro={rampa(t, m.acorda + 0.9, m.acorda + 1.6)} />
            </Fundo>
          </div>
          {/* O clarão da linha do tubo ligando. */}
          <AbsoluteFill style={{ background: "var(--cor-mascote-tela)", opacity: clarao }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
}
