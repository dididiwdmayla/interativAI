"use client";

/*
 * O "por dentro" de um dispositivo: o caminho do comando, etapa por etapa,
 * cada uma com um desenho simples da peça (o código, a plaquinha, o relé, o
 * motor...). Uma bolinha de sinal desce pela linha que liga as etapas: o
 * comando indo do código até o mundo (ou, num sensor, do mundo até o código).
 */
import { useReducedMotion } from "framer-motion";
import type { EtapaPorDentro, TipoDispositivo } from "@/motor/cena/catalogo";

const TAMANHO = 44;

/** O desenho de cada peça do caminho (44 x 44), só com tokens. */
function DesenhoPeca({ peca, tipo }: { peca: EtapaPorDentro["peca"]; tipo: TipoDispositivo }) {
  const traco = { stroke: "var(--cor-texto)", strokeOpacity: 0.55, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (peca) {
    case "codigo":
      return (
        <g>
          <rect x={8} y={6} width={28} height={32} rx={4} fill="var(--cor-codigo-fundo)" {...traco} />
          <path d="M13 15h10M13 21h16M13 27h8" stroke="var(--cor-primaria)" strokeWidth={2.4} strokeLinecap="round" />
        </g>
      );
    case "placa":
      return (
        <g>
          <rect x={5} y={9} width={34} height={26} rx={3} fill="var(--cor-cena-planta-sombra)" {...traco} />
          <rect x={15} y={15} width={14} height={14} rx={2} fill="var(--cor-cena-contorno)" opacity={0.8} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i} stroke="var(--cor-cena-metal)" strokeWidth={1.6}>
              <path d={`M${17 + i * 3.3} 15v-3M${17 + i * 3.3} 29v3`} />
            </g>
          ))}
          <circle cx={9} cy={13} r={1.6} fill="var(--cor-cena-led)" />
        </g>
      );
    case "rele":
      return (
        <g>
          <rect x={8} y={9} width={28} height={26} rx={3} fill="var(--cor-secundaria)" opacity={0.85} {...traco} />
          <path d="M14 27v-8h4M30 27v-8h-4M18 19l7 -5" stroke="var(--cor-superficie)" strokeWidth={2} strokeLinecap="round" fill="none" />
          <circle cx={18} cy={19} r={1.6} fill="var(--cor-superficie)" />
        </g>
      );
    case "driver":
      return (
        <g>
          <rect x={7} y={10} width={30} height={24} rx={3} fill="var(--cor-cena-metal-sombra)" {...traco} />
          <path d="M11 26l4-8 4 8 4-8 4 8 4-8" stroke="var(--cor-destaque)" strokeWidth={2} fill="none" strokeLinecap="round" />
        </g>
      );
    case "motor":
      return (
        <g>
          <circle cx={20} cy={22} r={13} fill="var(--cor-cena-metal)" {...traco} />
          <circle cx={20} cy={22} r={4} fill="var(--cor-cena-metal-sombra)" />
          <path d="M33 22h7" stroke="var(--cor-cena-metal-sombra)" strokeWidth={3} strokeLinecap="round" />
          <path d="M14 13a11 11 0 0 1 12 0" stroke="var(--cor-primaria)" strokeWidth={2} fill="none" strokeLinecap="round" />
        </g>
      );
    case "resistencia":
      return (
        <g>
          <path d="M5 22h6l3-7 5 14 5-14 5 14 3-7h7" stroke="var(--cor-cena-quente)" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "termometro":
      return (
        <g>
          <rect x={18} y={6} width={8} height={24} rx={4} fill="var(--cor-superficie)" {...traco} />
          <circle cx={22} cy={33} r={6} fill="var(--cor-cena-quente)" {...traco} />
          <rect x={20.5} y={16} width={3} height={14} rx={1.5} fill="var(--cor-cena-quente)" />
        </g>
      );
    case "display":
      return (
        <g>
          <rect x={4} y={12} width={36} height={20} rx={3} fill="var(--cor-cena-letreiro)" {...traco} />
          {Array.from({ length: 5 }, (_, c) =>
            Array.from({ length: 3 }, (_, l) => (
              <circle key={`${c}-${l}`} cx={11 + c * 5.5} cy={17 + l * 5} r={1.4} fill={(c + l) % 2 ? "var(--cor-cena-letreiro-aceso)" : "var(--cor-cena-letreiro-apagado)"} />
            )),
          )}
        </g>
      );
    case "sensor":
      return (
        <g>
          <rect x={10} y={12} width={24} height={12} rx={3} fill="var(--cor-superficie)" {...traco} />
          <path d="M14 24a8 8 0 0 0 16 0z" fill="var(--cor-cena-metal)" {...traco} />
          <path d="M10 36q12 6 24 0M14 40q8 3 16 0" stroke="var(--cor-cena-led)" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </g>
      );
    case "contato":
      return (
        <g>
          <path d="M8 26h12l10-7M30 26h6" stroke="var(--cor-texto)" strokeOpacity={0.7} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <circle cx={20} cy={26} r={2.5} fill="var(--cor-cena-metal-sombra)" />
          <circle cx={30} cy={26} r={2.5} fill="var(--cor-cena-metal-sombra)" />
        </g>
      );
    case "dispositivo":
      if (tipo === "portao") {
        return (
          <g>
            <rect x={5} y={34} width={34} height={3} rx={1.5} fill="var(--cor-cena-metal-sombra)" />
            <rect x={8} y={10} width={26} height={22} rx={2} fill="none" stroke="var(--cor-cena-metal)" strokeWidth={2.4} />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={11 + i * 5} y={11} width={2} height={20} fill="var(--cor-cena-metal)" />
            ))}
            <path d="M36 21h5M38 18l3 3-3 3" stroke="var(--cor-primaria)" strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      }
      return (
        <g>
          <circle cx={22} cy={20} r={11} fill="var(--cor-cena-luz)" {...traco} />
          <path d="M18 31h8M19 35h6" stroke="var(--cor-texto)" strokeOpacity={0.6} strokeWidth={2} strokeLinecap="round" />
          <path d="M22 4v3M8 20H5M39 20h-3M12 10l-2-2M32 10l2-2" stroke="var(--cor-destaque)" strokeWidth={2} strokeLinecap="round" />
        </g>
      );
  }
}

export function IlustracaoPorDentro({ etapas, sentido, tipo }: { etapas: readonly EtapaPorDentro[]; sentido: "entrada" | "saida"; tipo: TipoDispositivo }) {
  const reduzir = useReducedMotion() ?? false;
  return (
    <ol className="relative flex flex-col gap-3" data-por-dentro={sentido}>
      {/* A linha que liga as etapas, com o sinal descendo por ela. */}
      <span className="absolute bottom-6 left-[22px] top-6 w-0.5 rounded-full bg-borda" aria-hidden="true">
        {!reduzir && <span className="absolute -left-[3px] h-2 w-2 animate-[sinal-por-dentro_1.8s_linear_infinite] rounded-full bg-primaria" />}
      </span>
      {etapas.map((etapa, indice) => (
        <li key={indice} className="relative flex items-center gap-3" data-etapa={etapa.peca}>
          <svg viewBox={`0 0 ${TAMANHO} ${TAMANHO}`} width={TAMANHO} height={TAMANHO} className="shrink-0 rounded-xl border-2 border-borda bg-superficie" aria-hidden="true">
            <DesenhoPeca peca={etapa.peca} tipo={tipo} />
          </svg>
          <p className="text-sm leading-snug text-texto">
            <span className="mr-1 font-black text-primaria">{indice + 1}.</span>
            {etapa.texto}
          </p>
        </li>
      ))}
    </ol>
  );
}
