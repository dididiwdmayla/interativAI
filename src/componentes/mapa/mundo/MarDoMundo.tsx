"use client";

/*
 * O mar do mundo, além das ondinhas (Oceano.tsx): a profundidade (água
 * rasa e clara em volta das ilhas, mais funda e escura longe delas), os
 * reflexos de luz que piscam na água, a espuma batendo nas praias e, de
 * noite, o mar escuro com as estrelas e a lua refletidas.
 *
 * Desempenho: a profundidade e a maior parte das estrelas são desenho
 * parado (pintado uma vez). O que se mexe é pequeno, só transform e
 * opacity (o compositor anima, sem repintar o mapa), e para fora da tela
 * (`data-pausado`). Com menos movimento, nada se mexe (globals.css).
 */
import type { CSSProperties, ReactNode } from "react";
import { sorteioFixo, type Ponto } from "../geometria";
import type { Periodo } from "./periodo";
import { useMarcarNaTela } from "./useNaTela";

type NoDesenho = { escala: number };

/** Uma caixa em px, a partir do centro e do tamanho em unidades do desenho. */
export function caixaPx({ x, y }: Ponto, largura: number, altura: number, escala: number): CSSProperties {
  return { left: (x - largura / 2) * escala, top: (y - altura / 2) * escala, width: largura * escala, height: altura * escala };
}

/**
 * Um pedaço parado do mundo que anima só enquanto aparece na tela: fora dela,
 * `data-pausado="sim"` tira a animação (e a camada do compositor; globals.css).
 * A marca vai direto no elemento, sem estado do React (rolar não renderiza nada).
 */
export function Pausavel({ estilo, className = "", children, ...dados }: { estilo: CSSProperties; className?: string; children: ReactNode } & Record<`data-${string}`, string>) {
  const ref = useMarcarNaTela<HTMLDivElement>();
  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute ${className}`} style={estilo} {...dados}>
      {children}
    </div>
  );
}

/**
 * A profundidade: o mar fundo cobre o mundo, e em volta de cada ilha (e do
 * Porto) a água rasa clareia até a cor de sempre do mar. Desenho parado.
 */
export function Profundidade({ largura, altura, escala, ilhas }: NoDesenho & { largura: number; altura: number; ilhas: readonly Ponto[] }) {
  return (
    <svg
      viewBox={`0 0 ${largura} ${altura}`}
      width={largura * escala}
      height={altura * escala}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      data-profundidade
    >
      <defs>
        <radialGradient id="mundo-agua-rasa">
          <stop offset="0" stopColor="var(--cor-mar)" stopOpacity="1" />
          <stop offset="0.62" stopColor="var(--cor-mar)" stopOpacity="1" />
          <stop offset="1" stopColor="var(--cor-mar)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={largura} height={altura} fill="var(--cor-mar-profundo)" />
      {ilhas.map((ilha, indice) => (
        <ellipse key={indice} cx={ilha.x} cy={ilha.y + 12} rx={330} ry={235} fill="url(#mundo-agua-rasa)" />
      ))}
    </svg>
  );
}

/** Os reflexos de luz na água (de dia): risquinhos claros que acendem e apagam, cada um no seu tempo. */
export function Reflexos({ lugares, escala }: NoDesenho & { lugares: readonly Ponto[] }) {
  return (
    <>
      {lugares.map((lugar, indice) => (
        <Pausavel
          key={indice}
          estilo={{ ...caixaPx(lugar, 46, 14, escala), "--duracao": `${4.5 + sorteioFixo(indice + 31) * 3}s`, "--atraso": `${-sorteioFixo(indice + 47) * 6}s` } as CSSProperties}
          className="reflexo-agua"
          data-reflexo=""
        >
          <svg viewBox="-23 -7 46 14" width="100%" height="100%" className="block overflow-visible">
            <path d="M-18 0h22M8 0h8M-10 5h12" stroke="var(--cor-reflexo)" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </Pausavel>
      ))}
    </>
  );
}

/** A espuma batendo na praia de cada ilha: dois anéis (um no modo leve) que nascem na areia, crescem e somem, um atrás do outro. */
export function EspumaDasPraias({ ilhas, escala, aneis = 2 }: NoDesenho & { ilhas: readonly Ponto[]; aneis?: number }) {
  return (
    <>
      {ilhas.map((ilha, indice) => (
        <Pausavel key={indice} estilo={caixaPx({ x: ilha.x, y: ilha.y + 27 }, 250, 100, escala)} data-espuma="">
          {Array.from({ length: aneis }, (_, anel) => (
            <svg
              key={anel}
              viewBox="-125 -50 250 100"
              width="100%"
              height="100%"
              className="espuma-praia absolute inset-0 block overflow-visible"
              style={{ "--atraso": `${anel * -2.2 - sorteioFixo(indice + 5) * 2}s` } as CSSProperties}
            >
              <ellipse cx="0" cy="0" rx="113" ry="41" fill="none" stroke="var(--cor-espuma)" strokeWidth="3" strokeDasharray="14 9" strokeLinecap="round" />
            </svg>
          ))}
        </Pausavel>
      ))}
    </>
  );
}

/**
 * O céu na água, conforme a hora (desenho parado, pintado uma vez embaixo de
 * tudo): de noite, o mar escuro com as estrelas e a lua refletidas; no
 * amanhecer e no entardecer, a água morna.
 */
export function CeuNaAgua({ periodo, largura, altura, escala, lugares }: NoDesenho & { periodo: Periodo; largura: number; altura: number; lugares: readonly Ponto[] }) {
  if (periodo === "dia") return null;
  const noite = periodo === "noite";
  const tinta = noite ? "var(--cor-noite)" : periodo === "entardecer" ? "var(--cor-entardecer)" : "var(--cor-amanhecer)";
  const paradas = lugares.slice(ESTRELAS_QUE_PISCAM);
  const lua = lugares[Math.floor(lugares.length / 2)];
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: tinta }} data-ceu-na-agua={periodo} />
      {noite && (
        <svg viewBox={`0 0 ${largura} ${altura}`} width={largura * escala} height={altura * escala} className="pointer-events-none absolute inset-0" aria-hidden="true" data-estrelas>
          {paradas.map((ponto, indice) => (
            <circle key={indice} cx={ponto.x + sorteioFixo(indice + 3) * 30} cy={ponto.y + sorteioFixo(indice + 9) * 20} r={1 + sorteioFixo(indice + 17) * 1.4} fill="var(--cor-estrela)" opacity={0.55 + sorteioFixo(indice + 23) * 0.4} />
          ))}
          {lua && (
            <g transform={`translate(${lua.x} ${lua.y})`} data-lua>
              <ellipse rx="34" ry="9" fill="var(--cor-estrela)" opacity="0.18" />
              <ellipse rx="14" ry="5" fill="var(--cor-estrela)" opacity="0.5" />
            </g>
          )}
        </svg>
      )}
    </>
  );
}

/** Quantas das estrelas piscam (as outras são desenho parado). */
export const ESTRELAS_QUE_PISCAM = 8;

/** As estrelas que piscam, de noite: umas poucas, cada uma no seu tempo, paradas fora da tela. */
export function EstrelasPiscando({ lugares, escala, quantas = ESTRELAS_QUE_PISCAM }: NoDesenho & { lugares: readonly Ponto[]; quantas?: number }) {
  return (
    <>
      {lugares.slice(0, quantas).map((ponto, indice) => (
        <Pausavel
          key={indice}
          estilo={{ ...caixaPx(ponto, 16, 16, escala), "--duracao": `${2.2 + sorteioFixo(indice + 61) * 2.4}s`, "--atraso": `${-sorteioFixo(indice + 71) * 4}s` } as CSSProperties}
          className="estrela-pisca"
          data-estrela-pisca=""
        >
          <svg viewBox="-8 -8 16 16" width="100%" height="100%" className="block">
            <path d="M0-7L1.6-1.6 7 0 1.6 1.6 0 7-1.6 1.6-7 0-1.6-1.6Z" fill="var(--cor-estrela)" />
          </svg>
        </Pausavel>
      ))}
    </>
  );
}
