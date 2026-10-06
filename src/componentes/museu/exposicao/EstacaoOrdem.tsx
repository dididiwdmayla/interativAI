"use client";

/*
 * A fila de cartões: uma escada (de baixo para cima: o primeiro degrau é
 * o mais perto da máquina) ou as etapas de um acontecimento (de cima para
 * baixo). Toca num cartão da caixa e depois no lugar da fila; as setas
 * mudam de lugar e o x devolve. Cartão no lugar certo (em relação aos
 * outros da fila) acende e mostra a revelação.
 */
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { IconeCerto } from "@/componentes/icones/IconeCerto";
import { sinalizarUso } from "@/ferramentas/uso";
import { type EstacaoOrdem as DadosOrdem, type EstadoOrdem, itemNoLugar, ordemNaCaixaDeItens } from "@/motor/exposicao/cartoes";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

export function EstacaoOrdem({ estacao, estado, mexer, toque, destaque }: PropsEstacao<DadosOrdem, EstadoOrdem>) {
  const reduzir = useReducedMotion();
  const [escolhido, setEscolhido] = useState<string | null>(null);
  const porId = new Map(estacao.itens.map((i) => [i.id, i]));
  const naCaixa = ordemNaCaixaDeItens(estacao).filter((id) => !estado.fila.includes(id));
  const escada = estacao.aparencia === "escada";
  const fila = estado.fila;
  const por = (posicao: number) => {
    if (!escolhido) return;
    mexer({ tipo: "porNaOrdem", estacao: estacao.id, item: escolhido, posicao });
    setEscolhido(null);
  };
  /** Um lugar para pôr o cartão escolhido: a posição na fila (o tamanho da fila é o fim). */
  const vaga = (posicao: number) => (
    <button
      key={`vaga-${posicao}`}
      type="button"
      disabled={!escolhido}
      onClick={() => por(posicao)}
      className={`min-h-6 w-full rounded-lg border-2 border-dashed text-[11px] font-black ${escolhido ? "border-primaria text-primaria hover:bg-hover pointer-coarse:min-h-10" : "border-transparent text-transparent"}`}
      aria-label={posicao >= fila.length ? "Pôr aqui, no fim da fila" : `Pôr aqui, na posição ${posicao + 1}`}
      data-por-na-ordem={posicao}
    >
      {escolhido ? "pôr aqui" : ""}
    </button>
  );
  // Na escada, o primeiro degrau fica embaixo: a fila aparece de trás para frente.
  const indices = fila.map((_, i) => i);
  const mostrados = escada ? [...indices].reverse() : indices;
  const seta = (para: "cima" | "baixo") => (
    <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={para === "cima" ? "M2.5 8 6 4.5 9.5 8" : "M2.5 4 6 7.5 9.5 4"} />
    </svg>
  );
  return (
    <div className="flex flex-col gap-2" data-estacao-ordem={estacao.id}>
      <NucleoDaEstacao tipo="ordem" className="flex min-h-14 flex-wrap gap-1.5 rounded-xl border-2 border-dashed border-borda bg-painel p-2">
        {naCaixa.length ? (
          naCaixa.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={escolhido === id}
              onClick={() => {
                // Escolher um cartão já é usar a fila (o "Experimente" da apresentação termina aqui).
                sinalizarUso("ordem-dos-cartoes");
                setEscolhido(escolhido === id ? null : id);
              }}
              className={`rounded-xl border-2 px-2.5 py-1.5 text-xs font-bold shadow-[0_3px_0_var(--cor-sombra)] pointer-coarse:min-h-11 ${escolhido === id ? "-translate-y-0.5 border-primaria bg-selecao" : "border-borda bg-[var(--cor-museu-placa)] hover:bg-hover"} ${destaque?.peca === id ? "animate-pulse ring-4 ring-destaque" : ""}`}
              data-item-caixa={id}
            >
              {porId.get(id)?.texto}
            </button>
          ))
        ) : (
          <p className="text-xs font-bold text-texto-suave">A caixa está vazia.</p>
        )}
      </NucleoDaEstacao>
      <p className="text-xs font-bold text-texto-suave" aria-live="polite">
        {escolhido ? `Agora ${toque ? "toque" : "clique"} no lugar da fila.` : `${toque ? "Toque" : "Clique"} num cartão da caixa.`}
      </p>
      <div className={`flex flex-col gap-1 rounded-2xl border-2 border-borda bg-superficie p-2 ${destaque?.peca === "fila" ? "animate-pulse ring-4 ring-destaque" : ""}`}>
        <p className="text-center text-[11px] font-black uppercase tracking-wide text-texto-suave">{escada ? estacao.pontas.fim : estacao.pontas.inicio}</p>
        {vaga(escada ? fila.length : 0)}
        {mostrados.map((i) => {
          const id = fila[i];
          const item = porId.get(id);
          const certo = itemNoLugar(estacao, estado, id);
          // A escada sobe para a direita: cada degrau um pouco mais para dentro.
          const recuo = escada ? `${Math.min(i, 6) * 5}%` : "0";
          // Subir na tela: na escada, é ir para um degrau acima (posição maior); nas etapas, para antes.
          const acima = escada ? i + 1 : i - 1;
          const abaixo = escada ? i - 1 : i + 1;
          return (
            <div key={id} className="flex flex-col gap-1">
              <motion.div
                layout={!reduzir}
                style={{ marginLeft: recuo }}
                className={`flex items-start gap-1.5 rounded-xl border-2 px-2 py-1.5 ${certo ? "border-sucesso bg-selecao" : "border-borda bg-[var(--cor-museu-placa)]"} ${escada ? "border-b-4" : ""}`}
                data-item-fila={id}
                data-certo={certo ? "sim" : "nao"}
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-painel text-[11px] font-black text-texto">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 text-xs font-black text-texto">
                    {certo && <IconeCerto tamanho={13} />}
                    {item?.texto}
                  </span>
                  {certo && item?.revela && <span className="block text-[11px] text-texto-suave">{item.revela}</span>}
                </span>
                <span className="flex shrink-0 gap-0.5">
                  {([["cima", acima, "Subir"], ["baixo", abaixo, "Descer"]] as const).map(([para, alvo, rotulo]) => (
                    <button
                      key={para}
                      type="button"
                      disabled={alvo < 0 || alvo >= fila.length}
                      onClick={() => mexer({ tipo: "porNaOrdem", estacao: estacao.id, item: id, posicao: alvo })}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border-2 border-borda bg-superficie text-texto hover:bg-hover disabled:opacity-30 pointer-coarse:h-9 pointer-coarse:w-9"
                      aria-label={`${rotulo}: ${item?.texto}`}
                    >
                      {seta(para)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => mexer({ tipo: "tirarDaOrdem", estacao: estacao.id, item: id })}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border-2 border-borda bg-superficie text-xs font-black text-texto hover:bg-hover pointer-coarse:h-9 pointer-coarse:w-9"
                    aria-label={`Devolver para a caixa: ${item?.texto}`}
                    data-tirar-da-ordem={id}
                  >
                    x
                  </button>
                </span>
              </motion.div>
              {vaga(escada ? i : i + 1)}
            </div>
          );
        })}
        <p className="text-center text-[11px] font-black uppercase tracking-wide text-texto-suave">{escada ? estacao.pontas.inicio : estacao.pontas.fim}</p>
      </div>
    </div>
  );
}
