"use client";

import { type KeyboardEvent, useRef } from "react";

type Props = {
  valor: string;
  editando: boolean;
  rotulo: string;
  className?: string;
  /** Mostrado quando o valor está vazio, para ainda dar onde clicar. */
  marcadorVazio?: string;
  /** Dica do trecho (title), para o mouse. */
  titulo?: string;
  /** Espaço também confirma (nome de tag não tem espaço; igual ao F12). */
  confirmarComEspaco?: boolean;
  /** O campo cresce enquanto digita, a partir desta largura em letras (o atributo novo). */
  crescerDesde?: number;
  /** A cada tecla, com o valor do campo (o fechamento da tag acompanha). */
  aoDigitar?: (valor: string) => void;
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
  titulo = "Dois cliques para editar",
  confirmarComEspaco = false,
  crescerDesde,
  aoDigitar,
  aoIniciar,
  aoConfirmar,
  aoCancelar,
}: Props) {
  const finalizado = useRef(false);
  const ultimoToque = useRef(0);
  /** Tipo do último ponteiro que apertou aqui (o dblclick do toque é ignorado; ver abaixo). */
  const ultimoPonteiro = useRef("mouse");

  if (editando) {
    const aoTeclar = (evento: KeyboardEvent<HTMLInputElement>) => {
      evento.stopPropagation();
      if (evento.key === "Enter" || (confirmarComEspaco && evento.key === " ")) {
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
        size={Math.max(valor.length + 2, crescerDesde ?? 6)}
        onInput={
          crescerDesde !== undefined
            ? (evento) => {
                evento.currentTarget.size = Math.max(evento.currentTarget.value.length + 2, crescerDesde);
              }
            : undefined
        }
        onFocus={(evento) => {
          finalizado.current = false;
          evento.currentTarget.select();
        }}
        onKeyDown={aoTeclar}
        onChange={aoDigitar ? (evento) => aoDigitar(evento.currentTarget.value) : undefined}
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
        // No toque, o duplo toque é o do onPointerUp (dois toques NESTE texto).
        // O navegador também gera dblclick para dois toques rápidos em lugares
        // diferentes (um botão e logo depois esta linha): isso não é edição.
        if (ultimoPonteiro.current === "touch") return;
        aoIniciar();
      }}
      onPointerDown={(evento) => {
        ultimoPonteiro.current = evento.pointerType;
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
      title={titulo}
    >
      {valor.length > 0 ? valor : (marcadorVazio ?? "")}
    </span>
  );
}
