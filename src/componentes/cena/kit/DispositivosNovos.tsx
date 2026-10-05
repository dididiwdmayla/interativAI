import type { DispositivoCena, EstadoDispositivos } from "@/motor/cena/modelo";
import { CONTORNO, cor, SombraNoChao } from "./estilo";

type Props = { dispositivo: DispositivoCena; estado: EstadoDispositivos; tempoMs: number; reduzido?: boolean };

/** Dispositivos novos em coordenadas locais; o ponto de referência é o canto superior esquerdo. */
export function DispositivoNovo({ dispositivo: d, estado, tempoMs, reduzido }: Props) {
  const e = estado[d.id] ?? {};
  const pulso = reduzido ? 0.65 : 0.55 + Math.sin(tempoMs / 150) * 0.25;
  let desenho;
  switch (d.tipo) {
    case "geladeira": {
      const aberta = e.portaAberta === true;
      desenho = <>
        <SombraNoChao x={25} y={89} largura={58} />
        <rect width={52} height={88} rx={7} fill={cor("metal-sombra")} {...CONTORNO} />
        <rect x={3} y={3} width={45} height={79} rx={5} fill={cor("claro")} />
        {[25, 47, 67].map(y => <g key={y}><path d={`M6 ${y}h39`} stroke={cor("metal")} strokeWidth={3} /><rect x={9} y={y - 13} width={9} height={12} rx={2} fill={cor("vaso")} /><rect x={25} y={y - 10} width={14} height={9} rx={3} fill={cor("planta")} /></g>)}
        <g transform={aberta ? 'translate(0 0) skewY(-9) scale(.24 1)' : undefined}>
          <rect width={50} height={86} rx={6} fill={cor("vidro")} {...CONTORNO} />
          <path d="M3 29h44" stroke={cor("metal-sombra")} />
          <rect x={39} y={36} width={3} height={21} rx={1.5} fill={cor("metal-sombra")} />
          <rect x={12} y={9} width={12} height={13} rx={2} transform="rotate(-8 18 15)" fill={cor("luz")} />
          <circle cx={18} cy={10} r={2} fill={cor("vaso")} />
          <path d="M4 81h42" stroke={cor("metal")} strokeWidth={5} />
        </g>
        {aberta && <path d="M7 6h38v72H7z" fill={cor("luz")} opacity={0.12} />}
      </>; break;
    }
    case "semaforo": {
      const cores = ["vermelho", "amarelo", "verde"];
      desenho = <>
        <SombraNoChao x={17} y={108} largura={38} />
        <rect x={14} y={53} width={6} height={53} rx={3} fill={cor("metal-sombra")} />
        <rect x={0} y={0} width={34} height={67} rx={10} fill={cor("letreiro")} {...CONTORNO} />
        {cores.map((c, i) => <g key={c}><path d={`M5 ${11 + i * 20}q12 -13 24 0`} fill="none" stroke={cor("metal-sombra")} strokeWidth={3} />{e.cor === c && <circle cx={17} cy={14 + i * 20} r={13} fill={cor(`sinal-${c}`)} opacity={pulso * 0.25} />}<circle cx={17} cy={14 + i * 20} r={7} fill={cor(e.cor === c ? `sinal-${c}` : "letreiro-apagado")} /><circle cx={15} cy={12 + i * 20} r={2} fill={cor("claro")} opacity={e.cor === c ? 0.55 : 0.08} /></g>)}
        <rect x={40} y={30} width={22} height={29} rx={5} fill={cor("letreiro")} {...CONTORNO} />
        <path d="M34 47h7" stroke={cor("metal-sombra")} strokeWidth={3} />
        <g stroke={cor(e.cor === "vermelho" ? "sinal-verde" : "sinal-vermelho")} strokeWidth={2.5} strokeLinecap="round" fill="none"><circle cx={51} cy={37} r={2} /><path d={e.cor === "vermelho" ? "M51 42l-4 6m4-6 5 4m-5-4v6l-4 6m4-6 5 6" : "M51 42v7m-4-5h8m-4 5-3 5m3-5 3 5"} /></g>
      </>; break;
    }
    case "alarme":
      desenho = <><rect width={28} height={24} rx={8} fill={cor("claro")} {...CONTORNO} /><circle cx={14} cy={12} r={8} fill={cor(e.tocando ? "sinal-vermelho" : "metal")} />{[8, 12, 16].map(y => <path key={y} d={`M10 ${y}h8`} stroke={cor("metal-sombra")} strokeWidth={1.5} />)}{e.tocando && <g fill="none" stroke={cor("sinal-vermelho")} strokeWidth={2} opacity={pulso}><path d="M-4 4q-7 8 0 16M32 4q7 8 0 16M-9 0q-10 12 0 24M37 0q10 12 0 24" /></g>}</>; break;
    case "aspersor":
      desenho = <><SombraNoChao x={12} y={28} largura={29} /><rect x={9} y={4} width={6} height={24} rx={3} fill={cor("metal-sombra")} /><rect x={0} y={1} width={25} height={7} rx={3.5} fill={cor("metal")} {...CONTORNO} /><circle cx={12} cy={4} r={4} fill={cor("tecido")} />{e.ligado && <g stroke={cor("agua")} strokeWidth={1.7} fill={cor("agua")}>
        {[-1, 1].flatMap(lado => [0, 1, 2, 3, 4].map(i => { const p = reduzido ? (i + 1) / 6 : ((tempoMs / 650 + i / 5) % 1); return <ellipse key={`${lado}-${i}`} cx={12 + lado * (9 + p * 44)} cy={4 - 30 * Math.sin(p * Math.PI) + p * 24} rx={1.3} ry={2.2} opacity={0.9 - p * 0.4} />; }))}
        <path d="M12 3q-22-37-51 16M12 3q22-37 51 16" fill="none" opacity={0.25} />
      </g>}</>; break;
    case "sensorUmidade": {
      const valor = Math.round(Number(e.valor ?? 0));
      desenho = <><path d="M10 20v23m8-23v23" stroke={cor("metal")} strokeWidth={3} /><rect width={30} height={27} rx={6} fill={cor("claro")} {...CONTORNO} /><rect x={4} y={4} width={22} height={12} rx={3} fill={cor("letreiro")} /><text x={15} y={13} fontSize={8} textAnchor="middle" fontFamily="monospace" fill={cor("led")}>{valor}</text><rect x={5} y={20} width={20} height={3} rx={1.5} fill={cor("metal")} /><rect x={5} y={20} width={valor / 5} height={3} rx={1.5} fill={cor("agua")} /></>; break;
    }
    case "sensorCarro":
      desenho = <><rect width={24} height={19} rx={5} fill={cor("metal")} {...CONTORNO} /><circle cx={9} cy={9} r={5} fill={cor("letreiro")} /><circle cx={18} cy={6} r={2} fill={cor(e.temCarro ? "led" : "metal-sombra")} /><path d="M24 12q9 6 5 25" stroke={cor("metal-sombra")} fill="none" strokeWidth={2} /></>; break;
    case "botao":
      desenho = <><rect width={22} height={30} rx={7} fill={cor("luz")} {...CONTORNO} /><circle cx={11} cy={15} r={7} fill={cor("metal-sombra")} /><circle cx={11} cy={e.pressionado ? 16 : 14} r={5.5} fill={cor(e.pressionado ? "led" : "claro")} /><path d="M8 14h6m-3-3 3 3-3 3" stroke={cor("contorno")} strokeWidth={1.2} fill="none" /></>; break;
    case "sensorDia":
      desenho = <><rect width={26} height={26} rx={8} fill={cor("claro")} {...CONTORNO} /><circle cx={13} cy={13} r={7} fill={cor(e.dia ? "luz" : "ceu-noite")} />{e.dia ? <g stroke={cor("vaso")}><path d="M13 3v3m0 14v3M3 13h3m14 0h3" /></g> : <circle cx={16} cy={10} r={5} fill={cor("claro")} />}</>; break;
    default: return null;
  }
  return <g transform={`translate(${d.x} ${d.y}) scale(${d.escala ?? 1})`}>{desenho}</g>;
}
