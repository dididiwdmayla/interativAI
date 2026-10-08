/* As vozes geradas (src/dados/vozes.json): a duração e os eventos que mexem a boca. */
import indice from "../dados/vozes.json";
import { FALAS, type Fala, type IdFala, tempoDoBalao } from "../roteiro";

type EventoDeVoz = { t: number; d: number; tipo: "blip" | "chiado" | "tom" | "varrido" };
type Voz = { fala: string; texto: string; expressao: string; duracao: number; eventos: EventoDeVoz[] };
const VOZES = indice as unknown as Record<string, Voz>;

export type ParteTocada = { id: string; inicio: number; duracao: number; eventos: EventoDeVoz[] };

/** Os arquivos de voz de uma fala, em sequência (uma parte só, ou uma por humor). */
export function partesDaFala(id: IdFala): ParteTocada[] {
  const fala = FALAS[id] as Fala;
  const ids = fala.vozes ? fala.vozes.map((parte) => parte.id) : [id];
  let inicio = 0;
  return ids.map((idDaVoz) => {
    const voz = VOZES[idDaVoz];
    if (!voz) throw new Error(`falta a voz "${idDaVoz}": rode node scripts/vozes.mjs`);
    const parte = { id: idDaVoz, inicio, duracao: voz.duracao, eventos: voz.eventos };
    inicio += voz.duracao + 0.12;
    return parte;
  });
}

/** Quanto dura a voz inteira da fala. */
export function duracaoDaVoz(id: IdFala): number {
  const ultima = partesDaFala(id).at(-1);
  return ultima ? ultima.inicio + ultima.duracao : 0;
}

/** Quanto tempo o balão fica na tela: o mínimo de leitura, e nunca menos que a voz. */
export function duracaoDoBalao(id: IdFala): number {
  return Math.max(tempoDoBalao(FALAS[id].texto), duracaoDaVoz(id) + 0.5);
}

/**
 * A boca no instante `t` (s desde o começo da fala): aberta (1) durante cada
 * apito, meio aberta nos chiados, fechada (0) nas pausas.
 */
export function bocaEm(id: IdFala, t: number): number {
  let abertura = 0;
  for (const parte of partesDaFala(id)) {
    const local = t - parte.inicio;
    if (local < 0 || local > parte.duracao + 0.05) continue;
    for (const evento of parte.eventos) {
      if (local < evento.t - 0.01 || local > evento.t + evento.d + 0.035) continue;
      abertura = Math.max(abertura, evento.tipo === "blip" ? 1 : evento.tipo === "chiado" ? 0.5 : 0.35);
    }
  }
  return abertura;
}
