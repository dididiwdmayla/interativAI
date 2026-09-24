"use client";

import type { MouseEvent, WheelEvent } from "react";

type Props = {
  ativa: boolean;
  aoApontar: (x: number, y: number) => void;
  aoEscolher: (x: number, y: number) => void;
  aoSair: () => void;
  aoRolar: (deltaY: number) => void;
};

/**
 * Camada transparente sobre o iframe no modo inspecionar. Ela captura o
 * mouse no documento do jogo e pergunta ao iframe qual elemento está ali.
 */
export function CamadaInspecao({ ativa, aoApontar, aoEscolher, aoSair, aoRolar }: Props) {
  if (!ativa) return null;

  const posicao = (evento: MouseEvent<HTMLDivElement>) => {
    const caixa = evento.currentTarget.getBoundingClientRect();
    return { x: evento.clientX - caixa.left, y: evento.clientY - caixa.top };
  };

  return (
    <>
      <div
        className="absolute inset-0 z-20 cursor-crosshair"
        onMouseMove={(evento) => {
          const { x, y } = posicao(evento);
          aoApontar(x, y);
        }}
        onClick={(evento) => {
          const { x, y } = posicao(evento);
          aoEscolher(x, y);
        }}
        onMouseLeave={aoSair}
        onWheel={(evento: WheelEvent<HTMLDivElement>) => aoRolar(evento.deltaY)}
        aria-hidden="true"
      />
      <div
        role="status"
        className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-secundaria px-4 py-1.5 text-sm font-bold text-sobre-secundaria shadow-lg"
      >
        Clique em algo da tela (Esc cancela)
      </div>
    </>
  );
}
