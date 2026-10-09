/*
 * O muro de código do gancho de "O aprendiz": código de verdade (programas da
 * Ilha Lógica, lidos do conteúdo do jogo pelo scripts/muro.mjs), denso,
 * desfocado e rolando devagar. Ele racha como vidro de tela e cai em cacos; no
 * fim do vídeo, os cacos voltam voando e o muro se remonta (o mesmo movimento,
 * de trás para a frente), para o último quadro ser igual ao primeiro.
 */
import { AbsoluteFill } from "remotion";
import muro from "../../dados/muro.json";
import { FONTE_CODIGO } from "../../fontes";
import { rampa, sai, sorteio } from "../../lib/tempo";

const L = 1080;
const A = 1920;
const LETRA = 31;
const ALTURA_DA_LINHA = 47;
const MARGEM = 34;
/** Quanto o muro rola, em px por segundo. */
export const ROLAGEM = 26;
/** O ponto da pancada (a rachadura nasce aqui). */
const PANCADA = { x: 560, y: 560 };
/** Quanto tempo os cacos levam para sair do quadro (s). */
export const QUEDA = 0.56;

const PALAVRAS = new Set(["function", "return", "const", "let", "if", "else", "for", "while", "true", "false", "of"]);

/** Pinta uma linha de código com as cores de sintaxe (palavras da linguagem, textos e números). */
function Linha({ texto }: { texto: string }) {
  const pedacos = texto.split(/("[^"]*"|\b\d+\b|\b[a-zA-Z_]+\b)/);
  return (
    <>
      {pedacos.map((pedaco, i) => {
        const cor = PALAVRAS.has(pedaco) ? "var(--cor-destaque)" : pedaco.startsWith('"') ? "var(--cor-borda)" : /^\d+$/.test(pedaco) ? "var(--cor-alerta)" : undefined;
        return cor ? (
          <span key={i} style={{ color: cor }}>
            {pedaco}
          </span>
        ) : (
          pedaco
        );
      })}
    </>
  );
}

/** As linhas do muro, repetidas até encher o quadro e sobrar para a rolagem. */
const LINHAS: string[] = Array.from({ length: 58 }, (_, i) => muro.linhas[i % muro.linhas.length]);

/** O código do muro entre duas alturas do quadro (só as linhas que aparecem ali), já na posição da rolagem. */
function Codigo({ rola, de = 0, ate = A }: { rola: number; de?: number; ate?: number }) {
  const primeira = Math.max(0, Math.floor((de + rola - MARGEM) / ALTURA_DA_LINHA) - 1);
  const ultima = Math.min(LINHAS.length - 1, Math.ceil((ate + rola - MARGEM) / ALTURA_DA_LINHA) + 1);
  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--cor-texto)" }}>
      <div style={{ position: "absolute", inset: 0, filter: "blur(2.2px)", fontFamily: FONTE_CODIGO, fontSize: LETRA, fontWeight: 600, lineHeight: `${ALTURA_DA_LINHA}px`, color: "var(--cor-fundo-padrao)", whiteSpace: "pre" }}>
        {LINHAS.slice(primeira, ultima + 1).map((linha, i) => (
          <div key={primeira + i} style={{ position: "absolute", left: MARGEM, top: MARGEM + (primeira + i) * ALTURA_DA_LINHA - rola, opacity: 0.82 }}>
            <span style={{ display: "inline-block", width: 70, color: "var(--cor-texto-suave)" }}>{primeira + i + 1}</span>
            <Linha texto={linha} />
          </div>
        ))}
      </div>
    </div>
  );
}

type Ponto = { x: number; y: number };
type Caco = { pontos: [Ponto, Ponto, Ponto]; meio: Ponto; atraso: number; vx: number; giro: number; pulo: number };

/** Os cacos: uma grade de 5 x 8 com os cantos fora de esquadro, cada quadra cortada em dois triângulos. */
const CACOS: Caco[] = (() => {
  const colunas = 5;
  const linhas = 8;
  const sorte = sorteio(31);
  const canto = (c: number, l: number): Ponto => ({
    x: c === 0 ? -4 : c === colunas ? L + 4 : (c / colunas) * L + (sorte() - 0.5) * 150,
    y: l === 0 ? -4 : l === linhas ? A + 4 : (l / linhas) * A + (sorte() - 0.5) * 150,
  });
  const cantos = Array.from({ length: linhas + 1 }, (_, l) => Array.from({ length: colunas + 1 }, (_, c) => canto(c, l)));
  const cacos: Caco[] = [];
  for (let l = 0; l < linhas; l++) {
    for (let c = 0; c < colunas; c++) {
      const [a, b, d, e] = [cantos[l][c], cantos[l][c + 1], cantos[l + 1][c + 1], cantos[l + 1][c]];
      const trios: [Ponto, Ponto, Ponto][] = (l + c) % 2 === 0 ? [[a, b, d], [a, d, e]] : [[a, b, e], [b, d, e]];
      for (const pontos of trios) {
        const meio = { x: (pontos[0].x + pontos[1].x + pontos[2].x) / 3, y: (pontos[0].y + pontos[1].y + pontos[2].y) / 3 };
        const distancia = Math.hypot(meio.x - PANCADA.x, meio.y - PANCADA.y);
        cacos.push({ pontos, meio, atraso: (distancia / 1500) * 0.13, vx: ((meio.x - PANCADA.x) / 540) * 420 + (sorte() - 0.5) * 260, giro: (sorte() - 0.5) * 260, pulo: 120 + sorte() * 180 });
      }
    }
  }
  return cacos;
})();

/** As rachaduras: as arestas dos cacos perto da pancada aparecem primeiro. */
const ARESTAS: { a: Ponto; b: Ponto; distancia: number }[] = (() => {
  const vistas = new Map<string, { a: Ponto; b: Ponto; distancia: number }>();
  for (const caco of CACOS) {
    for (let i = 0; i < 3; i++) {
      const a = caco.pontos[i];
      const b = caco.pontos[(i + 1) % 3];
      const chave = [`${Math.round(a.x)},${Math.round(a.y)}`, `${Math.round(b.x)},${Math.round(b.y)}`].sort().join("|");
      if (!vistas.has(chave)) vistas.set(chave, { a, b, distancia: Math.hypot((a.x + b.x) / 2 - PANCADA.x, (a.y + b.y) / 2 - PANCADA.y) });
    }
  }
  return [...vistas.values()];
})();

type Props = {
  /** Segundos de vídeo (para a rolagem). */
  rola: number;
  /** Quanto das rachaduras já apareceu (0 a 1). */
  rachado?: number;
  /** Segundos desde que o muro quebrou (negativo ou zero: inteiro). */
  quebrado?: number;
  /** Quanto o contorno claro dos cacos aparece (na volta do laço ele some antes de o muro fechar). */
  contorno?: number;
  /** O muro inteiro por baixo dos cacos (0 a 1): na volta do laço, fecha as frestas entre eles antes do último quadro. */
  inteiro?: number;
};

export function MuroDeCodigo({ rola, rachado = 0, quebrado = 0, contorno = 1, inteiro = 0 }: Props) {
  const desloca = rola * ROLAGEM;
  if (quebrado <= 0) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Codigo rola={desloca} />
        {rachado > 0 ? (
          <svg viewBox={`0 0 ${L} ${A}`} width={L} height={A} style={{ position: "absolute", inset: 0 }}>
            {ARESTAS.map((aresta, i) => {
              const p = rampa(rachado, (aresta.distancia / 1700) * 0.75, (aresta.distancia / 1700) * 0.75 + 0.25, sai);
              if (p <= 0) return null;
              return <line key={i} x1={aresta.a.x} y1={aresta.a.y} x2={aresta.a.x + (aresta.b.x - aresta.a.x) * p} y2={aresta.a.y + (aresta.b.y - aresta.a.y) * p} stroke="var(--cor-superficie)" strokeWidth={5} strokeLinecap="round" opacity={0.9} />;
            })}
          </svg>
        ) : null}
      </AbsoluteFill>
    );
  }
  if (quebrado >= QUEDA + 0.2) return null;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {inteiro > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: inteiro }}>
          <Codigo rola={desloca} />
        </div>
      ) : null}
      {CACOS.map((caco, i) => {
        const t = Math.max(0, quebrado - caco.atraso);
        const y = -caco.pulo * t + 6200 * t * t;
        const x = caco.vx * t;
        const some = 1 - rampa(t, QUEDA * 0.55, QUEDA * 0.95);
        if (some <= 0 || caco.meio.y + y - 420 > A) return null;
        const alturas = caco.pontos.map((ponto) => ponto.y);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `polygon(${caco.pontos.map((ponto) => `${ponto.x}px ${ponto.y}px`).join(", ")})`,
              transformOrigin: `${caco.meio.x}px ${caco.meio.y}px`,
              transform: `translate(${x}px, ${y}px) rotate(${caco.giro * t}deg) scale(${1 - 0.25 * Math.min(1, t / QUEDA)})`,
              opacity: some,
            }}
          >
            <Codigo rola={desloca} de={Math.min(...alturas)} ate={Math.max(...alturas)} />
            <svg viewBox={`0 0 ${L} ${A}`} width={L} height={A} style={{ position: "absolute", inset: 0 }}>
              <polygon points={caco.pontos.map((ponto) => `${ponto.x},${ponto.y}`).join(" ")} fill="none" stroke="var(--cor-superficie)" strokeWidth={6} strokeLinejoin="round" opacity={0.9 * contorno} />
            </svg>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
