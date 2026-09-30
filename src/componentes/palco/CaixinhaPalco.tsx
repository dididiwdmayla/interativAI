"use client";

import { NOME_DO_TIPO, tipoDoNo, type VariavelPalco } from "@/motor/palco";
import { COR_DO_TIPO } from "./coresDoTipo";
import { ValorPalco } from "./ValorPalco";

type Props = { variavel: VariavelPalco; anterior: VariavelPalco | null; nova: boolean; mudou: boolean };

const ROTULO_DECLARACAO: Record<VariavelPalco["declaracao"], string> = {
  let: "let",
  const: "const",
  var: "var",
  funcao: "function",
  parametro: "parâmetro",
  classe: "class",
};

/** Uma variável: a etiqueta com o nome, a caixinha com o valor e a plaquinha do tipo. */
export function CaixinhaPalco({ variavel, anterior, nova, mudou }: Props) {
  const tipo = tipoDoNo(variavel.valor);
  const cor = COR_DO_TIPO[tipo];
  const animacao = nova ? "palco-surgir" : mudou ? "palco-piscar" : "";
  return (
    <div
      className={`flex min-w-0 max-w-full flex-col rounded-xl border-2 bg-superficie ${cor.borda} ${animacao}`}
      data-caixinha={variavel.nome}
      data-tipo={tipo}
      data-declaracao={variavel.declaracao}
      data-mudou={nova ? "nova" : mudou ? "mudou" : "nao"}
      title={`${variavel.nome}: ${NOME_DO_TIPO[tipo]} (${ROTULO_DECLARACAO[variavel.declaracao]})`}
    >
      <div className="flex items-center gap-1.5 border-b-2 border-borda px-2 py-0.5">
        <span className="min-w-0 truncate font-mono text-sm font-black text-texto">{variavel.nome}</span>
        <span className="text-[10px] font-bold uppercase tracking-wide text-texto-suave">{ROTULO_DECLARACAO[variavel.declaracao]}</span>
        <span className="flex-1" />
        <span className={`rounded-full border px-1.5 text-[10px] font-bold ${cor.texto} ${cor.borda}`}>{NOME_DO_TIPO[tipo]}</span>
      </div>
      <div className="min-w-0 px-2 py-1.5">
        <ValorPalco no={variavel.valor} anterior={anterior?.valor ?? null} />
      </div>
    </div>
  );
}
