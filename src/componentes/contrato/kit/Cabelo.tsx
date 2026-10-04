/*
 * O cabelo em duas camadas: a de trás (desenhada antes da cabeça: o volume
 * do cacheado, o comprido, o rabo, o coque) e a da frente (a franja e o topo,
 * por cima da testa). Careca tem só os tufinhos dos lados.
 */
import type { Cabelo as TipoCabelo } from "@/motor/contrato/clientes";
import { CABECA, CONTORNO, SOMBRA } from "./estilo";

const { x, y, rx, ry } = CABECA;

/** Os cachos em volta da cabeça (posições fixas: o desenho é igual no servidor e no cliente). */
const CACHOS: readonly [number, number, number][] = [
  [38, 44, 12], [50, 30, 13], [66, 24, 13], [82, 26, 13], [96, 36, 12], [104, 52, 11], [36, 60, 11], [106, 68, 10], [34, 76, 10], [104, 84, 9], [36, 90, 9],
];

export function CabeloAtras({ cabelo, cor }: { cabelo: TipoCabelo; cor: string }) {
  switch (cabelo) {
    case "longo":
      return (
        <g>
          <path d={`M${x - rx - 4} ${y - 6} Q${x - rx - 8} ${y + 46} ${x - rx + 4} ${y + 58} L${x + rx - 4} ${y + 58} Q${x + rx + 8} ${y + 46} ${x + rx + 4} ${y - 6} Z`} fill={cor} {...CONTORNO} />
          <path d={`M${x - rx - 2} ${y + 30} Q${x - rx} ${y + 52} ${x - rx + 6} ${y + 58} L${x - rx + 14} ${y + 58} Z`} {...SOMBRA} />
        </g>
      );
    case "cacheado":
      return (
        <g fill={cor} {...CONTORNO}>
          {CACHOS.map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      );
    case "rabo":
      return (
        <g>
          <path d={`M${x + rx - 6} ${y - 18} Q${x + rx + 26} ${y - 8} ${x + rx + 14} ${y + 34} Q${x + rx + 6} ${y + 18} ${x + rx - 2} ${y + 4} Z`} fill={cor} {...CONTORNO} />
          <circle cx={x + rx - 2} cy={y - 14} r={4} fill="var(--cor-cliente-roupa-amarelo)" {...CONTORNO} />
        </g>
      );
    case "coque":
      return (
        <g>
          <circle cx={x} cy={y - ry - 4} r={14} fill={cor} {...CONTORNO} />
          <path d={`M${x - 10} ${y - ry - 6} Q${x} ${y - ry + 4} ${x + 10} ${y - ry - 6}`} fill="none" stroke="var(--cor-cliente-rosto)" strokeOpacity={0.2} strokeWidth={1.4} />
        </g>
      );
    default:
      return null;
  }
}

export function CabeloFrente({ cabelo, cor }: { cabelo: TipoCabelo; cor: string }) {
  switch (cabelo) {
    case "careca":
      return (
        <g fill={cor} {...CONTORNO}>
          <path d={`M${x - rx + 1} ${y + 2} Q${x - rx - 3} ${y - 12} ${x - rx + 8} ${y - 18} Q${x - rx + 6} ${y - 6} ${x - rx + 6} ${y + 4} Z`} />
          <path d={`M${x + rx - 1} ${y + 2} Q${x + rx + 3} ${y - 12} ${x + rx - 8} ${y - 18} Q${x + rx - 6} ${y - 6} ${x + rx - 6} ${y + 4} Z`} />
        </g>
      );
    case "cacheado":
      return (
        <g fill={cor} {...CONTORNO}>
          {[44, 54, 64, 74, 84, 94].map((cx, i) => (
            <circle key={cx} cx={cx} cy={y - ry + 12 + (i % 2) * 3} r={8} />
          ))}
        </g>
      );
    case "curto":
      return (
        <g>
          <path d={`M${x - rx} ${y - 2} Q${x - rx - 2} ${y - ry - 2} ${x} ${y - ry - 4} Q${x + rx + 4} ${y - ry} ${x + rx} ${y - 2} Q${x + rx - 6} ${y - 20} ${x + 8} ${y - 24} Q${x - 10} ${y - 16} ${x - rx + 6} ${y - 14} Z`} fill={cor} {...CONTORNO} />
        </g>
      );
    default:
      // Liso com a risca: longo, rabo e coque (o topo da cabeça, puxado para trás).
      return (
        <g>
          <path d={`M${x - rx} ${y + 2} Q${x - rx - 2} ${y - ry} ${x} ${y - ry - 2} Q${x + rx + 2} ${y - ry} ${x + rx} ${y + 2} Q${x + rx - 4} ${y - 18} ${x + 6} ${y - 22} Q${x + 2} ${y - 16} ${x - 4} ${y - 22} Q${x - rx + 6} ${y - 18} ${x - rx} ${y + 2} Z`} fill={cor} {...CONTORNO} />
          <path d={`M${x + 6} ${y - 22} Q${x + rx - 6} ${y - 18} ${x + rx} ${y + 2} Q${x + rx - 2} ${y - 14} ${x + 12} ${y - 22} Z`} {...SOMBRA} />
        </g>
      );
  }
}
