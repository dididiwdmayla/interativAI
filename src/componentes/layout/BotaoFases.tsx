"use client";

import { IconeListaFases } from "@/componentes/icones/IconeListaFases";

type Props = { aoAbrir: () => void; noMenu?: boolean };

/** Botão "Fases": abre a lista de unidades e fases. */
export function BotaoFases({ aoAbrir, noMenu = false }: Props) {
  return (
    <button
      type="button"
      onClick={aoAbrir}
      aria-label="Abrir a lista de fases"
      className={
        noMenu
          ? "inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-borda bg-superficie px-3 text-sm font-black text-texto hover:border-primaria hover:text-primaria"
          : "flex h-9 items-center gap-1.5 rounded-full border-2 border-borda bg-superficie px-3 text-sm font-black text-texto transition-colors hover:border-primaria hover:text-primaria"
      }
    >
      <IconeListaFases />
      <span className={noMenu ? "" : "hidden md:inline"}>Fases</span>
    </button>
  );
}
