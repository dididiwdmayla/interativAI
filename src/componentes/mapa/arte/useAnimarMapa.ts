"use client";

import { useReducedMotion } from "framer-motion";

/** Anima o mapa só quando a pessoa não pediu menos movimento. */
export function useAnimarMapa(): boolean {
  return !(useReducedMotion() ?? false);
}
