"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Resultado reativo de uma media query. No servidor devolve false. */
export function useConsultaMidia(consulta: string): boolean {
  const assinar = useCallback(
    (avisar: () => void) => {
      const lista = window.matchMedia(consulta);
      lista.addEventListener("change", avisar);
      return () => lista.removeEventListener("change", avisar);
    },
    [consulta],
  );
  return useSyncExternalStore(
    assinar,
    () => window.matchMedia(consulta).matches,
    () => false,
  );
}

export const CONSULTA_TOQUE = "(pointer: coarse)";

/** Verdadeiro quando o jeito principal de apontar é o dedo (tela de toque). */
export function useToque(): boolean {
  return useConsultaMidia(CONSULTA_TOQUE);
}
