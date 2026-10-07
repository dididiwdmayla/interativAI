"use client";

/*
 * As caixas da memória (sala 4): a fileira de caixas, cada uma com o seu
 * endereço. O programa pequeno roda linha a linha e guarda valores; a
 * caixa ganha o nome da variável (como no palco da memória). A bandeja
 * tem valores para o aluno guardar numa caixa (toca no valor e depois na
 * caixa); sem valor na mão, tocar na caixa aponta para ela.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { EstacaoMemoria as DadosMemoria, EstadoMemoria } from "@/motor/exposicao/simulacoes/memoria";
import { sinalizarUso } from "@/ferramentas/uso";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

export function EstacaoMemoria({ estacao, estado, mexer, toque, destaque }: PropsEstacao<DadosMemoria, EstadoMemoria>) {
  const reduzir = useReducedMotion();
  const [naMao, setNaMao] = useState<number | null>(null);
  const comando = (texto: string) => mexer({ tipo: "comandoNaEstacao", estacao: estacao.id, comando: texto });
  const proxima = estacao.programa[estado.linha];
  const escolhida = estado.escolhida;
  return (
    <div className="flex flex-col gap-2" data-estacao-memoria={estacao.id}>
      <div className="flex flex-col gap-2 md:flex-row">
        <section className="flex min-w-0 flex-col gap-1.5 md:w-64" aria-label="O programa">
          <ol className="rounded-lg bg-codigo-fundo py-1 font-codigo text-[12px] leading-snug text-codigo-texto">
            {estacao.programa.map((linha, i) => (
              <li key={i} className={`flex gap-1 whitespace-pre px-1.5 ${i === estado.linha ? "bg-[var(--cor-codigo-destaque-linha)] font-black" : i < estado.linha ? "opacity-60" : ""}`} data-linha-memoria={i}>
                <span aria-hidden="true" className="w-3">{i === estado.linha ? ">" : ""}</span>
                {linha.texto}
              </li>
            ))}
          </ol>
          <NucleoDaEstacao tipo="memoria" className="flex flex-wrap gap-1.5">
            <button
              type="button"
              disabled={!proxima}
              onClick={() => comando("passo")}
              className={`inline-flex min-h-10 items-center rounded-full border-2 border-primaria bg-primaria px-3 text-xs font-black text-sobre-primaria hover:brightness-110 disabled:opacity-40 pointer-coarse:min-h-11 ${destaque?.peca === "passo" ? "animate-pulse ring-4 ring-destaque" : ""}`}
              data-comando="passo"
            >
              {proxima ? "Rodar uma linha" : "O programa acabou"}
            </button>
            <button type="button" onClick={() => comando("reiniciar")} className="inline-flex min-h-10 items-center rounded-full border-2 border-borda bg-superficie px-3 text-xs font-black text-texto hover:bg-hover pointer-coarse:min-h-11" data-comando="reiniciar">
              Recomeçar
            </button>
          </NucleoDaEstacao>
        </section>
        <section className="flex min-w-0 flex-1 flex-col gap-1.5" aria-label="A memória">
          <ul className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-8" data-fileira-memoria>
            {estado.valores.map((valor, n) => {
              const nome = estado.nomes[n];
              const ativa = escolhida === n;
              return (
                <li key={n}>
                  <button
                    type="button"
                    onClick={() => {
                      if (naMao !== null) {
                        comando(`guardar:${n}=${naMao}`);
                        setNaMao(null);
                      } else comando(`escolher:${n}`);
                    }}
                    className={`flex w-full flex-col items-center rounded-xl border-2 px-1 pb-1 pt-0.5 shadow-[0_3px_0_var(--cor-sombra)] pointer-coarse:min-h-16 ${ativa ? "border-primaria bg-selecao" : naMao !== null ? "border-dashed border-primaria bg-superficie hover:bg-hover" : "border-borda bg-[var(--cor-caixa-preenchimento)] hover:bg-hover"} ${destaque?.peca === String(n) ? "animate-pulse ring-4 ring-destaque" : ""}`}
                    aria-label={`Caixa de endereço ${n}: ${valor === null ? "vazia" : `guarda ${valor}`}${nome ? `, variável ${nome}` : ""}`}
                    data-caixa={n}
                    data-valor={valor ?? ""}
                    data-escolhida={ativa ? "sim" : "nao"}
                  >
                    <span className="font-codigo text-[10px] font-bold text-texto-suave">#{n}</span>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span key={String(valor)} initial={reduzir ? false : { y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-codigo text-lg font-black text-texto">
                        {valor ?? " "}
                      </motion.span>
                    </AnimatePresence>
                    <span className={`min-h-4 truncate rounded px-1 text-[10px] font-black ${nome ? "bg-primaria text-sobre-primaria" : "text-transparent"}`}>{nome ?? "-"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap items-center gap-1.5" aria-label="A bandeja de valores">
            <span className="text-xs font-bold text-texto-suave">Bandeja:</span>
            {estacao.bandeja.map((valor) => (
              <button
                key={valor}
                type="button"
                aria-pressed={naMao === valor}
                onClick={() => {
                  sinalizarUso("caixas-da-memoria");
                  setNaMao(naMao === valor ? null : valor);
                }}
                className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border-2 px-2 font-codigo text-sm font-black pointer-coarse:min-h-11 pointer-coarse:min-w-11 ${naMao === valor ? "border-primaria bg-primaria text-sobre-primaria" : "border-borda bg-superficie text-texto hover:bg-hover"}`}
                data-ficha={valor}
              >
                {valor}
              </button>
            ))}
          </div>
          <p className="text-xs font-bold text-texto-suave" aria-live="polite">
            {naMao !== null
              ? `O ${naMao} está na mão: ${toque ? "toque" : "clique"} numa caixa para guardar.`
              : escolhida !== null
                ? `Caixa ${escolhida}: ${estado.valores[escolhida] === null ? "vazia" : `guarda ${estado.valores[escolhida]}`}${estado.nomes[escolhida] ? ` (é a variável ${estado.nomes[escolhida]})` : ""}.`
                : "Cada caixa tem um endereço (o número). A variável é só um nome para uma caixa."}
          </p>
        </section>
      </div>
    </div>
  );
}
