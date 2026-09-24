"use client";

import { type PointerEvent, useRef, type WheelEvent } from "react";

type Props = {
  ativa: boolean;
  /** No toque: arrastar o dedo mostra a caixa, soltar escolhe. */
  toque?: boolean;
  aoApontar: (x: number, y: number) => void;
  aoEscolher: (x: number, y: number) => void;
  aoSair: () => void;
  aoRolar: (deltaY: number) => void;
};

/**
 * Camada transparente sobre o iframe no modo inspecionar. Ela captura o
 * ponteiro (mouse, dedo ou caneta) no documento do jogo e pergunta ao
 * iframe qual elemento está ali. Mouse: passar mostra, clicar escolhe.
 * Dedo: arrastar mostra, soltar escolhe.
 */
export function CamadaInspecao({ ativa, toque = false, aoApontar, aoEscolher, aoSair, aoRolar }: Props) {
  const apertado = useRef(false);
  if (!ativa) return null;

  const posicao = (evento: PointerEvent<HTMLDivElement>) => {
    const caixa = evento.currentTarget.getBoundingClientRect();
    return { x: evento.clientX - caixa.left, y: evento.clientY - caixa.top };
  };

  return (
    <>
      <div
        className="absolute inset-0 z-20 cursor-crosshair touch-none"
        onPointerDown={(evento) => {
          apertado.current = true;
          evento.currentTarget.setPointerCapture(evento.pointerId);
          const { x, y } = posicao(evento);
          aoApontar(x, y);
        }}
        onPointerMove={(evento) => {
          // Dedo só aponta enquanto encosta; mouse aponta sempre.
          if (evento.pointerType !== "mouse" && !apertado.current) return;
          const { x, y } = posicao(evento);
          aoApontar(x, y);
        }}
        onPointerUp={(evento) => {
          if (!apertado.current) return;
          apertado.current = false;
          const { x, y } = posicao(evento);
          aoEscolher(x, y);
        }}
        onPointerCancel={() => {
          apertado.current = false;
          aoSair();
        }}
        onPointerLeave={(evento) => {
          if (evento.pointerType === "mouse") aoSair();
        }}
        onWheel={(evento: WheelEvent<HTMLDivElement>) => aoRolar(evento.deltaY)}
        aria-hidden="true"
      />
      <div
        role="status"
        className="pointer-events-none absolute bottom-3 left-1/2 z-30 max-w-[calc(100%-16px)] -translate-x-1/2 truncate whitespace-nowrap rounded-full bg-secundaria px-4 py-1.5 text-sm font-bold text-sobre-secundaria shadow-lg"
      >
        {toque ? "Arraste o dedo e solte em cima de algo" : "Clique em algo da tela (Esc cancela)"}
      </div>
    </>
  );
}
