import { CONTORNO, cor, SombraNoChao } from "./estilo";
type Props = { x: number; y: number; l: number; a: number; periodo: "dia" | "noite"; variante?: string };

export function Ceu({ x, y, l, a, periodo }: Props) {
  return <g><rect x={x} y={y} width={l} height={a} fill={cor(periodo === "dia" ? "ceu-dia" : "ceu-noite")} /><circle cx={x + l * .83} cy={y + a * .25} r={15} fill={cor(periodo === "dia" ? "luz" : "lua")} />{periodo === "noite" ? [28, 90, 140, 220].map((sx, i) => <circle key={sx} cx={x + sx * l / 320} cy={y + 12 + i % 3 * 13} r={1.4} fill={cor("claro")} />) : <g fill={cor("claro")} opacity={.55}><path d={`M${x + 25} ${y + 28}q0-9 10-9q4-12 14-2q14-2 14 11z`} /><path d={`M${x + l * .53} ${y + 18}q0-7 8-7q4-9 12-2q10-2 10 9z`} /></g>}</g>;
}

export function Garagem({ x, y, l, a }: Props) {
  return <g transform={`translate(${x} ${y}) scale(${l / 270} ${a / 142})`}>
    <rect x={5} y={20} width={258} height={120} rx={5} fill={cor("fachada")} {...CONTORNO} />
    <path d="M0 25L34 0h201l35 25z" fill={cor("tecido")} {...CONTORNO} /><path d="M4 25h262" stroke={cor("tecido-sombra")} strokeWidth={6} strokeLinecap="round" />
    <rect x={17} y={36} width={154} height={104} rx={5} fill={cor("madeira-sombra")} /><rect x={23} y={42} width={142} height={98} rx={3} fill={cor("parede-sombra")} />
    <path d="M25 132l20-32h100l18 32" fill={cor("piso")} />
    <rect x={49} y={54} width={91} height={34} rx={4} fill={cor("madeira")} {...CONTORNO} /><path d="M52 70h84" stroke={cor("madeira-sombra")} strokeWidth={3} />
    {[61, 78, 97, 118].map((sx, i) => <g key={sx}><rect x={sx} y={57} width={10} height={11 + i % 2 * 7} rx={2} fill={cor(i % 2 ? "luz" : "metal")} /><path d={`M${sx + 5} 73v11`} stroke={cor("metal-sombra")} strokeWidth={3} /></g>)}
    <rect x={190} y={43} width={47} height={36} rx={5} fill={cor("vidro")} {...CONTORNO} /><path d="M214 45v32m-22-16h43" stroke={cor("claro")} strokeWidth={3} />
    <circle cx={231} cy={109} r={15} fill="none" stroke={cor("planta-sombra")} strokeWidth={4} /><path d="M233 94v-6m0 36v10h9" fill="none" stroke={cor("planta-sombra")} strokeWidth={3} />
    <rect x={179} y={130} width={73} height={10} rx={3} fill={cor("fachada-sombra")} />
  </g>;
}

export function Cozinha({ x, y, l, a }: Props) {
  return <g transform={`translate(${x} ${y}) scale(${l / 180} ${a / 110})`}>
    <rect x={0} y={25} width={180} height={44} fill={cor("vidro")} opacity={.65} />
    {[0, 1, 2, 3].map(i => <path key={i} d={`M0 ${27 + i * 12}h180`} stroke={cor("claro")} strokeWidth={1.5} />)}
    {[0, 1, 2, 3, 4, 5, 6].map(i => <path key={i} d={`M${i * 28} 26v40`} stroke={cor("claro")} strokeWidth={1.5} />)}
    <rect width={74} height={31} rx={4} fill={cor("tecido")} {...CONTORNO} /><rect x={4} y={4} width={66} height={23} rx={3} fill={cor("tecido-sombra")} /><path d="M37 3v24m-6-13v7m12-7v7" stroke={cor("metal")} strokeWidth={2} />
    <rect x={96} y={22} width={76} height={5} rx={2} fill={cor("madeira")} />
    {[104, 120, 138, 156].map((sx,i) => <g key={sx}><rect x={sx} y={9 + i % 2 * 3} width={10} height={13 - i % 2 * 3} rx={3} fill={cor(i % 2 ? "vaso" : "luz")} /><rect x={sx} y={8 + i % 2 * 3} width={10} height={3} rx={1} fill={cor("madeira-sombra")} /></g>)}
    <rect y={67} width={180} height={42} rx={4} fill={cor("tecido")} {...CONTORNO} />
    {[5, 65, 125].map(sx => <g key={sx}><rect x={sx} y={73} width={49} height={30} rx={3} fill={cor("tecido-sombra")} /><path d={`M${sx + 18} 79h13`} stroke={cor("metal")} strokeWidth={2.5} strokeLinecap="round" /></g>)}
    <rect x={-3} y={63} width={186} height={8} rx={3} fill={cor("claro")} {...CONTORNO} />
    <ellipse cx={126} cy={64} rx={20} ry={4} fill={cor("metal")} /><path d="M134 60V47q0-7-7-7t-7 7" stroke={cor("metal-sombra")} strokeWidth={3.5} fill="none" />
    <rect x={73} y={48} width={15} height={15} rx={3} fill={cor("vaso")} /><path d="M76 50l-3-15m9 15 3-17m-6 17V35" stroke={cor("madeira")} strokeWidth={3} />
    <path d="M11 110h158" stroke={cor("tecido-sombra")} strokeWidth={5} />
  </g>;
}

export function Rua({ x, y, l, a }: Props) {
  return <g transform={`translate(${x} ${y}) scale(${l / 320} ${a / 100})`}>
    <rect width={320} height={100} fill={cor("calcada")} /><path d="M0 23h320M0 90h320" stroke={cor("calcada-sombra")} strokeWidth={7} />
    <rect y={27} width={320} height={59} fill={cor("metal-sombra")} />
    {[0, 44, 245, 288].map(sx => <rect key={sx} x={sx} y={54} width={27} height={3} rx={1.5} fill={cor("luz")} />)}
    {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M${111 + i * 19} 32h12l-6 47h-12z`} fill={cor("claro")} />)}
    <path d="M93 31l-6 48m128-48-6 48" stroke={cor("claro")} strokeWidth={2} opacity={.6} />
    {[12, 38, 64, 242, 268, 294].map(sx => <rect key={sx} x={sx} y={8} width={18} height={7} rx={2} fill={cor("luz")} opacity={.65} />)}
  </g>;
}

export function Estufa({ x, y, l, a }: Props) {
  return <g transform={`translate(${x} ${y}) scale(${l / 284} ${a / 162})`}>
    <path d="M9 160V54L142 2l133 52v106z" fill={cor("vidro")} opacity={.23} />
    <path d="M9 158V54L142 2l133 52v104M9 54h266M142 3v152M56 36v120M228 36v120M9 107h266" stroke={cor("metal-sombra")} strokeWidth={4} strokeLinejoin="round" fill="none" />
    <path d="M13 54L142 6l129 48M13 58v96M146 58v96" stroke={cor("claro")} strokeWidth={1.7} fill="none" opacity={.65} />
    <path d="M70 63l25-8-25 43m96-36 28-7-28 48" fill={cor("claro")} opacity={.18} />
    <path d="M3 157h278" stroke={cor("madeira-sombra")} strokeWidth={7} strokeLinecap="round" />
    <path d="M157 26l29 12-20 8-29-12z" fill={cor("vidro")} {...CONTORNO} />
  </g>;
}

export function Canteiro({ x, y, l, a, variante }: Props) {
  return <g transform={`translate(${x} ${y}) scale(${l / 124} ${a / 50})`}>
    <SombraNoChao x={62} y={49} largura={127} />
    <path d="M1 22h122l-5 26H6z" fill={cor("madeira")} {...CONTORNO} /><path d="M6 43h112v5H6z" fill={cor("madeira-sombra")} />
    <ellipse cx={62} cy={23} rx={60} ry={8} fill={cor("madeira-sombra")} />
    {[18, 45, 73, 101].map((sx, i) => <g key={sx}><path d={`M${sx} 27V7`} stroke={cor("planta-sombra")} strokeWidth={2} /><path d={`M${sx} 18q-18-3-12-12q13-2 12 12m0-3q17-1 13-11q-14-2-13 11`} fill={cor("planta")} {...CONTORNO} /><path d={`M${sx} 20q-12-1-10-7`} stroke={cor("planta-sombra")} fill="none" />{variante === "tomates" && <><circle cx={sx - 4} cy={22} r={4} fill={cor("sinal-vermelho")} /><circle cx={sx + 5} cy={17 + i % 2 * 3} r={4} fill={cor("vaso")} /></>}</g>)}
    <path d="M3 30h118" stroke={cor("pao")} opacity={.6} strokeWidth={2} />
  </g>;
}
