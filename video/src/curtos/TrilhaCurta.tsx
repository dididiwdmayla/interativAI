/*
 * O som de um curto, todo montado a partir do roteiro:
 * - a música: a janela escolhida por medida (public/musica/curto-<id>.wav, do scripts/vozes.mjs), do
 *   primeiro ao último quadro, sem entrada nem saída (o vídeo repete em laço);
 * - ela abaixa 8 dB nas falas do computadorzinho e 6 dB nos efeitos importantes; a conta dá a volta no
 *   fim do vídeo, para o volume do último quadro emendar no do primeiro;
 * - a voz de modem, os efeitos do jogo, os sons próprios dos curtos e os toques e teclas das gravações.
 */
import { Audio, Sequence, staticFile } from "remotion";
import { FPS } from "../roteiro";
import { instante, takeDe } from "../lib/tomadas";
import { cortesDo, DURACAO, falasDo, JANELAS, segundoDa, sonsDo, type IdCurto } from "./roteiro";
import { vozDe } from "./voz";

const VOLUME_MUSICA = 0.56;
const VOLUME_VOZ = 1.3;
const VOLUME_EFEITO = 0.75;
const VOLUME_SINT = 0.85;
const NA_FALA = 10 ** (-8 / 20);
const NO_EFEITO = 10 ** (-6 / 20);
/** Quanto dura o abaixamento de um efeito importante (s) e as curvas de entrada e saída. */
const DURACAO_DO_EFEITO = 0.5;
const CURVA_DA_FALA = 0.15;
const CURVA_DO_EFEITO = 0.07;

type Intervalo = { de: number; ate: number; fundo: number; curva: number };

/** Quanto a música abaixa no instante `t` (o menor volume entre os intervalos que pegam `t`, com as curvas nas pontas). */
function abaixamento(intervalos: Intervalo[], t: number, duracao: number): number {
  let volume = 1;
  for (const intervalo of intervalos) {
    // O vídeo repete: um som do começo já abaixa a música no fim, e vice-versa.
    for (const volta of [-duracao, 0, duracao]) {
      const de = intervalo.de + volta;
      const ate = intervalo.ate + volta;
      if (t <= de - intervalo.curva || t >= ate + intervalo.curva) continue;
      const p = Math.min(1, (t - (de - intervalo.curva)) / intervalo.curva, (ate + intervalo.curva - t) / intervalo.curva);
      volume = Math.min(volume, 1 - (1 - intervalo.fundo) * p);
    }
  }
  return volume;
}

type Props = {
  curto: IdCurto;
  /** Um trecho em que a música some de vez (o silêncio do nocaute), em quadros. */
  silencio?: { de: number; quadros: number };
  /** Só para a revisão: toca uma parte só da trilha. */
  so?: "musica" | "voz" | "efeitos";
};

export function TrilhaCurta({ curto, silencio, so }: Props) {
  const duracao = DURACAO[curto];
  const q = (segundos: number) => Math.max(0, Math.round(segundos * FPS));
  const falas = falasDo(curto).map((item) => ({ ...item, inicio: segundoDa(curto, item.em), voz: vozDe(item.fala.id) }));
  const sons = sonsDo(curto).map((som) => ({ ...som, inicio: segundoDa(curto, som.em) }));
  const intervalos: Intervalo[] = [
    ...falas.map((fala) => ({ de: fala.inicio, ate: fala.inicio + fala.voz.duracao, fundo: NA_FALA, curva: CURVA_DA_FALA })),
    ...sons.filter((som) => som.importante).map((som) => ({ de: som.inicio, ate: som.inicio + DURACAO_DO_EFEITO, fundo: NO_EFEITO, curva: CURVA_DO_EFEITO })),
  ];

  // Os sons que saem do take.json: cada toque e cada tecla dos cortes que pedem som.
  const sonsDosCortes = cortesDo(curto).flatMap((corte) => {
    if (!corte.sons) return [];
    const take = takeDe(corte.tomada);
    const de = instante(take, corte.inicio);
    const velocidade = corte.velocidade ?? 1;
    const comeco = segundoDa(curto, corte.de);
    const fim = segundoDa(curto, corte.ate);
    let tecla = 0;
    return take.eventos.flatMap((evento) => {
      const quando = comeco + (evento.t - de) / velocidade;
      if (quando < comeco || quando > fim - 0.03) return [];
      if (evento.tipo === "tecla") {
        tecla += 1;
        const id = evento.letra === "Enter" || evento.letra === "Backspace" ? "sint-tecla-enter" : evento.letra === " " ? "sint-tecla-4" : `sint-tecla-${[1, 2, 3, 5, 6][tecla % 5]}`;
        return [{ id, quando, volume: 0.55 }];
      }
      if (evento.tipo === "toque") return [{ id: "sint-clique", quando, volume: 0.55 }];
      return [];
    });
  });

  // O vídeo repete: nenhum efeito pode estar soando no último quadro (a cauda cortada vira um estalo na
  // emenda). Quem ainda estiver tocando some nos últimos décimos.
  const SAIDA_DO_LACO = 0.3;
  const noFim = (inicioEmQuadros: number) => (quadro: number) => Math.min(1, Math.max(0, (duracao - 0.04 - (inicioEmQuadros + quadro) / FPS) / SAIDA_DO_LACO));

  const musicaLigada = !so || so === "musica";
  const vozLigada = !so || so === "voz";
  const efeitosLigados = !so || so === "efeitos";
  const volumeDaMusica = (quadro: number) => {
    if (silencio && quadro >= silencio.de && quadro < silencio.de + silencio.quadros) return 0;
    return VOLUME_MUSICA * abaixamento(intervalos, quadro / FPS, duracao);
  };
  return (
    <>
      {musicaLigada ? <Audio src={staticFile(`musica/curto-${curto}.wav`)} volume={volumeDaMusica} /> : null}
      {(vozLigada ? falas : []).map((fala) => (
        <Sequence key={`voz-${fala.fala.id}`} from={q(fala.inicio)} durationInFrames={Math.ceil((fala.voz.duracao + 0.15) * FPS)} layout="none">
          <Audio src={staticFile(`vozes/${fala.fala.id}.wav`)} volume={(quadro) => VOLUME_VOZ * noFim(q(fala.inicio))(quadro)} />
        </Sequence>
      ))}
      {(efeitosLigados ? sons : []).map((som, indice) => (
        <Sequence key={`som-${som.id}-${indice}`} from={q(som.inicio)} durationInFrames={FPS * 4} layout="none">
          <Audio src={staticFile(`efeitos/${som.id}.wav`)} volume={(quadro) => (som.volume ?? 1) * (som.id.startsWith("sint-") ? VOLUME_SINT : VOLUME_EFEITO) * noFim(q(som.inicio))(quadro)} />
        </Sequence>
      ))}
      {(efeitosLigados ? sonsDosCortes : []).map((som, indice) => (
        <Sequence key={`toque-${indice}`} from={q(som.quando)} durationInFrames={FPS} layout="none">
          <Audio src={staticFile(`efeitos/${som.id}.wav`)} volume={(quadro) => som.volume * noFim(q(som.quando))(quadro)} />
        </Sequence>
      ))}
    </>
  );
}

/** Para a revisão: os intervalos de fala de um curto (s). */
export const falasNoTempo = (curto: IdCurto): { id: string; texto: string; inicio: number; duracao: number }[] => falasDo(curto).map((item) => ({ id: item.fala.id, texto: item.fala.texto, inicio: segundoDa(curto, item.em), duracao: vozDe(item.fala.id).duracao }));
export const batidaDo = (curto: IdCurto): number => JANELAS[curto].batida;
