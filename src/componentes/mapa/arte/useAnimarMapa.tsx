"use client";

import { useReducedMotion } from "framer-motion";
import { createContext, type ReactNode, type SVGProps, useContext, useEffect, useRef, useState } from "react";
import { useMontado } from "@/lib/useMontado";

/**
 * Se o pedaço do mapa em volta está na tela. Fora dela, as animações param
 * (o desenho continua lá, parado): um mundo com várias ilhas se mexendo fora
 * da tela fazia o Chrome repintar o mapa à toa, e no celular os pedaços que
 * entravam na tela ao rolar demoravam a aparecer.
 */
const NaTela = createContext(true);

/** Anima o mapa só quando a pessoa não pediu menos movimento, depois de montar e com o pedaço na tela. */
export function useAnimarMapa(): boolean {
  const montado = useMontado();
  const reduzir = useReducedMotion() ?? false;
  const naTela = useContext(NaTela);
  return montado && !reduzir && naTela;
}

/**
 * Um grupo do SVG do mapa que só anima o que tem dentro enquanto aparece
 * (com uma folga em volta, para já estar andando quando entra). A
 * visibilidade nunca depende disto: só o movimento.
 */
export function GrupoAnimadoNaTela({ children, ...props }: { children: ReactNode } & SVGProps<SVGGElement>) {
  const grupo = useRef<SVGGElement>(null);
  const [naTela, setNaTela] = useState(true);
  useEffect(() => {
    const elemento = grupo.current;
    if (!elemento || typeof IntersectionObserver === "undefined") return;
    // A raiz é a área que rola (a folga vale dentro dela); fora de uma, a tela.
    const raiz = elemento.closest("[data-area-arrastavel]");
    const observador = new IntersectionObserver(([entrada]) => setNaTela(entrada.isIntersecting), { root: raiz, rootMargin: "120px" });
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);
  return (
    <g {...props} ref={grupo}>
      <NaTela.Provider value={naTela}>{children}</NaTela.Provider>
    </g>
  );
}
