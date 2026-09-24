"use client";

import { type KeyboardEvent, type PointerEvent, type RefObject, useState } from "react";

type Props = {
  /** Caixa que contém prévia + alça + painel, para converter o dedo em proporção. */
  recipiente: RefObject<HTMLElement | null>;
  proporcao: number;
  minimo: number;
  maximo: number;
  aoMudar: (proporcao: number) => void;
  aoSoltar: (proporcao: number) => void;
  className?: string;
};

/** Alça entre a prévia (em cima) e o painel (embaixo) no celular em pé. */
export function AlcaDivisoria({ recipiente, proporcao, minimo, maximo, aoMudar, aoSoltar, className = "" }: Props) {
  const [arrastando, setArrastando] = useState(false);
  const limitar = (valor: number) => Math.min(maximo, Math.max(minimo, valor));

  const pelaPosicao = (y: number) => {
    const caixa = recipiente.current?.getBoundingClientRect();
    if (!caixa || caixa.height === 0) return proporcao;
    return limitar((y - caixa.top) / caixa.height);
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    const passo = evento.shiftKey ? 0.1 : 0.04;
    let nova: number | null = null;
    if (evento.key === "ArrowUp") nova = limitar(proporcao - passo);
    else if (evento.key === "ArrowDown") nova = limitar(proporcao + passo);
    if (nova === null) return;
    evento.preventDefault();
    aoMudar(nova);
    aoSoltar(nova);
  };

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label="Arrastar para mudar o tamanho da tela do site"
      aria-valuemin={Math.round(minimo * 100)}
      aria-valuemax={Math.round(maximo * 100)}
      aria-valuenow={Math.round(proporcao * 100)}
      tabIndex={0}
      onPointerDown={(evento: PointerEvent<HTMLDivElement>) => {
        evento.currentTarget.setPointerCapture(evento.pointerId);
        setArrastando(true);
      }}
      onPointerMove={(evento) => {
        if (arrastando) aoMudar(pelaPosicao(evento.clientY));
      }}
      onPointerUp={(evento) => {
        evento.currentTarget.releasePointerCapture(evento.pointerId);
        setArrastando(false);
        aoSoltar(pelaPosicao(evento.clientY));
      }}
      onPointerCancel={() => setArrastando(false)}
      onKeyDown={aoTeclar}
      className={`flex h-5 shrink-0 cursor-row-resize touch-none items-center justify-center ${className}`}
    >
      <span
        className={`h-1.5 w-14 rounded-full transition-colors ${arrastando ? "bg-primaria" : "bg-borda"}`}
        aria-hidden="true"
      />
    </div>
  );
}
