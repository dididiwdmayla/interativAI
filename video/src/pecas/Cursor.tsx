/*
 * O cursor (e, no celular, o dedo) desenhado a partir do take.json. O
 * screencast não grava o ponteiro; aqui ele é redesenhado no lugar certo, com
 * um anel curto em cada clique.
 */
import { rampa, sai } from "../lib/tempo";
import type { Evento, Take } from "../lib/tomadas";

type Props = {
  take: Take;
  /** O instante da tomada (s) neste quadro. */
  tempo: number;
  /** A velocidade do corte (para o anel durar o mesmo tempo de vídeo). */
  velocidade: number;
  /** Px da página -> px do vídeo. */
  escala: number;
  /** O zoom da câmera: o cursor não cresce junto. */
  zoom: number;
};

function posicaoEm(movimentos: Evento[], tempo: number): { x: number; y: number } | null {
  if (movimentos.length === 0) return null;
  let antes = movimentos[0];
  for (const evento of movimentos) {
    if (evento.t > tempo) {
      const intervalo = evento.t - antes.t;
      const p = intervalo > 0 ? Math.min(1, Math.max(0, (tempo - antes.t) / intervalo)) : 1;
      return { x: (antes.x ?? 0) + ((evento.x ?? 0) - (antes.x ?? 0)) * p, y: (antes.y ?? 0) + ((evento.y ?? 0) - (antes.y ?? 0)) * p };
    }
    antes = evento;
  }
  return { x: antes.x ?? 0, y: antes.y ?? 0 };
}

export function Cursor({ take, tempo, velocidade, escala, zoom }: Props) {
  const celular = take.formato === "celular";
  if (celular) {
    // O dedo: um círculo que aparece no toque e acompanha o arrasto.
    const dedos = take.eventos.filter((evento) => evento.tipo === "toque" || evento.tipo === "dedo-desce" || evento.tipo === "dedo-move" || evento.tipo === "dedo-sobe");
    let ponto: { x: number; y: number; forca: number } | null = null;
    for (let i = 0; i < dedos.length; i++) {
      const evento = dedos[i];
      if (evento.tipo === "toque") {
        const dt = (tempo - evento.t) / velocidade;
        if (dt > -0.22 && dt < 0.3) ponto = { x: evento.x ?? 0, y: evento.y ?? 0, forca: rampa(dt, -0.22, -0.05, sai) * (1 - rampa(dt, 0.08, 0.3, sai)) };
      } else if (evento.tipo === "dedo-desce") {
        const fim = dedos.slice(i).find((item) => item.tipo === "dedo-sobe");
        if (!fim) continue;
        const antes = (tempo - evento.t) / velocidade;
        const depois = (tempo - fim.t) / velocidade;
        if (antes > -0.2 && depois < 0.25) {
          const caminho = dedos.slice(i, dedos.indexOf(fim) + 1);
          const onde = posicaoEm(caminho, Math.min(fim.t, Math.max(evento.t, tempo)));
          if (onde) ponto = { ...onde, forca: rampa(antes, -0.2, -0.04, sai) * (1 - rampa(depois, 0.02, 0.25, sai)) };
        }
      }
    }
    if (!ponto || ponto.forca <= 0.01) return null;
    const raio = 46 / zoom;
    return (
      <div style={{ position: "absolute", left: ponto.x * escala - raio, top: ponto.y * escala - raio, width: raio * 2, height: raio * 2, opacity: ponto.forca, transform: `scale(${0.8 + 0.2 * ponto.forca})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--cor-secundaria)", opacity: 0.34 }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `${5 / zoom}px solid var(--cor-superficie)`, boxShadow: `0 0 0 ${3 / zoom}px var(--cor-secundaria)` }} />
      </div>
    );
  }

  const movimentos = take.eventos.filter((evento) => evento.tipo === "mover");
  const ponto = posicaoEm(movimentos, tempo);
  if (!ponto) return null;
  const cliques = take.eventos.filter((evento) => evento.tipo === "clique" || evento.tipo === "duplo-clique");
  const x = ponto.x * escala;
  const y = ponto.y * escala;
  const k = 1 / zoom;
  let aperto = 0;
  return (
    <>
      {cliques.map((clique) => {
        const dt = (tempo - clique.t) / velocidade;
        if (dt < 0 || dt > 0.45) return null;
        aperto = Math.max(aperto, 1 - rampa(dt, 0, 0.16, sai));
        const p = rampa(dt, 0, 0.45, sai);
        const raio = (14 + 34 * p) * k;
        return (
          <div
            key={clique.t}
            style={{
              position: "absolute",
              left: (clique.x ?? 0) * escala - raio,
              top: (clique.y ?? 0) * escala - raio,
              width: raio * 2,
              height: raio * 2,
              boxSizing: "border-box",
              borderRadius: "50%",
              border: `${5 * k * (1 - p * 0.5)}px solid var(--cor-primaria)`,
              opacity: 1 - p,
            }}
          />
        );
      })}
      <svg viewBox="0 0 28 38" width={34 * k} height={46 * k} style={{ position: "absolute", left: x - 3 * k, top: y - 3 * k, transform: `scale(${1 - 0.14 * aperto})`, transformOrigin: "10% 8%", filter: `drop-shadow(0 ${3 * k}px ${2 * k}px var(--cor-sombra))` }}>
        <path d="M3 3 L3 29 L10 22.5 L15 34 L20 31.8 L15.2 20.6 L24.5 20.6 Z" fill="var(--cor-superficie)" stroke="var(--cor-texto)" strokeWidth={2.4} strokeLinejoin="round" />
      </svg>
    </>
  );
}
