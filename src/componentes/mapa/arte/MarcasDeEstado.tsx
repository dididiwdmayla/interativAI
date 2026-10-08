"use client";

import type { CSSProperties } from "react";
import { OperarioBloco, OperarioMartelo } from "./Operarios";

type NoMapa = {
  /** O centro da ilha, em unidades do desenho do mundo. */
  x: number;
  y: number;
  /** Quantos px vale uma unidade do desenho. */
  escala: number;
};

/** Uma elipse do desenho (centro e raios em unidades) como caixa em px. */
function caixa({ x, y, escala }: NoMapa, rx: number, ry: number, dy = 0) {
  return { left: (x - rx) * escala, top: (y + dy - ry) * escala, width: 2 * rx * escala, height: 2 * ry * escala };
}

/**
 * Brilho suave atrás de uma ilha disponível (e o anel aceso da ilha
 * completa). Em HTML, embaixo do desenho: pulsa só a opacidade, pelo
 * compositor, sem repintar o mapa.
 */
export function BrilhoIlha({ completa = false, ...no }: NoMapa & { completa?: boolean }) {
  return (
    <>
      <div aria-hidden="true" className="brilho-ilha pointer-events-none absolute rounded-[50%] bg-destaque" style={caixa(no, 132, 84, 10)} />
      {/* Ilha completa: um anel aceso em volta, além do brilho. */}
      {completa && (
        <div
          aria-hidden="true"
          data-ilha-acesa
          className="anel-ilha pointer-events-none absolute rounded-[50%] border-destaque"
          style={{ ...caixa(no, 149, 99, 10), borderWidth: 6 * no.escala }}
        />
      )}
    </>
  );
}

/**
 * Andaimes por cima da ilha e dois operários-computadorzinhos de capacete:
 * um martela no alto, o outro carrega blocos (de noite, cochilam). Em
 * construção.
 */
export function AndaimesIlha() {
  const traco = { stroke: "var(--cor-madeira)", strokeWidth: 4, strokeLinecap: "round" as const };
  return (
    <g>
      <g opacity="0.95">
        <line x1="-70" y1="30" x2="-70" y2="-70" {...traco} />
        <line x1="-20" y1="30" x2="-20" y2="-70" {...traco} />
        <line x1="30" y1="30" x2="30" y2="-70" {...traco} />
        <line x1="-78" y1="-66" x2="38" y2="-66" {...traco} />
        <line x1="-78" y1="-20" x2="38" y2="-20" {...traco} />
        <line x1="-70" y1="-66" x2="-20" y2="-20" {...traco} strokeWidth={2.5} />
        <line x1="-20" y1="-66" x2="30" y2="-20" {...traco} strokeWidth={2.5} />
      </g>
      {/* No meio do andaime (a tábua do meio), longe do topo da arte. */}
      <OperarioMartelo x={-45} y={-35} escala={1.05} />
      <OperarioBloco x={52} y={10} escala={1.15} />
    </g>
  );
}

/** Cadeado em SVG (corpo e alça). */
export function CadeadoMapa({ x, y, tamanho = 1 }: { x: number; y: number; tamanho?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${tamanho})`}>
      <path d="M-9-6v-7a9 9 0 0 1 18 0v7" fill="none" stroke="var(--cor-texto)" strokeWidth="4" />
      <rect x="-14" y="-7" width="28" height="22" rx="5" fill="var(--cor-destaque)" stroke="var(--cor-texto)" strokeWidth="2.5" />
      <circle cx="0" cy="2" r="3" fill="var(--cor-texto)" />
      <rect x="-1.2" y="3" width="2.4" height="6" rx="1" fill="var(--cor-texto)" />
    </g>
  );
}

/**
 * Névoa por cima da ilha bloqueada, com o cadeado. Em HTML, em cima do
 * desenho: a névoa desliza pelo compositor (transform), sem repintar o mapa.
 */
export function NevoaIlha(no: NoMapa) {
  const area = { left: (no.x - 150) * no.escala, top: (no.y - 90) * no.escala, width: 300 * no.escala, height: 160 * no.escala };
  const caixaDoDesenho = "-150 -90 300 160";
  return (
    <div aria-hidden="true" className="no-escuro pointer-events-none absolute" style={area} data-nevoa>
      <svg
        viewBox={caixaDoDesenho}
        width="100%"
        height="100%"
        className="nevoa-deriva absolute inset-0"
        style={{ "--deriva": `${6 * no.escala}px` } as CSSProperties}
      >
        <ellipse cx="-40" cy="-10" rx="70" ry="42" fill="var(--cor-nevoa)" opacity="0.85" />
        <ellipse cx="40" cy="-24" rx="66" ry="40" fill="var(--cor-nevoa)" opacity="0.8" />
        <ellipse cx="0" cy="22" rx="104" ry="36" fill="var(--cor-nevoa)" opacity="0.85" />
      </svg>
      <svg viewBox={caixaDoDesenho} width="100%" height="100%" className="absolute inset-0">
        <CadeadoMapa x={0} y={-8} tamanho={1.4} />
      </svg>
    </div>
  );
}
