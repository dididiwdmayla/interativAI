"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { Carinha } from "./Carinha";

type Props = {
  partes: readonly { id: string; descricao: string }[];
  feitas: readonly string[];
  /** "Checklist do desafio" ou, no projeto-ponte, "Requisitos do projeto". */
  titulo?: string;
  /** (Contrato) As partes que chegaram com a mudança de pedido: ganham o selo "Novo". */
  novas?: ReadonlySet<string>;
  /** (Contrato) Em cima da lista: o cliente e o botão do pedido. */
  topo?: ReactNode;
  /** No lugar da lista (o contrato antes da etapa de requisitos: a lista é o aluno que monta). */
  vazio?: string;
};

/** Checklist do desafio (ou dos requisitos do projeto): cada item se marca sozinho quando o validador dele passa. */
export function ChecklistDesafio({ partes, feitas, titulo = "Checklist do desafio", novas, topo, vazio }: Props) {
  const total = partes.length;
  const marcadas = partes.filter((parte) => feitas.includes(parte.id)).length;
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border-2 border-borda bg-painel px-3 py-2" data-checklist>
      {topo}
      <h2 className="mb-1 flex items-center justify-between text-xs font-black uppercase tracking-wide text-texto-suave">
        {titulo}
        <span className="rounded-full bg-superficie px-2 py-0.5 text-[11px] text-texto">
          {marcadas} de {total}
        </span>
      </h2>
      {vazio && <p className="text-sm text-texto-suave" data-checklist-vazio>{vazio}</p>}
      <ul className="min-h-0 flex-1 space-y-0.5 overflow-auto pr-1">
        {partes.map((parte) => {
          const feita = feitas.includes(parte.id);
          return (
            <motion.li
              key={parte.id}
              data-parte={parte.id}
              data-feita={feita}
              animate={feita ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
              className={`flex items-start gap-2 rounded-xl px-2 py-0.5 text-sm leading-5 ${
                feita ? "font-bold text-sucesso" : "text-texto"
              }`}
            >
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center">
                <AnimatePresence initial={false} mode="wait">
                  {feita ? (
                    <motion.span
                      key="feita"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 14 }}
                      className="inline-flex"
                    >
                      <Carinha variante="feliz" tom="sucesso" tamanho={20} rotulo="Parte feita" />
                    </motion.span>
                  ) : (
                    <motion.span key="pendente" className="h-4 w-4 rounded-md border-2 border-borda bg-superficie" />
                  )}
                </AnimatePresence>
              </span>
              <span>
                {novas?.has(parte.id) && (
                  <span className="mr-1 inline-block rounded-full bg-secundaria px-1.5 align-middle text-[10px] font-black uppercase tracking-wide text-sobre-secundaria" data-parte-nova>
                    Novo
                  </span>
                )}
                {parte.descricao}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
