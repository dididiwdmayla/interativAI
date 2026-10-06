/*
 * Peças de comércio do kit de cenas (rodada 37): o caixa do mercadinho (o
 * balcão com a esteira e a cesta de compras) e a recepção do salão (o
 * espelho e a cadeira). Desenham a partir do canto de cima à esquerda, com
 * o tamanho pedido; cores só por tokens (estilo.tsx).
 */
import { CONTORNO, cor, SombraNoChao } from "./estilo";

type PropsPeca = { x: number; y: number; l: number; a: number; variante?: string };

/** O balcão do caixa do mercadinho: a esteira com os rolinhos em cima e o painel na frente. */
export function BalcaoMercadinho({ x, y, l, a }: PropsPeca) {
  const esteira = Math.min(l * 0.7, l - 30);
  return (
    <g>
      <SombraNoChao x={x + l / 2} y={y + a + 1} largura={l} />
      <rect x={x + 2} y={y + 8} width={l - 4} height={a - 8} rx={2} fill={cor("fachada")} {...CONTORNO} />
      <rect x={x + 6} y={y + 14} width={l - 12} height={a - 20} rx={2} fill={cor("fachada-sombra")} opacity={0.6} />
      {/* A faixa do mercadinho, com as estrelinhas */}
      {Array.from({ length: Math.max(1, Math.floor((l - 20) / 26)) }, (_, i) => (
        <path
          key={i}
          d={`M${x + 18 + i * 26} ${y + 20}l1.6 3.4 3.7.4-2.8 2.5.8 3.6-3.3-1.9-3.3 1.9.8-3.6-2.8-2.5 3.7-.4z`}
          fill={cor("luz")}
          opacity={0.9}
        />
      ))}
      {/* O tampo e a esteira (a parte que roda leva as compras até o caixa) */}
      <rect x={x - 3} y={y + 4} width={l + 6} height={6} rx={2} fill={cor("metal")} {...CONTORNO} />
      <rect x={x + 3} y={y} width={esteira} height={6} rx={3} fill={cor("letreiro")} {...CONTORNO} />
      {Array.from({ length: Math.floor(esteira / 9) }, (_, i) => (
        <path key={i} d={`M${x + 7 + i * 9} ${y + 1.2}v3.6`} stroke={cor("letreiro-apagado")} strokeWidth={1.4} strokeLinecap="round" />
      ))}
      <rect x={x + 3 + esteira + 4} y={y + 1} width={3} height={4} rx={1} fill={cor("metal-sombra")} />
    </g>
  );
}

/** O balcão da recepção do salão: madeira clara, com um vaso de flores e o caderninho. */
export function BalcaoSalao({ x, y, l, a }: PropsPeca) {
  return (
    <g>
      <SombraNoChao x={x + l / 2} y={y + a + 1} largura={l} />
      <path d={`M${x + 2} ${y + 6}h${l - 4}v${a - 6}h${-(l - 4)}z`} fill={cor("claro")} {...CONTORNO} />
      <path d={`M${x + 2} ${y + 6}h${l - 4}v${(a - 6) * 0.45}h${-(l - 4)}z`} fill={cor("toldo")} opacity={0.85} />
      {Array.from({ length: Math.max(1, Math.floor(l / 18)) }, (_, i) => (
        <circle key={i} cx={x + 10 + i * 18} cy={y + 6 + (a - 6) * 0.22} r={2.6} fill={cor("luz")} />
      ))}
      <rect x={x - 3} y={y} width={l + 6} height={7} rx={2.5} fill={cor("madeira")} {...CONTORNO} />
      {/* O caderninho da agenda antiga, aberto num canto */}
      <path d={`M${x + 6} ${y}l4-5h12l-2 5z`} fill={cor("claro")} {...CONTORNO} />
      <path d={`M${x + 11} ${y - 3}h7`} stroke={cor("tecido")} strokeWidth={0.9} />
    </g>
  );
}

/** A cesta de compras, cheia (fica em cima da esteira ou do chão). */
export function Cesta({ x, y, l, a }: PropsPeca) {
  const boca = y + a * 0.38;
  return (
    <g>
      <SombraNoChao x={x + l / 2} y={y + a + 1} largura={l * 0.9} />
      {/* As compras saindo da cesta */}
      <rect x={x + l * 0.18} y={y + 2} width={l * 0.18} height={a * 0.5} rx={2} fill={cor("sinal-vermelho")} {...CONTORNO} />
      <ellipse cx={x + l * 0.52} cy={y + a * 0.3} rx={l * 0.13} ry={a * 0.18} fill={cor("pao")} {...CONTORNO} />
      <rect x={x + l * 0.62} y={y + a * 0.06} width={l * 0.16} height={a * 0.42} rx={3} fill={cor("vidro")} {...CONTORNO} />
      <circle cx={x + l * 0.36} cy={y + a * 0.34} r={a * 0.13} fill={cor("planta")} {...CONTORNO} />
      {/* A cesta, com as alças */}
      <path d={`M${x + l * 0.22} ${boca}q${l * 0.08} ${-a * 0.45} ${l * 0.2} 0M${x + l * 0.58} ${boca}q${l * 0.08} ${-a * 0.45} ${l * 0.2} 0`} fill="none" stroke={cor("metal-sombra")} strokeWidth={1.6} />
      <path d={`M${x} ${boca}h${l}l${-l * 0.08} ${a - (boca - y)}h${-l * 0.84}z`} fill={cor("toldo")} {...CONTORNO} />
      {[0.3, 0.55, 0.8].map((p) => (
        <path key={p} d={`M${x + l * 0.04} ${boca + (a - (boca - y)) * p}h${l * 0.92}`} stroke={cor("claro")} strokeOpacity={0.45} strokeWidth={1} />
      ))}
    </g>
  );
}

/** O espelho do salão: moldura redonda em cima, com o reflexo. */
export function Espelho({ x, y, l, a }: PropsPeca) {
  return (
    <g>
      <path d={`M${x} ${y + a}V${y + l / 2}a${l / 2} ${l / 2} 0 0 1 ${l} 0V${y + a}z`} fill={cor("madeira")} {...CONTORNO} />
      <path d={`M${x + 4} ${y + a - 3}V${y + l / 2}a${l / 2 - 4} ${l / 2 - 4} 0 0 1 ${l - 8} 0V${y + a - 3}z`} fill={cor("vidro")} />
      <path d={`M${x + l * 0.22} ${y + a * 0.62}l${l * 0.3} ${-a * 0.3}M${x + l * 0.3} ${y + a * 0.8}l${l * 0.36} ${-a * 0.36}`} stroke={cor("claro")} strokeOpacity={0.65} strokeWidth={2.4} strokeLinecap="round" />
      <rect x={x - 3} y={y + a - 2} width={l + 6} height={4} rx={1.5} fill={cor("madeira-sombra")} {...CONTORNO} />
    </g>
  );
}

/** A cadeira do salão: assento estofado, braços e o pé de metal. */
export function Cadeira({ x, y, l, a }: PropsPeca) {
  const assento = y + a * 0.5;
  return (
    <g>
      <SombraNoChao x={x + l / 2} y={y + a + 1} largura={l * 0.8} />
      <rect x={x + l * 0.42} y={assento + a * 0.14} width={l * 0.16} height={a * 0.3} fill={cor("metal-sombra")} {...CONTORNO} />
      <ellipse cx={x + l / 2} cy={y + a - 2} rx={l * 0.36} ry={3} fill={cor("metal")} {...CONTORNO} />
      <rect x={x + l * 0.12} y={y} width={l * 0.76} height={a * 0.56} rx={8} fill={cor("tecido")} {...CONTORNO} />
      <rect x={x + l * 0.2} y={y + 5} width={l * 0.6} height={a * 0.4} rx={6} fill={cor("tecido-sombra")} opacity={0.5} />
      <rect x={x} y={assento} width={l} height={a * 0.16} rx={4} fill={cor("tecido")} {...CONTORNO} />
      <rect x={x - 1} y={assento - 6} width={l * 0.16} height={8} rx={3} fill={cor("metal")} {...CONTORNO} />
      <rect x={x + l * 0.85} y={assento - 6} width={l * 0.16} height={8} rx={3} fill={cor("metal")} {...CONTORNO} />
    </g>
  );
}
