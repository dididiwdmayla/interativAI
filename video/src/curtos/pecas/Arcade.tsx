/*
 * As peças de fliperama de "O chefão": o fundo com scanlines, o cartão da
 * cliente (estilo seleção de lutador), a explosão do chefão em pixels que
 * viram estrelas, o cartão do seletor de fases e o letreiro neon.
 * Tudo pelo quadro e só com os tokens do tema Fliperama.
 */
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, spring } from "remotion";
import { IconeEstrela } from "@jogo/componentes/icones/IconeEstrela";
import { CLIENTES } from "@jogo/motor/contrato/clientes";
import { FONTE_UI } from "../../fontes";
import { FPS } from "../../roteiro";
import { rampa, sai, sorteio } from "../../lib/tempo";
import { Personagem, type ExpressaoCliente } from "./Personagem";

/** As scanlines: riscos finos e fracos, desenhados (um degradê repetido, parado). */
export function Scanlines({ opacidade = 0.16 }: { opacidade?: number }) {
  return <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(to bottom, var(--cor-borda) 0px, var(--cor-borda) 2px, transparent 2px, transparent 7px)", opacity: opacidade, pointerEvents: "none" }} />;
}

/** O fundo das cenas desenhadas: o escuro do Fliperama, duas manchas e as scanlines. */
export function FundoArcade({ children }: { children?: ReactNode }) {
  return (
    <AbsoluteFill style={{ background: "var(--cor-fundo)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "-20%", top: "12%", width: "90%", aspectRatio: "1", borderRadius: "50%", background: "var(--cor-fundo-padrao)", opacity: 0.8 }} />
      <div style={{ position: "absolute", right: "-30%", bottom: "-6%", width: "86%", aspectRatio: "1", borderRadius: "50%", background: "var(--cor-selecao)", opacity: 0.45 }} />
      <Scanlines />
      {children}
    </AbsoluteFill>
  );
}

/** A Dona Zélia (a aparência dela no jogo), num cartão de cliente. */
export function CartaoDaCliente({ nome, t, quadro, expressao, anterior, troca, largura = 400 }: { nome: string; t: number; quadro: number; expressao: ExpressaoCliente; anterior?: ExpressaoCliente; troca?: number; largura?: number }) {
  if (t < 0) return null;
  const entrada = spring({ frame: Math.round(t * FPS), fps: FPS, config: { damping: 12, stiffness: 210, mass: 0.7 } });
  return (
    <div style={{ width: largura, boxSizing: "border-box", borderRadius: 36, border: "8px solid var(--cor-secundaria)", background: "var(--cor-painel)", boxShadow: "0 12px 0 var(--cor-primaria)", overflow: "hidden", transform: `translateX(${(1 - entrada) * -260}px) rotate(${-3 * entrada}deg)`, opacity: Math.min(1, entrada * 2) }}>
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 22, background: "var(--cor-selecao)" }}>
        <Personagem aparencia={CLIENTES["dona-zelia"].aparencia} tamanho={largura * 0.74} quadro={quadro} expressao={expressao} anterior={anterior} troca={troca} semente={23} />
      </div>
      <div style={{ padding: "10px 12px 16px", background: "var(--cor-primaria)", color: "var(--cor-texto-sobre-primaria)", fontFamily: FONTE_UI, fontSize: 60, fontWeight: 900, lineHeight: 1, letterSpacing: "0.01em", textAlign: "center", whiteSpace: "nowrap" }}>{nome}</div>
    </div>
  );
}

const CORES_DOS_PIXELS = ["var(--cor-primaria)", "var(--cor-secundaria)", "var(--cor-destaque)", "var(--cor-painel)", "var(--cor-erro)", "var(--cor-borda)"];

type Pixel = { x: number; y: number; cor: string; vx: number; vy: number; giro: number; vira: number; sobe: number };
const PIXELS: Pixel[] = (() => {
  const sorte = sorteio(77);
  const lista: Pixel[] = [];
  const colunas = 13;
  const linhas = 12;
  for (let l = 0; l < linhas; l++) {
    for (let c = 0; c < colunas; c++) {
      // Só os quadradinhos de dentro do contorno do besouro (um oval, com a cabeça em cima).
      const nx = (c + 0.5) / colunas - 0.5;
      const ny = (l + 0.5) / linhas - 0.5;
      if ((nx / 0.46) ** 2 + ((ny - 0.08) / 0.44) ** 2 > 1 && !(Math.abs(nx) < 0.2 && ny < -0.2)) continue;
      const angulo = Math.atan2(ny, nx) + (sorte() - 0.5) * 0.9;
      const forca = 380 + sorte() * 760;
      lista.push({ x: nx, y: ny, cor: CORES_DOS_PIXELS[Math.floor(sorte() * CORES_DOS_PIXELS.length)], vx: Math.cos(angulo) * forca, vy: Math.sin(angulo) * forca - 200, giro: (sorte() - 0.5) * 900, vira: 0.3 + sorte() * 0.35, sobe: 520 + sorte() * 520 });
    }
  }
  return lista;
})();

/** O chefão explode em pixels; os pixels viram estrelas do jogo e sobem. `t`: segundos desde a explosão. */
export function Explosao({ t, x, y, tamanho }: { t: number; x: number; y: number; tamanho: number }) {
  if (t < 0 || t > 2.1) return null;
  const lado = tamanho / 13;
  return (
    <>
      {PIXELS.map((pixel, i) => {
        // Sai com força, freia, e depois sobe como estrela.
        const freio = 1 - Math.exp(-t * 4.2);
        const subindo = Math.max(0, t - pixel.vira);
        const px = x + pixel.x * tamanho + (pixel.vx * freio) / 4.2 + Math.sin(subindo * 5 + i) * 18 * Math.min(1, subindo * 2);
        const py = y + pixel.y * tamanho + (pixel.vy * freio) / 4.2 - pixel.sobe * subindo * subindo * 1.6 - 60 * subindo;
        const estrela = rampa(t, pixel.vira, pixel.vira + 0.16);
        const some = 1 - rampa(t, 1.2 + (i % 5) * 0.12, 1.75 + (i % 5) * 0.07, sai);
        if (some <= 0 || py < -120) return null;
        const medida = lado * (1 + 0.9 * estrela);
        return (
          <div key={i} style={{ position: "absolute", left: px - medida / 2, top: py - medida / 2, width: medida, height: medida, opacity: some, transform: `rotate(${pixel.giro * Math.min(t, pixel.vira + 0.2)}deg)` }}>
            {estrela < 1 ? <div style={{ position: "absolute", inset: 0, background: pixel.cor, opacity: 1 - estrela }} /> : null}
            {estrela > 0 ? (
              <div style={{ position: "absolute", inset: 0, opacity: estrela }}>
                <IconeEstrela tamanho={medida} cheia />
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

/** Um cartão do seletor de fases: a gravação recortada, com a etiqueta do mundo. `filho` é a tomada em tela cheia (1080 x 1920). */
export function CartaoDeFase({ rotulo, t, largura, altura, sobe = 0, filho }: { rotulo: string; t: number; largura: number; altura: number; sobe?: number; filho: ReactNode }) {
  const entrada = spring({ frame: Math.round(t * FPS), fps: FPS, config: { damping: 15, stiffness: 520, mass: 0.4 } });
  const escala = largura / 1080;
  return (
    <div style={{ position: "relative", width: largura, height: altura, transform: `translateX(${(1 - entrada) * 300}px) rotate(${(1 - entrada) * 4}deg)`, opacity: Math.min(1, 0.4 + entrada) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 44, border: "10px solid var(--cor-secundaria)", boxShadow: "0 0 46px var(--cor-secundaria), 0 14px 0 var(--cor-primaria)", overflow: "hidden", background: "var(--cor-fundo)" }}>
        <div style={{ position: "absolute", left: 0, top: -sobe, width: 1080, height: 1920, transformOrigin: "0 0", transform: `scale(${escala})` }}>{filho}</div>
      </div>
      <div style={{ position: "absolute", left: 26, top: -34, padding: "6px 26px 10px", borderRadius: 999, border: "7px solid var(--cor-fundo)", background: "var(--cor-destaque)", color: "var(--cor-texto-sobre-destaque)", fontFamily: FONTE_UI, fontSize: 62, fontWeight: 900, lineHeight: 1, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{rotulo}</div>
    </div>
  );
}

/** O brilho de uma palavra do neon no instante `t` (s desde que ela liga): pisca como uma lâmpada pegando. */
function acesa(t: number): number {
  if (t < 0) return 0;
  const quadro = Math.round(t * FPS);
  const piscadas = [1, 0.2, 1, 1, 0.35, 1, 1, 0.7];
  return quadro < piscadas.length ? piscadas[quadro] : 1;
}

/** O letreiro neon, palavra por palavra. `quando`: o instante (s) em que cada linha liga; `pronto`: já aceso (0 a 1 apaga na saída). */
export function Neon({ linhas, t, quando, letra = 164, estilo }: { linhas: readonly string[]; t: number; quando: number[]; letra?: number; estilo?: CSSProperties }) {
  const zumbido = 0.94 + 0.06 * Math.sin(t * Math.PI * 2 * 7.5);
  return (
    <div style={{ display: "inline-block", padding: `${letra * 0.22}px ${letra * 0.42}px ${letra * 0.3}px`, borderRadius: letra * 0.34, border: `${Math.round(letra * 0.07)}px solid var(--cor-primaria)`, background: "var(--cor-superficie)", boxShadow: `0 0 ${letra * 0.5}px var(--cor-primaria), inset 0 0 ${letra * 0.3}px var(--cor-selecao)`, fontFamily: FONTE_UI, fontSize: letra, fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.01em", whiteSpace: "nowrap", ...estilo }}>
      {linhas.map((linha, i) => {
        const luz = acesa(t - quando[i]) * zumbido;
        const cor = i === linhas.length - 1 ? "var(--cor-secundaria)" : "var(--cor-destaque)";
        return (
          <div key={linha} style={{ position: "relative" }}>
            <div style={{ color: "var(--cor-borda)" }}>{linha}</div>
            <div style={{ position: "absolute", inset: 0, color: cor, opacity: luz, textShadow: `0 0 ${letra * 0.1}px ${cor}, 0 0 ${letra * 0.3}px ${cor}` }}>{linha}</div>
          </div>
        );
      })}
    </div>
  );
}
