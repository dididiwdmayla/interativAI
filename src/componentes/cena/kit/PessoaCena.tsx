/*
 * A pessoa da linha do tempo: uma silhueta amigável e arredondada, no
 * estilo do jogo (cabeça redonda, corpo de pílula, pernas que alternam
 * quando ela anda). (x, y) é o meio dos pés.
 */
import type { PessoaNaCena } from "@/motor/cena/modelo";
import { CONTORNO, cor, SombraNoChao } from "./estilo";

export function PessoaCena({ pessoa, tempoMs }: { pessoa: PessoaNaCena; tempoMs: number }) {
  const { y } = pessoa;
  const passo = pessoa.andando ? Math.sin(tempoMs / 95) : 0;
  const virar = pessoa.olhando === "esquerda" ? -1 : 1;
  const balanco = pessoa.andando ? Math.abs(Math.sin(tempoMs / 95)) * 1.2 : 0;
  return (
    <g data-pessoa={pessoa.indice} data-presente={pessoa.presente ? "sim" : "nao"}>
      <SombraNoChao x={pessoa.x} y={y} largura={24} />
      <g transform={`translate(${pessoa.x} ${y - balanco}) scale(${virar} 1)`}>
        {/* Pernas */}
        <rect x={-6} y={-22} width={5.5} height={22} rx={2.75} fill={cor("pessoa-sombra")} transform={`rotate(${passo * 16} -3.25 -22)`} {...CONTORNO} />
        <rect x={0.5} y={-22} width={5.5} height={22} rx={2.75} fill={cor("pessoa-sombra")} transform={`rotate(${-passo * 16} 3.25 -22)`} {...CONTORNO} />
        {/* Braço de trás */}
        <rect x={-2} y={-45} width={5} height={19} rx={2.5} fill={cor("pessoa-sombra")} transform={`rotate(${-passo * 22} 0.5 -43)`} />
        {/* Corpo */}
        <rect x={-10} y={-48} width={20} height={29} rx={9} fill={cor("pessoa")} {...CONTORNO} />
        <path d="M3 -46q6 6 6 18v6q0 3-3 3h-3z" fill={cor("pessoa-sombra")} opacity={0.5} />
        {/* Braço da frente */}
        <rect x={-2.5} y={-45} width={5} height={19} rx={2.5} fill={cor("pessoa")} transform={`rotate(${passo * 22} 0 -43)`} {...CONTORNO} />
        <circle cx={0} cy={-26} r={2.8} fill={cor("pele")} transform={`rotate(${passo * 22} 0 -43)`} />
        {/* Cabeça */}
        <circle cx={0} cy={-57} r={9.5} fill={cor("pele")} {...CONTORNO} />
        <path d="M-9.5 -57a9.5 9.5 0 0 1 19 -1q-6 -3 -11 -2q-4 1 -8 3z" fill={cor("cabelo")} />
        <circle cx={4.5} cy={-57} r={1.3} fill={cor("contorno")} />
        <path d="M3 -52.5q2.5 1.5 4.5 -0.5" fill="none" stroke={cor("contorno")} strokeWidth={1} strokeLinecap="round" />
        <circle cx={6.5} cy={-54} r={1.6} fill={cor("vaso")} opacity={0.35} />
      </g>
    </g>
  );
}
