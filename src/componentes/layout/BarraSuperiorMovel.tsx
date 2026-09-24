import type { ReactNode } from "react";
import { EstrelasFase } from "./EstrelasFase";
import { MenuMovel } from "./MenuMovel";

type Props = {
  /** Trilha encurtada (ex.: "Elementos › Fase 1"). */
  titulo: string;
  estrelas: number;
  /** Bem fina, para o celular deitado. */
  fina?: boolean;
  /** Tema, som, Ferramentas, recomeçar. */
  menu: ReactNode;
};

/** Barra superior compacta do celular: trilha curta, estrelas e o resto num menu. */
export function BarraSuperiorMovel({ titulo, estrelas, fina = false, menu }: Props) {
  return (
    <header
      className={`flex shrink-0 items-center gap-2 border-b-2 border-borda bg-superficie pl-3 pr-1 ${fina ? "h-10" : "h-12"}`}
    >
      <span className="min-w-0 flex-1 truncate text-sm font-black text-texto">{titulo}</span>
      <EstrelasFase quantidade={estrelas} tamanho={fina ? 16 : 18} />
      <MenuMovel>{menu}</MenuMovel>
    </header>
  );
}
