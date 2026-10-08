"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * Se um pedaço parado do mundo (um peixe, a espuma de uma praia, um brilho
 * na água) está na tela, com uma folga em volta. Fora dela, quem usa marca
 * `data-pausado="sim"` e as animações CSS param (globals.css): o desenho
 * continua lá, parado. A raiz é a área do mapa que rola.
 */
export function useNaTela<T extends Element>(folga = 160): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [naTela, setNaTela] = useState(true);
  useEffect(() => {
    const elemento = ref.current;
    if (!elemento || typeof IntersectionObserver === "undefined") return;
    const raiz = elemento.closest("[data-area-arrastavel]");
    const observador = new IntersectionObserver(([entrada]) => setNaTela(entrada.isIntersecting), { root: raiz, rootMargin: `${folga}px` });
    observador.observe(elemento);
    return () => observador.disconnect();
  }, [folga]);
  return [ref, naTela];
}
