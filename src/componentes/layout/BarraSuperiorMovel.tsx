import type { ReactNode } from "react";
import { EstrelasFase } from "./EstrelasFase";
import { MenuMovel } from "./MenuMovel";

type Props = {
  /** Onde o jogador está, encurtado (ex.: "Unidade 2 › Fase 1"). */
  titulo: string;
  /** Estrelas da fase, ou null na revisão (sem estrelas). */
  estrelas: number | null;
  /** Bem fina, para o celular deitado. */
  fina?: boolean;
  /** Tema, som, Ferramentas, recomeçar. */
  menu: ReactNode;
  /** Botão que fica sempre à vista, fora do menu (ex.: "Voltar ao desafio"). */
  acaoFixa?: ReactNode;
};

/**
 * Barra superior compacta do celular: onde o jogador está, estrelas e o
 * resto num menu. Fica acima do fundo do balão do computadorzinho, então
 * os botões dela funcionam mesmo com a conversa aberta.
 */
export function BarraSuperiorMovel({ titulo, estrelas, fina = false, menu, acaoFixa }: Props) {
  return (
    <header
      className={`relative z-[45] flex shrink-0 items-center gap-2 border-b-2 border-borda bg-superficie pl-3 pr-1 ${fina ? "h-10" : "h-12"}`}
    >
      <span className="min-w-0 flex-1 truncate text-sm font-black text-texto">{titulo}</span>
      {estrelas === null ? (
        <span className="rounded-full bg-painel px-2 py-0.5 text-[11px] font-black uppercase text-texto-suave">Revisão</span>
      ) : (
        <EstrelasFase quantidade={estrelas} tamanho={fina ? 16 : 18} />
      )}
      {acaoFixa}
      <MenuMovel>{menu}</MenuMovel>
    </header>
  );
}
