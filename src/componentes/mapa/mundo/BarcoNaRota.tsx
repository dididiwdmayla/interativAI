"use client";

/*
 * O barquinho de papel fazendo as rotas entre as ilhas: sai da praia de uma
 * ilha, segue a linha pontilhada, encosta na praia da próxima, para um
 * tiquinho e segue; no fim da rota, vira e volta. Balança o tempo todo.
 *
 * Desempenho: a viagem é uma animação só de transform (Web Animations, com
 * os quadros calculados em lugaresDoMar.ts), que o compositor anda sem
 * repintar o mapa; o balanço é CSS, também transform. Com menos movimento,
 * ele fica parado perto da ilha atual, como antes.
 */
import { useMenosMovimento } from "@/lib/useConsultaMidia";
import { useEffect, useMemo, useRef } from "react";
import type { Ponto } from "../geometria";
import { viagemDoBarco } from "./lugaresDoMar";

/** Quanto tempo o barquinho leva de uma ilha à outra. */
const TRECHO_MS = 9_000;

type Props = {
  /** As ilhas da rota, na ordem (unidades do desenho). */
  rota: readonly Ponto[];
  /** Onde ele fica parado, com menos movimento (entre a ilha atual e a próxima). */
  parado: Ponto;
  escala: number;
};

function Desenho() {
  return (
    <svg viewBox="-30 -40 60 60" width="100%" height="100%" className="barquinho-balanca block overflow-visible">
      <ellipse cx="0" cy="13" rx="26" ry="4" fill="var(--cor-espuma)" opacity="0.35" />
      <path d="M-22 0h44l-9 12h-26z" fill="var(--cor-madeira)" />
      <path d="M0-32v31" stroke="var(--cor-madeira)" strokeWidth="2.5" />
      <path d="M2-30l18 26H2z" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="1.5" />
      <path d="M-2-28l-14 24h14z" fill="var(--cor-primaria)" />
      {/* A lanterna da proa (acende de noite). */}
      <circle className="lanterna-barco" cx="18" cy="-3" r="2.6" fill="var(--cor-janela-acesa)" />
    </svg>
  );
}

export function BarcoNaRota({ rota, parado, escala }: Props) {
  const reduzir = useMenosMovimento();
  const barco = useRef<HTMLDivElement>(null);
  const quadros = useMemo(() => viagemDoBarco(rota), [rota]);
  const tamanho = 60 * escala;

  useEffect(() => {
    const elemento = barco.current;
    if (!elemento || reduzir || quadros.length < 2 || typeof elemento.animate !== "function") return;
    const keyframes = quadros.map((quadro) => ({
      offset: quadro.offset,
      transform: `translate(${(quadro.x * escala - tamanho / 2).toFixed(1)}px, ${(quadro.y * escala - tamanho * 0.66).toFixed(1)}px) rotate(${quadro.angulo.toFixed(1)}deg) scaleX(${quadro.virado ? -1 : 1})`,
    }));
    const trechos = Math.max(1, rota.length - 1);
    const animacao = elemento.animate(keyframes, { duration: TRECHO_MS * trechos * 2.4, iterations: Infinity, easing: "linear" });
    return () => animacao.cancel();
  }, [escala, quadros, reduzir, rota.length, tamanho]);

  return (
    <div
      ref={barco}
      aria-hidden="true"
      className="no-escuro pointer-events-none absolute left-0 top-0"
      style={{
        width: tamanho,
        height: tamanho,
        transform: `translate(${parado.x * escala - tamanho / 2}px, ${parado.y * escala - tamanho * 0.66}px)`,
        willChange: "transform",
      }}
      data-barquinho
    >
      <Desenho />
    </div>
  );
}
