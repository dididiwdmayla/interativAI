"use client";

import { IconeDesfazer } from "@/componentes/icones/IconeDesfazer";
import { IconeRefazer } from "@/componentes/icones/IconeRefazer";
import { Dica } from "@/componentes/ui/Dica";

type Props = {
  podeDesfazer: boolean;
  podeRefazer: boolean;
  aoDesfazer: () => void;
  aoRefazer: () => void;
};

const CLASSE =
  "grid h-8 w-8 place-items-center rounded-lg border-2 border-transparent text-texto transition-colors hover:border-borda hover:bg-hover disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-transparent disabled:hover:bg-transparent pointer-coarse:h-11 pointer-coarse:w-11";

/** Desfazer e refazer do painel (Ctrl+Z e Ctrl+Shift+Z ou Ctrl+Y com o foco no painel). */
export function BotoesHistorico({ podeDesfazer, podeRefazer, aoDesfazer, aoRefazer }: Props) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <Dica texto="Desfazer (Ctrl+Z)" alinhar="inicio">
        <button
          type="button"
          onClick={aoDesfazer}
          disabled={!podeDesfazer}
          aria-label="Desfazer a última mudança do painel (Ctrl+Z)"
          className={CLASSE}
        >
          <IconeDesfazer />
        </button>
      </Dica>
      <Dica texto="Refazer (Ctrl+Shift+Z ou Ctrl+Y)" alinhar="inicio">
        <button
          type="button"
          onClick={aoRefazer}
          disabled={!podeRefazer}
          aria-label="Refazer (Ctrl+Shift+Z ou Ctrl+Y)"
          className={CLASSE}
        >
          <IconeRefazer />
        </button>
      </Dica>
    </span>
  );
}
