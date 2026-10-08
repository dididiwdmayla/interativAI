/*
 * O balão de fala do computadorzinho, com o visual do BalaoFala do jogo
 * (src/componentes/mascote/BalaoFala.tsx: painel arredondado com borda e o
 * rabinho apontando para ele), recriado para o vídeo. O texto entra palavra
 * por palavra e termina junto com a voz. Os balões são as legendas do vídeo.
 */
import type { CSSProperties } from "react";
import { FONTE_UI } from "../fontes";
import { elastico, rampa, sai } from "../lib/tempo";

type Props = {
  texto: string;
  /** Segundos desde o começo da fala. */
  t: number;
  /** Quanto dura a voz (as palavras terminam de entrar junto com ela). */
  voz: number;
  /** Quanto o balão fica na tela. */
  duracao: number;
  /** Tamanho da letra em px (no 16:9, pelo menos 40; no 9:16, pelo menos 52). */
  letra?: number;
  larguraMaxima?: number;
  /** Para onde aponta o rabinho. */
  rabo?: "esquerda" | "baixo-esquerda" | "baixo" | "cima";
  estilo?: CSSProperties;
};

export function Balao({ texto, t, voz, duracao, letra = 44, larguraMaxima = 1000, rabo = "esquerda", estilo }: Props) {
  if (t < 0 || t > duracao + 0.2) return null;
  const entrada = rampa(t, 0, 0.22, elastico);
  const saida = 1 - rampa(t, duracao, duracao + 0.18, sai);
  const escala = entrada * (0.9 + 0.1 * saida);
  const palavras = texto.split(" ");
  const borda = Math.max(4, Math.round(letra * 0.11));
  const ponta = Math.round(letra * 0.62);
  const posicaoDoRabo: CSSProperties =
    rabo === "esquerda"
      ? { left: -ponta / 2 - borda / 2, bottom: letra * 0.9, transform: "rotate(45deg)", borderLeft: `${borda}px solid var(--cor-borda)`, borderBottom: `${borda}px solid var(--cor-borda)` }
      : rabo === "baixo-esquerda"
        ? { left: letra * 1.2, bottom: -ponta / 2 - borda / 2, transform: "rotate(-45deg)", borderLeft: `${borda}px solid var(--cor-borda)`, borderBottom: `${borda}px solid var(--cor-borda)` }
        : rabo === "baixo"
          ? { left: "50%", marginLeft: -ponta / 2, bottom: -ponta / 2 - borda / 2, transform: "rotate(-45deg)", borderLeft: `${borda}px solid var(--cor-borda)`, borderBottom: `${borda}px solid var(--cor-borda)` }
          : { left: "50%", marginLeft: -ponta / 2, top: -ponta / 2 - borda / 2, transform: "rotate(135deg)", borderLeft: `${borda}px solid var(--cor-borda)`, borderBottom: `${borda}px solid var(--cor-borda)` };
  const origem = rabo === "esquerda" ? "0% 80%" : rabo === "baixo-esquerda" ? "12% 100%" : rabo === "baixo" ? "50% 100%" : "50% 0%";
  return (
    <div
      style={{
        position: "relative",
        maxWidth: larguraMaxima,
        width: "max-content",
        padding: `${letra * 0.5}px ${letra * 0.72}px`,
        borderRadius: letra * 0.8,
        border: `${borda}px solid var(--cor-borda)`,
        background: "var(--cor-painel)",
        boxShadow: `0 ${Math.round(letra * 0.2)}px 0 var(--cor-sombra)`,
        fontFamily: FONTE_UI,
        fontSize: letra,
        fontWeight: 800,
        lineHeight: 1.22,
        color: "var(--cor-texto)",
        transform: `scale(${escala})`,
        transformOrigin: origem,
        opacity: Math.min(1, entrada * 1.4) * saida,
        ...estilo,
      }}
    >
      <span style={{ position: "absolute", width: ponta, height: ponta, background: "var(--cor-painel)", ...posicaoDoRabo }} />
      <span style={{ position: "relative", display: "flex", flexWrap: "wrap", columnGap: letra * 0.27 }}>
        {palavras.map((palavra, indice) => {
          // A última palavra entra quando a voz está acabando.
          const quando = palavras.length === 1 ? 0 : (indice / (palavras.length - 1)) * Math.max(0.2, voz - 0.25);
          const p = rampa(t, quando, quando + 0.14, sai);
          return (
            <span key={`${palavra}-${indice}`} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * letra * 0.28}px)` }}>
              {palavra}
            </span>
          );
        })}
      </span>
    </div>
  );
}
