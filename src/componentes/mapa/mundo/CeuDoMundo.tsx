"use client";

/*
 * O céu do mundo: nuvens que atravessam devagar, cada uma com a sombra
 * dela no mar (e nas ilhas), e duas gaivotas batendo asa (de dia; de noite
 * elas dormem). Ficam por cima das ilhas e por baixo dos nomes, que
 * continuam legíveis.
 *
 * Desempenho: cada nuvem e cada gaivota é uma camada só, que anda por
 * transform pelo compositor (sem repintar o mapa); quantas nuvens depende
 * do tamanho do mundo, com teto. No modo leve, no máximo duas nuvens e
 * nenhuma gaivota. Com menos movimento, as nuvens ficam paradas e as
 * gaivotas não aparecem.
 */
import { useMenosMovimento } from "@/lib/useConsultaMidia";
import type { CSSProperties } from "react";
import { sorteioFixo } from "../geometria";
import type { Periodo } from "./periodo";

type Props = { largura: number; altura: number; escala: number; periodo: Periodo; leve?: boolean };

/** Teto de nuvens no céu (o celular agradece); no modo leve, menos. */
const MAXIMO_DE_NUVENS = 3;
const MAXIMO_DE_NUVENS_LEVE = 2;

function Nuvem({ variante }: { variante: number }) {
  const formas = [
    "M-50 8c-12 0-18-12-8-18 0-14 18-20 28-10 6-14 30-14 36 0 14-4 26 8 18 18 8 6 2 14-8 14z",
    "M-40 6c-10 0-14-10-6-15 2-12 16-14 24-6 8-10 26-8 30 4 12 0 18 12 8 17z",
    "M-56 8c-10 0-12-12-2-15 2-12 20-16 28-6 6-12 24-12 30-2 10-6 24 0 22 10 10 2 10 12 0 13z",
  ];
  const forma = formas[variante % formas.length];
  return (
    <svg viewBox="-70 -40 160 110" width="100%" height="100%" className="block overflow-visible" aria-hidden="true">
      {/* A sombra cai no mar, mais embaixo e para a direita (o sol vem do alto, à esquerda). */}
      <path d={forma} transform="translate(22 54) scale(1.1 0.55)" fill="var(--cor-nuvem-sombra)" opacity="0.1" />
      <path d={forma} fill="var(--cor-nuvem)" opacity="0.92" />
      <path d={forma} transform="translate(4 5) scale(0.86 0.5)" fill="var(--cor-nuvem-sombra)" opacity="0.08" />
    </svg>
  );
}

function Gaivota() {
  return (
    <svg viewBox="-16 -8 32 16" width="100%" height="100%" className="block overflow-visible" aria-hidden="true">
      <g className="gaivota-asas">
        <path d="M-14-1q7-7 14 1 7-8 14-1" fill="none" stroke="var(--cor-gaivota)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function CeuDoMundo({ largura, altura, escala, periodo, leve = false }: Props) {
  const reduzir = useMenosMovimento();
  const quantas = Math.min(leve ? MAXIMO_DE_NUVENS_LEVE : MAXIMO_DE_NUVENS, Math.max(1, Math.round(largura / 900)));
  const viagem = (largura + 400) * escala;
  const nuvens = Array.from({ length: quantas }, (_, indice) => ({
    // Cada nuvem numa faixa de altura e num ponto da viagem.
    y: altura * (0.12 + ((indice * 0.37 + sorteioFixo(indice + 401) * 0.2) % 0.76)),
    duracao: 95 + sorteioFixo(indice + 411) * 70,
    atraso: -sorteioFixo(indice + 421) * 160,
    tamanho: 0.85 + sorteioFixo(indice + 431) * 0.5,
    parada: largura * (0.15 + indice * 0.32),
  }));
  return (
    <>
      {nuvens.map((nuvem, indice) => (
        <div
          key={indice}
          aria-hidden="true"
          className={`no-escuro pointer-events-none absolute ${reduzir ? "" : "nuvem-viaja"}`}
          style={
            {
              left: (reduzir ? nuvem.parada : -200) * escala,
              top: (nuvem.y - 40 * nuvem.tamanho) * escala,
              width: 160 * escala * nuvem.tamanho,
              height: 110 * escala * nuvem.tamanho,
              "--viagem": `${viagem}px`,
              "--duracao": `${nuvem.duracao}s`,
              "--atraso": `${nuvem.atraso}s`,
            } as CSSProperties
          }
          data-nuvem
        >
          <Nuvem variante={indice} />
        </div>
      ))}
      {!reduzir &&
        !leve &&
        periodo !== "noite" &&
        [0, 1].map((indice) => (
          <div
            key={indice}
            aria-hidden="true"
            className="no-escuro gaivota-voa pointer-events-none absolute"
            style={
              {
                left: -60 * escala,
                top: altura * (0.2 + indice * 0.45) * escala,
                width: 34 * escala,
                height: 17 * escala,
                "--viagem": `${viagem}px`,
                "--duracao": `${48 + indice * 17}s`,
                "--atraso": `${-indice * 23 - 6}s`,
              } as CSSProperties
            }
            data-gaivota
          >
            <Gaivota />
          </div>
        ))}
    </>
  );
}
