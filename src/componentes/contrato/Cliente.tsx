"use client";

/*
 * O cliente de um contrato, montado com o kit (src/componentes/contrato/kit):
 * o corpo com a roupa, o cabelo (atrás e na frente), o rosto com a expressão
 * e os acessórios. Tem a mesma vida do computadorzinho: pisca em intervalos
 * aleatórios, respira devagar, inclina a cabeça para pensar, pula de
 * empolgação e, falando, a boca acompanha o texto que aparece (abre nas
 * vogais, quase fecha nas consoantes). Com "menos movimento", fica parado.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePiscar } from "@/componentes/mascote/usePiscar";
import { useMontado } from "@/lib/useMontado";
import { type AparenciaCliente, clienteDe, type IdCliente } from "@/motor/contrato/clientes";
import { DESCRICAO_EXPRESSAO_CLIENTE, type ExpressaoCliente, formaDaLetra } from "@/motor/contrato/expressoes";
import { Acessorios } from "./kit/Acessorios";
import { CabeloAtras, CabeloFrente } from "./kit/Cabelo";
import { CABECA, CONTORNO, coresDe, cor, SOMBRA } from "./kit/estilo";
import { RostoCliente } from "./kit/Rosto";
import { Corpo } from "./kit/Roupa";

type Props = {
  id: IdCliente;
  expressao?: ExpressaoCliente;
  /** Falando agora (a boca acompanha o texto). */
  falando?: boolean;
  /** A última letra que apareceu na fala (a boca abre nas vogais). */
  letraAtual?: string;
  tamanho?: number;
  className?: string;
};

/** Os enfeites de cada expressão, fora do rosto: a mão no queixo, a gota, os brilhos. */
function Extras({ expressao, animar, pele }: { expressao: ExpressaoCliente; animar: boolean; pele: string }) {
  const { x, y, rx } = CABECA;
  switch (expressao) {
    case "pensativo":
      return (
        <g>
          {/* A mão no queixo e os pontinhos de pensamento */}
          <path d="M80 96 Q84 86 92 86 Q100 87 98 96 Q96 106 86 106 Q80 104 80 96 Z" fill={pele} {...CONTORNO} />
          <path d="M86 88 Q90 82 94 84" fill="none" stroke="var(--cor-cliente-rosto)" strokeOpacity={0.3} strokeWidth={1.4} />
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={x + rx + 8 + i * 7}
              cy={y - 30 - i * 8}
              r={2 + i}
              fill={cor("branco")}
              {...CONTORNO}
              animate={animar ? { opacity: [0.3, 1, 0.3] } : { opacity: 1 }}
              transition={animar ? { duration: 1.6, repeat: Infinity, delay: i * 0.25 } : undefined}
            />
          ))}
        </g>
      );
    case "preocupado":
      return (
        <motion.path
          d={`M${x + rx - 2} ${y - 22} q4 7 0 10 q-4 -3 0 -10 z`}
          fill="var(--cor-cliente-lente-vidro)"
          stroke="var(--cor-secundaria)"
          strokeWidth={1.4}
          animate={animar ? { y: [0, 6, 0], opacity: [1, 0.6, 1] } : undefined}
          transition={animar ? { duration: 1.8, repeat: Infinity } : undefined}
        />
      );
    case "empolgado":
      return (
        <g fill="var(--cor-cliente-roupa-amarelo)">
          {[
            [18, 40, 0],
            [118, 30, 0.3],
            [124, 74, 0.6],
          ].map(([cx, cy, atraso]) => (
            <motion.path
              key={`${cx}`}
              d={`M${cx} ${cy - 7} L${cx + 2} ${cy - 2} L${cx + 7} ${cy} L${cx + 2} ${cy + 2} L${cx} ${cy + 7} L${cx - 2} ${cy + 2} L${cx - 7} ${cy} L${cx - 2} ${cy - 2} Z`}
              animate={animar ? { scale: [0.6, 1.1, 0.6], opacity: [0.5, 1, 0.5] } : undefined}
              transition={animar ? { duration: 1.1, repeat: Infinity, delay: atraso } : undefined}
              style={{ originX: `${cx}px`, originY: `${cy}px` }}
            />
          ))}
        </g>
      );
    case "satisfeito":
      return (
        <g stroke="var(--cor-cliente-roupa-amarelo)" strokeWidth={2.4} strokeLinecap="round">
          <path d="M20 54 L28 58 M18 66 L27 66 M20 78 L28 74" />
          <path d="M120 54 L112 58 M122 66 L113 66 M120 78 L112 74" />
        </g>
      );
    default:
      return null;
  }
}

/** O cliente do kit pelo id (os contratos usam este). */
export function Cliente({ id, ...resto }: Props) {
  const cliente = clienteDe(id);
  return <RetratoCliente aparencia={cliente.aparencia} nome={cliente.nome} chave={id} {...resto} />;
}

type PropsRetrato = Omit<Props, "id"> & { aparencia: AparenciaCliente; nome: string; chave?: string };

/** Qualquer combinação de peças do kit (o mostruário /lab/clientes usa direto). */
export function RetratoCliente({ aparencia, nome, chave, expressao = "feliz", falando = false, letraAtual, tamanho = 96, className }: PropsRetrato) {
  const cores = coresDe(aparencia);
  const reduzir = useReducedMotion() ?? false;
  const montado = useMontado();
  const animar = montado && !reduzir;
  const piscando = usePiscar(animar && expressao !== "satisfeito");
  const boca = falando ? formaDaLetra(letraAtual) : null;
  const inclinacao = expressao === "pensativo" ? -6 : expressao === "satisfeito" ? 4 : 0;
  const pulando = expressao === "empolgado" && animar;

  return (
    <svg
      viewBox="0 -12 140 162"
      width={tamanho}
      height={(tamanho * 162) / 140}
      className={className}
      role="img"
      aria-label={`${nome}, ${DESCRICAO_EXPRESSAO_CLIENTE[expressao]}${falando ? ", falando" : ""}`}
      overflow="visible"
      data-cliente={chave}
      data-expressao={expressao}
      data-falando={falando ? "sim" : "nao"}
    >
      {/* Respira: o corpo inteiro cresce um tiquinho e volta, devagar. */}
      <motion.g
        animate={animar ? { scaleY: [1, 1.018, 1], scaleX: [1, 1.006, 1] } : { scaleY: 1, scaleX: 1 }}
        transition={animar ? { duration: 3.6, repeat: Infinity, ease: "easeInOut" } : undefined}
        style={{ originX: 0.5, originY: 1 }}
      >
        <Corpo roupa={aparencia.roupa} cores={cores} />
        {/* A cabeça: inclina para pensar, pula de empolgação e balança um pouco falando. */}
        <motion.g
          initial={false}
          animate={pulando ? { y: [0, -5, 0], rotate: inclinacao } : falando && animar ? { y: [0, -1.2, 0], rotate: inclinacao } : { y: 0, rotate: inclinacao }}
          transition={
            pulando
              ? { y: { duration: 0.5, repeat: Infinity, ease: "easeOut" }, rotate: { duration: 0.3 } }
              : falando && animar
                ? { y: { duration: 0.32, repeat: Infinity }, rotate: { type: "spring", stiffness: 220, damping: 16 } }
                : { type: "spring", stiffness: 220, damping: 16 }
          }
          style={{ originX: "70px", originY: "100px" }}
        >
          <CabeloAtras cabelo={aparencia.cabelo} cor={cores.cabelo} />
          {/* As orelhas e a cabeça, com a sombra do lado de baixo */}
          <circle cx={CABECA.x - CABECA.rx} cy={CABECA.y + 4} r={7} fill={cores.pele} {...CONTORNO} />
          <circle cx={CABECA.x + CABECA.rx} cy={CABECA.y + 4} r={7} fill={cores.pele} {...CONTORNO} />
          <ellipse cx={CABECA.x} cy={CABECA.y} rx={CABECA.rx} ry={CABECA.ry} fill={cores.pele} {...CONTORNO} />
          <path d={`M${CABECA.x - CABECA.rx + 4} ${CABECA.y + 14} Q${CABECA.x} ${CABECA.y + CABECA.ry + 8} ${CABECA.x + CABECA.rx - 4} ${CABECA.y + 14} Q${CABECA.x} ${CABECA.y + CABECA.ry - 2} ${CABECA.x - CABECA.rx + 4} ${CABECA.y + 14} Z`} {...SOMBRA} />
          <AnimatePresence initial={false}>
            <motion.g key={expressao} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <RostoCliente expressao={expressao} piscando={piscando} boca={boca} />
            </motion.g>
          </AnimatePresence>
          <CabeloFrente cabelo={aparencia.cabelo} cor={cores.cabelo} />
          <Acessorios lista={aparencia.acessorios ?? []} corRoupa={cores.roupa} />
        </motion.g>
      </motion.g>
      <AnimatePresence initial={false}>
        <motion.g key={expressao} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.25 }}>
          <Extras expressao={expressao} animar={animar} pele={cores.pele} />
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}
