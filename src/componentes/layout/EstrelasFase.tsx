"use client";

import { motion } from "framer-motion";
import { IconeEstrela } from "@/componentes/icones/IconeEstrela";

type Props = {
  quantidade: number;
  total?: number;
  tamanho?: number;
  /** Faz as estrelas surgirem uma a uma (tela de conclusão). */
  entrada?: boolean;
};

export function EstrelasFase({ quantidade, total = 3, tamanho = 22, entrada = false }: Props) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${quantidade} de ${total} estrelas`}
    >
      {Array.from({ length: total }, (_, indice) => {
        const cheia = indice < quantidade;
        return (
          <motion.span
            key={indice}
            className="inline-flex"
            initial={entrada ? { scale: 0, rotate: -120 } : false}
            animate={cheia ? { scale: 1, rotate: 0 } : { scale: 0.85, rotate: -12 }}
            transition={{ type: "spring", stiffness: 380, damping: 16, delay: entrada ? 0.3 + indice * 0.25 : 0 }}
          >
            <IconeEstrela cheia={cheia} tamanho={tamanho} />
          </motion.span>
        );
      })}
    </div>
  );
}
