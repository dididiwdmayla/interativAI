"use client";

import { textoPrevia } from "@/motor/executor/formatar";
import type { FotoMemoria } from "@/motor/executor/tipos";
import { memoriaParaExibido } from "@/motor/programa";

type Props = { memoria: FotoMemoria | null };

/** O palco da memória: as variáveis do programa. */
export function PalcoMemoria({ memoria }: Props) {
  const globais = memoria?.quadros[0]?.escopos[0]?.variaveis ?? [];
  return (
    <div className="flex h-full min-h-0 flex-col gap-2 overflow-auto bg-codigo-fundo p-3" data-palco>
      {globais.length === 0 && <p className="text-sm text-texto-suave">A memória está vazia. Crie uma variável no Console.</p>}
      {globais.map((variavel) => (
        <div key={variavel.nome} className="rounded-lg border-2 border-borda bg-superficie px-2 py-1 font-mono text-sm" data-caixinha={variavel.nome}>
          <span className="font-bold">{variavel.nome}</span> = {memoria ? textoPrevia(memoriaParaExibido(variavel.valor, memoria.monte)) : ""}
        </div>
      ))}
    </div>
  );
}
