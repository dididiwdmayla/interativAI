"use client";

import { ChaoIlha } from "./ChaoIlha";

/**
 * O guindaste montando a página, bloco por bloco: a lança, o cabo e o bloco
 * pendurado. O ciclo (desce o bloco, solta na pilha, sobe vazio e volta com
 * outro) é CSS, pelo compositor: o cabo estica (scaleY a partir da lança) e
 * o bloco desce até encostar em cima da pilha (globals.css).
 */
function Guindaste() {
  return (
    <g data-guindaste>
      {/* A torre treliçada e a lança */}
      <path d="M30 10V-78M38 10V-78M30-68l8 12M38-56l-8 12M30-44l8 12M38-32l-8 12M30-20l8 12" stroke="var(--cor-alerta)" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M-14-79H58" stroke="var(--cor-alerta)" strokeWidth="4" strokeLinecap="round" />
      <rect x="50" y="-83" width="12" height="9" rx="2" fill="var(--cor-pedra-sombra)" />
      <rect x="-3" y="-82" width="8" height="5" rx="1.5" fill="var(--cor-texto-suave)" />
      {/* O cabo (de -77 a -68; estica até -50, em cima da pilha). */}
      <line x1="1" y1="-77" x2="1" y2="-68" stroke="var(--cor-texto-suave)" strokeWidth="1.4" className="guindaste-cabo" />
      {/* O bloco no gancho: some quando encosta na pilha (e o da pilha aparece) e volta lá em cima. */}
      <g className="guindaste-bloco">
        <rect x="-7" y="-68" width="16" height="14" rx="2" fill="var(--cor-secundaria)" stroke="var(--cor-mascote-base)" strokeWidth="1.2" />
      </g>
      <g className="guindaste-pilha">
        <rect x="-7" y="-50" width="16" height="14" rx="2" fill="var(--cor-secundaria)" stroke="var(--cor-mascote-base)" strokeWidth="1.2" />
      </g>
    </g>
  );
}

/** Sites: prédios em forma de < e >, blocos empilhados e o guindaste montando a página. */
export function ArteSites() {
  const janelas = (x: number, y: number) =>
    [0, 12].map((dy) => <rect key={dy} x={x} y={y + dy} width="7" height="6" rx="1.5" fill="var(--cor-superficie)" opacity="0.8" />);
  return (
    <g>
      <ChaoIlha />
      <Guindaste />
      {/* Prédio "<" */}
      <path
        d="M-44-74L-92-32-44 10-26 10-68-32-26-74Z"
        fill="var(--cor-primaria)"
        stroke="var(--cor-mascote-moldura-sombra)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {janelas(-78, -38)}
      {/* Prédio ">" */}
      <path
        d="M44-74L92-32 44 10 26 10 68-32 26-74Z"
        fill="var(--cor-secundaria)"
        stroke="var(--cor-mascote-base)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {janelas(71, -38)}
      {/* Blocos empilhados no meio, como peças de uma página */}
      <rect x="-16" y="-6" width="32" height="16" rx="3" fill="var(--cor-destaque)" stroke="var(--cor-madeira)" strokeWidth="1.5" />
      <rect x="-11" y="-22" width="22" height="16" rx="3" fill="var(--cor-sucesso)" />
      <rect x="-7" y="-36" width="14" height="14" rx="2" fill="var(--cor-alerta)" />
    </g>
  );
}
