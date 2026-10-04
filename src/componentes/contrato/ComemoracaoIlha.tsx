"use client";

/*
 * A comemoração de fim de ilha (depois da entrega do contrato): o
 * computadorzinho e o cliente comemorando juntos, uma chuva de confete e o
 * som grande do jogo. Com "menos movimento", o confete fica parado.
 */
import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { tocarEfeito } from "@/audio/motor";
import { Mascote } from "@/componentes/mascote/Mascote";
import { useMontado } from "@/lib/useMontado";
import type { IdCliente } from "@/motor/contrato/clientes";
import { Cliente } from "./Cliente";

/** Os confetes: posições e cores fixas (o desenho é igual no servidor e no cliente). */
const CONFETES = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 37) % 100,
  atraso: ((i * 13) % 10) / 10,
  giro: (i % 2 ? 1 : -1) * (180 + ((i * 47) % 180)),
  cor: ["var(--cor-primaria)", "var(--cor-secundaria)", "var(--cor-destaque)", "var(--cor-sucesso)", "var(--cor-alerta)"][i % 5],
  forma: i % 3,
}));

export function ComemoracaoIlha({ ilha, cliente, projeto }: { ilha: string; cliente: IdCliente; projeto: string }) {
  const reduzir = useReducedMotion() ?? false;
  const montado = useMontado();
  const animar = montado && !reduzir;
  useEffect(() => {
    tocarEfeito("unidade-concluida");
  }, []);
  return (
    <section className="relative overflow-hidden rounded-2xl border-2 border-borda bg-painel px-4 pb-4 pt-6 text-center" data-comemoracao-ilha>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {CONFETES.map((confete, i) => (
          <motion.g
            key={i}
            initial={false}
            animate={animar ? { y: [-10, 110], rotate: [0, confete.giro] } : { y: 8 + ((i * 29) % 80) }}
            transition={animar ? { duration: 2.6 + confete.atraso, repeat: Infinity, delay: confete.atraso * 2, ease: "linear" } : undefined}
            style={{ x: confete.x, originX: "0px", originY: "0px" }}
          >
            {confete.forma === 0 ? <rect width={2.2} height={1.2} fill={confete.cor} /> : confete.forma === 1 ? <circle r={0.9} fill={confete.cor} /> : <path d="M0 -1.2 L1 0.8 L-1 0.8 Z" fill={confete.cor} />}
          </motion.g>
        ))}
      </svg>
      <p className="relative text-xs font-black uppercase tracking-wide text-texto-suave">{ilha}</p>
      <p className="relative text-2xl font-black text-primaria">Fim de ilha!</p>
      <p className="relative mx-auto mt-1 max-w-md text-[15px] font-bold text-texto">
        Você fechou a ilha com um trabalho de verdade: {projeto}. Um cliente, um pedido que mudou no meio e uma entrega aprovada.
      </p>
      <div className="relative mt-3 flex items-end justify-center gap-4">
        <Mascote expressao="comemorando" tamanho={120} />
        <Cliente id={cliente} expressao="satisfeito" tamanho={120} />
      </div>
    </section>
  );
}
