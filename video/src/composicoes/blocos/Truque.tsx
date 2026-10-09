/*
 * Bloco 2: o truque. O computadorzinho manda apertar F12, a tecla afunda, e a
 * câmera mergulha na tela dele: lá dentro, o jogo de verdade (a tomada do
 * roteiro). No 16:9, a câmera volta ao computadorzinho no fim.
 */
import { Freeze, Sequence, useCurrentFrame } from "remotion";
import { q, rampa, elastico, sai, vaiEVolta } from "../../lib/tempo";
import { RostoNaTela } from "../../pecas/MascoteVideo";
import { MergulhoNaTela } from "../../pecas/MergulhoNaTela";
import { TeclaF12 } from "../../pecas/TeclaF12";
import { CenaDaTomada, Tomada } from "../../pecas/Tomada";
import { useFalasDoBloco, Fundo, MascoteGrande, medidas, tempoDoBloco, type PropsDoBloco } from "./comum";

const VOLTA = 0.6;

export function Truque({ bloco, formato }: PropsDoBloco) {
  const quadro = useCurrentFrame();
  const t = tempoDoBloco(quadro);
  const m = bloco.momentos ?? {};
  const { l, a } = medidas(formato);
  const vertical = formato === "9x16";
  const falas = useFalasDoBloco(bloco);
  const ultimo = bloco.cortes[bloco.cortes.length - 1];
  const temVolta = typeof m.volta === "number";
  const antes = t < m.mergulho;
  const depois = temVolta && t >= m.volta + VOLTA;
  const aparece = rampa(t, m.tecla, m.tecla + 0.3, elastico);
  const aperto = Math.sin(rampa(t, m.aperto - 0.08, m.aperto + 0.22, vaiEVolta) * Math.PI);
  const tamanhoDaTecla = vertical ? 300 : 320;
  const tecla = vertical ? { left: 560, top: 1270 } : { left: 1440, top: 400 };
  return (
    <Fundo>
      {antes || depois ? (
        <MascoteGrande
          formato={formato}
          quadro={quadro + q(bloco.inicio)}
          t={t}
          falas={falas}
          direcao="direita"
          descanso={depois ? "curioso" : "feliz"}
          // O respiro para antes do mergulho (o monitor tem de estar no lugar exato) e volta depois da câmera sair.
          respiro={antes ? 1 - rampa(t, m.mergulho - 0.7, m.mergulho - 0.15, vaiEVolta) : rampa(t, m.volta + VOLTA, m.volta + VOLTA + 0.7, vaiEVolta)}
        />
      ) : null}
      {antes && aparece > 0 ? (
        <div style={{ position: "absolute", ...tecla, transform: `scale(${aparece * (1 - rampa(t, m.mergulho - 0.12, m.mergulho, sai) * 0.2)}) rotate(${vertical ? -4 : 5}deg)`, transformOrigin: "50% 70%" }}>
          <TeclaF12 tamanho={tamanhoDaTecla} aperto={aperto} />
        </div>
      ) : null}
      {bloco.cortes.map((corte) => (
        <Sequence key={corte.em} from={q(corte.em)} durationInFrames={Math.max(1, q(corte.em + corte.duracao) - q(corte.em))}>
          <Tomada corte={corte} largura={l} altura={a} teto={vertical ? 1.45 : undefined} rosto="apontando" />
        </Sequence>
      ))}
      {temVolta ? (
        <Sequence from={q(m.volta)} durationInFrames={q(VOLTA)}>
          <Volta corte={ultimo} largura={l} altura={a} />
        </Sequence>
      ) : null}
    </Fundo>
  );
}

/** A câmera sai da tela do computadorzinho (o mergulho ao contrário), com a última imagem da tomada parada. */
function Volta({ corte, largura, altura }: { corte: PropsDoBloco["bloco"]["cortes"][number]; largura: number; altura: number }) {
  const quadro = useCurrentFrame();
  const p = 1 - rampa(tempoDoBloco(quadro), 0, VOLTA - 0.12, vaiEVolta);
  const rosto = rampa(tempoDoBloco(quadro), VOLTA - 0.2, VOLTA);
  return (
    <MergulhoNaTela p={Math.min(0.9999, p)} largura={largura} altura={altura} porCima={rosto > 0 ? <RostoNaTela expressao="feliz" opacidade={rosto} /> : null}>
      <Freeze frame={q(corte.duracao) - 1}>
        <CenaDaTomada corte={{ ...corte, cursor: false }} largura={largura} altura={altura} />
      </Freeze>
    </MergulhoNaTela>
  );
}
