"use client";

import { useState } from "react";
import { AlvoFerramenta } from "@/componentes/ferramentas/AlvoFerramenta";
import { IconeAviso } from "@/componentes/icones/IconeAviso";
import type { IdFerramenta } from "@/ferramentas/ids";
import { montarLinkRastreavel, rotuloDaOrigem, type Utm } from "@/motor/medicao";

/** Uma linha do relatório: um evento medido ou uma visita que chegou. */
export type LinhaMedicao =
  | { id: number; tipo: "evento"; nome: string; origem: Utm | null; hora: string }
  | { id: number; tipo: "visita"; origem: Utm; hora: string };

type Props = {
  linhas: readonly LinhaMedicao[];
  /** Quais ferramentas a fase liberou (medicao, link-rastreavel). */
  ferramentas: readonly IdFerramenta[];
  /** O endereço do site-alvo (a base do link). */
  url: string;
  /** O elemento selecionado é um link: dá para pôr o link rastreável nele. */
  podePorNoLink: boolean;
  aoPorNoLink: (href: string) => void;
  aoSimularVisita: (utm: Utm) => void;
  aoAbrirCard: (id: IdFerramenta) => void;
};

function Campo({ rotulo, valor, aoMudar, nome }: { rotulo: string; valor: string; aoMudar: (valor: string) => void; nome: string }) {
  return (
    <label className="flex min-w-0 flex-col gap-0.5 text-xs font-bold text-texto-suave">
      {rotulo}
      <input
        type="text"
        value={valor}
        data-campo-utm={nome}
        onChange={(evento) => aoMudar(evento.target.value)}
        className="h-9 min-w-0 rounded-lg border-2 border-borda bg-superficie px-2 font-mono text-sm text-texto outline-none focus:border-primaria pointer-coarse:h-11"
      />
    </label>
  );
}

/**
 * A aba Medição (zona "Ser encontrado", S4): o relatório em tempo real
 * simulado (os eventos dos elementos com data-evento clicados na prévia,
 * com a origem da visita) e o construtor de link rastreável (utm).
 */
export function PainelMedicao({ linhas, ferramentas, url, podePorNoLink, aoPorNoLink, aoSimularVisita, aoAbrirCard }: Props) {
  const [utm, setUtm] = useState<Utm>({ source: "", medium: "", campaign: "" });
  const [copiado, setCopiado] = useState(false);
  const completo = utm.source.trim() !== "" && utm.medium.trim() !== "" && utm.campaign.trim() !== "";
  const link = montarLinkRastreavel(url, utm);
  const contagem = new Map<string, number>();
  for (const linha of linhas) if (linha.tipo === "evento") contagem.set(linha.nome, (contagem.get(linha.nome) ?? 0) + 1);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-superficie" data-painel-medicao>
      <p className="flex shrink-0 items-start gap-1.5 border-b-2 border-borda bg-painel px-3 py-2 text-xs font-bold leading-snug text-texto-suave" data-aviso-simulacao>
        <IconeAviso className="mt-0.5 shrink-0 text-alerta" />
        Simulação: esta página não roda JavaScript, então o jogo faz o papel do código de medição. Na vida real, é um código instalado no site
        que manda cada evento para a ferramenta de análise (você aprende a escrever na ilha Páginas vivas).
      </p>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-3">
        {ferramentas.includes("medicao") && (
          <AlvoFerramenta ids={["medicao"]} marcador="medicao" aoAbrirCard={aoAbrirCard} classeMarcador="right-1 top-1">
            <section className="rounded-2xl border-2 border-borda bg-fundo p-3" data-relatorio-medicao>
              <h3 className="text-sm font-black text-texto">Relatório em tempo real</h3>
              {contagem.size > 0 && (
                <ul className="mt-2 flex flex-wrap gap-1.5" data-contagem-eventos>
                  {[...contagem].map(([nome, vezes]) => (
                    <li key={nome} className="rounded-full bg-painel px-2 py-0.5 font-mono text-xs font-bold text-texto" data-contagem-evento={nome}>
                      {nome}: {vezes}
                    </li>
                  ))}
                </ul>
              )}
              {linhas.length === 0 ? (
                <p className="mt-1 text-sm text-texto-suave">
                  Nada ainda. Clique, na tela do site, numa peça com <code className="font-mono text-xs">data-evento</code>.
                </p>
              ) : (
                <ol className="mt-2 flex flex-col gap-1" data-linhas-medicao>
                  {[...linhas].reverse().map((linha) => (
                    <li key={linha.id} className="flex flex-wrap items-baseline gap-x-2 text-sm" data-linha-medicao={linha.tipo === "evento" ? linha.nome : "visita"}>
                      <span className="font-mono text-xs text-texto-suave">{linha.hora}</span>
                      {linha.tipo === "evento" ? (
                        <>
                          <span className="font-mono font-black text-texto">{linha.nome}</span>
                          <span className="text-xs text-texto-suave">de {rotuloDaOrigem(linha.origem)}</span>
                        </>
                      ) : (
                        <span className="text-texto">
                          Visita chegou de <span className="font-mono font-bold">{rotuloDaOrigem(linha.origem)}</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </AlvoFerramenta>
        )}
        {ferramentas.includes("link-rastreavel") && (
          <AlvoFerramenta ids={["link-rastreavel"]} marcador="link-rastreavel" aoAbrirCard={aoAbrirCard} classeMarcador="right-1 top-1">
            <section className="rounded-2xl border-2 border-borda bg-fundo p-3" data-construtor-link>
              <h3 className="text-sm font-black text-texto">Construtor de link rastreável</h3>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Campo rotulo="Origem (utm_source)" nome="source" valor={utm.source} aoMudar={(source) => setUtm({ ...utm, source })} />
                <Campo rotulo="Meio (utm_medium)" nome="medium" valor={utm.medium} aoMudar={(medium) => setUtm({ ...utm, medium })} />
                <Campo rotulo="Campanha (utm_campaign)" nome="campaign" valor={utm.campaign} aoMudar={(campaign) => setUtm({ ...utm, campaign })} />
              </div>
              <p className="mt-2 break-all rounded-lg bg-painel px-2 py-1 font-mono text-xs text-texto" data-link-montado>
                {completo ? link : "Preencha os três campos (ex.: instagram, social, promo-inverno)."}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!completo}
                  onClick={copiar}
                  className="inline-flex h-8 items-center rounded-full border-2 border-borda bg-superficie px-3 text-xs font-black text-texto disabled:opacity-50 pointer-coarse:h-11"
                >
                  {copiado ? "Copiado!" : "Copiar"}
                </button>
                <button
                  type="button"
                  disabled={!completo || !podePorNoLink}
                  title={podePorNoLink ? undefined : "Selecione um link (a) na árvore primeiro"}
                  onClick={() => aoPorNoLink(link)}
                  data-por-no-link
                  className="inline-flex h-8 items-center rounded-full border-2 border-borda bg-superficie px-3 text-xs font-black text-texto disabled:opacity-50 pointer-coarse:h-11"
                >
                  Pôr no link selecionado
                </button>
                <button
                  type="button"
                  disabled={!completo}
                  onClick={() => aoSimularVisita({ source: utm.source.trim(), medium: utm.medium.trim(), campaign: utm.campaign.trim() })}
                  data-simular-visita
                  className="inline-flex h-8 items-center rounded-full border-2 border-primaria bg-primaria px-3 text-xs font-black text-sobre-primaria disabled:opacity-50 pointer-coarse:h-11"
                >
                  Simular uma visita por este link
                </button>
              </div>
            </section>
          </AlvoFerramenta>
        )}
      </div>
    </div>
  );
}
