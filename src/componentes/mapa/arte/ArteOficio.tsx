"use client";

import type { CSSProperties } from "react";
import { ChaoIlha } from "./ChaoIlha";

/**
 * A fumaça da chaminé: três baforadas subindo, crescendo e sumindo, uma
 * atrás da outra (CSS, pelo compositor; globals.css). Com menos movimento,
 * fica uma baforada parada.
 */
function Fumaca() {
  return (
    <>
      <circle cx="12" cy="-84" r="5" fill="var(--cor-fumaca)" className="fumaca-parada" />
      {[0, 1, 2].map((indice) => (
        <circle key={indice} cx="12" cy="-80" r="5" fill="var(--cor-fumaca)" className="fumaca-sobe" style={{ "--atraso": `${indice - 3}s` } as CSSProperties} />
      ))}
    </>
  );
}

/** Ofício: uma oficina com ferramentas e a chaminé soltando fumaça (tem gente trabalhando). */
export function ArteOficio() {
  return (
    <g>
      <ChaoIlha />
      {/* A chaminé, atrás do telhado */}
      <rect x="6" y="-76" width="12" height="22" rx="1.5" fill="var(--cor-pedra-sombra)" />
      <Fumaca />
      {/* Oficina */}
      <rect x="-50" y="-44" width="72" height="54" rx="4" fill="var(--cor-madeira)" />
      <path d="M-58-42L-14-76 30-42Z" fill="var(--cor-primaria)" stroke="var(--cor-mascote-moldura-sombra)" strokeWidth="2" strokeLinejoin="round" />
      <rect x="-24" y="-18" width="22" height="28" rx="3" fill="var(--cor-mar-fundo)" />
      <rect x="-44" y="-34" width="14" height="12" rx="2" fill="var(--cor-superficie)" opacity="0.85" />
      {/* Chave inglesa */}
      <g transform="translate(52 -26) rotate(35)">
        <rect x="-3" y="-4" width="6" height="34" rx="3" fill="var(--cor-texto-suave)" />
        <path d="M-9-12a9 9 0 1 0 18 0l-5 0 0 5-8 0 0-5z" fill="var(--cor-texto-suave)" />
      </g>
      {/* Martelo */}
      <g transform="translate(70 -4) rotate(-25)">
        <rect x="-2.5" y="-6" width="5" height="30" rx="2" fill="var(--cor-madeira)" />
        <rect x="-11" y="-12" width="22" height="9" rx="2" fill="var(--cor-texto-suave)" />
      </g>
    </g>
  );
}
