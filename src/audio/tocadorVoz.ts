import { criarSintetizador } from "./sintese";
import type { EventoVoz } from "./vozModem";

/*
 * Parte que toca a voz de modem: recebe a lista de eventos (vozModem.ts) e
 * agenda cada um no Web Audio, em `destino`, a partir de `t0`.
 */

/** Ganho de referência dos eventos da voz; o barramento "voz" aplica o volume do jogador. */
const GANHO_VOZ = 0.09;

export function tocarEventosVoz(ctx: BaseAudioContext, destino: AudioNode, t0: number, eventos: readonly EventoVoz[]): void {
  const s = criarSintetizador(ctx, destino, t0);
  for (const evento of eventos) {
    const ganho = evento.ganho * GANHO_VOZ;
    switch (evento.tipo) {
      case "blip":
        if (evento.forma === "fm") {
          s.fm({
            frequencia: evento.frequencia,
            frequenciaFinal: evento.frequenciaFinal,
            inicio: evento.tempo,
            duracao: evento.duracao,
            ganho: ganho * 1.2,
            razao: 2,
            indice: 0.6,
            ataque: 0.006,
          });
        } else {
          s.tom({
            frequencia: evento.frequencia,
            frequenciaFinal: evento.frequenciaFinal,
            inicio: evento.tempo,
            duracao: evento.duracao,
            ganho: ganho * 0.55,
            forma: "square",
            ataque: 0.006,
          });
        }
        break;
      case "chiado":
        s.ruido({ inicio: evento.tempo, duracao: evento.duracao, ganho, frequencia: evento.frequencia, q: 3 });
        break;
      case "tom":
      case "varrido":
        s.tom({
          frequencia: evento.frequencia,
          frequenciaFinal: evento.frequenciaFinal,
          inicio: evento.tempo,
          duracao: evento.duracao,
          ganho,
          forma: "sine",
          ataque: 0.005,
        });
        break;
    }
  }
}
