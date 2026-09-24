"use client";

import { IconeRecarregar } from "@/componentes/icones/IconeRecarregar";
import type { ParteDesafio } from "@/conteudo/tipos";

type Props = {
  pendentes: readonly ParteDesafio[];
  /** Nome da fase onde cada parte foi ensinada. */
  tituloDaFase: (id: string) => string;
  aoRever: (parteId: string) => void;
  aoFechar: () => void;
};

/** "Rever": as partes que faltam, cada uma com o botão que abre a fase onde ela foi ensinada. */
export function ListaRever({ pendentes, tituloDaFase, aoRever, aoFechar }: Props) {
  return (
    <div className="w-full rounded-2xl border-2 border-secundaria bg-superficie p-2" data-lista-rever>
      <p className="px-1 text-xs font-bold text-texto-suave">
        Cada Rever custa 1 estrela (fica no mínimo 1). O desafio fica salvo do jeito que está.
      </p>
      <ul className="mt-1.5 space-y-1.5">
        {pendentes.map((parte) => (
          <li
            key={parte.id}
            className="flex flex-col items-start gap-1.5 rounded-xl bg-painel px-2 py-1.5 sm:flex-row sm:items-center sm:gap-2"
          >
            <span className="min-w-0 text-sm font-bold text-texto sm:flex-1">
              {parte.descricao}
              <span className="block text-xs font-normal text-texto-suave">Ensinado em: {tituloDaFase(parte.revisarEm)}</span>
            </span>
            <button
              type="button"
              onClick={() => aoRever(parte.id)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-secundaria bg-superficie px-3 text-xs font-black text-secundaria hover:bg-secundaria hover:text-sobre-secundaria"
            >
              <IconeRecarregar tamanho={14} />
              Rever este passo
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={aoFechar}
        className="mt-1 min-h-11 px-2 text-xs font-bold text-texto-suave underline decoration-dotted underline-offset-2 hover:text-texto"
      >
        Deixa, vou tentar sozinho
      </button>
    </div>
  );
}
