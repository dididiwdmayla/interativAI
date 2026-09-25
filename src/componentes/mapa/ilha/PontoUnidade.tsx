"use client";

import { motion } from "framer-motion";
import { IconeCadeado } from "@/componentes/icones/IconeCadeado";
import { EstrelasFase } from "@/componentes/layout/EstrelasFase";
import { Carinha } from "@/componentes/mascote/Carinha";
import type { EstadoUnidadeMapa } from "@/lib/mapa";
import { useAnimarMapa } from "../arte/useAnimarMapa";
import type { PontoIlha } from "./desenhoIlha";

type Props = {
  ponto: PontoIlha;
  estado: EstadoUnidadeMapa;
  estrelas: number;
  /** Posição na tela (px). */
  x: number;
  y: number;
  /** Acabou de ser concluída: acende com festa. */
  acendendo: boolean;
  aoAbrir: () => void;
};

const ROTULO: Record<EstadoUnidadeMapa, string> = {
  concluida: "concluída",
  disponivel: "disponível",
  bloqueada: "bloqueada",
  planejada: "em breve",
};

/** Andaime pequeno: unidade planejada. */
function Andaime() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="var(--cor-madeira)" strokeWidth="2.4" strokeLinecap="round">
      <path d="M5 21V4M19 21V4M3 7h18M3 14h18M5 7l14 7M19 7L5 14" />
    </svg>
  );
}

/**
 * Um ponto do caminho da ilha: concluída (carinha feliz e estrelas),
 * disponível (pulsando), bloqueada (cadeado) ou planejada (andaime e
 * "Em breve"). O botão tem pelo menos 52 px.
 */
export function PontoUnidade({ ponto, estado, estrelas, x, y, acendendo, aoAbrir }: Props) {
  const animar = useAnimarMapa();
  const { item } = ponto;
  const fundo = {
    concluida: "bg-sucesso border-sucesso",
    disponivel: "bg-primaria border-primaria text-sobre-primaria",
    bloqueada: "bg-painel border-borda text-texto-suave",
    planejada: "bg-areia border-dashed border-madeira",
  }[estado];
  const lado = ponto.lado;
  const etiqueta = {
    baixo: "left-1/2 top-full mt-1.5 -translate-x-1/2 items-center text-center",
    direita: "left-full top-1/2 ml-2 -translate-y-1/2 items-start text-left",
    esquerda: "right-full top-1/2 mr-2 -translate-y-1/2 items-end text-right",
  }[lado];

  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        {estado === "disponivel" && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-4 border-primaria"
            animate={animar ? { scale: [1, 1.45], opacity: [0.7, 0] } : { opacity: 0 }}
            transition={animar ? { duration: 1.4, repeat: Infinity, ease: "easeOut" } : undefined}
          />
        )}
        {acendendo && (
          <motion.span
            aria-hidden="true"
            className="absolute -inset-3 rounded-full bg-destaque"
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 1.1, repeat: animar ? 2 : 0, ease: "easeOut" }}
          />
        )}
        <motion.button
          type="button"
          data-unidade={item.id}
          data-estado={estado}
          aria-label={`${item.titulo}: ${ROTULO[estado]}`}
          onClick={aoAbrir}
          initial={acendendo && animar ? { scale: 0.6 } : false}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 12, delay: acendendo ? 0.4 : 0 }}
          className={`relative grid h-[52px] w-[52px] place-items-center rounded-full border-4 shadow-[0_4px_0_var(--cor-sombra)] transition-transform hover:scale-105 ${fundo}`}
        >
          {estado === "concluida" && <Carinha variante="feliz" tom="destaque" tamanho={34} />}
          {estado === "disponivel" && <span className="text-lg font-black">{ponto.indice + 1}</span>}
          {estado === "bloqueada" && <IconeCadeado tamanho={20} />}
          {estado === "planejada" && <Andaime />}
        </motion.button>
        <span className={`pointer-events-none absolute flex w-36 flex-col gap-0.5 ${etiqueta}`}>
          <span className="rounded-lg bg-superficie/90 px-1.5 py-0.5 text-xs font-black leading-tight text-texto shadow-[0_2px_0_var(--cor-sombra)]">
            {item.titulo}
          </span>
          {estado === "concluida" && <EstrelasFase quantidade={estrelas} tamanho={13} />}
          {estado === "planejada" && (
            <span className="rounded-full bg-madeira px-1.5 text-[10px] font-black uppercase text-superficie">Em breve</span>
          )}
        </span>
      </div>
    </div>
  );
}
