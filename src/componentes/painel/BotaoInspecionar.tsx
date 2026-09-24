"use client";

import { IconeInspecionar } from "@/componentes/icones/IconeInspecionar";
import { Dica } from "@/componentes/ui/Dica";

type Props = {
  ativo: boolean;
  pulsando?: boolean;
  aoAlternar: () => void;
};

export function BotaoInspecionar({ ativo, pulsando = false, aoAlternar }: Props) {
  return (
    <Dica texto={ativo ? "Clique num elemento da tela" : "Modo inspecionar"}>
      <button
        type="button"
        aria-pressed={ativo}
        aria-label="Modo inspecionar: escolha um elemento clicando na tela"
        onClick={aoAlternar}
        className={`relative grid h-8 w-8 place-items-center rounded-lg border-2 transition-colors ${
          ativo
            ? "border-secundaria bg-secundaria text-sobre-secundaria"
            : "border-transparent text-texto hover:border-borda hover:bg-hover"
        }`}
      >
        <IconeInspecionar />
        {pulsando && (
          <span
            className="pointer-events-none absolute -inset-1 animate-ping rounded-xl border-4 border-destaque"
            aria-hidden="true"
          />
        )}
      </button>
    </Dica>
  );
}
