/* Um bloco feito só de cortes de tomadas (Sites, Lógica, Origens, Tudo o mais), com as palavras no ritmo. */
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { q } from "../../lib/tempo";
import { PalavraNoRitmo } from "../../pecas/PalavrasNoRitmo";
import { DURACAO_DO_MERGULHO, Tomada } from "../../pecas/Tomada";
import { CartaoDeTomada } from "../../pecas/CartaoDeTomada";
import { medidas, tempoDoBloco, type PropsDoBloco } from "./comum";

export function Cortes({ bloco, formato }: PropsDoBloco) {
  const quadro = useCurrentFrame();
  const t = tempoDoBloco(quadro);
  const { l, a } = medidas(formato);
  const vertical = formato === "9x16";
  return (
    <AbsoluteFill style={{ background: "var(--cor-fundo)" }}>
      {bloco.cortes.map((corte, indice) => (
        <Sequence key={`${corte.tomada}-${corte.em}`} from={q(corte.em)} durationInFrames={Math.max(1, q(corte.em + corte.duracao) - q(corte.em))}>
          {corte.recorte ? <CartaoDeTomada corte={corte} largura={l} altura={a} indice={indice} /> : <Tomada corte={corte} largura={l} altura={a} teto={vertical ? 1.45 : undefined} />}
        </Sequence>
      ))}
      {bloco.cortes.map((corte, indice) => {
        if (!corte.palavra || corte.recorte) return null;
        const atraso = corte.mergulho ? DURACAO_DO_MERGULHO : 0.04;
        return (
          <div key={`palavra-${corte.em}`} style={{ position: "absolute", left: vertical ? 48 : 60, top: vertical ? 330 : 52 }}>
            <PalavraNoRitmo palavra={corte.palavra} t={t - corte.em - atraso} duracao={corte.duracao - atraso} letra={vertical ? 104 : 116} indice={indice} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
