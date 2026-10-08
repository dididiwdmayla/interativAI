"use client";

import type { CSSProperties } from "react";
import { ChaoIlha } from "./ChaoIlha";

/** Uma faísca que acende e cresce (CSS, pelo compositor; globals.css). */
function Faisca({ x, y, atraso }: { x: number; y: number; atraso: number }) {
  return (
    <path
      d={`M${x} ${y - 7}L${x + 2} ${y - 2}L${x + 7} ${y}L${x + 2} ${y + 2}L${x} ${y + 7}L${x - 2} ${y + 2}L${x - 7} ${y}L${x - 2} ${y - 2}Z`}
      fill="var(--cor-destaque)"
      className="faisca-pisca"
      style={{ "--atraso": `${atraso - 1.6}s` } as CSSProperties}
    />
  );
}

/** Uma peça pulando (CSS, pelo compositor). */
const pular = (atraso: number) => ({ className: "peca-pula", style: { "--atraso": `${atraso - 1.2}s` } as CSSProperties });

/** Páginas vivas: peças que se mexem, faíscas e botões. */
export function ArtePaginasVivas() {
  return (
    <g>
      <ChaoIlha />
      <g {...pular(0)}>
        <rect x="-62" y="-40" width="26" height="26" rx="5" fill="var(--cor-primaria)" />
      </g>
      <g {...pular(0.3)}>
        <rect x="-26" y="-58" width="22" height="22" rx="11" fill="var(--cor-secundaria)" />
      </g>
      <g {...pular(0.6)}>
        <rect x="8" y="-44" width="24" height="24" rx="4" fill="var(--cor-sucesso)" />
      </g>
      {/* Botão */}
      <rect x="20" y="-8" width="54" height="22" rx="11" fill="var(--cor-destaque)" stroke="var(--cor-madeira)" strokeWidth="2" />
      <rect x="32" y="1" width="30" height="4" rx="2" fill="var(--cor-texto-sobre-destaque)" opacity="0.7" />
      <Faisca x={-78} y={-58} atraso={0} />
      <Faisca x={48} y={-58} atraso={0.5} />
      <Faisca x={-6} y={-78} atraso={1} />
    </g>
  );
}
