"use client";

import { useEffect, useRef, useState } from "react";
import { useConsultaMidia } from "@/lib/useConsultaMidia";

export type LayoutJogo = "desktop" | "retrato" | "paisagem";

/** Paisagem de celular: deitado e baixinho. Tem prioridade sobre o desktop. */
export const CONSULTA_PAISAGEM = "(orientation: landscape) and (max-height: 499.98px)";
export const CONSULTA_DESKTOP = "(min-width: 1024px)";

/**
 * Qual das três composições da tela usar. Abaixo de 1024 px (inclusive
 * tablets entre 768 e 1024 px) vale o retrato: prévia em cima, painel embaixo.
 */
export function useLayoutJogo(): LayoutJogo {
  const paisagem = useConsultaMidia(CONSULTA_PAISAGEM);
  const desktop = useConsultaMidia(CONSULTA_DESKTOP);
  if (paisagem) return "paisagem";
  return desktop ? "desktop" : "retrato";
}

/** Área que o teclado virtual toma antes de contar como "aberto". */
const FRACAO_TECLADO = 0.78;

/**
 * Altura realmente visível (VisualViewport) e se o teclado virtual parece
 * aberto. No Chrome Android, com interactive-widget=resizes-content, a
 * própria janela encolhe; no iOS só o VisualViewport encolhe. Os dois casos
 * aparecem como altura visível bem menor que a maior já vista naquela largura.
 */
export function useViewportVisivel(): { altura: number | null; tecladoAberto: boolean } {
  const [estado, setEstado] = useState<{ altura: number | null; tecladoAberto: boolean }>({
    altura: null,
    tecladoAberto: false,
  });
  const maior = useRef<{ largura: number; altura: number }>({ largura: 0, altura: 0 });

  useEffect(() => {
    const visual = window.visualViewport;
    const medir = () => {
      const altura = Math.round(visual?.height ?? window.innerHeight);
      const largura = Math.round(visual?.width ?? window.innerWidth);
      // Girou ou mudou a largura: começa a contar de novo.
      if (Math.abs(largura - maior.current.largura) > 40) maior.current = { largura, altura };
      if (altura > maior.current.altura) maior.current.altura = altura;
      const campoFocado = document.activeElement?.matches("input, textarea, [contenteditable=true]") ?? false;
      const tecladoAberto = campoFocado && altura < maior.current.altura * FRACAO_TECLADO;
      setEstado((atual) =>
        atual.altura === altura && atual.tecladoAberto === tecladoAberto ? atual : { altura, tecladoAberto },
      );
    };
    medir();
    visual?.addEventListener("resize", medir);
    window.addEventListener("resize", medir);
    window.addEventListener("focusin", medir);
    window.addEventListener("focusout", medir);
    return () => {
      visual?.removeEventListener("resize", medir);
      window.removeEventListener("resize", medir);
      window.removeEventListener("focusin", medir);
      window.removeEventListener("focusout", medir);
    };
  }, []);

  return estado;
}
