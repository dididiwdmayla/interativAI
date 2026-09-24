"use client";

import { type ReactNode, type Ref, useRef } from "react";
import type { IdFerramenta } from "@/ferramentas/ids";
import { FERRAMENTAS } from "@/ferramentas/registro";

type Props = {
  /** Ferramentas que moram neste elemento (vira data-ferramenta). */
  ids: readonly IdFerramenta[];
  /** Ferramenta aberta pelo "?" e pelo toque longo; sem ela, não há marcador. */
  marcador?: IdFerramenta;
  aoAbrirCard?: (id: IdFerramenta) => void;
  /** Classes do "?" (posição). Padrão: canto de cima à direita, por dentro. */
  classeMarcador?: string;
  className?: string;
  children: ReactNode;
  as?: "div" | "section" | "main" | "span";
  rotulo?: string;
  ref?: Ref<HTMLElement>;
};

const TOQUE_LONGO_MS = 550;
const TOLERANCIA_PX = 10;

/** Evento que um alvo mais interno já tratou (os alvos podem ser aninhados). */
let ultimoTratado: Event | null = null;

/**
 * Um elemento de dentro (um nó da árvore, por exemplo) avisa que vai
 * cuidar deste toque. Aí o toque longo abre o menu dele, e não o card da
 * ferramenta: os dois nunca disputam o mesmo dedo.
 */
export function reivindicarToque(evento: Event): void {
  ultimoTratado = evento;
}

/**
 * Embrulha o elemento real de uma ferramenta: marca data-ferramenta para a
 * apresentação achar, mostra um "?" discreto no desktop e abre o card da
 * ferramenta com toque longo no celular.
 */
export function AlvoFerramenta({
  ids,
  marcador,
  aoAbrirCard,
  classeMarcador = "right-1.5 top-1.5",
  className = "",
  children,
  as: Tag = "div",
  rotulo,
  ref,
}: Props) {
  const toque = useRef<{ x: number; y: number; temporizador: ReturnType<typeof setTimeout> } | null>(null);
  const engolirClique = useRef(false);

  const cancelar = () => {
    if (toque.current) clearTimeout(toque.current.temporizador);
    toque.current = null;
  };

  const comMarcador = marcador !== undefined && aoAbrirCard !== undefined;

  return (
    <Tag
      ref={ref as Ref<HTMLDivElement>}
      data-ferramenta={ids.join(" ")}
      aria-label={rotulo}
      className={`relative ${className}`}
      onPointerDown={(evento) => {
        if (!comMarcador || evento.pointerType !== "touch" || ultimoTratado === evento.nativeEvent) return;
        ultimoTratado = evento.nativeEvent;
        cancelar();
        const { clientX: x, clientY: y } = evento;
        toque.current = {
          x,
          y,
          temporizador: setTimeout(() => {
            toque.current = null;
            engolirClique.current = true;
            navigator.vibrate?.(15);
            aoAbrirCard(marcador);
          }, TOQUE_LONGO_MS),
        };
      }}
      onPointerMove={(evento) => {
        const atual = toque.current;
        if (atual && Math.hypot(evento.clientX - atual.x, evento.clientY - atual.y) > TOLERANCIA_PX) cancelar();
      }}
      onPointerUp={cancelar}
      onPointerCancel={cancelar}
      onClickCapture={(evento) => {
        if (!engolirClique.current) return;
        engolirClique.current = false;
        evento.preventDefault();
        evento.stopPropagation();
      }}
      onContextMenu={(evento) => {
        if (engolirClique.current || toque.current) evento.preventDefault();
      }}
    >
      {children}
      {comMarcador && (
        <button
          type="button"
          onClick={(evento) => {
            evento.stopPropagation();
            aoAbrirCard(marcador);
          }}
          aria-label={`O que é: ${FERRAMENTAS[marcador].nome}`}
          title={`O que é: ${FERRAMENTAS[marcador].nome}`}
          className={`absolute z-30 hidden h-5 w-5 place-items-center rounded-full border-2 border-borda bg-superficie text-[11px] font-black leading-none text-texto-suave opacity-60 shadow-sm transition-opacity hover:border-primaria hover:text-primaria hover:opacity-100 focus-visible:opacity-100 pointer-fine:grid ${classeMarcador}`}
        >
          ?
        </button>
      )}
    </Tag>
  );
}
