import type { ReactNode } from "react";
import { IconeRecarregar } from "@/componentes/icones/IconeRecarregar";
import { IconeSeta } from "@/componentes/icones/IconeSeta";

type Props = {
  url: string;
  children: ReactNode;
};

/** Moldura de navegador falsa em volta do site-alvo. */
export function JanelaNavegador({ url, children }: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-borda bg-superficie shadow-[0_8px_0_var(--cor-sombra)]">
      <div className="flex shrink-0 items-center gap-3 border-b-2 border-borda bg-painel px-3 py-2">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-erro" />
          <span className="h-3 w-3 rounded-full bg-alerta" />
          <span className="h-3 w-3 rounded-full bg-sucesso" />
        </div>
        <div className="flex items-center gap-1 text-texto-suave" aria-hidden="true">
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
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
