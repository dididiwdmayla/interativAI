/*
 * Os acessórios do kit, por cima do rosto e do cabelo: óculos redondos,
 * bigode, touca de padaria, brincos, lenço no pescoço e boné.
 */
import type { Acessorio } from "@/motor/contrato/clientes";
import { CABECA, CONTORNO, cor, OLHOS, SOMBRA } from "./estilo";

export function Acessorios({ lista, corRoupa }: { lista: readonly Acessorio[]; corRoupa: string }) {
  const { x, y, rx, ry } = CABECA;
  return (
    <g>
      {lista.includes("lenco") && (
        <g>
          <path d="M54 104 Q70 116 86 104 L84 112 Q70 122 56 112 Z" fill={cor("roupa-amarelo")} {...CONTORNO} />
          <path d="M64 114 L70 132 L76 114 Z" fill={cor("roupa-amarelo")} {...CONTORNO} />
        </g>
      )}
      {lista.includes("brincos") && (
        <g fill={cor("roupa-amarelo")} {...CONTORNO}>
          <circle cx={x - rx - 1} cy={y + 14} r={3} />
          <circle cx={x + rx + 1} cy={y + 14} r={3} />
        </g>
      )}
      {lista.includes("bigode") && <path d="M58 84 Q64 79 70 83 Q76 79 82 84 Q76 88 70 85 Q64 88 58 84 Z" fill={cor("cabelo-grisalho")} {...CONTORNO} />}
      {lista.includes("oculos") && (
        <g fill={cor("lente-vidro")} stroke={cor("lente")} strokeWidth={2.4}>
          <circle cx={OLHOS.esquerdo} cy={OLHOS.y} r={9.5} />
          <circle cx={OLHOS.direito} cy={OLHOS.y} r={9.5} />
          <path d={`M${OLHOS.esquerdo + 9.5} ${OLHOS.y - 1} Q70 ${OLHOS.y - 5} ${OLHOS.direito - 9.5} ${OLHOS.y - 1}`} fill="none" />
          <path d={`M${OLHOS.esquerdo - 9.5} ${OLHOS.y - 2} L${x - rx + 1} ${OLHOS.y - 4}`} fill="none" />
          <path d={`M${OLHOS.direito + 9.5} ${OLHOS.y - 2} L${x + rx - 1} ${OLHOS.y - 4}`} fill="none" />
        </g>
      )}
      {lista.includes("touca") && (
        <g>
          {/* A touca de padaria: a faixa e o "pão" fofo em cima */}
          <path d={`M${x - 28} ${y - ry + 6} Q${x - 36} ${y - ry - 18} ${x - 16} ${y - ry - 20} Q${x - 8} ${y - ry - 32} ${x + 6} ${y - ry - 26} Q${x + 22} ${y - ry - 34} ${x + 28} ${y - ry - 16} Q${x + 40} ${y - ry - 8} ${x + 28} ${y - ry + 6} Z`} fill={cor("branco")} {...CONTORNO} />
          <path d={`M${x - 28} ${y - ry + 6} Q${x} ${y - ry - 2} ${x + 28} ${y - ry + 6} L${x + 27} ${y - ry + 13} Q${x} ${y - ry + 6} ${x - 27} ${y - ry + 13} Z`} fill={cor("branco")} {...CONTORNO} />
          <path d={`M${x - 27} ${y - ry + 13} Q${x} ${y - ry + 6} ${x + 27} ${y - ry + 13} L${x + 27} ${y - ry + 10} Q${x} ${y - ry + 3} ${x - 27} ${y - ry + 10} Z`} {...SOMBRA} />
        </g>
      )}
      {lista.includes("bone") && (
        <g>
          <path d={`M${x - rx + 2} ${y - 10} Q${x - rx} ${y - ry - 6} ${x} ${y - ry - 6} Q${x + rx} ${y - ry - 6} ${x + rx - 2} ${y - 10} Z`} fill={corRoupa} {...CONTORNO} />
          <path d={`M${x + 6} ${y - 12} Q${x + rx + 22} ${y - 16} ${x + rx + 20} ${y - 8} Q${x + rx} ${y - 6} ${x + 6} ${y - 8} Z`} fill={corRoupa} {...CONTORNO} />
          <circle cx={x} cy={y - ry - 5} r={2.4} fill={cor("branco")} />
        </g>
      )}
    </g>
  );
}
