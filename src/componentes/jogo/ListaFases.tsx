"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import { IconeCadeado } from "@/componentes/icones/IconeCadeado";
import { IconeFechar } from "@/componentes/icones/IconeFechar";
import { IconeListaFases } from "@/componentes/icones/IconeListaFases";
import { EstrelasFase } from "@/componentes/layout/EstrelasFase";
import { Carinha } from "@/componentes/mascote/Carinha";
import { FASES, UNIDADES } from "@/conteudo";
import { useProgresso } from "@/lib/armazemProgresso";
import { faseLiberada } from "@/lib/liberacao";
import { useConsultaMidia } from "@/lib/useConsultaMidia";

type Props = {
  aberta: boolean;
  faseAtual: string;
  aoEscolher: (faseId: string) => void;
  aoFechar: () => void;
};

/**
 * Lista de fases (antes a navegação provisória; agora só no /lab/mapa): unidades e fases em ordem,
 * com cadeado nas que ainda não abriram. Gaveta no desktop, folha no celular.
 */
export function ListaFases({ aberta, faseAtual, aoEscolher, aoFechar }: Props) {
  const idTitulo = useId();
  const folha = useConsultaMidia("(max-width: 767.98px)");
  const progresso = useProgresso();
  const caixa = useRef<HTMLDivElement>(null);
  const arrasto = useDragControls();

  useEffect(() => {
    if (!aberta) return;
    const temporizador = setTimeout(() => {
      caixa.current?.querySelector<HTMLElement>("[aria-current=true]")?.scrollIntoView({ block: "nearest" });
      caixa.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
    }, 60);
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key !== "Escape") return;
      evento.stopPropagation();
      aoFechar();
    };
    window.addEventListener("keydown", aoTeclar, true);
    return () => {
      clearTimeout(temporizador);
      window.removeEventListener("keydown", aoTeclar, true);
    };
  }, [aberta, aoFechar]);

  return (
    <AnimatePresence>
      {aberta && (
        <motion.div
          className="fixed inset-0 z-50 bg-veu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) aoFechar();
          }}
        >
          <motion.div
            ref={caixa}
            role="dialog"
            aria-modal="true"
            aria-labelledby={idTitulo}
            initial={folha ? { y: "100%" } : { x: "100%" }}
            animate={folha ? { y: 0 } : { x: 0 }}
            exit={folha ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            drag={folha ? "y" : false}
            dragListener={false}
            dragControls={arrasto}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) aoFechar();
            }}
            className={`absolute flex flex-col border-borda bg-painel text-texto shadow-[0_-6px_0_var(--cor-sombra)] ${
              folha ? "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-3xl border-t-2" : "inset-y-0 right-0 w-[min(420px,100vw)] border-l-2"
            }`}
          >
            <header
              className={`relative flex shrink-0 items-center gap-2 px-4 pb-2 ${folha ? "touch-none pt-5" : "pt-3"}`}
              onPointerDown={(evento) => {
                if (folha) arrasto.start(evento);
              }}
            >
              {folha && (
                <span className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-borda" aria-hidden="true" />
              )}
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-superficie text-primaria">
                <IconeListaFases tamanho={20} />
              </span>
              <h2 id={idTitulo} className="min-w-0 flex-1 text-lg font-black">
                Lista de fases
              </h2>
              <button
                type="button"
                onClick={aoFechar}
                aria-label="Fechar a lista de fases"
                className="grid h-11 w-11 place-items-center rounded-full text-texto-suave hover:bg-hover hover:text-texto"
              >
                <IconeFechar />
              </button>
            </header>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 pb-6">
              {UNIDADES.map((unidade) => (
                <section key={unidade.id} aria-label={`Unidade ${unidade.numero}: ${unidade.titulo}`}>
                  <h3 className="text-xs font-black uppercase tracking-wide text-texto-suave">
                    {unidade.zona} · Unidade {unidade.numero}
                  </h3>
                  <p className="text-base font-black text-texto">{unidade.titulo}</p>
                  <p className="mb-2 text-xs leading-snug text-texto-suave">{unidade.meta.enunciado}</p>
                  <ol className="space-y-1.5">
                    {unidade.fases.map((id, indice) => {
                      const fase = FASES.find((item) => item.id === id);
                      if (!fase) return null;
                      const liberada = faseLiberada(fase, progresso);
                      const concluida = progresso.fasesConcluidas.includes(id);
                      const atual = id === faseAtual;
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            disabled={!liberada}
                            aria-current={atual}
                            data-fase={id}
                            onClick={() => aoEscolher(id)}
                            className={`flex min-h-12 w-full items-center gap-3 rounded-2xl border-2 px-3 py-2 text-left transition-colors disabled:cursor-not-allowed ${
                              atual ? "border-primaria bg-superficie" : "border-borda bg-superficie hover:border-primaria"
                            } ${liberada ? "" : "opacity-60"}`}
                          >
                            <span
                              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black ${
                                concluida ? "" : liberada ? "bg-primaria text-sobre-primaria" : "bg-painel text-texto-suave"
                              }`}
                            >
                              {concluida ? (
                                <Carinha variante="feliz" tom="sucesso" tamanho={28} rotulo="Concluída" />
                              ) : liberada ? (
                                indice + 1
                              ) : (
                                <IconeCadeado tamanho={14} />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-black text-texto">
                                {fase.tipo === "desafio" ? "Desafio: " : `Fase ${indice + 1}: `}
                                {fase.titulo}
                              </span>
                              {!liberada && (
                                <span className="block text-xs text-texto-suave">Termine a fase anterior para abrir</span>
                              )}
                            </span>
                            {concluida && <EstrelasFase quantidade={progresso.estrelasPorFase[id] ?? 0} tamanho={14} />}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
