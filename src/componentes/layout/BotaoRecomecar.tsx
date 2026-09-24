"use client";

import { useState } from "react";
import { IconeRecarregar } from "@/componentes/icones/IconeRecarregar";
import { Mascote } from "@/componentes/mascote/Mascote";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";

type Props = {
  aoRecomecar: () => void;
  /** No menu do celular o botão aparece em qualquer largura. */
  noMenu?: boolean;
};

/** Botão discreto para recomeçar a fase, com confirmação. */
export function BotaoRecomecar({ aoRecomecar, noMenu = false }: Props) {
  const [confirmando, setConfirmando] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className={
          noMenu
            ? "inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold text-texto-suave hover:bg-hover hover:text-texto"
            : "hidden items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-texto-suave hover:bg-hover hover:text-texto md:inline-flex"
        }
      >
        <IconeRecarregar tamanho={14} />
        Recomeçar fase
      </button>
      <Modal aberto={confirmando} titulo="Recomeçar a fase?" aoFechar={() => setConfirmando(false)}>
        <div className="flex items-center gap-4">
          <Mascote expressao="preocupado" tamanho={96} />
          <div>
            <p className="text-lg font-black">Recomeçar do zero?</p>
            <p className="text-sm text-texto-suave">
              O site volta ao original, os objetivos zeram e as estrelas desta tentativa também.
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Botao variante="secundario" onClick={() => setConfirmando(false)}>
            Melhor não
          </Botao>
          <Botao
            onClick={() => {
              setConfirmando(false);
              aoRecomecar();
            }}
          >
            Recomeçar
          </Botao>
        </div>
      </Modal>
    </>
  );
}
