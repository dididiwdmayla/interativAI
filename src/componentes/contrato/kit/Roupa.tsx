/*
 * O corpo (até os ombros), o pescoço e a roupa. Cada roupa é uma variante do
 * mesmo busto: avental (de padaria, por cima da camisa), camisa (com gola),
 * jaleco (aberto, com lapelas) e macacão (alças com botões).
 */
import type { Roupa as TipoRoupa } from "@/motor/contrato/clientes";
import { CONTORNO, type Cores, cor, SOMBRA } from "./estilo";

const BUSTO = "M14 150 C14 124 30 112 52 108 L88 108 C110 112 126 124 126 150 Z";

export function Corpo({ roupa, cores }: { roupa: TipoRoupa; cores: Cores }) {
  return (
    <g>
      {/* O pescoço, com a sombra do queixo */}
      <path d="M59 90 L59 110 Q70 116 81 110 L81 90 Z" fill={cores.pele} {...CONTORNO} />
      <path d="M59 96 Q70 104 81 96 L81 90 L59 90 Z" {...SOMBRA} />
      <path d={BUSTO} fill={roupa === "jaleco" || roupa === "macacao" ? cor("branco") : cores.roupa} {...CONTORNO} />
      <path d="M14 150 C14 134 20 126 30 120 C30 132 32 142 34 150 Z" {...SOMBRA} />
      <path d="M126 150 C126 134 120 126 110 120 C110 132 108 142 106 150 Z" {...SOMBRA} />
      {roupa === "camisa" && (
        <g>
          <path d="M52 108 L62 124 L70 112 L78 124 L88 108 L80 106 L70 112 L60 106 Z" fill={cor("branco")} {...CONTORNO} />
          <circle cx={70} cy={130} r={1.8} fill={cor("rosto")} opacity={0.35} />
          <circle cx={70} cy={141} r={1.8} fill={cor("rosto")} opacity={0.35} />
        </g>
      )}
      {roupa === "avental" && (
        <g>
          {/* A camisa por baixo aparece nos ombros; o avental cobre o peito, com o bolso */}
          <path d="M40 150 L44 120 Q70 114 96 120 L100 150 Z" fill={cor("branco")} {...CONTORNO} />
          <path d="M48 120 Q50 110 56 106 M92 120 Q90 110 84 106" stroke={cor("branco")} strokeWidth={5} strokeLinecap="round" fill="none" />
          <rect x={58} y={132} width={24} height={14} rx={4} fill="none" stroke={cores.roupa} strokeWidth={2.2} opacity={0.8} />
        </g>
      )}
      {roupa === "jaleco" && (
        <g>
          <path d="M70 112 L58 108 L50 132 L62 126 Z" fill={cor("branco")} {...CONTORNO} />
          <path d="M70 112 L82 108 L90 132 L78 126 Z" fill={cor("branco")} {...CONTORNO} />
          <path d="M62 126 L70 112 L78 126 L70 150 Z" fill={cores.roupa} {...CONTORNO} />
          <rect x={88} y={134} width={14} height={10} rx={2} fill="none" stroke={cor("rosto")} strokeOpacity={0.3} strokeWidth={1.6} />
        </g>
      )}
      {roupa === "macacao" && (
        <g>
          <path d="M34 150 L38 128 Q70 122 102 128 L106 150 Z" fill={cores.roupa} {...CONTORNO} />
          <path d="M34 150 L38 128 Q70 122 102 128 L106 150 Z" fill={cor("rosto")} opacity={0.12} />
          <path d="M46 128 L52 108 M94 128 L88 108" stroke={cores.roupa} strokeWidth={6} strokeLinecap="round" fill="none" />
          <circle cx={47} cy={128} r={2.6} fill={cor("lente")} />
          <circle cx={93} cy={128} r={2.6} fill={cor("lente")} />
        </g>
      )}
    </g>
  );
}
