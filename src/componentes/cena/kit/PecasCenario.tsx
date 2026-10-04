/*
 * As peças do cenário (decoração: o código não mexe nelas). Cada peça
 * desenha a partir do canto de cima à esquerda (x, y), com o tamanho padrão
 * ou o que a cena pedir. Cores só por tokens (estilo.tsx).
 */
import type { ReactNode } from "react";
import type { PecaCenario } from "@/motor/cena/modelo";
import { CONTORNO, cor, SombraNoChao } from "./estilo";

/** O tamanho padrão de cada peça (largura x altura). */
export const TAMANHO_PADRAO: Record<PecaCenario["peca"], [number, number]> = {
  parede: [320, 150],
  piso: [320, 50],
  janela: [64, 52],
  porta: [40, 82],
  cama: [112, 50],
  mesa: [46, 34],
  prateleira: [64, 30],
  planta: [26, 44],
  balcao: [120, 46],
  quadro: [36, 28],
  tapete: [96, 16],
  toldo: [200, 26],
  vitrine: [150, 84],
};

type PropsPeca = { x: number; y: number; l: number; a: number; variante?: string; periodo: "dia" | "noite"; id: string };

function Parede({ x, y, l, a, variante, id }: PropsPeca) {
  if (variante === "tijolos") {
    const fileiras = Math.ceil(a / 10);
    return (
      <g>
        <rect x={x} y={y} width={l} height={a} fill={cor("fachada")} />
        {Array.from({ length: fileiras }, (_, i) => (
          <g key={i}>
            <path d={`M${x} ${y + i * 10}h${l}`} stroke={cor("fachada-sombra")} strokeWidth={1} />
            {Array.from({ length: Math.ceil(l / 22) + 1 }, (_, j) => {
              const bx = x + j * 22 + (i % 2 ? 11 : 0);
              return bx > x && bx < x + l ? <path key={j} d={`M${bx} ${y + i * 10}v10`} stroke={cor("fachada-sombra")} strokeWidth={1} /> : null;
            })}
          </g>
        ))}
        <rect x={x} y={y} width={l} height={a} fill={`url(#${id}-luz-parede)`} />
      </g>
    );
  }
  return (
    <g>
      <rect x={x} y={y} width={l} height={a} fill={cor("parede")} />
      {variante === "listras" &&
        Array.from({ length: Math.floor(l / 18) }, (_, i) => <rect key={i} x={x + i * 18 + 9} y={y} width={7} height={a} fill={cor("parede-sombra")} opacity={0.45} />)}
      {/* Luz de cima e a sombra no canto: a parede não é chapada. */}
      <rect x={x} y={y} width={l} height={a} fill={`url(#${id}-luz-parede)`} />
      {/* Rodapé */}
      <rect x={x} y={y + a - 5} width={l} height={5} fill={cor("madeira-sombra")} opacity={0.75} />
    </g>
  );
}

function Piso({ x, y, l, a, variante }: PropsPeca) {
  if (variante === "calcada") {
    return (
      <g>
        <rect x={x} y={y} width={l} height={a} fill={cor("calcada")} />
        {Array.from({ length: Math.ceil(l / 32) }, (_, i) => (
          <path key={i} d={`M${x + i * 32} ${y}l-6 ${a - 8}`} stroke={cor("calcada-sombra")} strokeWidth={1} />
        ))}
        <path d={`M${x} ${y + (a - 8) / 2}h${l}`} stroke={cor("calcada-sombra")} strokeWidth={1} />
        {/* O meio-fio */}
        <rect x={x} y={y + a - 8} width={l} height={8} fill={cor("calcada-sombra")} />
        <rect x={x} y={y} width={l} height={3} fill="var(--cor-cena-escuro)" opacity={0.14} />
      </g>
    );
  }
  const tabuas = Math.ceil(a / 8);
  return (
    <g>
      <rect x={x} y={y} width={l} height={a} fill={cor("piso")} />
      {Array.from({ length: tabuas }, (_, i) => (
        <g key={i}>
          <path d={`M${x} ${y + i * 8}h${l}`} stroke={cor("piso-sombra")} strokeWidth={1} />
          {Array.from({ length: Math.ceil(l / 60) }, (_, j) => {
            const jx = x + j * 60 + (i % 2 ? 30 : 12);
            return jx < x + l ? <path key={j} d={`M${jx} ${y + i * 8}v8`} stroke={cor("piso-sombra")} strokeWidth={1} /> : null;
          })}
        </g>
      ))}
      {/* A sombra onde o piso encontra a parede */}
      <rect x={x} y={y} width={l} height={4} fill="var(--cor-cena-escuro)" opacity={0.16} />
    </g>
  );
}

function Janela({ x, y, l, a, variante, periodo }: PropsPeca) {
  const noite = periodo === "noite";
  const vidro = { x: x + 4, y: y + 4, l: l - 8, a: a - 8 };
  return (
    <g>
      {/* Moldura */}
      <rect x={x} y={y} width={l} height={a} rx={3} fill={cor("madeira")} {...CONTORNO} />
      <rect x={vidro.x} y={vidro.y} width={vidro.l} height={vidro.a} rx={1.5} fill={noite ? cor("ceu-noite") : cor("ceu-dia")} />
      {noite ? (
        <g>
          <circle cx={vidro.x + vidro.l * 0.72} cy={vidro.y + vidro.a * 0.3} r={6} fill={cor("lua")} />
          <circle cx={vidro.x + vidro.l * 0.72 + 3} cy={vidro.y + vidro.a * 0.3 - 2} r={5} fill={cor("ceu-noite")} />
          {[
            [0.2, 0.25],
            [0.38, 0.62],
            [0.82, 0.75],
            [0.12, 0.7],
          ].map(([px, py], i) => (
            <path
              key={i}
              d={`M${vidro.x + vidro.l * px} ${vidro.y + vidro.a * py - 2}l0.7 1.3l1.3 0.7l-1.3 0.7l-0.7 1.3l-0.7-1.3l-1.3-0.7l1.3-0.7z`}
              fill={cor("lua")}
            />
          ))}
        </g>
      ) : (
        <g fill={cor("claro")}>
          <circle cx={vidro.x + vidro.l * 0.3} cy={vidro.y + vidro.a * 0.45} r={4} />
          <circle cx={vidro.x + vidro.l * 0.3 + 5} cy={vidro.y + vidro.a * 0.45 - 2} r={5} />
          <circle cx={vidro.x + vidro.l * 0.3 + 10} cy={vidro.y + vidro.a * 0.45} r={4} />
        </g>
      )}
      {/* Reflexo no vidro */}
      <path d={`M${vidro.x + 4} ${vidro.y + vidro.a - 4}l${vidro.a * 0.5} ${-vidro.a * 0.6}`} stroke={cor("claro")} strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" />
      {/* Travessas */}
      <path d={`M${x + l / 2} ${y + 3}v${a - 6}M${x + 3} ${y + a / 2}h${l - 6}`} stroke={cor("madeira")} strokeWidth={3} />
      {/* Peitoril */}
      <rect x={x - 4} y={y + a - 1} width={l + 8} height={5} rx={2} fill={cor("madeira-sombra")} {...CONTORNO} />
      {variante === "cortina" && (
        <g>
          <path d={`M${x - 6} ${y - 4}h${l * 0.3}q-3 ${a * 0.5} 2 ${a + 6}h-${l * 0.3 + 2}z`} fill={cor("tecido")} {...CONTORNO} />
          <path d={`M${x + l + 6} ${y - 4}h-${l * 0.3}q3 ${a * 0.5} -2 ${a + 6}h${l * 0.3 + 2}z`} fill={cor("tecido")} {...CONTORNO} />
          <path d={`M${x + 2} ${y}v${a}M${x + l - 2} ${y}v${a}`} stroke={cor("tecido-sombra")} strokeWidth={2} />
          <rect x={x - 8} y={y - 7} width={l + 16} height={4} rx={2} fill={cor("metal")} {...CONTORNO} />
        </g>
      )}
    </g>
  );
}

function Porta({ x, y, l, a, variante }: PropsPeca) {
  const vidro = variante === "vidro";
  return (
    <g>
      <rect x={x - 3} y={y - 3} width={l + 6} height={a + 3} rx={2} fill={cor("madeira-sombra")} />
      <rect x={x} y={y} width={l} height={a} rx={2} fill={cor("madeira")} {...CONTORNO} />
      {vidro ? (
        <g>
          <rect x={x + 5} y={y + 6} width={l - 10} height={a * 0.55} rx={1.5} fill={cor("vidro")} opacity={0.85} />
          <path d={`M${x + 8} ${y + 6 + a * 0.4}l${l * 0.4} ${-a * 0.3}`} stroke={cor("claro")} strokeOpacity={0.5} strokeWidth={2.5} strokeLinecap="round" />
          {/* A plaquinha pendurada no vidro */}
          <path d={`M${x + l / 2 - 6} ${y + 14}l6 -5l6 5`} fill="none" stroke={cor("contorno")} strokeOpacity={0.5} strokeWidth={0.8} />
          <rect x={x + l / 2 - 9} y={y + 14} width={18} height={8} rx={1.5} fill={cor("claro")} {...CONTORNO} />
          <rect x={x + l / 2 - 6} y={y + 17} width={12} height={2} rx={1} fill={cor("toldo")} />
        </g>
      ) : (
        <g fill={cor("madeira-sombra")} opacity={0.55}>
          <rect x={x + 6} y={y + 7} width={l - 12} height={a * 0.36} rx={2} />
          <rect x={x + 6} y={y + a * 0.5} width={l - 12} height={a * 0.4} rx={2} />
        </g>
      )}
      <circle cx={x + l - 7} cy={y + a * 0.55} r={2.6} fill={cor("metal")} {...CONTORNO} />
    </g>
  );
}

function Cama({ x, y, l, a }: PropsPeca) {
  return (
    <g>
      <SombraNoChao x={x + l / 2} y={y + a + 1} largura={l + 6} />
      {/* Cabeceira */}
      <rect x={x} y={y} width={12} height={a} rx={4} fill={cor("madeira")} {...CONTORNO} />
      <rect x={x + 8} y={y} width={4} height={a} fill={cor("madeira-sombra")} opacity={0.6} />
      {/* Colchão e lençol */}
      <rect x={x + 10} y={y + a * 0.38} width={l - 10} height={a * 0.42} rx={5} fill={cor("claro")} {...CONTORNO} />
      {/* Travesseiro */}
      <rect x={x + 14} y={y + a * 0.26} width={24} height={11} rx={5.5} fill={cor("claro")} {...CONTORNO} />
      {/* Cobertor, com a dobra */}
      <path d={`M${x + 42} ${y + a * 0.34}h${l - 46}q4 0 4 4v${a * 0.42}h-${l - 42}z`} fill={cor("tecido")} {...CONTORNO} />
      <path d={`M${x + 42} ${y + a * 0.34}v${a * 0.46}`} stroke={cor("tecido-sombra")} strokeWidth={4} />
      <path d={`M${x + 42} ${y + a * 0.72}h${l - 42}`} stroke={cor("tecido-sombra")} strokeWidth={2} opacity={0.6} />
      {/* Pés */}
      <rect x={x + 14} y={y + a * 0.8} width={5} height={a * 0.2} fill={cor("madeira-sombra")} />
      <rect x={x + l - 9} y={y + a * 0.8} width={5} height={a * 0.2} fill={cor("madeira-sombra")} />
    </g>
  );
}

function Mesa({ x, y, l, a, variante }: PropsPeca) {
  return (
    <g>
      <SombraNoChao x={x + l / 2} y={y + a + 1} largura={l} />
      {variante === "cabeceira" ? (
        <g>
          <rect x={x + 2} y={y + 5} width={l - 4} height={a - 5} rx={2} fill={cor("madeira-sombra")} {...CONTORNO} />
          <rect x={x + 5} y={y + 9} width={l - 10} height={(a - 12) / 2} rx={1.5} fill={cor("madeira")} />
          <rect x={x + 5} y={y + 11 + (a - 12) / 2} width={l - 10} height={(a - 16) / 2} rx={1.5} fill={cor("madeira")} />
          <circle cx={x + l / 2} cy={y + 9 + (a - 12) / 4} r={1.5} fill={cor("metal")} />
          <circle cx={x + l / 2} cy={y + 11 + (a - 12) / 2 + (a - 16) / 4} r={1.5} fill={cor("metal")} />
        </g>
      ) : (
        <g>
          <rect x={x + 4} y={y + 5} width={4} height={a - 5} fill={cor("madeira-sombra")} />
          <rect x={x + l - 8} y={y + 5} width={4} height={a - 5} fill={cor("madeira-sombra")} />
        </g>
      )}
      <rect x={x} y={y} width={l} height={6} rx={2} fill={cor("madeira")} {...CONTORNO} />
    </g>
  );
}

function Prateleira({ x, y, l, a, variante }: PropsPeca) {
  const base = y + a - 4;
  let itens: ReactNode = null;
  if (variante === "paes") {
    itens = Array.from({ length: Math.floor(l / 16) }, (_, i) => {
      const cx = x + 9 + i * 16;
      return (
        <g key={i}>
          <ellipse cx={cx} cy={base - 5} rx={7} ry={5} fill={cor("pao")} {...CONTORNO} />
          <path d={`M${cx - 3} ${base - 8}l2 3M${cx + 1} ${base - 9}l2 3`} stroke={cor("pao-sombra")} strokeWidth={1.2} />
        </g>
      );
    });
  } else if (variante === "potes") {
    itens = Array.from({ length: Math.floor(l / 14) }, (_, i) => (
      <g key={i}>
        <rect x={x + 3 + i * 14} y={base - 13} width={10} height={13} rx={2} fill={cor("vidro")} {...CONTORNO} />
        <rect x={x + 3 + i * 14} y={base - 15} width={10} height={3} rx={1} fill={cor("metal")} />
      </g>
    ));
  } else {
    const cores = ["tecido", "planta", "vaso", "toldo", "tecido-sombra", "madeira"];
    let bx = x + 3;
    const livros: ReactNode[] = [];
    for (let i = 0; bx < x + l - 8; i++) {
      const largura = 5 + (i % 3);
      const altura = a - 10 - ((i * 7) % 6);
      livros.push(<rect key={i} x={bx} y={base - altura} width={largura} height={altura} rx={1} fill={cor(cores[i % cores.length])} {...CONTORNO} />);
      bx += largura + 1;
    }
    itens = livros;
  }
  return (
    <g>
      {itens}
      <rect x={x} y={base} width={l} height={4} rx={1.5} fill={cor("madeira")} {...CONTORNO} />
      <path d={`M${x + 6} ${base + 4}v5h5M${x + l - 6} ${base + 4}v5h-5`} stroke={cor("madeira-sombra")} strokeWidth={2} fill="none" />
    </g>
  );
}

function Planta({ x, y, l, a }: PropsPeca) {
  const vaso = a * 0.36;
  const topo = y + a - vaso;
  return (
    <g>
      <SombraNoChao x={x + l / 2} y={y + a + 1} largura={l * 0.9} />
      {[-38, -12, 12, 38, 0].map((angulo, i) => (
        <ellipse
          key={i}
          cx={x + l / 2}
          cy={topo - a * 0.22}
          rx={l * 0.16}
          ry={a * 0.3}
          transform={`rotate(${angulo} ${x + l / 2} ${topo})`}
          fill={i % 2 ? cor("planta-sombra") : cor("planta")}
          {...CONTORNO}
        />
      ))}
      <path d={`M${x + 2} ${topo}h${l - 4}l-3 ${vaso}h-${l - 10}z`} fill={cor("vaso")} {...CONTORNO} />
      <rect x={x} y={topo - 2} width={l} height={5} rx={2} fill={cor("vaso")} {...CONTORNO} />
    </g>
  );
}

function Balcao({ x, y, l, a, variante }: PropsPeca) {
  if (variante === "padaria") {
    const vitrine = a * 0.5;
    return (
      <g>
        <SombraNoChao x={x + l / 2} y={y + a + 1} largura={l} />
        {/* A base de madeira */}
        <rect x={x} y={y + vitrine} width={l} height={a - vitrine} rx={2} fill={cor("madeira")} {...CONTORNO} />
        <rect x={x + 4} y={y + vitrine + 5} width={l - 8} height={a - vitrine - 10} rx={2} fill={cor("madeira-sombra")} opacity={0.55} />
        {/* Os pães dentro do vidro */}
        {Array.from({ length: Math.floor((l - 12) / 18) }, (_, i) => {
          const cx = x + 12 + i * 18;
          return (
            <g key={i}>
              <ellipse cx={cx} cy={y + vitrine - 6} rx={7.5} ry={5} fill={cor(i % 3 === 1 ? "pao-sombra" : "pao")} {...CONTORNO} />
              <path d={`M${cx - 3} ${y + vitrine - 9}l2 3M${cx + 1} ${y + vitrine - 10}l2 3`} stroke={cor("pao-sombra")} strokeWidth={1.2} />
            </g>
          );
        })}
        <path d={`M${x + 2} ${y + vitrine}V${y + 6}q0-6 6-6h${l - 16}q6 0 6 6v${vitrine - 6}`} fill={cor("vidro")} fillOpacity={0.35} {...CONTORNO} />
        <path d={`M${x + 10} ${y + vitrine - 4}l${vitrine * 0.6} ${-vitrine * 0.7}`} stroke={cor("claro")} strokeOpacity={0.55} strokeWidth={2.5} strokeLinecap="round" />
        <rect x={x - 2} y={y + vitrine - 2} width={l + 4} height={4} rx={1.5} fill={cor("madeira-sombra")} />
      </g>
    );
  }
  return (
    <g>
      <SombraNoChao x={x + l / 2} y={y + a + 1} largura={l} />
      <rect x={x + 2} y={y + 6} width={l - 4} height={a - 6} fill={cor("madeira-sombra")} {...CONTORNO} />
      {Array.from({ length: Math.max(1, Math.floor(l / 40)) }, (_, i) => {
        const largura = (l - 12) / Math.max(1, Math.floor(l / 40));
        return <rect key={i} x={x + 6 + i * largura + 2} y={y + 12} width={largura - 4} height={a - 18} rx={2} fill={cor("madeira")} opacity={0.7} />;
      })}
      <rect x={x - 3} y={y} width={l + 6} height={7} rx={2} fill={cor("madeira")} {...CONTORNO} />
    </g>
  );
}

function Quadro({ x, y, l, a }: PropsPeca) {
  return (
    <g>
      <rect x={x} y={y} width={l} height={a} rx={2} fill={cor("madeira")} {...CONTORNO} />
      <rect x={x + 3} y={y + 3} width={l - 6} height={a - 6} fill={cor("ceu-dia")} />
      <circle cx={x + l * 0.7} cy={y + a * 0.38} r={a * 0.12} fill={cor("luz")} />
      <path d={`M${x + 3} ${y + a - 3}q${l * 0.25} ${-a * 0.5} ${l * 0.5} ${-a * 0.18}t${l / 2 - 6} ${-a * 0.1}V${y + a - 3}z`} fill={cor("planta")} />
    </g>
  );
}

function Tapete({ x, y, l, a }: PropsPeca) {
  return (
    <g>
      <ellipse cx={x + l / 2} cy={y + a / 2} rx={l / 2} ry={a / 2} fill={cor("tecido-sombra")} {...CONTORNO} />
      <ellipse cx={x + l / 2} cy={y + a / 2} rx={l / 2 - 5} ry={a / 2 - 3} fill="none" stroke={cor("claro")} strokeOpacity={0.6} strokeWidth={1.2} strokeDasharray="3 3" />
    </g>
  );
}

function Toldo({ x, y, l, a }: PropsPeca) {
  const faixas = Math.ceil(l / 16);
  const corpo = a - 7;
  return (
    <g>
      <rect x={x} y={y + a} width={l} height={6} fill="var(--cor-cena-escuro)" opacity={0.16} />
      {Array.from({ length: faixas }, (_, i) => {
        const fx = x + i * 16;
        const largura = Math.min(16, x + l - fx);
        return (
          <g key={i}>
            <path d={`M${fx} ${y}h${largura}v${corpo}h-${largura}z`} fill={i % 2 ? cor("claro") : cor("toldo")} />
            <path d={`M${fx} ${y + corpo}a${largura / 2} 7 0 0 0 ${largura} 0z`} fill={i % 2 ? cor("claro") : cor("toldo")} {...CONTORNO} />
          </g>
        );
      })}
      <rect x={x} y={y} width={l} height={corpo} fill="none" {...CONTORNO} />
      <rect x={x} y={y} width={l} height={corpo * 0.35} fill="var(--cor-cena-escuro)" opacity={0.08} />
    </g>
  );
}

function Vitrine({ x, y, l, a }: PropsPeca) {
  return (
    <g>
      <rect x={x} y={y} width={l} height={a} fill={cor("vidro")} fillOpacity={0.28} />
      <path d={`M${x + 10} ${y + a - 8}l${a * 0.55} ${-a * 0.72}M${x + 24} ${y + a - 8}l${a * 0.35} ${-a * 0.46}`} stroke={cor("claro")} strokeOpacity={0.45} strokeWidth={3} strokeLinecap="round" />
      <rect x={x} y={y} width={l} height={a} rx={1.5} fill="none" stroke={cor("madeira")} strokeWidth={4} />
      <rect x={x - 4} y={y + a} width={l + 8} height={6} rx={2} fill={cor("madeira-sombra")} {...CONTORNO} />
    </g>
  );
}

const DESENHOS: Record<PecaCenario["peca"], (props: PropsPeca) => ReactNode> = {
  parede: Parede,
  piso: Piso,
  janela: Janela,
  porta: Porta,
  cama: Cama,
  mesa: Mesa,
  prateleira: Prateleira,
  planta: Planta,
  balcao: Balcao,
  quadro: Quadro,
  tapete: Tapete,
  toldo: Toldo,
  vitrine: Vitrine,
};

/** Uma peça do cenário, no lugar e tamanho que a cena pede (espelhada, se pedir). */
export function PecaDoCenario({ peca, periodo, id }: { peca: PecaCenario; periodo: "dia" | "noite"; id: string }) {
  const [largura, altura] = TAMANHO_PADRAO[peca.peca];
  const props: PropsPeca = { x: peca.x, y: peca.y, l: peca.largura ?? largura, a: peca.altura ?? altura, variante: peca.variante, periodo, id };
  const Desenho = DESENHOS[peca.peca];
  const desenho = <Desenho {...props} />;
  if (!peca.espelhar) return <g data-peca={peca.peca}>{desenho}</g>;
  const meio = props.x + props.l / 2;
  return (
    <g data-peca={peca.peca} transform={`translate(${meio * 2} 0) scale(-1 1)`}>
      {desenho}
    </g>
  );
}
