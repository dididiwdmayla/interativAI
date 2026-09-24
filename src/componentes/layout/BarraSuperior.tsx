import type { ReactNode } from "react";
import { BotaoSom } from "./BotaoSom";
import { EstrelasFase } from "./EstrelasFase";
import { SeletorTema } from "./SeletorTema";
import { Trilha } from "./Trilha";

type Props = {
  trilha: readonly string[];
  estrelas: number;
  logo?: ReactNode;
  acoes?: ReactNode;
};

export function BarraSuperior({ trilha, estrelas, logo, acoes }: Props) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b-2 border-borda bg-superficie px-3 sm:gap-4 sm:px-4">
      <div className="flex items-center gap-2">
        {logo}
        <span className="hidden text-lg font-black tracking-tight text-primaria sm:inline">InterativAI</span>
      </div>
      <div className="hidden h-6 w-0.5 rounded-full bg-borda sm:block" aria-hidden="true" />
      <div className="hidden min-w-0 flex-1 sm:block">
        <Trilha partes={trilha} />
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <EstrelasFase quantidade={estrelas} />
        {acoes}
        <SeletorTema />
        <BotaoSom />
      </div>
    </header>
  );
}
