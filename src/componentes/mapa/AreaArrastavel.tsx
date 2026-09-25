"use client";

import { type ReactNode, type Ref, useEffect, useImperativeHandle, useRef } from "react";

export type ApiAreaArrastavel = {
  /** Rola para deixar o ponto (em px do conteúdo) no meio da área. */
  centralizar: (x: number, y: number, suave?: boolean) => void;
  elemento: () => HTMLDivElement | null;
};

type Props = {
  rotulo: string;
  children: ReactNode;
  className?: string;
  ref?: Ref<ApiAreaArrastavel>;
};

const LIMIAR_ARRASTO_PX = 5;

/**
 * Área do mapa que dá para arrastar com o mouse e rolar com o dedo, a
 * rodinha ou as setas do teclado. Arrastar não conta como clique: o clique
 * que termina um arrasto é engolido.
 */
export function AreaArrastavel({ rotulo, children, className = "", ref }: Props) {
  const area = useRef<HTMLDivElement>(null);
  const arrasto = useRef<{ x: number; y: number; esquerda: number; topo: number; andou: boolean } | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      centralizar(x, y, suave = false) {
        const elemento = area.current;
        if (!elemento) return;
        const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        elemento.scrollTo({
          left: x - elemento.clientWidth / 2,
          top: y - elemento.clientHeight / 2,
          behavior: suave && !reduzido ? "smooth" : "auto",
        });
      },
      elemento: () => area.current,
    }),
    [],
  );

  useEffect(() => {
    const elemento = area.current;
    if (!elemento) return;
    // Engole o clique logo depois de um arrasto (fase de captura, antes dos botões).
    const aoClicar = (evento: MouseEvent) => {
      if (!arrasto.current?.andou) return;
      evento.preventDefault();
      evento.stopPropagation();
      arrasto.current = null;
    };
    elemento.addEventListener("click", aoClicar, true);
    return () => elemento.removeEventListener("click", aoClicar, true);
  }, []);

  return (
    <div
      ref={area}
      role="region"
      aria-label={rotulo}
      tabIndex={0}
      className={`relative min-h-0 flex-1 overflow-auto overscroll-contain [touch-action:pan-x_pan-y] ${className}`}
      onPointerDown={(evento) => {
        if (evento.pointerType !== "mouse" || evento.button !== 0) return;
        const elemento = area.current;
        if (!elemento) return;
        arrasto.current = {
          x: evento.clientX,
          y: evento.clientY,
          esquerda: elemento.scrollLeft,
          topo: elemento.scrollTop,
          andou: false,
        };
      }}
      onPointerMove={(evento) => {
        const atual = arrasto.current;
        const elemento = area.current;
        if (!atual || !elemento || evento.pointerType !== "mouse" || (evento.buttons & 1) === 0) return;
        const dx = evento.clientX - atual.x;
        const dy = evento.clientY - atual.y;
        if (!atual.andou && Math.hypot(dx, dy) < LIMIAR_ARRASTO_PX) return;
        atual.andou = true;
        elemento.scrollLeft = atual.esquerda - dx;
        elemento.scrollTop = atual.topo - dy;
      }}
      onPointerUp={() => {
        // Sem arrasto de verdade, o clique segue normal. Com arrasto, o clique
        // que vem logo em seguida é engolido e depois tudo zera.
        if (arrasto.current && !arrasto.current.andou) arrasto.current = null;
        else setTimeout(() => (arrasto.current = null), 0);
      }}
      onPointerCancel={() => {
        arrasto.current = null;
      }}
    >
      {children}
    </div>
  );
}
