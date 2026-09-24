"use client";

import type { ReactNode } from "react";
import type { Aba } from "@/motor/abas";
import { AbasPainel } from "./AbasPainel";

type Props = {
  abaAtiva: Aba;
  abasDesbloqueadas: readonly Aba[];
  aoTrocarAba: (aba: Aba) => void;
  ferramentas?: ReactNode;
  children: ReactNode;
};

/** Moldura do DevTools simplificado: abas no topo e conteúdo da aba. */
export function Painel({ abaAtiva, abasDesbloqueadas, aoTrocarAba, ferramentas, children }: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-borda bg-superficie shadow-[0_8px_0_var(--cor-sombra)]">
      <div className="flex shrink-0 items-end gap-2 border-b-2 border-borda bg-painel px-2 pt-1.5 pointer-fine:pr-8">
        {ferramentas && <div className="flex items-center self-center pb-1">{ferramentas}</div>}
        <div className="h-6 w-0.5 self-center rounded-full bg-borda" aria-hidden="true" />
        <AbasPainel ativa={abaAtiva} desbloqueadas={abasDesbloqueadas} aoTrocar={aoTrocarAba} />
      </div>
      <div role="tabpanel" className="flex min-h-0 flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
