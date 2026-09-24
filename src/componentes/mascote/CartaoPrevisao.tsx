"use client";

import type { Previsao } from "@/conteudo/tipos";
import { Carinha } from "./Carinha";

type Props = {
  previsao: Previsao;
  /** Opção escolhida, ou null enquanto o jogador não respondeu. */
  resposta: number | null;
  aoResponder: (opcao: number) => void;
};

const LETRAS = ["A", "B", "C", "D"];

/**
 * Card de previsão: antes de fazer, o jogador dá um palpite. Depois de
 * responder, mostra se acertou e a explicação; aí ele faz a ação e vê
 * acontecer. Errar não custa estrela.
 */
export function CartaoPrevisao({ previsao, resposta, aoResponder }: Props) {
  if (resposta === null) {
    return (
      <div className="w-full" data-previsao>
        <p className="mb-1.5 text-xs font-black uppercase tracking-wide text-texto-suave">
          Seu palpite (errar não custa estrela)
        </p>
        <div role="group" aria-label="Opções da previsão" className="flex flex-col gap-1.5">
          {previsao.opcoes.map((opcao, indice) => (
            <button
              key={opcao}
              type="button"
              onClick={() => aoResponder(indice)}
              className="flex min-h-11 w-full items-center gap-2 rounded-2xl border-2 border-borda bg-superficie px-3 py-1.5 text-left text-sm font-bold text-texto transition-colors hover:border-primaria hover:text-primaria"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-painel text-xs font-black text-primaria">
                {LETRAS[indice]}
              </span>
              {opcao}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const acertou = resposta === previsao.correta;
  return (
    <div
      className={`w-full rounded-2xl border-2 px-3 py-2 ${acertou ? "border-sucesso" : "border-secundaria"} bg-superficie`}
      data-previsao-respondida={acertou ? "acertou" : "errou"}
    >
      <p className={`flex items-center gap-1.5 text-sm font-black ${acertou ? "text-sucesso" : "text-secundaria"}`}>
        <Carinha variante={acertou ? "feliz" : "surpresa"} tom={acertou ? "sucesso" : "primaria"} tamanho={18} />
        {acertou ? "Acertou!" : `Quase! A certa era a ${LETRAS[previsao.correta]}: ${previsao.opcoes[previsao.correta]}`}
      </p>
      <p className="mt-0.5 text-sm leading-snug text-texto">{previsao.explicacao}</p>
    </div>
  );
}
