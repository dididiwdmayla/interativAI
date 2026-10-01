"use client";

import { temFormaDeArvore } from "@/motor/estruturas";
import type { EscopoPalco, QuadroPalco as Quadro, VariavelPalco } from "@/motor/palco";
import { CaixinhaPalco } from "./CaixinhaPalco";

/** (Ferramenta arvore-palco) As variáveis vistas como árvore, pelo nome. */
export type ArvoresDoPalco = { abertas: ReadonlySet<string>; aoAlternar: (nome: string) => void } | null;

type Props = {
  quadro: Quadro;
  /** O mesmo quadro no passo anterior (para piscar o que mudou). */
  anteriores: Map<string, VariavelPalco>;
  novas: Set<string>;
  mudaram: Set<string>;
  /** Faixa embaixo do nome: "devolve 5", "parou aqui". */
  faixa?: { texto: string; tom: "retorno" | "erro" } | null;
  /** É o quadro mais de dentro (a função que está rodando agora). */
  ativo: boolean;
  arvores?: ArvoresDoPalco;
};

function Variaveis({ escopo, anteriores, novas, mudaram, arvores = null }: { escopo: EscopoPalco } & Pick<Props, "anteriores" | "novas" | "mudaram" | "arvores">) {
  return (
    <div className="flex flex-wrap items-start gap-2">
      {escopo.variaveis.map((variavel) => (
        <CaixinhaPalco
          key={variavel.chave}
          variavel={variavel}
          anterior={anteriores.get(variavel.chave) ?? null}
          nova={novas.has(variavel.chave)}
          mudou={mudaram.has(variavel.chave)}
          arvore={arvores && temFormaDeArvore(variavel.valor) ? { ativa: arvores.abertas.has(variavel.nome), aoAlternar: () => arvores.aoAlternar(variavel.nome) } : null}
        />
      ))}
    </div>
  );
}

/** Uma moldura de memória: a global, ou a de uma função enquanto ela roda (com os blocos dentro). */
export function QuadroPalco({ quadro, anteriores, novas, mudaram, faixa = null, ativo, arvores = null }: Props) {
  const global = quadro.chamada === 0;
  const [principal, ...blocos] = quadro.escopos;
  const vazio = quadro.escopos.every((escopo) => escopo.variaveis.length === 0);
  return (
    <section
      className={`flex flex-col gap-2 rounded-2xl border-2 p-2.5 ${global ? "border-borda bg-painel" : `palco-surgir border-secundaria bg-superficie ${ativo ? "shadow-[0_4px_0_var(--cor-sombra)]" : "opacity-80"}`}`}
      data-quadro={quadro.nome}
      data-chamada={quadro.chamada}
      aria-label={global ? "Memória global" : `Função ${quadro.nome} rodando`}
    >
      <header className="flex flex-wrap items-center gap-2">
        <span className={`text-xs font-black uppercase tracking-wide ${global ? "text-texto-suave" : "text-secundaria"}`}>
          {global ? "Memória global" : `${quadro.nome}() rodando`}
        </span>
        {faixa && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${faixa.tom === "erro" ? "bg-js-erro-fundo text-erro" : "bg-sucesso text-superficie"}`}
            data-faixa-quadro={faixa.tom}
          >
            {faixa.texto}
          </span>
        )}
      </header>
      {vazio && <p className="text-xs text-texto-suave">{global ? "Nenhuma variável ainda." : "Sem variáveis."}</p>}
      {principal && <Variaveis escopo={principal} anteriores={anteriores} novas={novas} mudaram={mudaram} arvores={arvores} />}
      {blocos.map((bloco) =>
        bloco.variaveis.length === 0 ? null : (
          <div key={bloco.id} className="flex flex-col gap-1.5 rounded-xl border-2 border-dashed border-borda p-2" data-bloco-palco={bloco.id}>
            <span className="text-[10px] font-bold uppercase tracking-wide text-texto-suave">dentro do bloco</span>
            <Variaveis escopo={bloco} anteriores={anteriores} novas={novas} mudaram={mudaram} arvores={arvores} />
          </div>
        ),
      )}
    </section>
  );
}
