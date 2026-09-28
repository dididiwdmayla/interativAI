import { faixaDaNota } from "@/motor/auditoria";

type Props = { nota: number; rotulo: string; categoria: string };

/** A cor da faixa, como o Lighthouse: boa (90+), média (50 a 89), ruim (abaixo de 50). */
const COR_DA_FAIXA = {
  boa: "var(--cor-sucesso)",
  media: "var(--cor-alerta)",
  ruim: "var(--cor-erro)",
} as const;

const RAIO = 26;
const VOLTA = 2 * Math.PI * RAIO;

/** O anel de pontuação do Lighthouse: o arco cheio até a nota, o número no meio. */
export function AnelNota({ nota, rotulo, categoria }: Props) {
  const faixa = faixaDaNota(nota);
  const cor = COR_DA_FAIXA[faixa];
  return (
    <figure className="flex w-24 flex-col items-center gap-1" data-nota-auditoria={categoria} data-nota={nota} data-faixa={faixa}>
      <svg viewBox="0 0 64 64" width={64} height={64} role="img" aria-label={`${rotulo}: nota ${nota} de 100`}>
        <circle cx="32" cy="32" r={RAIO} fill="none" stroke="var(--cor-borda)" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={RAIO}
          fill="none"
          stroke={cor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(nota / 100) * VOLTA} ${VOLTA}`}
          transform="rotate(-90 32 32)"
        />
        <text x="32" y="38" textAnchor="middle" fontSize="18" fontWeight="800" fill={cor}>
          {nota}
        </text>
      </svg>
      <figcaption className="text-center text-xs font-bold text-texto">{rotulo}</figcaption>
    </figure>
  );
}
