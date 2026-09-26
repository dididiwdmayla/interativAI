import type { ReactNode } from "react";
import { IconeGlobo } from "@/componentes/icones/IconeGlobo";
import { IconeRecarregar } from "@/componentes/icones/IconeRecarregar";
import { IconeSeta } from "@/componentes/icones/IconeSeta";

type Props = {
  url: string;
  /**
   * Modo documento: a aba do navegador aparece em cima, com o <title> da
   * página ao vivo (sem title, o Chrome mostra o endereço). Sem o campo,
   * não há aba (as fases que só mexem no body).
   */
  tituloAba?: string | null;
  /** Um aviso por cima da página (a simulação dos acentos quebrados). */
  aviso?: ReactNode;
  children: ReactNode;
  /** No celular: barra mais baixa, sem as setas de navegação. */
  compacta?: boolean;
};

/** Moldura de navegador falsa em volta do site-alvo. */
export function JanelaNavegador({ url, tituloAba, aviso, children, compacta = false }: Props) {
  const temAba = tituloAba !== undefined;
  const textoAba = tituloAba && tituloAba.trim().length > 0 ? tituloAba.trim() : url;
  return (
    <div className={`flex h-full min-h-0 flex-col overflow-hidden ${
        compacta ? "rounded-xl shadow-[0_4px_0_var(--cor-sombra)]" : "rounded-2xl shadow-[0_8px_0_var(--cor-sombra)]"
      } border-2 border-borda bg-superficie`}>
      {temAba && (
        <div className={`flex shrink-0 items-end bg-fundo pointer-fine:pr-10 ${compacta ? "px-2 pt-1" : "px-3 pt-1.5"}`}>
          <div
            data-aba-navegador
            title={textoAba}
            className="flex min-w-0 max-w-60 items-center gap-1.5 rounded-t-lg border-2 border-b-0 border-borda bg-painel px-3 py-1 text-xs font-bold text-texto"
          >
            <IconeGlobo tamanho={12} className="shrink-0 text-texto-suave" />
            <span className="truncate" data-titulo-aba>
              {textoAba}
            </span>
          </div>
        </div>
      )}
      <div
        className={`flex shrink-0 items-center border-b-2 border-borda bg-painel pointer-fine:pr-10 ${
          compacta ? "gap-2 px-2 py-1" : "gap-3 px-3 py-2"
        }`}
      >
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-erro" />
          <span className="h-3 w-3 rounded-full bg-alerta" />
          <span className="h-3 w-3 rounded-full bg-sucesso" />
        </div>
        <div className={`items-center gap-1 text-texto-suave ${compacta ? "hidden" : "flex"}`} aria-hidden="true">
          <span className="grid h-6 w-6 place-items-center opacity-40">
            <IconeSeta direcao="esquerda" />
          </span>
          <span className="grid h-6 w-6 place-items-center opacity-40">
            <IconeSeta direcao="direita" />
          </span>
          <span className="grid h-6 w-6 place-items-center opacity-40">
            <IconeRecarregar />
          </span>
        </div>
        <div
          className="min-w-0 flex-1 truncate rounded-full border-2 border-borda bg-superficie px-3 py-0.5 font-codigo text-xs text-texto-suave"
          aria-label="Endereço do site"
        >
          <span className="text-sucesso">https://</span>
          {url}
        </div>
      </div>
      <div className="relative min-h-0 flex-1">
        {children}
        {aviso}
      </div>
    </div>
  );
}
