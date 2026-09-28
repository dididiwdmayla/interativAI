"use client";

import { IconeDispositivo } from "@/componentes/icones/IconeDispositivo";
import { Dica } from "@/componentes/ui/Dica";

type Props = {
  ativo: boolean;
  aoAlternar: () => void;
};

/** O botão da barra de dispositivo, ao lado da setinha (Toggle device toolbar do Chrome, Ctrl+Shift+M). */
export function BotaoDispositivo({ ativo, aoAlternar }: Props) {
  return (
    <Dica texto={ativo ? "Desligar o modo dispositivo" : "Modo dispositivo (Ctrl+Shift+M)"} alinhar="inicio">
      <button
        type="button"
        data-botao-dispositivo
        aria-pressed={ativo}
        aria-label="Modo dispositivo: ver o site num celular, tablet ou notebook (Ctrl+Shift+M)"
        onClick={aoAlternar}
        className={`relative grid h-8 w-8 place-items-center rounded-lg border-2 transition-colors pointer-coarse:h-11 pointer-coarse:w-11 ${
          ativo ? "border-secundaria bg-secundaria text-sobre-secundaria" : "border-transparent text-texto hover:border-borda hover:bg-hover"
        }`}
      >
        <IconeDispositivo />
      </button>
    </Dica>
  );
}
