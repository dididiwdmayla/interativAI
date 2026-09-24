"use client";

import { type KeyboardEvent, type PointerEvent, type ReactNode, useRef, useState } from "react";

type Props = {
  cima: ReactNode;
  baixo: ReactNode;
  proporcaoInicial?: number;
  rotulo: string;
  /** No celular só uma das áreas aparece; as duas continuam montadas. */
  mostrar?: "ambas" | "cima" | "baixo";
};

const MINIMO = 0.18;
const MAXIMO = 0.82;

function limitar(valor: number): number {
  return Math.min(MAXIMO, Math.max(MINIMO, valor));
}

/** Duas áreas empilhadas com um divisor arrastável (mouse, toque e teclado). */
export function PainelDividido({ cima, baixo, proporcaoInicial = 0.5, rotulo, mostrar = "ambas" }: Props) {
  const recipiente = useRef<HTMLDivElement>(null);
  const [proporcao, setProporcao] = useState(proporcaoInicial);
  const [arrastando, setArrastando] = useState(false);

  const atualizarPelaPosicao = (y: number) => {
    const caixa = recipiente.current?.getBoundingClientRect();
    if (!caixa || caixa.height === 0) return;
    setProporcao(limitar((y - caixa.top) / caixa.height));
  };

  const aoApertar = (evento: PointerEvent<HTMLDivElement>) => {
    evento.currentTarget.setPointerCapture(evento.pointerId);
    setArrastando(true);
  };

  const aoMover = (evento: PointerEvent<HTMLDivElement>) => {
    if (arrastando) atualizarPelaPosicao(evento.clientY);
  };

  const aoSoltar = (evento: PointerEvent<HTMLDivElement>) => {
    evento.currentTarget.releasePointerCapture(evento.pointerId);
    setArrastando(false);
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    const passo = evento.shiftKey ? 0.1 : 0.04;
    if (evento.key === "ArrowUp") setProporcao((valor) => limitar(valor - passo));
    else if (evento.key === "ArrowDown") setProporcao((valor) => limitar(valor + passo));
    else if (evento.key === "Home") setProporcao(MINIMO);
    else if (evento.key === "End") setProporcao(MAXIMO);
    else return;
    evento.preventDefault();
  };

  return (
    <div ref={recipiente} className="flex min-h-0 flex-1 flex-col">
      <div
        className={`min-h-0 overflow-hidden ${mostrar === "baixo" ? "hidden" : ""}`}
        style={mostrar === "ambas" ? { flexBasis: `${proporcao * 100}%`, flexGrow: 0, flexShrink: 0 } : { flex: "1 1 0%" }}
      >
        {cima}
      </div>
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label={rotulo}
        aria-valuemin={Math.round(MINIMO * 100)}
        aria-valuemax={Math.round(MAXIMO * 100)}
        aria-valuenow={Math.round(proporcao * 100)}
        tabIndex={0}
        onPointerDown={aoApertar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        onKeyDown={aoTeclar}
        className={`group relative h-3 shrink-0 cursor-row-resize touch-none items-center justify-center border-y-2 border-borda transition-colors ${
          arrastando ? "bg-primaria" : "bg-painel hover:bg-hover"
        } ${mostrar === "ambas" ? "flex" : "hidden"}`}
      >
        <span
          className={`h-1 w-10 rounded-full ${arrastando ? "bg-sobre-primaria" : "bg-texto-suave group-hover:bg-primaria"}`}
          aria-hidden="true"
        />
      </div>
      <div className={`min-h-0 flex-1 overflow-hidden ${mostrar === "cima" ? "hidden" : ""}`}>{baixo}</div>
    </div>
  );
}
