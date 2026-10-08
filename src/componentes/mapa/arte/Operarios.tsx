"use client";

/*
 * Os operários das ilhas em construção: computadorzinhos de capacete. Um
 * martela no alto do andaime, o outro carrega um bloco pra lá e pra cá. De
 * noite, os dois cochilam (de capacete e tudo). Só tokens; o que se mexe é
 * pequeno, só CSS (o compositor anda sozinho; globals.css) e para fora da tela.
 */
import { useNoiteNoMapa } from "./noiteNoMapa";

/** O corpo do computadorzinho com capacete; `dormindo` fecha os olhos. */
function Corpo({ dormindo }: { dormindo: boolean }) {
  return (
    <g>
      <rect x="-9" y="10" width="18" height="4" rx="2" fill="var(--cor-mascote-base)" />
      <rect x="-16" y="-12" width="32" height="24" rx="8" fill="var(--cor-mascote-moldura)" />
      <rect x="-12" y="-8" width="24" height="16" rx="5" fill="var(--cor-mascote-tela)" />
      {dormindo ? (
        <path d="M-8-1q2.5 2 5 0M3-1q2.5 2 5 0M-2 4h4" fill="none" stroke="var(--cor-mascote-rosto)" strokeWidth="1.6" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="-5" cy="-1" r="1.8" fill="var(--cor-mascote-rosto)" />
          <circle cx="5" cy="-1" r="1.8" fill="var(--cor-mascote-rosto)" />
          <path d="M-3 3.5q3 2.5 6 0" fill="none" stroke="var(--cor-mascote-rosto)" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      {/* O capacete */}
      <path d="M-13-12a13 10 0 0 1 26 0z" fill="var(--cor-destaque)" stroke="var(--cor-madeira)" strokeWidth="1.2" />
      <rect x="-16" y="-13.5" width="32" height="3" rx="1.5" fill="var(--cor-destaque)" stroke="var(--cor-madeira)" strokeWidth="1" />
    </g>
  );
}

function Zzz({ x, y }: { x: number; y: number }) {
  return (
    <g className="operario-zzz">
      <text x={x} y={y} fontSize="10" fontWeight="900" fill="var(--cor-texto-suave)">
        z
      </text>
    </g>
  );
}

/** O operário do martelo, no andaime. */
export function OperarioMartelo({ x, y, escala = 1 }: { x: number; y: number; escala?: number }) {
  const noite = useNoiteNoMapa();
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} data-operario="martelo">
      <Corpo dormindo={noite} />
      {noite ? (
        <Zzz x={16} y={-16} />
      ) : (
        <g transform="translate(16 2)">
          {/* O martelo gira em volta da mão, em passos (poucas repinturas por segundo; globals.css). */}
          <g className="operario-martelo">
            <path d="M0 0l12-6" stroke="var(--cor-madeira)" strokeWidth="2.6" strokeLinecap="round" />
            <rect x="9" y="-12" width="9" height="6" rx="1.5" transform="rotate(-27 13 -9)" fill="var(--cor-texto-suave)" />
          </g>
        </g>
      )}
    </g>
  );
}

/** O operário que carrega um bloco, andando pra lá e pra cá no chão da ilha (em passos, como um robozinho). */
export function OperarioBloco({ x, y, escala = 1 }: { x: number; y: number; escala?: number }) {
  const noite = useNoiteNoMapa();
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} data-operario="bloco">
      <g className={noite ? undefined : "operario-anda"}>
        <Corpo dormindo={noite} />
        {!noite && <rect x="-8" y="-27" width="16" height="11" rx="2" fill="var(--cor-primaria)" stroke="var(--cor-madeira)" strokeWidth="1.2" />}
      </g>
      {noite && <Zzz x={14} y={-14} />}
    </g>
  );
}
