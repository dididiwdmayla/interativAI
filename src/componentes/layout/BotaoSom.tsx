"use client";

import { IconeSom } from "@/componentes/icones/IconeSom";
import { Dica } from "@/componentes/ui/Dica";
import { atualizarProgresso, useProgresso } from "@/lib/armazemProgresso";

export function BotaoSom() {
  const { som } = useProgresso();

  return (
    <Dica texto={som ? "Som ligado" : "Som desligado"}>
      <button
        type="button"
        aria-pressed={som}
        aria-label={som ? "Desligar som" : "Ligar som"}
        onClick={() => atualizarProgresso((atual) => ({ ...atual, som: !atual.som }))}
        className="grid h-9 w-9 place-items-center rounded-full border-2 border-borda bg-superficie text-texto transition-colors hover:border-primaria hover:text-primaria"
      >
        <IconeSom ligado={som} />
      </button>
    </Dica>
  );
}
