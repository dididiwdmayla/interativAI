import type { ReactNode } from "react";
import { BotaoSom } from "./BotaoSom";
import { EstrelasFase } from "./EstrelasFase";
import { SeletorTema } from "./SeletorTema";
import { OndeEstou } from "./OndeEstou";

type Props = {
  /** Onde o jogador está (ilha, zona, unidade, fase). */
  caminho: readonly string[];
  /** Estrelas da fase, ou null na revisão (sem estrelas). */
  estrelas: number | null;
  logo?: ReactNode;
  acoes?: ReactNode;
};

export function BarraSuperior({ caminho, estrelas, logo, acoes }: Props) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b-2 border-borda bg-superficie px-3 sm:gap-4 sm:px-4">
      <div className="flex items-center gap-2">
        {logo}
        <span className="hidden text-lg font-black tracking-tight text-primaria sm:inline">InterativAI</span>
      </div>
      <div className="hidden h-6 w-0.5 rounded-full bg-borda sm:block" aria-hidden="true" />
      <div className="hidden min-w-0 flex-1 sm:block">
        <OndeEstou partes={caminho} />
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {estrelas === null ? (
          <span className="rounded-full bg-painel px-3 py-1 text-xs font-black uppercase tracking-wide text-texto-suave">
            Revisão
          </span>
        ) : (
          <EstrelasFase quantidade={estrelas} />
        )}
        {acoes}
        <SeletorTema />
        <BotaoSom />
      </div>
    </header>
  );
}
