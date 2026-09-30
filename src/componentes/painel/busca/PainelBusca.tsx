"use client";

import { useMemo, useState } from "react";
import { AlvoFerramenta } from "@/componentes/ferramentas/AlvoFerramenta";
import { IconeAviso } from "@/componentes/icones/IconeAviso";
import { SeletorSegmentado } from "@/componentes/ui/SeletorSegmentado";
import type { IdFerramenta } from "@/ferramentas/ids";
import { type Aparelho, analisarDadosEstruturados, resultadoNaBusca } from "@/motor/busca";
import { CartaoNegocio } from "./CartaoNegocio";
import { ListaDadosEstruturados } from "./ListaDadosEstruturados";

export type SubAbaBusca = "resultado" | "dados";

type Props = {
  /** O documento do site-alvo agora. */
  obterDocumento: () => Document | null;
  /** Muda quando a página muda: o painel recalcula. */
  versao: string;
  url: string;
  aba: SubAbaBusca;
  aoTrocarAba: (aba: SubAbaBusca) => void;
  /** Quais das duas ferramentas a fase liberou. */
  ferramentas: readonly IdFerramenta[];
  aoAbrirCard: (id: IdFerramenta) => void;
};

/**
 * A aba Busca (zona "Ser encontrado"): o resultado da página numa busca,
 * ao vivo, e o teste de dados estruturados. Tudo é simulação aproximada, e
 * o painel diz isso no topo (src/motor/busca.ts explica cada aproximação).
 */
export function PainelBusca({ obterDocumento, versao, url, aba, aoTrocarAba, ferramentas, aoAbrirCard }: Props) {
  const [aparelho, setAparelho] = useState<Aparelho>("computador");
  const comResultado = ferramentas.includes("resultado-busca");
  const comDados = ferramentas.includes("dados-estruturados");
  const abaVisivel: SubAbaBusca = aba === "dados" && comDados ? "dados" : comResultado ? "resultado" : "dados";
  const analise = useMemo(() => {
    void versao;
    const documento = obterDocumento();
    if (!documento?.body) return null;
    return { resultado: resultadoNaBusca(documento, url, aparelho), blocos: analisarDadosEstruturados(documento) };
  }, [obterDocumento, url, aparelho, versao]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-superficie" data-painel-busca>
      <div className="flex shrink-0 flex-col gap-2 border-b-2 border-borda bg-painel px-3 py-2">
        <p className="flex items-start gap-1.5 text-xs font-bold leading-snug text-texto-suave" data-aviso-simulacao>
          <IconeAviso className="mt-0.5 shrink-0 text-alerta" />
          Simulação aproximada: o Google corta os textos por largura em pixels e pode trocar o título e a descrição por outro trecho
          da página.
        </p>
        {comResultado && comDados && (
          <SeletorSegmentado
            rotulo="Ferramentas da busca"
            opcoes={[
              { id: "resultado", rotulo: "Resultado" },
              { id: "dados", rotulo: "Dados estruturados" },
            ]}
            valor={abaVisivel}
            aoTrocar={aoTrocarAba}
            className="w-full"
          />
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {!analise ? null : abaVisivel === "resultado" ? (
          <AlvoFerramenta ids={["resultado-busca"]} marcador="resultado-busca" aoAbrirCard={aoAbrirCard} classeMarcador="right-1 top-1">
            <div className="flex flex-col gap-3">
              <SeletorSegmentado
                rotulo="Aparelho da busca"
                opcoes={[
                  { id: "computador", rotulo: "Computador" },
                  { id: "celular", rotulo: "Celular" },
                ]}
                valor={aparelho}
                aoTrocar={setAparelho}
                className="self-start"
              />
              {analise.resultado.indexavel ? (
                <article
                  className="rounded-2xl border-2 border-borda bg-fundo p-3"
                  data-resultado-busca
                  data-indexavel="sim"
                  data-titulo-cortado={analise.resultado.titulo.cortou ? "sim" : "nao"}
                  data-descricao-cortada={analise.resultado.descricao.cortou ? "sim" : "nao"}
                >
                  <p className="flex items-center gap-2 text-xs text-texto-suave">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-painel text-[11px] font-black text-texto" aria-hidden="true">
                      {analise.resultado.endereco.charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0 truncate" data-endereco-busca>
                      {analise.resultado.endereco}
                    </span>
                  </p>
                  <h3 className="mt-1 text-lg font-bold leading-snug text-secundaria underline-offset-2 hover:underline" data-titulo-busca>
                    {analise.resultado.titulo.exibido}
                  </h3>
                  <p className="mt-1 text-sm leading-snug text-texto" data-descricao-busca>
                    {analise.resultado.descricao.exibido || <span className="italic text-texto-suave">(sem texto para mostrar)</span>}
                  </p>
                </article>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-borda bg-fundo p-3 text-sm text-texto" data-resultado-busca data-indexavel="nao">
                  <p className="font-black">Esta página não aparece na busca.</p>
                  <p className="mt-1 text-texto-suave">
                    Ela tem <code className="font-mono text-xs">{analise.resultado.motivoNaoIndexavel}</code>: continua no ar para quem tem o
                    link, mas a busca não mostra.
                  </p>
                </div>
              )}
              <ul className={`flex flex-col gap-1 text-xs font-bold text-texto-suave ${analise.resultado.indexavel ? "" : "hidden"}`} data-observacoes-busca>
                {analise.resultado.titulo.inventado && <li>Sem &lt;title&gt;: a busca inventou um título com o que achou na página.</li>}
                {analise.resultado.titulo.cortou && <li>O título passou do espaço e foi cortado com reticências.</li>}
                {analise.resultado.descricao.inventado && (
                  <li>Sem meta description: a busca mostrou um trecho da página, que talvez não diga o que você quer.</li>
                )}
                {analise.resultado.descricao.cortou && <li>A descrição passou do espaço {aparelho === "celular" ? "do celular" : ""} e foi cortada.</li>}
              </ul>
              {analise.resultado.negocio && <CartaoNegocio negocio={analise.resultado.negocio} />}
            </div>
          </AlvoFerramenta>
        ) : (
          <AlvoFerramenta ids={["dados-estruturados"]} marcador="dados-estruturados" aoAbrirCard={aoAbrirCard} classeMarcador="right-1 top-1">
            <ListaDadosEstruturados blocos={analise.blocos} />
          </AlvoFerramenta>
        )}
      </div>
    </div>
  );
}
