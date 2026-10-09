/*
 * O gesto que se repete no vídeo: a cena aparece dentro da tela do monitor do
 * computadorzinho (o retângulo da tela do CorpoMonitor: x 30, y 32, 80 x 58,
 * rx 15, no viewBox dele) e a câmera mergulha nela até a cena ocupar o quadro
 * inteiro. `p` vai de 0 (o monitor inteiro na tela) a 1 (só a cena).
 */
import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { CorpoMonitor } from "@jogo/componentes/mascote/partes/CorpoMonitor";
import { mistura } from "../lib/tempo";
import { Fundo } from "./Fundo";
import { TELA, VIEWBOX } from "./MascoteVideo";

type Props = {
  p: number;
  largura: number;
  altura: number;
  /** A cena, do tamanho do quadro. */
  children: ReactNode;
  /** O que cobre a cena dentro da tela (o rosto, por exemplo), com a opacidade dada. */
  porCima?: ReactNode;
};

/** Px por unidade do monitor quando ele está inteiro na tela. */
export const unidadeInicial = (largura: number, altura: number): number => (largura > altura ? 5.6 : 6.4);
/** Onde fica o centro da tela do monitor quando ele está inteiro na tela. */
export const centroInicial = (largura: number, altura: number): { x: number; y: number } => ({ x: largura / 2, y: altura * (largura > altura ? 0.47 : 0.44) });

export function MergulhoNaTela({ p, largura, altura, children, porCima }: Props) {
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  const u0 = unidadeInicial(largura, altura);
  // No fim, a tela do monitor cobre o quadro inteiro e a cena está no tamanho real.
  const uFim = Math.max(largura / TELA.l, altura / TELA.a);
  const u = u0 * (uFim / u0) ** p;
  const inicio = centroInicial(largura, altura);
  const centro = { x: mistura(inicio.x, largura / 2, p), y: mistura(inicio.y, altura / 2, p) };
  const telaL = TELA.l * u;
  const telaA = TELA.a * u;
  // A cena cabe inteira na tela (com uma faixa da cor da tela sobrando, como um vídeo num monitor antigo).
  const escala = Math.min(telaL / largura, telaA / altura);
  const meioX = TELA.x + TELA.l / 2;
  const meioY = TELA.y + TELA.a / 2;
  return (
    <Fundo>
      <svg viewBox={`0 0 ${VIEWBOX.l} ${VIEWBOX.a}`} width={VIEWBOX.l * u} height={VIEWBOX.a * u} overflow="visible" style={{ position: "absolute", left: centro.x - meioX * u, top: centro.y - meioY * u }}>
        <CorpoMonitor />
      </svg>
      <div style={{ position: "absolute", left: centro.x - telaL / 2, top: centro.y - telaA / 2, width: telaL, height: telaA, borderRadius: TELA.rx * u, overflow: "hidden", background: "var(--cor-mascote-tela)" }}>
        <div style={{ position: "absolute", left: telaL / 2 - (largura * escala) / 2, top: telaA / 2 - (altura * escala) / 2, width: largura, height: altura, transform: `scale(${escala})`, transformOrigin: "0 0" }}>{children}</div>
        {porCima}
      </div>
    </Fundo>
  );
}
