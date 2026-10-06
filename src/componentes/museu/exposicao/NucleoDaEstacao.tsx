"use client";

/*
 * A peça de mexer de uma estação (os cartões do tear, as lâmpadas, o botão
 * de descer, os dígitos da cor, a caixa de cartões): o alvo das
 * apresentações da ferramenta e do "onde olhar". Pequeno de propósito: no
 * celular deitado, o cartão da apresentação cabe ao lado dele.
 */
import type { ReactNode } from "react";
import { AlvoFerramenta } from "@/componentes/ferramentas/AlvoFerramenta";
import { FERRAMENTA_DA_ESTACAO } from "@/motor/exposicao/conferir";
import type { TipoEstacao } from "@/motor/exposicao/modelo";

export function NucleoDaEstacao({ tipo, className = "", children }: { tipo: TipoEstacao; className?: string; children: ReactNode }) {
  return (
    <AlvoFerramenta ids={[FERRAMENTA_DA_ESTACAO[tipo]]} className={className}>
      {children}
    </AlvoFerramenta>
  );
}
