"use client";

import type { LinhaArvore } from "@/lib/arvore";

type Props = {
  linha: LinhaArvore;
  selecionada: boolean;
  aoClicar: () => void;
  aoPassarMouse: () => void;
};

const RECUO_PX = 16;

export function LinhaFechamento({ linha, selecionada, aoClicar, aoPassarMouse }: Props) {
  return (
    <div
      role="none"
      onClick={aoClicar}
      onMouseEnter={aoPassarMouse}
      className={`cursor-default whitespace-pre-wrap rounded-md py-px pr-2 text-codigo-tag ${
        selecionada ? "bg-selecao" : "hover:bg-hover"
      }`}
      style={{ paddingLeft: linha.profundidade * RECUO_PX + 22 }}
    >
      &lt;/{linha.no.tag}&gt;
    </div>
  );
}
