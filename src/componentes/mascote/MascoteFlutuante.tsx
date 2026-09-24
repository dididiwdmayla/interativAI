"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import type { ReactNode } from "react";
import type { Expressao } from "@/motor/expressao";
import { Mascote } from "./Mascote";

type Props = {
  expressao: Expressao;
  aberto: boolean;
  aoAlternar: (aberto: boolean) => void;
  /** Mini avatar, para o celular deitado. */
  mini?: boolean;
  /** Fala, objetivo, "Me ajuda" e campo do tutor. */
  children: ReactNode;
};

/**
 * No celular, o computadorzinho vira um avatar no canto inferior direito.
 * Um toque abre o balão por cima do painel; toque fora ou arrastar para
 * baixo fecha.
 */
export function MascoteFlutuante({ expressao, aberto, aoAlternar, mini = false, children }: Props) {
  const arrasto = useDragControls();
  const tamanho = mini ? 44 : 56;

  return (
    <>
      <AnimatePresence>
        {aberto && (
          <motion.div
            key="fundo"
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onPointerDown={() => aoAlternar(false)}
            aria-hidden="true"
          />
        )}
        {aberto && (
          <motion.section
            key="balao"
            aria-label="Conversa com o computadorzinho"
            data-balao-mascote
            className={`fixed z-40 flex flex-col gap-2 rounded-3xl border-2 border-borda bg-superficie p-2.5 shadow-[0_8px_0_var(--cor-sombra)] ${
              mini
                ? "bottom-2 right-16 max-h-[calc(100dvh-16px)] w-[min(460px,calc(100vw-80px))] overflow-y-auto"
                : "inset-x-2 max-h-[70dvh] overflow-y-auto md:left-auto md:w-[min(560px,calc(100vw-16px))]"
            }`}
            style={mini ? undefined : { bottom: tamanho + 20 }}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            drag="y"
            dragListener={false}
            dragControls={arrasto}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 60 || info.velocity.y > 500) aoAlternar(false);
            }}
          >
            <div
              className="-mt-1 flex h-5 shrink-0 cursor-grab touch-none items-center justify-center"
              onPointerDown={(evento) => arrasto.start(evento)}
              aria-hidden="true"
            >
              <span className="h-1.5 w-10 rounded-full bg-borda" />
            </div>
            {children}
          </motion.section>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => aoAlternar(!aberto)}
        aria-expanded={aberto}
        aria-label={aberto ? "Fechar a conversa com o computadorzinho" : "Abrir a conversa com o computadorzinho"}
        className="fixed bottom-3 right-3 z-40 grid place-items-center rounded-full border-2 border-borda bg-superficie shadow-[0_4px_0_var(--cor-sombra)]"
        style={{ width: tamanho, height: tamanho }}
      >
        <Mascote expressao={expressao} tamanho={tamanho - 12} />
      </button>
    </>
  );
}
