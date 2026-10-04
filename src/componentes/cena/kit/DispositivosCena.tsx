/*
 * O desenho de cada tipo de dispositivo, no estado do instante (o que a
 * simulação diz). O ponto (x, y) de cada um está em `caixaDoDispositivo`,
 * que também dá a área de toque (abrir a ficha).
 */
import type { DispositivoCena, EstadoDispositivos, FiltroPasso, RastroCena } from "@/motor/cena/modelo";
import { aberturaDoPortao, anguloDoVentilador, letrasAcesas } from "@/motor/cena/animacao";
import { LETRAS_DO_LETREIRO } from "@/motor/cena/catalogo";
import { CONTORNO, cor, SombraNoChao } from "./estilo";

export type Caixa = { x: number; y: number; largura: number; altura: number };

/**
 * A área de cada dispositivo na cena (para tocar e para o destaque):
 * - lâmpada pendente: (x, y) é a lâmpada, o fio desce do teto;
 * - lâmpada "spot": (x, y) é a luminária presa no teto ou no toldo;
 * - sensor e interruptor: (x, y) é o centro;
 * - portão, letreiro e forno: (x, y) é o canto de cima à esquerda;
 * - ventilador: (x, y) é o meio da base, no chão (ou na mesa).
 */
export function caixaDoDispositivo(dispositivo: DispositivoCena): Caixa {
  const e = dispositivo.escala ?? 1;
  const { x, y } = dispositivo;
  switch (dispositivo.tipo) {
    case "lampada":
      return dispositivo.variante === "spot" ? { x: x - 12 * e, y: y - 6 * e, largura: 24 * e, altura: 16 * e } : { x: x - 16 * e, y: y - 16 * e, largura: 32 * e, altura: 26 * e };
    case "sensor":
      return { x: x - 11 * e, y: y - 8 * e, largura: 22 * e, altura: 16 * e };
    case "interruptor":
      return { x: x - 8 * e, y: y - 11 * e, largura: 16 * e, altura: 22 * e };
    case "portao":
      return { x, y, largura: 96 * e, altura: 64 * e };
    case "letreiro":
      return { x, y, largura: 112 * e, altura: 26 * e };
    case "forno":
      return { x, y, largura: 64 * e, altura: 56 * e };
    case "ventilador":
      return { x: x - 18 * e, y: y - 58 * e, largura: 36 * e, altura: 60 * e };
  }
}

/** O centro da luz de uma lâmpada (onde ela clareia o ambiente). */
export function centroDaLuz(dispositivo: DispositivoCena): { x: number; y: number } {
  const e = dispositivo.escala ?? 1;
  return dispositivo.variante === "spot" ? { x: dispositivo.x, y: dispositivo.y + 6 * e } : { x: dispositivo.x, y: dispositivo.y + 2 * e };
}

type Props = {
  dispositivo: DispositivoCena;
  estado: EstadoDispositivos;
  rastro: RastroCena;
  tempoMs: number;
  filtro: FiltroPasso | null;
};

function Lampada({ dispositivo, estado }: Props) {
  const { x, y } = dispositivo;
  const e = dispositivo.escala ?? 1;
  const ligada = estado[dispositivo.id]?.ligada === true;
  const brilho = Number(estado[dispositivo.id]?.brilho ?? 100) / 100;
  const acesa = ligada && brilho > 0;
  if (dispositivo.variante === "spot") {
    return (
      <g transform={`translate(${x} ${y}) scale(${e})`}>
        <rect x={-10} y={-6} width={20} height={5} rx={2} fill={cor("metal-sombra")} {...CONTORNO} />
        <path d="M-8 -1h16l-3 6h-10z" fill={cor("metal")} {...CONTORNO} />
        <ellipse cx={0} cy={5.5} rx={5} ry={2.4} fill={acesa ? cor("luz") : cor("claro")} opacity={acesa ? 1 : 0.6} />
      </g>
    );
  }
  return (
    <g>
      {/* O fio desce do teto */}
      <path d={`M${x} 0V${y - 11 * e}`} stroke={cor("contorno")} strokeOpacity={0.55} strokeWidth={1.2} />
      <g transform={`translate(${x} ${y}) scale(${e})`}>
        <rect x={-2.5} y={-14} width={5} height={4} rx={1} fill={cor("metal-sombra")} />
        <path d="M-6 -11h12l8 10h-28z" fill={cor("toldo")} {...CONTORNO} />
        <path d="M0 -11h6l8 10h-14z" fill="var(--cor-cena-escuro)" opacity={0.18} />
        {acesa && <circle cx={0} cy={2} r={9} fill={cor("luz")} opacity={0.45 * brilho} />}
        <circle cx={0} cy={2} r={4.5} fill={acesa ? cor("luz") : cor("claro")} {...CONTORNO} opacity={acesa ? 1 : 0.75} />
      </g>
    </g>
  );
}

function Sensor({ dispositivo, estado, tempoMs }: Props) {
  const { x, y } = dispositivo;
  const e = dispositivo.escala ?? 1;
  const temGente = estado[dispositivo.id]?.temGente === true;
  const onda = (tempoMs % 900) / 900;
  return (
    <g transform={`translate(${x} ${y}) scale(${e})`}>
      {temGente &&
        [0, 0.5].map((atraso) => {
          const p = (onda + atraso) % 1;
          return <path key={atraso} d={`M${-8 - p * 10} ${6 + p * 8}q${8 + p * 10} ${6 + p * 6} ${16 + p * 20} 0`} fill="none" stroke={cor("led")} strokeWidth={1.4} opacity={1 - p} />;
        })}
      <rect x={-9} y={-6} width={18} height={9} rx={3} fill={cor("claro")} {...CONTORNO} />
      <path d="M-6 3a6 6 0 0 0 12 0z" fill={cor("metal")} {...CONTORNO} />
      <path d="M-3 4.5a3 2 0 0 0 4 1.5" stroke={cor("claro")} strokeOpacity={0.7} strokeWidth={1} fill="none" />
      <circle cx={6} cy={-1.5} r={1.8} fill={temGente ? cor("led") : cor("contorno")} opacity={temGente ? 1 : 0.3} />
    </g>
  );
}

function Interruptor({ dispositivo, estado }: Props) {
  const { x, y } = dispositivo;
  const e = dispositivo.escala ?? 1;
  const ligado = estado[dispositivo.id]?.ligado === true;
  return (
    <g transform={`translate(${x} ${y}) scale(${e})`}>
      <rect x={-6.5} y={-9.5} width={13} height={19} rx={2.5} fill={cor("claro")} {...CONTORNO} />
      <rect x={-3} y={-6} width={6} height={12} rx={1.5} fill={cor("metal-sombra")} opacity={0.4} />
      <rect x={-2.5} y={ligado ? -5.5 : 0} width={5} height={5.5} rx={1.2} fill={cor("metal")} {...CONTORNO} />
    </g>
  );
}

function Portao({ dispositivo, rastro, tempoMs, filtro }: Props) {
  const { x, y } = dispositivo;
  const e = dispositivo.escala ?? 1;
  const abertura = aberturaDoPortao(rastro, dispositivo.id, tempoMs, filtro);
  const deslize = abertura * 84;
  return (
    <g transform={`translate(${x} ${y}) scale(${e})`}>
      {/* O trilho e as colunas */}
      <rect x={-6} y={60} width={190} height={4} rx={1.5} fill={cor("metal-sombra")} />
      <rect x={-8} y={-4} width={8} height={68} rx={2} fill={cor("fachada-sombra")} {...CONTORNO} />
      <g transform={`translate(${deslize} 0)`}>
        <rect x={2} y={2} width={92} height={56} rx={2} fill="none" stroke={cor("metal")} strokeWidth={4} />
        {Array.from({ length: 11 }, (_, i) => (
          <rect key={i} x={6 + i * 8} y={4} width={3} height={52} rx={1} fill={cor("metal")} />
        ))}
        <rect x={2} y={28} width={92} height={3} fill={cor("metal-sombra")} />
        <circle cx={14} cy={61} r={3} fill={cor("metal-sombra")} />
        <circle cx={82} cy={61} r={3} fill={cor("metal-sombra")} />
      </g>
      <rect x={96} y={-4} width={8} height={68} rx={2} fill={cor("fachada-sombra")} {...CONTORNO} />
    </g>
  );
}

function Letreiro({ dispositivo, estado, rastro, tempoMs, filtro }: Props) {
  const { x, y } = dispositivo;
  const e = dispositivo.escala ?? 1;
  const texto = String(estado[dispositivo.id]?.texto ?? "");
  const acesas = letrasAcesas(rastro, dispositivo.id, texto, tempoMs, filtro);
  const larguraLetra = 6.4;
  const inicio = 56 - (texto.length * larguraLetra) / 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${e})`}>
      <rect x={6} y={24} width={3} height={6} fill={cor("metal-sombra")} />
      <rect x={103} y={24} width={3} height={6} fill={cor("metal-sombra")} />
      <rect x={0} y={0} width={112} height={26} rx={4} fill={cor("letreiro")} {...CONTORNO} />
      {/* Os pontinhos apagados (a matriz de LEDs) */}
      {Array.from({ length: LETRAS_DO_LETREIRO }, (_, i) => (
        <g key={i} fill={cor("letreiro-apagado")}>
          <circle cx={6.6 + i * larguraLetra + 1.6} cy={9} r={0.9} />
          <circle cx={6.6 + i * larguraLetra + 1.6} cy={13} r={0.9} />
          <circle cx={6.6 + i * larguraLetra + 1.6} cy={17} r={0.9} />
        </g>
      ))}
      <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontWeight={800} fontSize={10.5} textAnchor="middle">
        {texto.split("").map((letra, i) =>
          i < acesas ? (
            <g key={i}>
              <text x={inicio + i * larguraLetra + larguraLetra / 2} y={17} fill={cor("letreiro-aceso")} opacity={0.35} stroke={cor("letreiro-aceso")} strokeWidth={2.2}>
                {letra}
              </text>
              <text x={inicio + i * larguraLetra + larguraLetra / 2} y={17} fill={cor("letreiro-aceso")}>
                {letra}
              </text>
            </g>
          ) : null,
        )}
      </g>
    </g>
  );
}

function Forno({ dispositivo, estado }: Props) {
  const { x, y } = dispositivo;
  const e = dispositivo.escala ?? 1;
  const temperatura = Number(estado[dispositivo.id]?.temperatura ?? 25);
  const ligado = estado[dispositivo.id]?.ligado === true;
  const calor = Math.max(0, Math.min(1, (temperatura - 25) / 200));
  return (
    <g transform={`translate(${x} ${y}) scale(${e})`}>
      <SombraNoChao x={32} y={57} largura={66} />
      {calor > 0.45 &&
        [14, 32, 50].map((cx) => (
          <path key={cx} d={`M${cx} -3q-3 -4 0 -8t0 -8`} fill="none" stroke={cor("quente")} strokeOpacity={calor * 0.6} strokeWidth={1.6} strokeLinecap="round" />
        ))}
      <rect x={0} y={0} width={64} height={56} rx={5} fill={cor("metal")} {...CONTORNO} />
      <rect x={0} y={44} width={64} height={12} rx={4} fill={cor("metal-sombra")} />
      {/* O painel: botões e o termômetro */}
      <rect x={4} y={4} width={56} height={10} rx={2} fill={cor("metal-sombra")} />
      <circle cx={10} cy={9} r={3} fill={cor("claro")} {...CONTORNO} />
      <circle cx={19} cy={9} r={3} fill={cor("claro")} {...CONTORNO} />
      <circle cx={27} cy={9} r={1.6} fill={ligado ? cor("quente") : cor("contorno")} opacity={ligado ? 1 : 0.35} />
      <rect x={33} y={5.5} width={24} height={7} rx={1.5} fill={cor("letreiro")} />
      <text x={45} y={11} textAnchor="middle" fontSize={6} fontWeight={800} fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fill={cor("letreiro-aceso")}>
        {`${temperatura}°`}
      </text>
      {/* A porta com o vidro: o calor acende lá dentro */}
      <rect x={6} y={18} width={52} height={24} rx={3} fill={cor("metal-sombra")} {...CONTORNO} />
      <rect x={10} y={21} width={44} height={16} rx={2} fill="var(--cor-cena-escuro)" opacity={0.85} />
      <rect x={10} y={21} width={44} height={16} rx={2} fill={cor("quente")} opacity={calor * 0.85} />
      <path d={`M14 33h36`} stroke={cor("luz")} strokeOpacity={calor} strokeWidth={1.4} strokeDasharray="3 2" />
      <rect x={12} y={39.5} width={40} height={3} rx={1.5} fill={cor("claro")} {...CONTORNO} />
    </g>
  );
}

function Ventilador({ dispositivo, estado, rastro, tempoMs, filtro }: Props) {
  const { x, y } = dispositivo;
  const e = dispositivo.escala ?? 1;
  const velocidade = Number(estado[dispositivo.id]?.velocidade ?? 0);
  const angulo = anguloDoVentilador(rastro, dispositivo.id, tempoMs, filtro);
  return (
    <g transform={`translate(${x} ${y}) scale(${e})`}>
      <SombraNoChao x={0} y={1} largura={30} />
      <path d="M-13 0q0-7 13-7t13 7z" fill={cor("metal-sombra")} {...CONTORNO} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={-5 + i * 5} cy={-3} r={1.3} fill={i < velocidade ? cor("led") : cor("contorno")} opacity={i < velocidade ? 1 : 0.3} />
      ))}
      <rect x={-2} y={-34} width={4} height={28} rx={2} fill={cor("metal")} {...CONTORNO} />
      <g transform="translate(0 -40)">
        <g transform={`rotate(${angulo})`}>
          {[0, 120, 240].map((giro) => (
            <ellipse key={giro} cx={0} cy={-8} rx={5} ry={9} transform={`rotate(${giro})`} fill={cor("tecido")} opacity={velocidade > 0 ? 0.85 : 1} {...CONTORNO} />
          ))}
        </g>
        <circle r={4} fill={cor("metal-sombra")} {...CONTORNO} />
        <circle r={17} fill="none" stroke={cor("metal")} strokeWidth={1.6} />
        <path d="M-17 0h34M0 -17v34M-12 -12l24 24M12 -12l-24 24" stroke={cor("metal")} strokeWidth={0.7} opacity={0.7} />
      </g>
    </g>
  );
}

const DESENHOS = { lampada: Lampada, sensor: Sensor, interruptor: Interruptor, portao: Portao, letreiro: Letreiro, forno: Forno, ventilador: Ventilador } as const;

export function DesenhoDispositivo(props: Props) {
  const Desenho = DESENHOS[props.dispositivo.tipo];
  return <Desenho {...props} />;
}
