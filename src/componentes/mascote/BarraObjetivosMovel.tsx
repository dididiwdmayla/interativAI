"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import type { ReactNode } from "react";
import { ListaObjetivos, type ObjetivoNaTela } from "./ListaObjetivos";
import { SeloSozinho } from "./SeloSozinho";

type Props = {
  objetivos: readonly ObjetivoNaTela[];
  concluidos: number;
  ativo: number | null;
  /** Desafio: o checklist no lugar da lista de objetivos. */
  checklist?: { total: number; resumo: string; lista: ReactNode };
};

/** Objetivo atual numa linha com o progresso (2/4); o toque abre a lista inteira. */
export function BarraObjetivosMovel({ objetivos, concluidos, ativo, checklist }: Props) {
  const [aberta, setAberta] = useState(false);
  const atual = ativo !== null ? objetivos[ativo] : null;

  return (
    <div className="relative z-30 shrink-0 border-b-2 border-borda bg-painel">
      <button
        type="button"
        aria-expanded={aberta}
        onClick={() => setAberta((valor) => !valor)}
        className="flex min-h-11 w-full items-center gap-2 px-3 text-left"
      >
        <span className="shrink-0 rounded-full bg-primaria px-2 py-0.5 text-xs font-black text-sobre-primaria">
          {concluidos}/{checklist ? checklist.total : objetivos.length}
        </span>
        {atual?.sozinho && <SeloSozinho compacto />}
        <span className="min-w-0 flex-1 truncate text-sm font-bold text-texto">
          {checklist
            ? checklist.resumo
            : atual
              ? atual.enunciado
              : concluidos >= objetivos.length
                ? "Fase completa!"
                : "Objetivos da fase"}
        </span>
        <IconeChevron direcao={aberta ? "cima" : "baixo"} className="shrink-0 text-texto-suave" />
      </button>
      <AnimatePresence>
        {aberta && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-2 top-full mt-1 max-h-[50dvh] overflow-hidden shadow-[0_6px_0_var(--cor-sombra)]"
            onClick={() => setAberta(false)}
          >
            {checklist ? checklist.lista : <ListaObjetivos objetivos={objetivos} concluidos={concluidos} ativo={ativo} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
