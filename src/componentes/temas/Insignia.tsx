import type { IdTema } from "@/curriculo/temas";
import { MARCOS } from "@/lib/temas";
import { IconeTema } from "./IconeTema";

type Props = {
  tema: IdTema;
  /** De 0 a 1: o anel enche até aqui. */
  fracao: number;
  tamanho?: number;
  className?: string;
};

const RAIO = 26;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

/**
 * A insígnia de um tema: medalha redonda com o ícone no meio, um anel de
 * progresso em volta e quatro marcos (25, 50, 75 e 100%) que acendem
 * quando atingidos. Sem progresso nenhum, fica apagada.
 */
export function Insignia({ tema, fracao, tamanho = 72, className = "" }: Props) {
  const valor = Math.min(1, Math.max(0, fracao));
  const porcento = valor * 100;
  const completa = porcento >= 100;
  return (
    <svg
      viewBox="0 0 72 72"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      data-insignia={tema}
      data-porcento={Math.round(porcento)}
    >
      <circle cx="36" cy="36" r="33" fill={completa ? "var(--cor-destaque)" : "var(--cor-superficie)"} stroke="var(--cor-borda)" strokeWidth="2" />
      <circle cx="36" cy="36" r={RAIO} fill="none" stroke="var(--cor-painel)" strokeWidth="6" />
      {valor > 0 && (
        <circle
          cx="36"
          cy="36"
          r={RAIO}
          fill="none"
          stroke="var(--cor-primaria)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${CIRCUNFERENCIA * valor} ${CIRCUNFERENCIA}`}
          transform="rotate(-90 36 36)"
        />
      )}
      {MARCOS.map((marco) => {
        // O marco fica no anel, no ângulo da porcentagem (100% no topo, junto do começo).
        const angulo = (marco / 100) * 2 * Math.PI - Math.PI / 2;
        const x = 36 + RAIO * Math.cos(angulo);
        const y = 36 + RAIO * Math.sin(angulo);
        const atingido = porcento >= marco;
        return (
          <circle
            key={marco}
            cx={x}
            cy={y}
            r={marco === 100 ? 4.2 : 3.4}
            fill={atingido ? "var(--cor-destaque)" : "var(--cor-superficie)"}
            stroke={atingido ? "var(--cor-texto)" : "var(--cor-borda)"}
            strokeWidth="1.5"
            data-marco={marco}
            data-atingido={atingido ? "sim" : "nao"}
          />
        );
      })}
      <g transform="translate(22 22)" color={valor > 0 ? "var(--cor-texto)" : "var(--cor-texto-suave)"}>
        <IconeTema tema={tema} tamanho={28} />
      </g>
    </svg>
  );
}
