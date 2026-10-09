/*
 * O som do vídeo, todo montado a partir do roteiro:
 * - a música de cada bloco (a da ilha que está na tela), com cruzamento de
 *   1,5 s entre uma faixa e outra e o compasso 1 da faixa nova em cima do corte;
 * - a música abaixa 8 dB enquanto o computadorzinho fala (curva de 150 ms);
 * - a voz de modem de cada fala;
 * - os efeitos gravados do jogo e os sintetizados pelas receitas do jogo
 *   (o tique de cada objetivo, o clique do cursor, as teclas).
 */
import { Audio, Sequence, staticFile } from "remotion";
import batidas from "../dados/batidas.json";
import { FPS, type BlocoNoTempo, type IdMusica } from "../roteiro";
import { instante, takeDe } from "../lib/tomadas";
import { partesDaFala } from "../lib/voz";

const CRUZAMENTO = 1.5;
const VOLUME_MUSICA = 0.36;
/** -8 dB. */
const ABAIXADA = 10 ** (-8 / 20);
const CURVA = 0.15;
const VOLUME_VOZ = 1.3;
const VOLUME_EFEITO = 0.75;
const VOLUME_SINT = 0.8;

type Trecho = { musica: IdMusica; inicio: number; fim: number; de: number; primeiro: boolean; ultimo: boolean };

/** Blocos seguidos com a mesma música viram um trecho só (a faixa continua tocando). */
export function trechosDeMusica(blocos: BlocoNoTempo[]): Trecho[] {
  const trechos: Trecho[] = [];
  for (const bloco of blocos) {
    const anterior = trechos.at(-1);
    if (!bloco.musica) continue;
    if (anterior && anterior.musica === bloco.musica && bloco.musicaDe === undefined && Math.abs(anterior.fim - bloco.inicio) < 0.01) {
      anterior.fim = bloco.fim;
      continue;
    }
    trechos.push({ musica: bloco.musica, inicio: bloco.inicio, fim: bloco.fim, de: bloco.musicaDe ?? 0, primeiro: false, ultimo: false });
  }
  trechos.forEach((trecho, indice) => {
    trecho.primeiro = indice === 0 || Math.abs(trechos[indice - 1].fim - trecho.inicio) > 0.01;
    trecho.ultimo = indice === trechos.length - 1 || Math.abs(trechos[indice + 1].inicio - trecho.fim) > 0.01;
  });
  return trechos;
}

type Intervalo = { de: number; ate: number };

/** Quanto a música abaixa no instante `t`: 1 sem voz, -8 dB com voz, com a curva de 150 ms nas pontas. */
function abaixamento(falas: Intervalo[], t: number): number {
  let p = 0;
  for (const fala of falas) {
    if (t <= fala.de - CURVA || t >= fala.ate + CURVA) continue;
    const entrando = Math.min(1, (t - (fala.de - CURVA)) / CURVA);
    const saindo = Math.min(1, (fala.ate + CURVA - t) / CURVA);
    p = Math.max(p, Math.min(entrando, saindo));
  }
  return 1 - (1 - ABAIXADA) * p;
}

/** O volume do trecho no instante `t`: entra e sai no cruzamento de 1,5 s centrado no corte. */
function envelope(trecho: Trecho, t: number): number {
  const meia = CRUZAMENTO / 2;
  // A primeira música entra de uma vez, no tempo forte; a última sai devagar antes do fim.
  const entrada = trecho.primeiro ? Math.min(1, Math.max(0, (t - trecho.inicio) / 0.06)) : Math.min(1, Math.max(0, (t - (trecho.inicio - meia)) / CRUZAMENTO));
  const saida = trecho.ultimo ? Math.min(1, Math.max(0, (trecho.fim - t) / 1.4)) : Math.min(1, Math.max(0, (trecho.fim + meia - t) / CRUZAMENTO));
  return entrada * saida;
}

/** `so`: toca só uma parte da trilha (para a revisão medir a voz e a música em separado). */
type Props = { blocos: BlocoNoTempo[]; so?: "musica" | "voz" | "efeitos" };

export function Trilha({ blocos, so }: Props) {
  const falas = blocos.flatMap((bloco) => bloco.falas.map((item) => ({ ...item, inicio: bloco.inicio + item.em })));
  const vozes = falas.flatMap((fala) => partesDaFala(fala.fala).map((parte) => ({ ...parte, inicio: fala.inicio + parte.inicio })));
  const falando: Intervalo[] = vozes.map((voz) => ({ de: voz.inicio, ate: voz.inicio + voz.duracao }));
  const trechos = trechosDeMusica(blocos);
  const q = (segundos: number) => Math.max(0, Math.round(segundos * FPS));

  // Os sons que saem do take.json: cada tecla e cada clique dos cortes que pedem som.
  const sonsDosCortes = blocos.flatMap((bloco) =>
    bloco.cortes.flatMap((corte) => {
      if (!corte.sons) return [];
      const take = takeDe(corte.tomada);
      const de = instante(take, corte.de);
      const velocidade = corte.velocidade ?? 1;
      let tecla = 0;
      return take.eventos.flatMap((evento) => {
        const local = (evento.t - de) / velocidade;
        if (local < 0 || local > corte.duracao - 0.03) return [];
        const quando = bloco.inicio + corte.em + local;
        if (evento.tipo === "tecla") {
          tecla += 1;
          const id = evento.letra === "Enter" ? "sint-tecla-enter" : evento.letra === " " ? "sint-tecla-4" : `sint-tecla-${[1, 2, 3, 5, 6][tecla % 5]}`;
          return [{ id, quando, volume: 0.55 }];
        }
        if (evento.tipo === "clique" || evento.tipo === "duplo-clique" || evento.tipo === "toque") return [{ id: "sint-clique", quando, volume: 0.5 }];
        return [];
      });
    }),
  );

  const musicaLigada = !so || so === "musica";
  const vozLigada = !so || so === "voz";
  const efeitosLigados = !so || so === "efeitos";
  return (
    <>
      {(musicaLigada ? trechos : []).map((trecho) => {
        const loop = batidas[trecho.musica].duracaoSegundos;
        const meia = trecho.primeiro ? 0 : CRUZAMENTO / 2;
        const comeco = trecho.inicio - meia;
        const fim = trecho.fim + (trecho.ultimo ? 0 : CRUZAMENTO / 2);
        // A faixa começa antes do corte (a levada do fim do loop), para o compasso `de` cair em cima dele.
        const deNaFaixa = (((trecho.de - meia) % loop) + loop) % loop;
        const volume = (quadro: number) => {
          const t = comeco + quadro / FPS;
          return VOLUME_MUSICA * envelope(trecho, t) * abaixamento(falando, t);
        };
        return (
          <Sequence key={`${trecho.musica}-${trecho.inicio}`} from={q(comeco)} durationInFrames={Math.max(1, q(fim) - q(comeco))} layout="none">
            <Audio src={staticFile(`musica/${trecho.musica}.wav`)} startFrom={Math.round(deNaFaixa * FPS)} loop volume={volume} />
          </Sequence>
        );
      })}
      {(vozLigada ? vozes : []).map((voz) => (
        <Sequence key={`voz-${voz.id}-${voz.inicio}`} from={q(voz.inicio)} durationInFrames={Math.ceil((voz.duracao + 0.15) * FPS)} layout="none">
          <Audio src={staticFile(`vozes/${voz.id}.wav`)} volume={VOLUME_VOZ} />
        </Sequence>
      ))}
      {(efeitosLigados ? blocos : []).flatMap((bloco) =>
        bloco.efeitos.map((efeito) => {
          const sintetizado = efeito.id.startsWith("sint-");
          return (
            <Sequence key={`${bloco.id}-${efeito.id}-${efeito.em}`} from={q(bloco.inicio + efeito.em)} durationInFrames={FPS * 5} layout="none">
              <Audio src={staticFile(`efeitos/${efeito.id}.wav`)} volume={(efeito.volume ?? 1) * (sintetizado ? VOLUME_SINT : VOLUME_EFEITO)} />
            </Sequence>
          );
        }),
      )}
      {(efeitosLigados ? blocos : []).flatMap((bloco) =>
        [bloco.objetivo, ...(bloco.maisObjetivos ?? [])].flatMap((objetivo) =>
          objetivo
            ? [
                <Sequence key={`tique-${bloco.id}-${objetivo.indice}`} from={q(bloco.inicio + objetivo.em)} durationInFrames={FPS * 2} layout="none">
                  <Audio src={staticFile("efeitos/sint-acerto.wav")} volume={VOLUME_SINT} />
                </Sequence>,
              ]
            : [],
        ),
      )}
      {(efeitosLigados ? sonsDosCortes : []).map((som, indice) => (
        <Sequence key={`som-${indice}`} from={q(som.quando)} durationInFrames={FPS} layout="none">
          <Audio src={staticFile(`efeitos/${som.id}.wav`)} volume={som.volume} />
        </Sequence>
      ))}
    </>
  );
}
