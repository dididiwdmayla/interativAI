"use client";

import type { DegrauAjuda } from "@/motor/tipos";

type Props = {
  degrau: DegrauAjuda;
  desativado: boolean;
  aoAjudar: () => void;
};

const NOMES = ["pergunta", "dica", "onde olhar", "solução"];

/** Botão "Me ajuda" com quatro pontinhos mostrando o degrau da escada. */
export function BotaoAjuda({ degrau, desativado, aoAjudar }: Props) {
  const proximo = NOMES[Math.min(degrau, 3)];
  return (
    <button
      type="button"
      onClick={aoAjudar}
      disabled={desativado}
      aria-label={`Me ajuda. Próxima ajuda: ${proximo}`}
      className="inline-flex items-center gap-2 rounded-full border-2 border-secundaria bg-superficie px-3 py-1.5 text-sm font-black text-secundaria transition hover:bg-secundaria hover:text-sobre-secundaria disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-superficie disabled:hover:text-secundaria"
    >
      Me ajuda
      <span className="flex gap-0.5" aria-hidden="true">
        {NOMES.map((nome, indice) => (
          <span
            key={nome}
            className={`h-1.5 w-1.5 rounded-full ${indice < degrau ? "bg-current" : "bg-borda"}`}
          />
        ))}
      </span>
    </button>
  );
}
