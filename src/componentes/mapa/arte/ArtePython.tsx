"use client";

import type { CSSProperties } from "react";
import { ChaoIlha } from "./ChaoIlha";

/** Python: um observatório de dados, com o gráfico de barras crescendo (CSS, pelo compositor) e uma planilha estendida no varal. */
export function ArtePython() {
  const barras = [
    { x: 14, altura: 18, atraso: 0 },
    { x: 26, altura: 30, atraso: 0.2 },
    { x: 38, altura: 24, atraso: 0.4 },
    { x: 50, altura: 40, atraso: 0.6 },
  ];
  return (
    <g>
      <ChaoIlha />
      {/* A torre do observatório, com a cúpula e a luneta apontando pro céu */}
      <rect x="-62" y="-34" width="40" height="52" rx="4" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="2" />
      <path d="M-66-34a22 22 0 0 1 48 0z" fill="var(--cor-secundaria)" stroke="var(--cor-pedra-sombra)" strokeWidth="2" />
      <path d="M-40-48l20-16" stroke="var(--cor-texto-suave)" strokeWidth="5" strokeLinecap="round" />
      <rect x="-50" y="-6" width="16" height="24" rx="3" fill="var(--cor-madeira)" />
      <circle cx="-42" cy="-20" r="4" fill="var(--cor-destaque)" />
      {/* O quadro com o gráfico de barras */}
      <rect x="6" y="-40" width="58" height="50" rx="4" fill="var(--cor-superficie)" stroke="var(--cor-madeira)" strokeWidth="3" />
      <path d="M12 2H58" stroke="var(--cor-texto-suave)" strokeWidth="1.5" />
      {barras.map(({ x, altura, atraso }) => (
        <rect
          key={x}
          x={x}
          y={2 - altura}
          width="8"
          height={altura}
          rx="1.5"
          fill={x === 50 ? "var(--cor-primaria)" : "var(--cor-secundaria)"}
          className="barra-cresce"
          style={{ "--atraso": `${atraso - 3.2}s` } as CSSProperties}
        />
      ))}
      <path d="M18 10v14M52 10v14" stroke="var(--cor-madeira)" strokeWidth="3" strokeLinecap="round" />
      {/* O varal com a planilha CSV */}
      <path d="M-86 4Q-74 10-62 4" fill="none" stroke="var(--cor-texto-suave)" strokeWidth="1.5" />
      <rect x="-84" y="6" width="18" height="14" rx="1.5" fill="var(--cor-superficie)" stroke="var(--cor-pedra-sombra)" strokeWidth="1.5" />
      <path d="M-84 11h18M-84 15h18M-78 6v14M-72 6v14" stroke="var(--cor-pedra-sombra)" strokeWidth="1" />
    </g>
  );
}
