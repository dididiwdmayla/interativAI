"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import { IconeCaixaFerramentas } from "@/componentes/icones/IconeCaixaFerramentas";
import { IconeFechar } from "@/componentes/icones/IconeFechar";
import type { IdFerramenta } from "@/ferramentas/ids";
import { LISTA_FERRAMENTAS } from "@/ferramentas/registro";
import { useConsultaMidia } from "@/lib/useConsultaMidia";
import { CardFerramenta } from "./CardFerramenta";

type Props = {
  aberta: boolean;
  /** Card para rolar e destacar ao abrir (vindo do "?" ou do toque longo). */
  foco: IdFerramenta | null;
  vistas: readonly IdFerramenta[];
  toque: boolean;
  aoFechar: () => void;
  aoRever: (id: IdFerramenta) => void;
};

/** Caixa de Ferramentas: gaveta à direita no desktop, folha de baixo no celular. */
export function CaixaFerramentas({ aberta, foco, vistas, toque, aoFechar, aoRever }: Props) {
  const idTitulo = useId();
  const folha = useConsultaMidia("(max-width: 767.98px)");
  const caixa = useRef<HTMLDivElement>(null);
  const focoAnterior = useRef<Element | null>(null);
  const arrasto = useDragControls();

  useEffect(() => {
    if (!aberta) return;
    focoAnterior.current = document.activeElement;
    const temporizador = setTimeout(() => {
      const alvo = foco ? caixa.current?.querySelector<HTMLElement>(`[data-card="${foco}"]`) : null;
      alvo?.scrollIntoView({ block: "nearest" });
      caixa.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
    }, 60);
    return () => {
      clearTimeout(temporizador);
      const anterior = focoAnterior.current;
      if (anterior instanceof HTMLElement) anterior.focus({ preventScroll: true });
    };
  }, [aberta, foco]);

  useEffect(() => {
    if (!aberta) return;
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key !== "Escape") return;
      evento.stopPropagation();
      aoFechar();
    };
    window.addEventListener("keydown", aoTeclar, true);
    return () => window.removeEventListener("keydown", aoTeclar, true);
  }, [aberta, aoFechar]);

  const conhecidas = LISTA_FERRAMENTAS.filter((ferramenta) => vistas.includes(ferramenta.id)).length;

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
              folha
                ? "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-3xl border-t-2"
                : "inset-y-0 right-0 w-[min(420px,100vw)] border-l-2"
            }`}
          >
            <header
              className={`relative flex shrink-0 items-center gap-2 px-4 pb-2 ${folha ? "touch-none pt-5" : "pt-3"}`}
              onPointerDown={(evento) => {
                if (folha) arrasto.start(evento);
              }}
            >
              {folha && (
                <span
                  className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-borda"
                  aria-hidden="true"
                />
              )}
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-superficie text-primaria">
                <IconeCaixaFerramentas tamanho={20} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id={idTitulo} className="text-lg font-black">
                  Caixa de Ferramentas
                </h2>
                <p className="text-xs font-bold text-texto-suave">
                  {conhecidas} de {LISTA_FERRAMENTAS.length} ferramentas conhecidas
                </p>
              </div>
              <button
                type="button"
                onClick={aoFechar}
                aria-label="Fechar a Caixa de Ferramentas"
                className="grid h-11 w-11 place-items-center rounded-full text-texto-suave hover:bg-hover hover:text-texto"
              >
                <IconeFechar />
              </button>
            </header>
            <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 pb-6">
              {LISTA_FERRAMENTAS.map((ferramenta) => (
                <CardFerramenta
                  key={ferramenta.id}
                  ferramenta={ferramenta}
                  conhecida={vistas.includes(ferramenta.id)}
                  toque={toque}
                  emFoco={foco === ferramenta.id}
                  aoRever={() => aoRever(ferramenta.id)}
                />
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
