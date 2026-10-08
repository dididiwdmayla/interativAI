"use client";

import { useId } from "react";
import { tocarEfeito } from "@/audio/motor";
import { atualizarProgresso, useProgresso } from "@/lib/armazemProgresso";
import { useMenosMovimento } from "@/lib/useConsultaMidia";

const OPCOES = [
  { valor: "completas", rotulo: "Completas" },
  { valor: "leves", rotulo: "Leves" },
] as const;

/**
 * Animações do mundo: completas ou leves (menos coisas se mexendo, para
 * aparelho mais fraco). Sem escolha, o jogo decide sozinho pelo aparelho
 * (mundo/useModoAnimacoes.ts); `atual` é o modo que está valendo. A escolha
 * fica salva no progresso.
 */
export function AjusteAnimacoes({ atual }: { atual: "completas" | "leves" }) {
  const { animacoes } = useProgresso();
  const menosMovimento = useMenosMovimento();
  const idTitulo = useId();
  const automatico = animacoes === "auto";

  return (
    <section aria-labelledby={idTitulo} data-ajuste-animacoes={animacoes} className="flex flex-col gap-2 text-left">
      <h2 id={idTitulo} className="text-sm font-black uppercase tracking-wide text-texto-suave">
        Animações
      </h2>
      <div role="group" aria-labelledby={idTitulo} className="flex gap-2">
        {OPCOES.map(({ valor, rotulo }) => {
          const aceso = atual === valor;
          return (
            <button
              key={valor}
              type="button"
              aria-pressed={aceso}
              data-animacoes-opcao={valor}
              onClick={() => {
                atualizarProgresso((progresso) => ({ ...progresso, animacoes: valor }));
                tocarEfeito("clique");
              }}
              className={`min-h-9 flex-1 whitespace-nowrap rounded-full border-2 px-3 text-sm font-black transition-colors pointer-coarse:min-h-11 ${
                aceso ? "border-primaria bg-primaria text-sobre-primaria" : "border-borda bg-superficie text-texto hover:border-primaria hover:text-primaria"
              }`}
            >
              {rotulo}
            </button>
          );
        })}
      </div>
      <p className="text-xs font-bold text-texto-suave" data-animacoes-nota>
        {menosMovimento
          ? "Seu aparelho pediu menos movimento: o mundo fica parado."
          : automatico
            ? "Escolhidas sozinhas para este aparelho. Leves: menos coisas se mexendo, mais fluido."
            : "Leves: menos coisas se mexendo, mais fluido."}
      </p>
    </section>
  );
}
