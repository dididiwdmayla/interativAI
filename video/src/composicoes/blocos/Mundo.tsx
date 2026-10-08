/*
 * Bloco 4: o mundo. A câmera mergulha no mapa de dia (T02); no meio do
 * arrasto, uma linha diagonal varre a tela e troca o dia pela noite (T03,
 * gravada com o mesmo caminho e a mesma velocidade), no mesmo enquadramento.
 * Os nomes das ilhas que passam ganham um realce curto.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { Corte } from "../../roteiro";
import { elastico, rampa, sai, vaiEVolta } from "../../lib/tempo";
import { ilhasDa, instante, marca, takeDe, type Take } from "../../lib/tomadas";
import { MergulhoNaTela } from "../../pecas/MergulhoNaTela";
import { RostoNaTela } from "../../pecas/MascoteVideo";
import { CenaDaTomada, DURACAO_DO_MERGULHO, ESPERA_DO_MERGULHO, progressoDoMergulho } from "../../pecas/Tomada";
import { medidas, tempoDoBloco, type PropsDoBloco } from "./comum";

/** A mesma curva do rolarSuave do gravador (vai e volta quadrático). */
const curva = (p: number): number => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);

/** Quanto o mundo já rolou (px da página) no instante `tempo` da tomada. */
function rolagem(take: Take, tempo: number): number {
  const evento = take.eventos.find((item) => item.tipo === "marca" && item.nome === "rolar");
  if (!evento) return 0;
  const p = Math.min(1, Math.max(0, (tempo - evento.t) / ((evento.ms ?? 1) / 1000)));
  return (evento.dx ?? 0) * curva(p);
}

/** O instante da tomada em que cada ilha ganha o realce: quando o nome passa pelo meio da tela, ou em sequência no começo e no fim. */
function realces(take: Take, de: number, limite: number): { ilha: string; quando: number }[] {
  const evento = take.eventos.find((item) => item.tipo === "marca" && item.nome === "rolar");
  const inicio = evento?.t ?? 0;
  const duracao = (evento?.ms ?? 1) / 1000;
  const total = evento?.dx ?? 0;
  let noComeco = 0;
  let noFim = 0;
  return ilhasDa(take)
    .sort((a, b) => a.x - b.x)
    .map((ilha) => {
      const falta = ilha.x + ilha.l / 2 - limite;
      if (falta <= 0) return { ilha: ilha.ilha, quando: de + DURACAO_DO_MERGULHO + 0.35 + 0.42 * noComeco++ };
      if (falta >= total) return { ilha: ilha.ilha, quando: inicio + duracao - 0.9 + 0.45 * noFim++ };
      // Inverte a curva da rolagem: em que instante o mundo rolou `falta` px.
      const fracao = falta / total;
      const p = fracao < 0.5 ? Math.sqrt(fracao / 2) : 1 - Math.sqrt((1 - fracao) / 2);
      return { ilha: ilha.ilha, quando: inicio + p * duracao };
    });
}

export function Mundo({ bloco, formato }: PropsDoBloco) {
  const quadro = useCurrentFrame();
  const t = tempoDoBloco(quadro);
  const m = bloco.momentos ?? {};
  const { l, a } = medidas(formato);
  const corte = bloco.cortes[0];
  const dia = takeDe("T02-mundo-dia");
  const noite = takeDe("T03-mundo-noite");
  const de = instante(dia, corte.de);
  // A noite toca no mesmo ponto do caminho: alinhada pela marca "rolar" das duas tomadas.
  const corteDaNoite: Corte = { ...corte, tomada: "T03-mundo-noite", de: de - marca(dia, "rolar") + marca(noite, "rolar"), mergulho: false };
  const virada = rampa(t, m.virada, m.virada + m.viradaDura, vaiEVolta);
  const inclinacao = 190;
  const x = -inclinacao - 40 + (l + inclinacao * 2 + 80) * virada;
  const lista = realces(dia, de, dia.pagina.largura * 0.66);
  const p = progressoDoMergulho(quadro);
  const rosto = 1 - Math.min(1, quadro / ESPERA_DO_MERGULHO);
  // O realce dos nomes vale para as duas tomadas (a noite toca deslocada no tempo da gravação).
  const atraso = marca(noite, "rolar") - marca(dia, "rolar");
  const Realces = ({ take, tempo, escala, deslocamento }: { take: Take; tempo: number; escala: number; deslocamento: number }) => (
    <>
      {lista.map((item) => {
        const ilha = ilhasDa(take).find((outra) => outra.ilha === item.ilha);
        const desde = tempo - deslocamento - item.quando;
        if (!ilha || desde < 0 || desde > 1.1) return null;
        const andou = rolagem(take, tempo);
        const folga = 14;
        const entra = rampa(desde, 0, 0.28, elastico);
        const some = 1 - rampa(desde, 0.7, 1.1, sai);
        return (
          <div
            key={item.ilha}
            style={{
              position: "absolute",
              left: (ilha.x - andou) * escala - folga,
              top: ilha.y * escala - folga,
              width: ilha.l * escala + folga * 2,
              height: ilha.a * escala + folga * 2,
              boxSizing: "border-box",
              borderRadius: 26,
              border: "6px solid var(--cor-destaque)",
              boxShadow: "0 0 26px var(--cor-destaque)",
              opacity: some,
              transform: `scale(${0.7 + 0.3 * entra + 0.1 * (1 - some)})`,
            }}
          />
        );
      })}
    </>
  );
  return (
    <MergulhoNaTela p={p} largura={l} altura={a} porCima={rosto > 0 ? <RostoNaTela expressao="feliz" opacidade={rosto} /> : null}>
      <CenaDaTomada corte={{ ...corte, mergulho: false }} largura={l} altura={a}>
        {({ take, tempo, escala }) => <Realces take={take} tempo={tempo} escala={escala} deslocamento={0} />}
      </CenaDaTomada>
      {virada > 0 ? (
        <AbsoluteFill style={{ clipPath: `polygon(0px 0px, ${x + inclinacao}px 0px, ${x - inclinacao}px ${a}px, 0px ${a}px)` }}>
          <CenaDaTomada corte={corteDaNoite} largura={l} altura={a}>
            {({ take, tempo, escala }) => <Realces take={take} tempo={tempo} escala={escala} deslocamento={atraso} />}
          </CenaDaTomada>
        </AbsoluteFill>
      ) : null}
      {virada > 0 && virada < 1 ? (
        <svg width={l} height={a} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={x + inclinacao} y1={-20} x2={x - inclinacao} y2={a + 20} stroke="var(--cor-farol-luz)" strokeWidth={22} opacity={0.35} />
          <line x1={x + inclinacao} y1={-20} x2={x - inclinacao} y2={a + 20} stroke="var(--cor-estrela)" strokeWidth={7} />
        </svg>
      ) : null}
    </MergulhoNaTela>
  );
}
