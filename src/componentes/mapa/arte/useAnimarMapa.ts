"use client";

import { useReducedMotion } from "framer-motion";
import { useMontado } from "@/lib/useMontado";

/** Anima o mapa só quando a pessoa não pediu menos movimento (e só depois de montar). */
export function useAnimarMapa(): boolean {
  const montado = useMontado();
  const reduzir = useReducedMotion() ?? false;
  return montado && !reduzir;
}
