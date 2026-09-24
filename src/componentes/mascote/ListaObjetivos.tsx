"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Carinha } from "./Carinha";
import { SeloSozinho } from "./SeloSozinho";

export type ObjetivoNaTela = { id: string; enunciado: string; sozinho: boolean };

type Props = {
  objetivos: readonly ObjetivoNaTela[];
  concluidos: number;
  /** Índice do objetivo ativo, ou null se nenhum está ativo. */
  ativo: number | null;
};

/** Objetivos da fase: concluídos com carinha, o ativo em destaque, os futuros apagados. */
export function ListaObjetivos({ objetivos, concluidos, ativo }: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border-2 border-borda bg-painel px-3 py-2">
      <h2 className="mb-1 flex items-center justify-between text-xs font-black uppercase tracking-wide text-texto-suave">
        Objetivos
        <span className="rounded-full bg-superficie px-2 py-0.5 text-[11px] text-texto">
          {concluidos} de {objetivos.length}
        </span>
      </h2>
      <ol className="min-h-0 flex-1 space-y-0.5 overflow-auto pr-1">
        {objetivos.map((objetivo, indice) => {
          const feito = indice < concluidos;
          const atual = indice === ativo && !feito;
          return (
            <motion.li
              key={objetivo.id}
              layout
              animate={feito ? { scale: [1, 1.04, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
              aria-current={atual ? "step" : undefined}
              className={`flex items-start gap-2 rounded-xl px-2 py-0.5 text-sm leading-5 ${
                atual ? "bg-superficie font-bold text-texto ring-2 ring-primaria" : ""
              } ${feito || !atual ? "text-texto-suave" : ""}`}
            >
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center">
                <AnimatePresence initial={false} mode="wait">
                  {feito ? (
                    <motion.span
                      key="feito"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 14 }}
                      className="inline-flex"
                    >
                      <Carinha variante="feliz" tom="sucesso" tamanho={20} rotulo="Concluído" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="numero"
                      className={`grid h-5 w-5 place-items-center rounded-full text-[11px] font-black ${
                        atual ? "bg-primaria text-sobre-primaria" : "border-2 border-borda"
                      }`}
                    >
                      {indice + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className={`${atual ? "" : "line-clamp-1"} ${feito ? "line-through decoration-2" : ""}`}>
                {objetivo.sozinho && <SeloSozinho compacto className="mr-1 align-middle" />}
                {objetivo.enunciado}
              </span>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
