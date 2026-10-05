import { resolverAtores } from "@/motor/cena/acontecimentos";
import type { EstadoDispositivos, FiltroPasso, RastroCena } from "@/motor/cena/modelo";
import { PessoaCena } from "./PessoaCena";
import { CONTORNO, cor, SombraNoChao } from "./estilo";

function Carro() {
  return <>
    <SombraNoChao x={0} y={0} largura={74} />
    <path d="M-34-8v-13q0-7 11-8l9-15h23q8 0 14 15l10 4q6 2 6 9v8z" fill={cor("tecido")} {...CONTORNO} />
    <path d="M-30-13h65v6h-65z" fill={cor("tecido-sombra")} />
    <path d="M-19-29l8-11H0v11zm23-11h5q6 0 10 11H4z" fill={cor("vidro")} {...CONTORNO} />
    <path d="M6-27v13m-26-11h7" stroke={cor("tecido-sombra")} fill="none" strokeWidth={2} />
    <rect x={28} y={-23} width={8} height={6} rx={2} fill={cor("luz")} />
    <rect x={-35} y={-23} width={4} height={6} rx={2} fill={cor("sinal-vermelho")} />
    {[-22, 23].map(x => <g key={x}><circle cx={x} cy={-7} r={8} fill={cor("letreiro")} /><circle cx={x} cy={-7} r={4} fill={cor("metal")} /><circle cx={x - 1} cy={-8} r={1.5} fill={cor("claro")} /></g>)}
  </>;
}

export function AtoresCena({ rastro, estado, tempoMs, filtro, reduzido }: { rastro: RastroCena; estado: EstadoDispositivos; tempoMs: number; filtro: FiltroPasso | null; reduzido: boolean }) {
  const { movimentos } = resolverAtores(rastro, tempoMs, { filtro });
  return <>{(rastro.atores ?? []).map((ator, i) => {
    const movimento = movimentos.filter(m => m.ator === ator.id).at(-1);
    const c = ator.visivelQuando;
    if (!movimento && c && estado[c.dispositivo]?.[c.propriedade] !== c.valor) return null;
    const p = movimento ? Math.max(0, Math.min(1, (tempoMs - movimento.inicio) / (movimento.fim - movimento.inicio))) : 0;
    const progresso = reduzido ? (p < 1 ? 0 : 1) : p;
    const x = movimento ? movimento.de.x + (movimento.para.x - movimento.de.x) * progresso : ator.x;
    const y = movimento ? movimento.de.y + (movimento.para.y - movimento.de.y) * progresso : ator.y;
    return <g key={ator.id} data-ator={ator.id} data-progresso={p.toFixed(3)} transform={`translate(${x} ${y}) scale(${ator.escala ?? 1})`}>
      {ator.desenho === "carro" ? <Carro /> : <PessoaCena pessoa={{ indice: i + 100, x: 0, y: 0, andando: !reduzido && p > 0 && p < 1, olhando: "direita", presente: true }} tempoMs={tempoMs} />}
    </g>;
  })}</>;
}
