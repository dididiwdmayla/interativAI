"use client";

import { IconeCadeado } from "@/componentes/icones/IconeCadeado";
import { Carinha } from "@/componentes/mascote/Carinha";
import { Dica } from "@/componentes/ui/Dica";
import { ABAS, type Aba } from "@/motor/abas";

type Props = {
  ativa: Aba;
  desbloqueadas: readonly Aba[];
  aoTrocar: (aba: Aba) => void;
};

export function AbasPainel({ ativa, desbloqueadas, aoTrocar }: Props) {
  return (
    <div role="tablist" aria-label="Painéis do DevTools" className="flex min-w-0 items-end gap-0.5 overflow-x-auto">
      {ABAS.map((aba) => {
        const livre = desbloqueadas.includes(aba.id);
        const selecionada = ativa === aba.id;
        const botao = (
          <button
            type="button"
            role="tab"
            aria-selected={selecionada}
            aria-disabled={!livre}
            aria-label={livre ? aba.rotulo : `${aba.rotulo} (bloqueada, desbloqueia em breve)`}
            onClick={() => livre && aoTrocar(aba.id)}
            className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-t-lg px-3 py-2 text-sm font-bold transition-colors ${
              selecionada
                ? "bg-superficie text-primaria"
                : livre
                  ? "text-texto hover:bg-hover"
                  : "cursor-not-allowed text-texto-suave opacity-70"
            }`}
          >
            {!livre && <IconeCadeado tamanho={12} />}
            {aba.rotulo}
            {!livre && <Carinha variante="dormindo" tom="suave" tamanho={14} />}
            {selecionada && (
              <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-primaria" aria-hidden="true" />
            )}
          </button>
        );
        return livre ? (
          <span key={aba.id}>{botao}</span>
        ) : (
          <Dica key={aba.id} texto="Desbloqueia em breve">
            {botao}
          </Dica>
        );
      })}
    </div>
  );
}
