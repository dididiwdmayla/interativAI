"use client";

import { NOME_DO_TIPO, tipoDoNo, type VariavelPalco } from "@/motor/palco";
import { ArvorePalco } from "./ArvorePalco";
import { COR_DO_TIPO } from "./coresDoTipo";
import { ValorPalco } from "./ValorPalco";

type Props = {
  variavel: VariavelPalco;
  anterior: VariavelPalco | null;
  nova: boolean;
  mudou: boolean;
  /** (Ferramenta arvore-palco) O objeto tem filhos objetos: o botão "Ver como árvore". */
  arvore?: { ativa: boolean; aoAlternar: () => void } | null;
};

const ROTULO_DECLARACAO: Record<VariavelPalco["declaracao"], string> = {
  let: "let",
  const: "const",
  var: "var",
  funcao: "function",
  parametro: "parâmetro",
  classe: "class",
};

/** Uma variável: a etiqueta com o nome, a caixinha com o valor e a plaquinha do tipo. */
export function CaixinhaPalco({ variavel, anterior, nova, mudou, arvore = null }: Props) {
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
        {arvore && (
          <span data-ferramenta="arvore-palco" className="inline-flex">
            <button
              type="button"
              onClick={arvore.aoAlternar}
              aria-pressed={arvore.ativa}
              className="rounded-full border-2 border-js-objeto px-1.5 text-[10px] font-black text-js-objeto hover:bg-hover pointer-coarse:min-h-9 pointer-coarse:px-2.5"
              data-ver-como-arvore={variavel.nome}
            >
              {arvore.ativa ? "Ver como fichas" : "Ver como árvore"}
            </button>
          </span>
        )}
        <span className={`rounded-full border px-1.5 text-[10px] font-bold ${cor.texto} ${cor.borda}`}>{NOME_DO_TIPO[tipo]}</span>
      </div>
      <div className="min-w-0 px-2 py-1.5">
        {arvore?.ativa ? <ArvorePalco no={variavel.valor} /> : <ValorPalco no={variavel.valor} anterior={anterior?.valor ?? null} />}
      </div>
    </div>
  );
}
