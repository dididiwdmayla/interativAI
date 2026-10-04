/*
 * O rosto do cliente: olhos (que piscam), sobrancelhas, nariz, bochechas e a
 * boca. Cada expressão muda as peças (como no computadorzinho); falando, a
 * boca acompanha o texto: abre nas vogais, quase fecha nas consoantes e
 * descansa na expressão entre as palavras.
 */
import type { ExpressaoCliente, FormaBoca } from "@/motor/contrato/expressoes";
import { BOCA, cor, OLHOS, TRACO } from "./estilo";

function BocaFalando({ forma }: { forma: Exclude<FormaBoca, null> }) {
  const { x, y } = BOCA;
  const tamanho = { a: [7, 6], e: [8, 3.6], o: [4.6, 5.2], m: [6, 1.8] }[forma];
  return (
    <g>
      <ellipse cx={x} cy={y + 1} rx={tamanho[0]} ry={tamanho[1]} fill={cor("boca")} stroke={cor("rosto")} strokeWidth={2.2} />
      {forma === "a" && <ellipse cx={x} cy={y + 4.2} rx={4} ry={1.8} fill={cor("bochecha")} />}
    </g>
  );
}

function BocaDaExpressao({ expressao }: { expressao: ExpressaoCliente }) {
  const { x, y } = BOCA;
  switch (expressao) {
    case "feliz":
      return <path d={`M${x - 9} ${y - 2} Q${x} ${y + 8} ${x + 9} ${y - 2}`} {...TRACO} />;
    case "pensativo":
      return <path d={`M${x - 5} ${y + 1} Q${x + 2} ${y - 1} ${x + 8} ${y - 3}`} {...TRACO} />;
    case "preocupado":
      return <path d={`M${x - 9} ${y + 2} q2.25 -3 4.5 0 t4.5 0 t4.5 0 t4.5 0`} {...TRACO} strokeWidth={2.6} />;
    case "empolgado":
      return (
        <g>
          <path d={`M${x - 11} ${y - 3} Q${x} ${y + 14} ${x + 11} ${y - 3} Z`} fill={cor("boca")} stroke={cor("rosto")} strokeWidth={2.4} strokeLinejoin="round" />
          <ellipse cx={x} cy={y + 5} rx={4.5} ry={2} fill={cor("bochecha")} />
        </g>
      );
    case "satisfeito":
      return <path d={`M${x - 11} ${y - 3} Q${x} ${y + 10} ${x + 11} ${y - 3}`} {...TRACO} strokeWidth={3.2} />;
  }
}

function Olho({ cx, expressao, piscando }: { cx: number; expressao: ExpressaoCliente; piscando: boolean }) {
  const cy = OLHOS.y;
  if (expressao === "satisfeito") return <path d={`M${cx - 5} ${cy + 1} Q${cx} ${cy - 5} ${cx + 5} ${cy + 1}`} {...TRACO} />;
  if (piscando) return <path d={`M${cx - 4.5} ${cy} Q${cx} ${cy + 3} ${cx + 4.5} ${cy}`} {...TRACO} strokeWidth={2.6} />;
  // Pensativo olha para cima e para o lado; empolgado, olhos grandes e brilhando.
  const olhar = expressao === "pensativo" ? { x: 2.2, y: -2.4 } : { x: 0, y: 0 };
  const raio = expressao === "empolgado" ? 5.4 : expressao === "preocupado" ? 3.8 : 4.4;
  return (
    <g>
      <ellipse cx={cx + olhar.x} cy={cy + olhar.y} rx={raio} ry={raio * 1.12} fill={cor("rosto")} />
      <circle cx={cx + olhar.x + raio * 0.35} cy={cy + olhar.y - raio * 0.4} r={raio * (expressao === "empolgado" ? 0.42 : 0.3)} fill={cor("branco")} />
      {expressao === "empolgado" && <circle cx={cx - raio * 0.35} cy={cy + raio * 0.35} r={raio * 0.18} fill={cor("branco")} />}
    </g>
  );
}

function Sobrancelhas({ expressao }: { expressao: ExpressaoCliente }) {
  const y = OLHOS.y - 12;
  const { esquerdo: e, direito: d } = OLHOS;
  switch (expressao) {
    case "pensativo":
      return (
        <g {...TRACO} strokeWidth={2.6}>
          <path d={`M${e - 6} ${y + 1} L${e + 5} ${y + 1}`} />
          <path d={`M${d - 6} ${y - 1} Q${d} ${y - 6} ${d + 6} ${y - 2}`} />
        </g>
      );
    case "preocupado":
      return (
        <g {...TRACO} strokeWidth={2.6}>
          <path d={`M${e - 6} ${y + 2} L${e + 5} ${y - 2}`} />
          <path d={`M${d - 5} ${y - 2} L${d + 6} ${y + 2}`} />
        </g>
      );
    case "empolgado":
      return (
        <g {...TRACO} strokeWidth={2.6}>
          <path d={`M${e - 6} ${y - 1} Q${e} ${y - 7} ${e + 6} ${y - 2}`} />
          <path d={`M${d - 6} ${y - 2} Q${d} ${y - 7} ${d + 6} ${y - 1}`} />
        </g>
      );
    default:
      return (
        <g {...TRACO} strokeWidth={2.4}>
          <path d={`M${e - 6} ${y + 1} Q${e} ${y - 3} ${e + 6} ${y + 1}`} />
          <path d={`M${d - 6} ${y + 1} Q${d} ${y - 3} ${d + 6} ${y + 1}`} />
        </g>
      );
  }
}

type Props = {
  expressao: ExpressaoCliente;
  piscando: boolean;
  /** Falando: a forma da boca da letra de agora (null: a boca da expressão). */
  boca: FormaBoca;
};

export function RostoCliente({ expressao, piscando, boca }: Props) {
  const corada = expressao === "feliz" || expressao === "empolgado" || expressao === "satisfeito";
  return (
    <g>
      <Sobrancelhas expressao={expressao} />
      <Olho cx={OLHOS.esquerdo} expressao={expressao} piscando={piscando} />
      <Olho cx={OLHOS.direito} expressao={expressao} piscando={piscando} />
      {/* O nariz: uma curvinha */}
      <path d="M68 74 Q72 79 68 81" {...TRACO} strokeWidth={2} strokeOpacity={0.55} />
      <ellipse cx={46} cy={81} rx={6} ry={3.6} fill={cor("bochecha")} opacity={corada ? 0.75 : 0.35} />
      <ellipse cx={94} cy={81} rx={6} ry={3.6} fill={cor("bochecha")} opacity={corada ? 0.75 : 0.35} />
      {boca ? <BocaFalando forma={boca} /> : <BocaDaExpressao expressao={expressao} />}
    </g>
  );
}
