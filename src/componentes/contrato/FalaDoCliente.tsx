"use client";

import type { ReactNode } from "react";
import { clienteDe, type IdCliente } from "@/motor/contrato/clientes";
import type { FalaCliente } from "@/motor/contrato/modelo";
import { Cliente } from "./Cliente";

type Props = {
  cliente: IdCliente;
  fala: FalaCliente;
  /** O texto que já apareceu (a fala digitando). */
  mostrado: string;
  /** Ainda digitando: a boca mexe. */
  falando: boolean;
  /** Os botões embaixo do balão. */
  children?: ReactNode;
};

/** O cliente e o balão dele: o rosto muda com a expressão da fala e a boca acompanha o texto aparecendo. */
export function FalaDoCliente({ cliente, fala, mostrado, falando, children }: Props) {
  const dados = clienteDe(cliente);
  return (
    <div className="flex items-end gap-3" data-fala-cliente={fala.expressao}>
      <Cliente id={cliente} expressao={fala.expressao} falando={falando} letraAtual={mostrado.slice(-1)} tamanho={112} className="h-auto w-20 shrink-0 sm:w-28" />
      <div className="relative flex min-h-[6rem] min-w-0 flex-1 flex-col justify-between gap-2 rounded-2xl border-2 border-borda bg-superficie px-4 py-3">
        <span className="absolute -left-[9px] bottom-6 h-4 w-4 rotate-45 border-b-2 border-l-2 border-borda bg-superficie" aria-hidden="true" />
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-wide text-secundaria">
            {dados.nome} <span className="font-bold normal-case tracking-normal text-texto-suave">· {dados.negocio}</span>
          </p>
          {/* O texto inteiro fica reservado (invisível) para o balão não pular de tamanho enquanto digita. */}
          <p className="relative text-[15px] font-bold leading-snug text-texto" aria-live="polite">
            <span className="invisible" aria-hidden="true">
              {fala.texto}
            </span>
            <span className="absolute inset-0" data-texto-cliente>
              {mostrado}
            </span>
          </p>
        </div>
        {children && <div className="relative flex flex-wrap items-center justify-end gap-2">{children}</div>}
      </div>
    </div>
  );
}
