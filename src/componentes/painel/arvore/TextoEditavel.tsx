"use client";

import { type KeyboardEvent, useRef } from "react";

type Props = {
  valor: string;
  editando: boolean;
  rotulo: string;
  className?: string;
  /** Mostrado quando o valor está vazio, para ainda dar onde clicar. */
  marcadorVazio?: string;
  aoIniciar: () => void;
  aoConfirmar: (novo: string) => void;
  aoCancelar: () => void;
};

/** Trecho da árvore que vira campo de texto com dois cliques. */
export function TextoEditavel({
  valor,
  editando,
  rotulo,
  className = "",
  marcadorVazio,
  aoIniciar,
  aoConfirmar,
  aoCancelar,
}: Props) {
  const finalizado = useRef(false);
  const ultimoToque = useRef(0);

  if (editando) {
    const aoTeclar = (evento: KeyboardEvent<HTMLInputElement>) => {
      evento.stopPropagation();
      if (evento.key === "Enter") {
        evento.preventDefault();
        finalizado.current = true;
        aoConfirmar(evento.currentTarget.value);
      } else if (evento.key === "Escape") {
        evento.preventDefault();
        finalizado.current = true;
        aoCancelar();
      }
    };

    return (
      <input
        autoFocus
        defaultValue={valor}
        aria-label={rotulo}
        size={Math.max(valor.length + 2, 6)}
        onFocus={(evento) => {
          finalizado.current = false;
          evento.currentTarget.select();
        }}
        onKeyDown={aoTeclar}
        onClick={(evento) => evento.stopPropagation()}
        onDoubleClick={(evento) => evento.stopPropagation()}
        onBlur={(evento) => {
          if (!finalizado.current) aoConfirmar(evento.currentTarget.value);
          finalizado.current = true;
        }}
        className="max-w-full rounded-md border-2 border-primaria bg-superficie px-1 font-codigo text-codigo-texto outline-none"
      />
    );
  }

  return (
    <span
      className={`cursor-text rounded-sm hover:bg-hover hover:underline hover:decoration-dotted ${className}`}
      onDoubleClick={(evento) => {
        evento.stopPropagation();
        aoIniciar();
      }}
      onPointerUp={(evento) => {
        // Duplo toque, caso o navegador não gere dblclick no toque.
        if (evento.pointerType !== "touch") return;
        const agora = evento.timeStamp;
        if (agora - ultimoToque.current < 350) {
          ultimoToque.current = 0;
          aoIniciar();
        } else {
          ultimoToque.current = agora;
        }
      }}
      title="Dois cliques para editar"
    >
      {valor.length > 0 ? valor : (marcadorVazio ?? "")}
    </span>
  );
}
