"use client";

import { type RefObject, useLayoutEffect, useState } from "react";

/** Largura e altura de um elemento, atualizadas quando ele muda de tamanho. */
export function useTamanho(ref: RefObject<HTMLElement | null>): { largura: number; altura: number } {
  const [tamanho, setTamanho] = useState({ largura: 0, altura: 0 });
  useLayoutEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    const medir = () =>
      setTamanho((atual) =>
        atual.largura === elemento.clientWidth && atual.altura === elemento.clientHeight
          ? atual
          : { largura: elemento.clientWidth, altura: elemento.clientHeight },
      );
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(elemento);
    return () => observador.disconnect();
  }, [ref]);
  return tamanho;
}
