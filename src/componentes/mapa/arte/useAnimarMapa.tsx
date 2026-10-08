"use client";

import { useReducedMotion } from "framer-motion";
import { useMontado } from "@/lib/useMontado";

/**
 * Anima o mapa da ilha só quando a pessoa não pediu menos movimento e depois
 * de montar. (A arte das ilhas do mundo anima só por CSS, pelo compositor, e
 * para fora da tela pelo atributo `data-parada`; ver mundo/useNaTela.ts.)
 */
export function useAnimarMapa(): boolean {
  const montado = useMontado();
  const reduzir = useReducedMotion() ?? false;
  return montado && !reduzir;
}
