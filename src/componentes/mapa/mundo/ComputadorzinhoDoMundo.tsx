"use client";

/*
 * O computadorzinho no mundo. Quem volta ao mundo depois de um tempo fora
 * (ou chega pela primeira vez) ganha um aceno: o bracinho balança e ele
 * diz oi, por uns segundos. A hora da última visita fica no aparelho
 * (localStorage, chave própria e só cosmética; sem ela, ele acena).
 */
import { useEffect, useState } from "react";
import { Mascote } from "@/componentes/mascote/Mascote";

const CHAVE = "ilha-sites:mundo:ultima-visita";
/** Quanto tempo fora do mundo vale um aceno. */
const TEMPO_FORA_MS = 20 * 60 * 1000;
/** Quanto dura o aceno. */
const ACENO_MS = 4500;

function lerUltimaVisita(): number | null {
  try {
    const valor = Number(localStorage.getItem(CHAVE));
    return Number.isFinite(valor) && valor > 0 ? valor : null;
  } catch {
    return null;
  }
}

function guardarVisita() {
  try {
    localStorage.setItem(CHAVE, String(Date.now()));
  } catch {
    // Sem armazenamento: ele só acena de novo na próxima vez.
  }
}

/** O bracinho acenando, por cima do lado direito do monitor (as medidas do Mascote: 140 x 130). */
function BracoAcenando() {
  return (
    <svg viewBox="0 0 140 130" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <g className="braco-acena">
        <path d="M120 66 Q132 58 134 44" fill="none" stroke="var(--cor-mascote-moldura-sombra)" strokeWidth={5} strokeLinecap="round" />
        <circle cx="134.5" cy="39" r="6.5" fill="var(--cor-destaque)" stroke="var(--cor-mascote-moldura-sombra)" strokeWidth={1.6} />
      </g>
    </svg>
  );
}

/** Faz tempo que a pessoa não vem ao mundo (ou é a primeira vez)? Lido uma vez, ao chegar (o mundo só monta no navegador). */
function voltouDepoisDeUmTempo(): boolean {
  const ultima = lerUltimaVisita();
  return ultima === null || Date.now() - ultima >= TEMPO_FORA_MS;
}

export function ComputadorzinhoDoMundo({ tamanho }: { tamanho: number }) {
  const [acenando, setAcenando] = useState(voltouDepoisDeUmTempo);
  useEffect(() => {
    const fim = setTimeout(() => setAcenando(false), ACENO_MS);
    guardarVisita();
    // Enquanto a pessoa está no mundo, o relógio da visita anda junto; ao sair, guarda a hora.
    const intervalo = setInterval(guardarVisita, 60_000);
    return () => {
      clearTimeout(fim);
      clearInterval(intervalo);
      guardarVisita();
    };
  }, []);
  return (
    <div className="relative" style={{ width: tamanho, height: (tamanho * 130) / 140 }} data-acenando={acenando ? "sim" : "nao"}>
      <Mascote expressao={acenando ? "comemorando" : "feliz"} tamanho={tamanho} />
      {acenando && <BracoAcenando />}
      {acenando && (
        <p
          role="status"
          className="absolute right-full top-1/2 mr-1 -translate-y-1/2 whitespace-nowrap rounded-2xl border-2 border-borda bg-superficie px-3 py-1 text-sm font-black text-texto shadow-[0_3px_0_var(--cor-sombra)]"
          data-oi-do-computadorzinho
        >
          Oi! Que bom te ver!
        </p>
      )}
    </div>
  );
}
