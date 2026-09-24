"use client";

import type { ComponentType } from "react";
import { IconeApagar } from "@/componentes/icones/IconeApagar";
import { IconeDesfazer } from "@/componentes/icones/IconeDesfazer";
import { IconeDuplicar } from "@/componentes/icones/IconeDuplicar";
import { IconeEditar } from "@/componentes/icones/IconeEditar";
import { IconeEsconder } from "@/componentes/icones/IconeEsconder";
import { IconeRefazer } from "@/componentes/icones/IconeRefazer";
import type { PropsIcone } from "@/componentes/icones/tipos";
import type { AcoesNo } from "./tipos";

type Props = {
  acoes: AcoesNo;
  podeDesfazer: boolean;
  podeRefazer: boolean;
  aoDesfazer: () => void;
  aoRefazer: () => void;
};

type Botao = { id: string; nome: string; Icone: ComponentType<PropsIcone>; ativo: boolean; fazer: () => void };

/**
 * No celular, o nó selecionado ganha esta barra logo embaixo dele:
 * Editar, Esconder, Apagar, Duplicar, Desfazer e Refazer (alvos de 44 px).
 */
export function BarraAcoesNo({ acoes, podeDesfazer, podeRefazer, aoDesfazer, aoRefazer }: Props) {
  const botoes: Botao[] = [
    { id: "editar", nome: "Editar", Icone: IconeEditar, ativo: acoes.podeEditar, fazer: acoes.editar },
    {
      id: "esconder",
      nome: acoes.escondido ? "Mostrar" : "Esconder",
      Icone: IconeEsconder,
      ativo: acoes.podeEsconder,
      fazer: acoes.esconder,
    },
    { id: "apagar", nome: "Apagar", Icone: IconeApagar, ativo: acoes.podeApagar, fazer: acoes.apagar },
    { id: "duplicar", nome: "Duplicar", Icone: IconeDuplicar, ativo: acoes.podeDuplicar, fazer: acoes.duplicar },
    { id: "desfazer", nome: "Desfazer", Icone: IconeDesfazer, ativo: podeDesfazer, fazer: aoDesfazer },
    { id: "refazer", nome: "Refazer", Icone: IconeRefazer, ativo: podeRefazer, fazer: aoRefazer },
  ];
  return (
    <div
      role="toolbar"
      aria-label="Ações do elemento selecionado"
      data-barra-acoes
      className="my-1 flex gap-1 rounded-xl border-2 border-borda bg-superficie p-1 font-ui"
      onClick={(evento) => evento.stopPropagation()}
    >
      {botoes.map(({ id, nome, Icone, ativo, fazer }) => (
        <button
          key={id}
          type="button"
          data-acao={id}
          disabled={!ativo}
          onClick={fazer}
          className="flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 text-[10px] font-black leading-none text-texto hover:bg-hover disabled:opacity-35"
        >
          <Icone tamanho={17} />
          {nome}
        </button>
      ))}
    </div>
  );
}
