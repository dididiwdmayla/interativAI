"use client";

import { motion } from "framer-motion";
import { sorteioFixo } from "../geometria";
import { useAnimarMapa } from "./useAnimarMapa";

type Props = { largura: number; altura: number };

/** O mar do mapa: fundo e ondinhas que balançam devagar (paradas com movimento reduzido). */
export function Oceano({ largura, altura }: Props) {
  const animar = useAnimarMapa();
  const ondas = Array.from({ length: Math.round((largura * altura) / 16000) }, (_, indice) => ({
    x: sorteioFixo(indice + 1) * largura,
    y: sorteioFixo(indice + 101) * altura,
    escala: 0.7 + sorteioFixo(indice + 201) * 0.8,
    grupo: indice % 2,
  }));
  return (
    <g aria-hidden="true">
      <rect width={largura} height={altura} fill="var(--cor-mar)" />
      {[0, 1].map((grupo) => (
        <motion.g
          key={grupo}
          animate={animar ? { x: grupo === 0 ? [0, 18, 0] : [0, -18, 0] } : { x: 0 }}
          transition={animar ? { duration: 6 + grupo * 2, repeat: Infinity, ease: "easeInOut" } : undefined}
        >
          {ondas
            .filter((onda) => onda.grupo === grupo)
            .map((onda, indice) => (
              <path
                key={indice}
                d="M0 0q6-5 12 0t12 0"
                transform={`translate(${onda.x.toFixed(0)} ${onda.y.toFixed(0)}) scale(${onda.escala.toFixed(2)})`}
                fill="none"
                stroke="var(--cor-onda)"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.55"
              />
            ))}
        </motion.g>
      ))}
    </g>
  );
}
