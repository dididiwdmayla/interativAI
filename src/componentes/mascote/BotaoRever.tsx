"use client";

import { IconeRecarregar } from "@/componentes/icones/IconeRecarregar";

type Props = { aberto: boolean; aoAlternar: () => void };

/** No desafio, o "Me ajuda" vira "Rever": abre a lista das partes que faltam. */
export function BotaoRever({ aberto, aoAlternar }: Props) {
  return (
    <button
      type="button"
      onClick={aoAlternar}
      aria-expanded={aberto}
      aria-label="Rever: voltar a um passo que foi ensinado antes"
      className="inline-flex items-center gap-2 rounded-full border-2 border-secundaria bg-superficie px-3 py-1.5 text-sm font-black text-secundaria transition hover:bg-secundaria hover:text-sobre-secundaria"
    >
      <IconeRecarregar tamanho={14} />
      Rever
    </button>
  );
}
