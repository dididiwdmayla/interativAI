"use client";

import { motion } from "framer-motion";
import { Cursor, MoldeDemo } from "./MoldeDemo";

const CICLO = { duration: 3.6, repeat: Infinity, ease: "easeOut" } as const;
const FONTE = "var(--fonte-codigo), monospace";

/** Dois cliques no nome da tag: h2 vira h4, e o fechamento acompanha. */
export function DemoRenomearTag() {
  const trocaAntes = { opacity: [1, 1, 0, 0, 1] };
  const trocaDepois = { opacity: [0, 0, 1, 1, 0] };
  const tempos = { ...CICLO, times: [0, 0.5, 0.55, 0.92, 1] };
  return (
    <MoldeDemo rotulo="Animação: dois cliques no nome da tag h2 e ela vira h4, com o fechamento junto">
      <text x="14" y="36" fontSize="11" fontFamily={FONTE} fill="var(--cor-codigo-tag)">
        &lt;
      </text>
      <motion.rect
        x="21"
        y="25"
        width="20"
        height="15"
        rx="4"
        fill="var(--cor-superficie)"
        stroke="var(--cor-primaria)"
        strokeWidth="2"
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ ...CICLO, times: [0, 0.3, 0.34, 0.6, 0.64] }}
      />
      <motion.text x="24" y="36" fontSize="11" fontFamily={FONTE} fill="var(--cor-codigo-tag)" animate={trocaAntes} transition={tempos}>
        h2
      </motion.text>
      <motion.text x="24" y="36" fontSize="11" fontFamily={FONTE} fill="var(--cor-primaria)" animate={trocaDepois} transition={tempos}>
        h4
      </motion.text>
      <text x="41" y="36" fontSize="11" fontFamily={FONTE} fill="var(--cor-codigo-tag)">
        &gt;
      </text>
      <text x="50" y="36" fontSize="11" fontFamily={FONTE} fill="var(--cor-codigo-texto)">
        Receita
      </text>
      <motion.text x="104" y="36" fontSize="11" fontFamily={FONTE} fill="var(--cor-codigo-tag)" animate={trocaAntes} transition={tempos}>
        &lt;/h2&gt;
      </motion.text>
      <motion.text x="104" y="36" fontSize="11" fontFamily={FONTE} fill="var(--cor-primaria)" animate={trocaDepois} transition={tempos}>
        &lt;/h4&gt;
      </motion.text>
      {[0.14, 0.24].map((instante) => (
        <motion.circle
          key={instante}
          cx="31"
          cy="33"
          initial={{ r: 0, opacity: 0 }}
          fill="none"
          stroke="var(--cor-destaque)"
          strokeWidth="2"
          animate={{ r: [0, 0, 11, 11], opacity: [0, 0, 0.9, 0] }}
          transition={{ ...CICLO, times: [0, instante, instante + 0.08, instante + 0.12] }}
        />
      ))}
      <motion.g animate={{ x: [80, 31, 31, 80], y: [72, 34, 34, 72] }} transition={{ ...CICLO, times: [0, 0.1, 0.9, 1] }}>
        <Cursor />
      </motion.g>
      <rect x="14" y="54" width="132" height="24" rx="5" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="1.5" />
      <motion.text x="22" y="71" fontSize="13" fontWeight="900" fill="var(--cor-texto)" animate={trocaAntes} transition={tempos}>
        Receita
      </motion.text>
      <motion.text x="22" y="70" fontSize="10" fontWeight="800" fill="var(--cor-texto)" animate={trocaDepois} transition={tempos}>
        Receita
      </motion.text>
    </MoldeDemo>
  );
}
