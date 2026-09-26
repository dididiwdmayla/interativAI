"use client";

import { type KeyboardEvent, type PointerEvent, type ReactNode, useRef, useState } from "react";

type Props = {
  esquerda: ReactNode;
  direita: ReactNode;
  rotulo: string;
  proporcaoInicial?: number;
  /** Só uma das áreas (no celular em pé); as duas continuam montadas. */
  mostrar?: "ambas" | "esquerda" | "direita";
};

const MINIMO = 0.25;
const MAXIMO = 0.75;

function limitar(valor: number): number {
  return Math.min(MAXIMO, Math.max(MINIMO, valor));
}

/**
 * Duas áreas lado a lado com um divisor arrastável (mouse, toque e
 * teclado): a árvore de um lado e o painel Estilos do outro, como o Chrome
 * faz quando o DevTools tem espaço.
 */
export function PainelLadoALado({ esquerda, direita, rotulo, proporcaoInicial = 0.55, mostrar = "ambas" }: Props) {
  const recipiente = useRef<HTMLDivElement>(null);
  const [proporcao, setProporcao] = useState(proporcaoInicial);
  const [arrastando, setArrastando] = useState(false);

  const atualizarPelaPosicao = (x: number) => {
    const caixa = recipiente.current?.getBoundingClientRect();
    if (!caixa || caixa.width === 0) return;
    setProporcao(limitar((x - caixa.left) / caixa.width));
  };

  const aoApertar = (evento: PointerEvent<HTMLDivElement>) => {
    evento.currentTarget.setPointerCapture(evento.pointerId);
    setArrastando(true);
  };

  const aoSoltar = (evento: PointerEvent<HTMLDivElement>) => {
    evento.currentTarget.releasePointerCapture(evento.pointerId);
    setArrastando(false);
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    const passo = evento.shiftKey ? 0.1 : 0.04;
    if (evento.key === "ArrowLeft") setProporcao((valor) => limitar(valor - passo));
    else if (evento.key === "ArrowRight") setProporcao((valor) => limitar(valor + passo));
    else if (evento.key === "Home") setProporcao(MINIMO);
    else if (evento.key === "End") setProporcao(MAXIMO);
    else return;
    evento.preventDefault();
  };

  return (
    <div ref={recipiente} className="flex h-full min-h-0 min-w-0">
      <div
        className={`min-h-0 min-w-0 overflow-hidden ${mostrar === "direita" ? "hidden" : ""}`}
        style={mostrar === "ambas" ? { flexBasis: `${proporcao * 100}%`, flexGrow: 0, flexShrink: 0 } : { flex: "1 1 0%" }}
      >
        {esquerda}
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={rotulo}
        aria-valuemin={Math.round(MINIMO * 100)}
        aria-valuemax={Math.round(MAXIMO * 100)}
        aria-valuenow={Math.round(proporcao * 100)}
        tabIndex={0}
        onPointerDown={aoApertar}
        onPointerMove={(evento) => arrastando && atualizarPelaPosicao(evento.clientX)}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        onKeyDown={aoTeclar}
        className={`group relative w-3 shrink-0 cursor-col-resize touch-none items-center justify-center border-x-2 border-borda transition-colors ${
          arrastando ? "bg-primaria" : "bg-painel hover:bg-hover"
        } ${mostrar === "ambas" ? "flex" : "hidden"}`}
      >
        <span
          className={`h-10 w-1 rounded-full ${arrastando ? "bg-sobre-primaria" : "bg-texto-suave group-hover:bg-primaria"}`}
          aria-hidden="true"
        />
      </div>
      <div className={`min-h-0 min-w-0 flex-1 overflow-hidden ${mostrar === "esquerda" ? "hidden" : ""}`}>{direita}</div>
    </div>
  );
}
