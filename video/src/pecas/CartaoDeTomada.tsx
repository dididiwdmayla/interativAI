/*
 * No 9:16, um trecho de uma tomada de computador aparece enquadrado num
 * cartão (o vídeo vertical não é o 16:9 recortado: é uma edição própria).
 * O cartão mostra só a área `recorte` da página gravada.
 */
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { FPS, type Corte } from "../roteiro";
import { elastico, rampa, vaiEVolta } from "../lib/tempo";
import { escalaDa, instante, marca, takeDe } from "../lib/tomadas";
import { Fundo } from "./Fundo";
import { Cursor } from "./Cursor";
import { PalavraNoRitmo } from "./PalavrasNoRitmo";

type Props = { corte: Corte; largura: number; altura: number; indice?: number };

export function CartaoDeTomada({ corte, largura, altura, indice = 0 }: Props) {
  const quadro = useCurrentFrame();
  const t = quadro / FPS;
  const take = takeDe(corte.tomada);
  const recorte = corte.recorte ?? { x: 0, y: 0, l: take.pagina.largura, a: take.pagina.altura };
  const k = escalaDa(take);
  const velocidade = corte.velocidade ?? 1;
  const de = instante(take, corte.de);
  // Área segura do 9:16: 220 px em cima, 380 embaixo, 120 à direita.
  const margem = 44;
  const cartaoL = largura - 120 - margem * 2 + 60;
  const escala = cartaoL / (recorte.l * k);
  const cartaoA = Math.min(recorte.a * k * escala, altura - 220 - 380 - 400);
  const topo = 220 + (altura - 220 - 380 - cartaoA) * 0.36;
  const entrada = rampa(t, 0, 0.32, elastico);
  const virada = corte.viraNoite ? rampa(t, corte.viraNoite.em, corte.viraNoite.em + corte.viraNoite.dura, vaiEVolta) : 0;
  const inclinacao = 150;
  const x = -inclinacao - 30 + (cartaoL + inclinacao * 2 + 60) * virada;
  const deDaNoite = corte.viraNoite ? de - marca(take, "rolar") + marca(takeDe("T03-mundo-noite"), "rolar") : 0;
  return (
    <Fundo>
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: margem,
            top: topo,
            width: cartaoL,
            height: cartaoA,
            borderRadius: 40,
            overflow: "hidden",
            border: "7px solid var(--cor-borda)",
            boxShadow: "0 16px 0 var(--cor-sombra)",
            background: "var(--cor-superficie)",
            transform: `scale(${0.86 + 0.14 * entrada}) rotate(${(1 - entrada) * (indice % 2 === 0 ? -2 : 2)}deg)`,
            opacity: Math.min(1, entrada * 1.6),
          }}
        >
          <div style={{ position: "absolute", left: -recorte.x * k * escala, top: -recorte.y * k * escala, width: take.saida.largura, height: take.saida.altura, transform: `scale(${escala})`, transformOrigin: "0 0" }}>
            <OffthreadVideo src={staticFile(`takes/${corte.tomada}.mp4`)} startFrom={Math.round(de * FPS)} playbackRate={velocidade} muted style={{ position: "absolute", left: 0, top: 0, width: take.saida.largura, height: take.saida.altura }} />
            {corte.cursor === false ? null : <Cursor take={take} tempo={de + t * velocidade} velocidade={velocidade} escala={k} zoom={escala} />}
          </div>
          {/* O dia vira noite: a mesma tomada de noite (T03), no mesmo ponto do caminho, entra por uma linha diagonal. */}
          {virada > 0 ? (
            <div style={{ position: "absolute", inset: 0, clipPath: `polygon(0px 0px, ${x + inclinacao}px 0px, ${x - inclinacao}px ${cartaoA}px, 0px ${cartaoA}px)` }}>
              <div style={{ position: "absolute", left: -recorte.x * k * escala, top: -recorte.y * k * escala, width: take.saida.largura, height: take.saida.altura, transform: `scale(${escala})`, transformOrigin: "0 0" }}>
                <OffthreadVideo src={staticFile("takes/T03-mundo-noite.mp4")} startFrom={Math.round(deDaNoite * FPS)} playbackRate={velocidade} muted style={{ position: "absolute", left: 0, top: 0, width: take.saida.largura, height: take.saida.altura }} />
              </div>
            </div>
          ) : null}
          {virada > 0 && virada < 1 ? (
            <svg width={cartaoL} height={cartaoA} style={{ position: "absolute", left: 0, top: 0 }}>
              <line x1={x + inclinacao} y1={-20} x2={x - inclinacao} y2={cartaoA + 20} stroke="var(--cor-farol-luz)" strokeWidth={20} opacity={0.35} />
              <line x1={x + inclinacao} y1={-20} x2={x - inclinacao} y2={cartaoA + 20} stroke="var(--cor-estrela)" strokeWidth={6} />
            </svg>
          ) : null}
        </div>
        {corte.palavra ? (
          // A palavra vai como um adesivo no canto de baixo do cartão (em cima fica a pílula da lista).
          <div style={{ position: "absolute", left: margem, width: cartaoL - 24, top: topo + cartaoA - 78, display: "flex", justifyContent: "flex-end" }}>
            <PalavraNoRitmo palavra={corte.palavra} t={t - 0.1} duracao={corte.duracao - 0.1} letra={104} indice={indice} />
          </div>
        ) : null}
      </AbsoluteFill>
    </Fundo>
  );
}
