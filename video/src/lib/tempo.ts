/* Contas de tempo e curvas, sempre a partir do quadro (nada de relógio). */
import { Easing, interpolate } from "remotion";
import { FPS } from "../roteiro";

export const q = (segundos: number): number => Math.round(segundos * FPS);
export const s = (quadro: number): number => quadro / FPS;

const PRESO = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 antes de `de`, 1 depois de `ate` (em segundos), com a curva dada. */
export function rampa(t: number, de: number, ate: number, curva: (n: number) => number = Easing.inOut(Easing.cubic)): number {
  if (ate <= de) return t >= ate ? 1 : 0;
  return interpolate(t, [de, ate], [0, 1], { ...PRESO, easing: curva });
}

export const sai = Easing.out(Easing.cubic);
export const entra = Easing.in(Easing.cubic);
export const vaiEVolta = Easing.inOut(Easing.cubic);
export const elastico = Easing.out(Easing.back(1.7));

export const mistura = (a: number, b: number, p: number): number => a + (b - a) * p;

/** Sorteio determinístico (o mesmo do jogo, mulberry32): a mesma semente, a mesma sequência. */
export function sorteio(semente: number): () => number {
  let estado = semente >>> 0;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let valor = estado;
    valor = Math.imul(valor ^ (valor >>> 15), valor | 1);
    valor ^= valor + Math.imul(valor ^ (valor >>> 7), valor | 61);
    return ((valor ^ (valor >>> 14)) >>> 0) / 4294967296;
  };
}
