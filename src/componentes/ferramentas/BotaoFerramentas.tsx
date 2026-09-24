"use client";

import { IconeCaixaFerramentas } from "@/componentes/icones/IconeCaixaFerramentas";

type Props = { aoAbrir: () => void; compacto?: boolean };

/** Botão "Ferramentas" da barra superior. */
export function BotaoFerramentas({ aoAbrir, compacto = false }: Props) {
  return (
    <button
      type="button"
      onClick={aoAbrir}
      aria-label="Abrir a Caixa de Ferramentas"
      className="flex h-9 items-center gap-1.5 rounded-full border-2 border-borda bg-superficie px-3 text-sm font-black text-texto transition-colors hover:border-primaria hover:text-primaria"
    >
      <IconeCaixaFerramentas />
      {!compacto && <span className="hidden md:inline">Ferramentas</span>}
    </button>
  );
}
