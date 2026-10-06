"use client";

/*
 * Um antepassado do computadorzinho, pelo id. Tem a mesma vida dele e dos
 * clientes: pisca em intervalos aleatórios, respira devagar e, falando, a
 * boca acompanha o texto que aparece (abre nas vogais, quase fecha nas
 * consoantes). Dormindo (no corredor, antes de o aluno chegar perto), é
 * uma silhueta; ao acordar, a cor volta e ele se espreguiça. Com "menos
 * movimento", fica parado e acorda sem animação.
 */
import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import { Mascote } from "@/componentes/mascote/Mascote";
import { usePiscar } from "@/componentes/mascote/usePiscar";
import { useMontado } from "@/lib/useMontado";
import { FICHAS_ANTEPASSADOS } from "@/motor/exposicao/antepassados";
import type { IdAntepassado } from "@/motor/exposicao/modelo";
import { formaDaLetra } from "@/motor/contrato/expressoes";
import type { Expressao } from "@/motor/expressao";
import { Celular } from "./Celular";
import { Engrenagens } from "./Engrenagens";
import { Internet } from "./Internet";
import type { ExpressaoAntepassado, PropsCorpo } from "./partes";
import { PcBege } from "./PcBege";
import { Tecela } from "./Tecela";
import { Terminal } from "./Terminal";
import { Valvulas } from "./Valvulas";

const CORPOS: Record<Exclude<IdAntepassado, "computadorzinho">, (props: PropsCorpo) => React.ReactElement> = {
  tecela: Tecela,
  engrenagens: Engrenagens,
  valvulas: Valvulas,
  terminal: Terminal,
  pc: PcBege,
  internet: Internet,
  celular: Celular,
};

const DESCRICAO: Record<ExpressaoAntepassado, string> = {
  feliz: "sorrindo",
  curioso: "curioso",
  orgulhoso: "orgulhoso, de sorriso largo",
  dormindo: "dormindo, em silhueta",
};

/** O computadorzinho com a expressão mais próxima. */
const EXPRESSAO_DO_MASCOTE: Record<ExpressaoAntepassado, Expressao> = {
  feliz: "feliz",
  curioso: "curioso",
  orgulhoso: "comemorando",
  dormindo: "dormindo",
};

type Props = {
  id: IdAntepassado;
  expressao?: ExpressaoAntepassado;
  /** Falando agora (a boca acompanha o texto). */
  falando?: boolean;
  /** A última letra que apareceu na fala. */
  letraAtual?: string;
  /** Quantos pedaços da fala já saíram (as válvulas do gigante, a notificação do celular). */
  passos?: number;
  tamanho?: number;
  className?: string;
};

export function Antepassado({ id, expressao = "feliz", falando = false, letraAtual, passos = 0, tamanho = 120, className }: Props) {
  const reduzir = useReducedMotion() ?? false;
  const montado = useMontado();
  const animar = montado && !reduzir;
  const dormindo = expressao === "dormindo";
  const piscando = usePiscar(animar && !dormindo && expressao !== "orgulhoso");
  const filtro = useId().replace(/:/g, "");
  const ficha = FICHAS_ANTEPASSADOS[id];

  if (id === "computadorzinho") {
    return <Mascote expressao={EXPRESSAO_DO_MASCOTE[expressao]} tamanho={tamanho} className={className} />;
  }
  const Corpo = CORPOS[id];
  const boca = falando ? formaDaLetra(letraAtual) : null;
  const corpo = <Corpo expressao={expressao} piscando={piscando} boca={boca} falando={falando} animar={animar} passos={passos} />;

  return (
    <svg
      viewBox="0 0 160 170"
      width={tamanho}
      height={(tamanho * 170) / 160}
      className={className}
      role="img"
      aria-label={`${ficha.nome} (${ficha.maquina}, ${ficha.epoca}), ${DESCRICAO[expressao]}${falando ? ", falando" : ""}`}
      overflow="visible"
      data-antepassado={id}
      data-expressao={expressao}
      data-falando={falando ? "sim" : "nao"}
    >
      <defs>
        {/* A silhueta: o desenho inteiro pintado da cor de sombra do museu. */}
        <filter id={`silhueta-${filtro}`}>
          <feFlood style={{ floodColor: "var(--cor-museu-silhueta)" }} />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
      {/* Respira: o corpo inteiro cresce um tiquinho e volta, devagar. Acordando, se espreguiça. */}
      <motion.g
        initial={false}
        animate={animar && !dormindo ? { scaleY: [1, 1.02, 1], scaleX: [1, 1.006, 1] } : { scaleY: 1, scaleX: 1 }}
        transition={animar && !dormindo ? { duration: 3.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        style={{ originX: 0.5, originY: 1 }}
      >
        <motion.g
          key={dormindo ? "dormindo" : "acordado"}
          initial={dormindo || !animar ? false : { scaleY: 0.9, y: 6 }}
          animate={{ scaleY: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 11 }}
          style={{ originX: 0.5, originY: 1 }}
        >
          <motion.g initial={false} animate={{ opacity: dormindo ? 0 : 1 }} transition={{ duration: animar ? 0.7 : 0 }}>
            {corpo}
          </motion.g>
          <motion.g initial={false} animate={{ opacity: dormindo ? 0.9 : 0 }} transition={{ duration: animar ? 0.7 : 0 }} filter={`url(#silhueta-${filtro})`} aria-hidden="true">
            {corpo}
          </motion.g>
        </motion.g>
      </motion.g>
    </svg>
  );
}
