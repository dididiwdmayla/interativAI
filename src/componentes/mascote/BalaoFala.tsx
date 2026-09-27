"use client";

import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { type ReactNode, useEffect, useRef } from "react";
import { useVozDoMascote } from "@/audio/ganchos";
import { comecarPendencia } from "@/lib/pendencias";
import type { Fala } from "@/motor/tipos";

/** Teto da troca de texto: sem o fim da animação (aba escondida), não fica pendente para sempre. */
const TETO_TROCA_MS = 1000;

type Props = {
  fala: Fala;
  /** Pergunta do aluno que gerou esta fala (mostrada pequena, acima). */
  pergunta?: string | null;
  children?: ReactNode;
  /** Para onde aponta o rabinho: o mascote à esquerda (desktop) ou embaixo à direita (celular). */
  rabo?: "esquerda" | "baixo-direita";
  /** Fala com a voz de modem a cada fala nova (padrão: sim). */
  voz?: boolean;
};

/**
 * Balão de fala do computadorzinho, com rabinho apontando para ele. O texto
 * aparece de uma vez; a voz de modem toca junto, proporcional ao texto (com
 * teto). Balão fechando (saindo de cena) ou fala trocada calam a voz na hora.
 */
export function BalaoFala({ fala, pergunta, children, rabo = "esquerda", voz = true }: Props) {
  const presente = useIsPresent();
  useVozDoMascote(fala.texto, fala.expressao, voz && presente);
  // A troca de texto (sai o antigo, entra o novo) conta como pendência: a
  // fase só fica "pronta" (data-pronto) com o texto novo já na tela.
  const troca = useRef<{ texto: string; encerrar: () => void } | null>(null);
  const primeira = useRef(true);
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    const encerrar = comecarPendencia();
    troca.current = { texto: fala.texto, encerrar };
    const teto = setTimeout(encerrar, TETO_TROCA_MS);
    return () => {
      clearTimeout(teto);
      encerrar();
    };
  }, [fala.texto]);
  return (
    <div className="relative flex min-h-[5.5rem] flex-1 shrink-0 flex-col justify-between gap-2 rounded-2xl border-2 border-borda bg-painel px-4 py-3">
      <span
        className={`absolute h-4 w-4 border-b-2 border-l-2 border-borda bg-painel ${
          rabo === "esquerda" ? "-left-[9px] bottom-6 rotate-45" : "-bottom-[9px] right-6 -rotate-45"
        }`}
        aria-hidden="true"
      />
      <div aria-live="polite" className="relative">
        {pergunta && (
          <p className="mb-0.5 line-clamp-1 text-xs text-texto-suave">
            <span className="font-black">Você perguntou:</span> {pergunta}
          </p>
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={fala.texto}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            onAnimationComplete={() => {
              if (troca.current?.texto === fala.texto) troca.current.encerrar();
            }}
            className="text-[15px] font-bold leading-snug text-texto"
          >
            {fala.texto}
          </motion.p>
        </AnimatePresence>
      </div>
      {children && <div className="relative flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
