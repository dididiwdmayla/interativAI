"use client";

import type { DegrauAjuda } from "@/motor/tipos";

type Props = {
  degrau: DegrauAjuda;
  /** 4 no guiado; 2 no sozinho (só pergunta e dica). */
  degrauMaximo?: DegrauAjuda;
  desativado: boolean;
  aoAjudar: () => void;
};

const NOMES = ["pergunta", "dica", "onde olhar", "solução"];

/** Botão "Me ajuda" com um pontinho por degrau da escada. */
export function BotaoAjuda({ degrau, degrauMaximo = 4, desativado, aoAjudar }: Props) {
  const nomes = NOMES.slice(0, degrauMaximo);
  const acabou = degrau >= degrauMaximo;
  const rotulo = acabou
    ? "Me ajuda: no modo sozinho a ajuda vai só até a dica"
    : `Me ajuda. Próxima ajuda: ${nomes[Math.min(degrau, nomes.length - 1)]}`;
  return (
    <button
      type="button"
      onClick={aoAjudar}
      disabled={desativado || acabou}
      aria-label={rotulo}
      title={acabou ? "No modo sozinho, a ajuda vai só até a dica. Você consegue!" : undefined}
      className="inline-flex items-center gap-2 rounded-full border-2 border-secundaria bg-superficie px-3 py-1.5 text-sm font-black text-secundaria transition hover:bg-secundaria hover:text-sobre-secundaria disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-superficie disabled:hover:text-secundaria"
    >
      Me ajuda
      <span className="flex gap-0.5" aria-hidden="true">
        {nomes.map((nome, indice) => (
          <span key={nome} className={`h-1.5 w-1.5 rounded-full ${indice < degrau ? "bg-current" : "bg-borda"}`} />
        ))}
      </span>
    </button>
  );
}
