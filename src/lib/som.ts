"use client";

import { obterProgresso } from "@/lib/armazemProgresso";

/*
 * Sons gerados na hora com a Web Audio API, sem arquivos. O AudioContext só
 * nasce depois da primeira interação do jogador (regra dos navegadores).
 */

export type Som = "acerto" | "clique" | "conclusao" | "aviso";

const VOLUME = 0.06;

let contexto: AudioContext | null = null;
let liberado = false;

/** Chamar a partir de um evento de clique ou tecla. */
export function liberarAudio(): void {
  liberado = true;
}

function obterContexto(): AudioContext | null {
  if (!liberado || typeof window === "undefined") return null;
  if (!contexto) {
    const Construtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Construtor) return null;
    try {
      contexto = new Construtor();
    } catch {
      return null;
    }
  }
  if (contexto.state === "suspended") void contexto.resume();
  return contexto;
}

function nota(
  ctx: AudioContext,
  frequencia: number,
  inicio: number,
  duracao: number,
  volume: number,
  forma: OscillatorType,
): void {
  const oscilador = ctx.createOscillator();
  const ganho = ctx.createGain();
  oscilador.type = forma;
  oscilador.frequency.setValueAtTime(frequencia, inicio);
  ganho.gain.setValueAtTime(0.0001, inicio);
  ganho.gain.exponentialRampToValueAtTime(volume, inicio + 0.015);
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);
  oscilador.connect(ganho);
  ganho.connect(ctx.destination);
  oscilador.start(inicio);
  oscilador.stop(inicio + duracao + 0.03);
}

/** Toca um som curto, se o som estiver ligado. */
export function tocarSom(som: Som): void {
  if (!obterProgresso().som) return;
  const ctx = obterContexto();
  if (!ctx) return;
  const agora = ctx.currentTime + 0.01;

  switch (som) {
    case "clique":
      nota(ctx, 900, agora, 0.06, VOLUME * 0.5, "sine");
      break;
    case "acerto":
      // Arpejo curto e alegre: dó, mi, sol.
      [523.25, 659.25, 783.99].forEach((frequencia, indice) =>
        nota(ctx, frequencia, agora + indice * 0.08, 0.2, VOLUME, "triangle"),
      );
      break;
    case "conclusao":
      // Arpejo maior subindo e um acorde no fim.
      [523.25, 659.25, 783.99, 1046.5].forEach((frequencia, indice) =>
        nota(ctx, frequencia, agora + indice * 0.11, 0.26, VOLUME, "triangle"),
      );
      [523.25, 659.25, 783.99].forEach((frequencia) =>
        nota(ctx, frequencia * 2, agora + 0.5, 0.6, VOLUME * 0.55, "sine"),
      );
      break;
    case "aviso":
      nota(ctx, 523.25, agora, 0.16, VOLUME * 0.7, "sine");
      nota(ctx, 392, agora + 0.12, 0.24, VOLUME * 0.7, "sine");
      break;
  }
}
