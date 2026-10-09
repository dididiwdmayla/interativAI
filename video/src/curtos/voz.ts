/* As vozes dos curtos (src/dados/vozes.json, geradas pelo scripts/vozes.mjs): a duração e a boca do computadorzinho. */
import indice from "../dados/vozes.json";

type EventoDeVoz = { t: number; d: number; tipo: "blip" | "chiado" | "tom" | "varrido" };
type Voz = { texto: string; duracao: number; eventos: EventoDeVoz[] };
const VOZES = indice as unknown as Record<string, Voz>;

export function vozDe(id: string): Voz {
  const voz = VOZES[id];
  if (!voz) throw new Error(`falta a voz "${id}": rode node scripts/vozes.mjs`);
  return voz;
}

/** A boca no instante `t` (s desde o começo da fala): aberta nos apitos, meio aberta nos chiados, fechada nas pausas. */
export function bocaDaVoz(id: string, t: number): number {
  const voz = vozDe(id);
  if (t < 0 || t > voz.duracao + 0.05) return 0;
  let abertura = 0;
  for (const evento of voz.eventos) {
    if (t < evento.t - 0.01 || t > evento.t + evento.d + 0.035) continue;
    abertura = Math.max(abertura, evento.tipo === "blip" ? 1 : evento.tipo === "chiado" ? 0.5 : 0.35);
  }
  return abertura;
}
