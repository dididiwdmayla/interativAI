/*
 * "O chefão" (tema Fliperama, 1080 x 1920): um trailer de jogo de fliperama.
 * O bug é um chefão; a barra de vida dele só cai quando um teste de verdade
 * fica verde na gravação, e o golpe final é o conserto. Os tempos, os textos,
 * as tomadas e a câmera vêm do roteiro (src/curtos/roteiro.ts).
 *
 * O chefão é o defeito real de um chamado do jogo: a agenda do Salão Girassol
 * (Depuração, U6), que marca duas clientes no mesmo horário.
 *
 * O laço: o último quadro é o quadro 0 (o chefão inteiro, a barra cheia e o
 * letreiro "UM BUG APARECEU").
 */
import type { ReactNode } from "react";
import { AbsoluteFill, Freeze, Sequence, spring, useCurrentFrame } from "remotion";
import { FONTE_UI } from "../fontes";
import { mistura, rampa, sai, sorteio, vaiEVolta } from "../lib/tempo";
import { Icone } from "../composicoes/blocos/Titulo";
import { Balao } from "../pecas/Balao";
import { MascoteVideo } from "../pecas/MascoteVideo";
import { CartaoDaCliente, CartaoDeFase, Explosao, FundoArcade, Neon, Scanlines } from "./pecas/Arcade";
import { BarraDeVida, Dano } from "./pecas/BarraDeVida";
import { Chefao } from "./pecas/Chefao";
import { Faixa } from "./pecas/Faixa";
import type { ExpressaoCliente } from "./pecas/Personagem";
import { TomadaCurta } from "./pecas/TomadaCurta";
import { cortesDo, DURACAO, ENDERECO, FALAS_DOS_CURTOS, FPS, MOMENTOS_DO_CHEFAO as M, PLANOS_DO_CHEFAO, quadroDa, QUADROS, segundoDa, TEXTOS } from "./roteiro";
import { TrilhaCurta } from "./TrilhaCurta";
import { bocaDaVoz, vozDe } from "./voz";

const C = "chefao" as const;
const L = 1080;
const s = (batida: number): number => segundoDa(C, batida);
const T = TEXTOS.chefao;

/* ------------------------------------------------------------------ */
/* Onde cada coisa fica                                                */
/* ------------------------------------------------------------------ */

/** O chefão: grande no meio (o quadro 0) e pequeno no canto, ao lado da barra, durante a luta. */
const CHEFE = {
  grande: { cx: 540, cy: 838, tamanho: 770 },
  canto: { cx: 142, cy: 352, tamanho: 214 },
  nocaute: { cx: 540, cy: 760, tamanho: 520 },
} as const;
/** A barra de vida: no meio em cima (o quadro 0) e à direita do chefão durante a luta. */
const BARRA = { grande: { x: 150, y: 246, largura: 780 }, canto: { x: 250, y: 240, largura: 716 } } as const;
const FAIXA_DE_BAIXO = 1150;
const QUADRO_DO_NOCAUTE = quadroDa(C, M.nocaute);

/** O tranco da tela num golpe: forte e curto. `t`: segundos desde o golpe. */
function tranco(t: number, forca: number, semente: number): { x: number; y: number } {
  if (t < 0 || t > 0.34) return { x: 0, y: 0 };
  const sorte = sorteio(semente + Math.round(t * FPS));
  const resta = Math.exp(-t / 0.085) * forca;
  return { x: (sorte() - 0.5) * 2 * resta, y: (sorte() - 0.5) * 2 * resta };
}

/** O logo do jogo e o endereço, num cartão. */
function LogoEEndereco({ t }: { t: number }) {
  if (t < 0) return null;
  const entrada = spring({ frame: Math.round(t * FPS), fps: FPS, config: { damping: 13, stiffness: 200, mass: 0.7 } });
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "18px 36px 24px", borderRadius: 40, border: "8px solid var(--cor-secundaria)", background: "var(--cor-superficie)", boxShadow: "0 12px 0 var(--cor-primaria)", fontFamily: FONTE_UI, fontWeight: 900, lineHeight: 1.1, whiteSpace: "nowrap", opacity: Math.min(1, entrada * 2), transform: `translateY(${(1 - entrada) * 70}px) scale(${0.9 + 0.1 * entrada})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 66, letterSpacing: "-0.02em", color: "var(--cor-primaria)" }}>
        <Icone tamanho={72} />
        InterativAI
      </div>
      <div style={{ fontSize: 60, letterSpacing: "-0.02em", color: "var(--cor-texto)" }}>{ENDERECO}</div>
    </div>
  );
}

export const QUADROS_DO_CHEFAO = QUADROS.chefao;

/** `so`: só o som (para a revisão medir as partes em separado e para a mixagem final, que sai sem renderizar a imagem). */
type Props = { so?: "musica" | "voz" | "efeitos" | "tudo" };

export function CurtoChefao({ so }: Props) {
  const quadroReal = useCurrentFrame();
  if (so) return <TrilhaCurta curto={C} so={so === "tudo" ? undefined : so} silencio={{ de: QUADRO_DO_NOCAUTE, quadros: M.quadrosCongelados }} />;
  // O nocaute congela a imagem por 4 quadros (o som faz o silêncio junto).
  const congelado = quadroReal >= QUADRO_DO_NOCAUTE && quadroReal < QUADRO_DO_NOCAUTE + M.quadrosCongelados;
  return (
    <AbsoluteFill data-theme="fliperama" style={{ background: "var(--cor-fundo)" }}>
      <Freeze frame={QUADRO_DO_NOCAUTE} active={congelado}>
        <Imagem />
      </Freeze>
      <Clarao quadro={quadroReal} />
      <TrilhaCurta curto={C} silencio={{ de: QUADRO_DO_NOCAUTE, quadros: M.quadrosCongelados }} />
    </AbsoluteFill>
  );
}

/** O clarão do nocaute: suave, no token claro do tema, por cima do quadro congelado. */
function Clarao({ quadro }: { quadro: number }) {
  const n = quadro - QUADRO_DO_NOCAUTE;
  if (n < 0 || n > 9) return null;
  const forca = n < M.quadrosCongelados ? 0.3 + 0.4 * (n / (M.quadrosCongelados - 1)) : 0.7 * (1 - (n - M.quadrosCongelados + 1) / 6);
  return <AbsoluteFill style={{ background: "var(--cor-texto)", opacity: Math.max(0, forca) }} />;
}

function Imagem() {
  const quadro = useCurrentFrame();
  const t = quadro / FPS;
  const total = DURACAO.chefao;
  const cortes = cortesDo(C);
  const golpes = M.golpes.map(s);
  const testes = M.testes.map(s);
  const nocaute = s(M.nocaute);
  const volta = s(M.volta);
  const voltando = t >= volta;

  // Os trancos: a entrada, cada golpe e cada teste verde.
  const impactos = [{ t: 1 / FPS, forca: 34 }, ...golpes.map((quando) => ({ t: quando, forca: 26 })), ...testes.slice(0, 3).map((quando) => ({ t: quando, forca: 14 })), { t: nocaute + M.quadrosCongelados / FPS, forca: 40 }];
  const treme = impactos.reduce((soma, impacto, i) => { const d = tranco(t - impacto.t, impacto.forca, 500 + i * 37); return { x: soma.x + d.x, y: soma.y + d.y }; }, { x: 0, y: 0 });
  const ultimoImpacto = [...golpes, ...testes].filter((quando) => t >= quando).at(-1);
  const dano = ultimoImpacto === undefined ? 0 : 1 - rampa(t, ultimoImpacto, ultimoImpacto + 0.22, sai);
  // O soco de câmera de cada golpe: um zoom rápido que volta.
  const soco = 1 + 0.07 * golpes.reduce((maior, quando) => Math.max(maior, t >= quando ? 1 - rampa(t, quando, quando + 0.28, sai) : 0), 0);

  // O chefão: grande -> canto (batida 3) -> meio (nocaute) -> some; na volta do laço, cresce de um pixel.
  const explode = nocaute + 0.42;
  const paraOCanto = rampa(t, s(M.missao) - 0.12, s(M.missao) + 0.2, vaiEVolta);
  const paraOMeio = rampa(t, nocaute + 0.16, nocaute + 0.36, vaiEVolta);
  type Pose = { cx: number; cy: number; tamanho: number };
  const entre = (a: Pose, b: Pose, p: number): Pose => ({ cx: mistura(a.cx, b.cx, p), cy: mistura(a.cy, b.cy, p), tamanho: Math.exp(mistura(Math.log(a.tamanho), Math.log(b.tamanho), p)) });
  const PIXEL = { cx: 900, cy: 306, tamanho: 30 };
  const cresce = rampa(t, volta + 0.05, total - 1 / FPS, sai);
  const chefe = voltando ? entre(PIXEL, CHEFE.grande, cresce) : t < nocaute ? entre(CHEFE.grande, CHEFE.canto, paraOCanto) : entre(CHEFE.canto, CHEFE.nocaute, paraOMeio);
  const chefeVisivel = t < explode || (voltando && cresce > 0.12);
  const pixelVisivel = t > explode + 1.3 && (!voltando || cresce <= 0.12);
  const pixelPisca = t > s(M.pixel) ? Math.floor(t / 0.1) % 2 : Math.floor(t / 0.45) % 2;

  // A barra: junto com o chefão, até as próximas fases; volta inteira no fim.
  const barraVisivel = t < s(M.fases) || voltando;
  const barra = voltando ? BARRA.grande : { x: mistura(BARRA.grande.x, BARRA.canto.x, paraOCanto), y: mistura(BARRA.grande.y, BARRA.canto.y, paraOCanto), largura: mistura(BARRA.grande.largura, BARRA.canto.largura, paraOCanto) };
  const barraEntra = voltando && quadro < QUADROS.chefao - 2 ? spring({ frame: Math.round((t - volta - 0.1) * FPS), fps: FPS, config: { damping: 14, stiffness: 240, mass: 0.6 } }) : 1;
  const tempoDaBarra = voltando ? -1 : t;

  // A Dona Zélia: preocupada na missão, satisfeita no nocaute.
  const zeliaSatisfeita = nocaute + 1.2;
  const humorDaZelia: { expressao: ExpressaoCliente; anterior?: ExpressaoCliente; troca: number } = t >= zeliaSatisfeita ? { expressao: "satisfeito", anterior: "preocupado", troca: rampa(t, zeliaSatisfeita, zeliaSatisfeita + 0.2) } : { expressao: "preocupado", troca: 1 };

  // O combo: sobe a cada teste verde.
  const verdes = testes.filter((quando) => t >= quando).length;
  const ultimoVerde = testes.filter((quando) => t >= quando).at(-1);

  // A cena desenhada por trás: o fundo de fliperama no gancho, nas próximas fases e no final.
  const desenhado = t < s(M.missao) || t >= s(M.fases);
  const fases = PLANOS_DO_CHEFAO.find((plano) => plano.id === "fases")?.cortes ?? [];
  const finalEm = s(M.final);
  const fala = FALAS_DOS_CURTOS.jogador;
  const falaEm = s(M.fala);
  const saiNoFim = 1 - rampa(t, volta, volta + 0.18, sai);

  const gravacoes: ReactNode = cortes
    .filter((corte) => corte.de < M.fases)
    .map((corte) => (
      <Sequence key={`${corte.tomada}-${corte.de}`} from={quadroDa(C, corte.de)} durationInFrames={quadroDa(C, corte.ate) - quadroDa(C, corte.de)}>
        <TomadaCurta curto={C} corte={corte} tremor={treme} soco={soco} />
      </Sequence>
    ));

  return (
    <AbsoluteFill>
      {desenhado ? (
        <div style={{ position: "absolute", inset: -40, transform: `translate(${treme.x}px, ${treme.y}px)` }}>
          <FundoArcade />
        </div>
      ) : null}
      {gravacoes}
      {/* O nocaute escurece a gravação para a explosão aparecer. */}
      {t >= nocaute && t < s(M.fases) ? <AbsoluteFill style={{ background: "var(--cor-veu)", opacity: rampa(t, nocaute + 0.15, nocaute + 0.45) }} /> : null}
      {t >= nocaute && t < s(M.fases) ? <Scanlines opacidade={0.12 * rampa(t, nocaute + 0.15, nocaute + 0.45)} /> : null}

      {/* A missão: o cartão da cliente. No nocaute ela volta, satisfeita. */}
      {t >= s(M.missao) && t < s(8) + 0.1 ? (
        <div style={{ position: "absolute", left: 34, top: 506, opacity: 1 - rampa(t, s(8) - 0.12, s(8)), transform: `translate(${treme.x}px, ${treme.y}px)` }}>
          <CartaoDaCliente nome={T.cliente.nome} t={t - s(M.missao) - 0.1} quadro={quadro} expressao="preocupado" />
        </div>
      ) : null}
      {t >= zeliaSatisfeita - 0.35 && t < s(M.fases) ? (
        <div style={{ position: "absolute", left: 340, top: 520, opacity: 1 - rampa(t, s(M.fases) - 0.18, s(M.fases)) }}>
          <CartaoDaCliente nome={T.cliente.nome} t={t - (zeliaSatisfeita - 0.35)} quadro={quadro} expressao={humorDaZelia.expressao} anterior={humorDaZelia.anterior} troca={humorDaZelia.troca} />
        </div>
      ) : null}

      {/* As próximas fases: quatro cartões, um por batida. */}
      {t >= s(M.fases) && t < finalEm
        ? fases.map((corte, indice) => {
            const de = s(corte.de);
            if (t < de || t >= s(corte.ate)) return null;
            return (
              <div key={corte.tomada} style={{ position: "absolute", left: 170, top: 290 }}>
                <CartaoDeFase
                  rotulo={T.fases[indice]}
                  t={t - de}
                  largura={700}
                  altura={850}
                  sobe={[60, 150, 300, 150][indice]}
                  filho={
                    <Sequence from={quadroDa(C, corte.de)} durationInFrames={quadroDa(C, corte.ate) - quadroDa(C, corte.de)} layout="none">
                      <TomadaCurta curto={C} corte={corte} />
                    </Sequence>
                  }
                />
              </div>
            );
          })
        : null}

      {/* O final: o letreiro neon, o logo com o endereço e o computadorzinho perguntando. */}
      {t >= finalEm ? (
        <div style={{ position: "absolute", inset: 0, opacity: saiNoFim, transform: `scale(${0.94 + 0.06 * saiNoFim})` }}>
          <div style={{ position: "absolute", left: 0, width: L - 60, top: 300, display: "flex", justifyContent: "center" }}>
            <Neon linhas={T.final} t={t} quando={M.palavras.map(s)} letra={158} estilo={{ transform: "rotate(-2deg)" }} />
          </div>
          <div style={{ position: "absolute", left: 0, width: L - 60, top: 790, display: "flex", justifyContent: "center" }}>
            <LogoEEndereco t={t - s(M.endereco)} />
          </div>
          {t >= falaEm - 0.5 ? (
            <div style={{ position: "absolute", left: 56, top: 1120, opacity: rampa(t, falaEm - 0.5, falaEm - 0.3), transform: `translateY(${(1 - rampa(t, falaEm - 0.5, falaEm - 0.2, sai)) * 120}px)` }}>
              <MascoteVideo tamanho={350} expressao="curioso" quadro={quadro} boca={bocaDaVoz(fala.id, t - falaEm)} semente={9} />
            </div>
          ) : null}
          {t >= falaEm ? (
            <div style={{ position: "absolute", left: 424, top: 1214 }}>
              <Balao texto={fala.texto} t={t - falaEm} voz={vozDe(fala.id).duracao} duracao={8} letra={80} rabo="esquerda" />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* A entrada: o estouro atrás do chefão, logo depois do quadro 0 (o quadro 0 é limpo: é a capa e o fim do laço). */}
      {t > 0 && t < 0.4 ? (
        <svg viewBox="-540 -838 1080 1920" width={L} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - rampa(t, 0.12, 0.4, sai) }}>
          {Array.from({ length: 14 }, (_, i) => {
            const angulo = (i / 14) * Math.PI * 2 + 0.2;
            const de = 390 + 130 * rampa(t, 0, 0.3, sai);
            const ate = de + (i % 2 === 0 ? 190 : 110) * rampa(t, 0, 0.16, sai);
            return <line key={i} x1={Math.cos(angulo) * de} y1={Math.sin(angulo) * de} x2={Math.cos(angulo) * ate} y2={Math.sin(angulo) * ate} stroke={i % 2 === 0 ? "var(--cor-destaque)" : "var(--cor-secundaria)"} strokeWidth={16} strokeLinecap="round" />;
          })}
        </svg>
      ) : null}

      {/* O chefão e a barra de vida. */}
      {barraVisivel ? (
        <div style={{ position: "absolute", left: barra.x, top: barra.y, opacity: (t < s(M.fases) ? 1 - rampa(t, s(M.fases) - 0.15, s(M.fases)) : 1) * Math.min(1, barraEntra * 2), transform: `translate(${treme.x * 0.6}px, ${treme.y * 0.6}px) scale(${0.8 + 0.2 * barraEntra})` }}>
          <BarraDeVida nome={T.nome} largura={barra.largura} t={tempoDaBarra} golpes={golpes} testes={testes} escudo={T.escudo} />
          {golpes.map((quando) => (
            <Dano key={quando} texto="-1" t={t - quando} x={barra.largura - 110} y={-6} letra={80} />
          ))}
          {testes.map((quando, i) => (
            <Dano key={quando} texto={`-${Math.round(100 / testes.length)}`} t={voltando ? -1 : t - quando} x={barra.largura * (1 - (i + 0.5) / testes.length)} y={300} letra={84} />
          ))}
        </div>
      ) : null}
      {chefeVisivel ? (
        <div style={{ position: "absolute", left: chefe.cx - chefe.tamanho / 2 + treme.x, top: chefe.cy - (chefe.tamanho * 200) / 220 / 2 + treme.y, filter: "drop-shadow(0 12px 0 var(--cor-veu))" }}>
          <Chefao tamanho={chefe.tamanho} quadro={quadro} laco={total} dano={voltando ? 0 : dano} aperto={voltando ? 0 : dano} glitch={voltando ? 1 + 2 * (1 - cresce) : t > nocaute ? 2.4 : 1} />
        </div>
      ) : null}
      <Explosao t={t - explode} x={CHEFE.nocaute.cx} y={CHEFE.nocaute.cy} tamanho={CHEFE.nocaute.tamanho} />
      {pixelVisivel ? (
        <div style={{ position: "absolute", left: PIXEL.cx - 15, top: PIXEL.cy - 15, width: 30, height: 30, opacity: pixelPisca ? 1 : 0.25 }}>
          <div style={{ position: "absolute", inset: 0, transform: "translate(-5px, 3px)", background: "var(--cor-secundaria)" }} />
          <div style={{ position: "absolute", inset: 0, background: "var(--cor-primaria)" }} />
        </div>
      ) : null}

      {/* O combo: aparece no segundo teste verde e sobe até o nocaute. */}
      {verdes >= 2 && ultimoVerde !== undefined && t < nocaute + 1.1 ? (
        <div style={{ position: "absolute", right: L - 960, top: 496 }}>
          <div style={{ padding: "6px 26px 10px", borderRadius: 22, border: "7px solid var(--cor-fundo)", background: "var(--cor-destaque)", color: "var(--cor-texto-sobre-destaque)", fontFamily: FONTE_UI, fontSize: 74, fontWeight: 900, lineHeight: 1, whiteSpace: "nowrap", boxShadow: "0 8px 0 var(--cor-primaria)", opacity: 1 - rampa(t, nocaute + 0.9, nocaute + 1.1), transform: `rotate(4deg) scale(${1 + 0.35 * (1 - spring({ frame: Math.round((t - ultimoVerde) * FPS), fps: FPS, config: { damping: 9, stiffness: 300, mass: 0.5 } }))})`, transformOrigin: "80% 50%" }}>
            {T.combo} x{verdes}
          </div>
        </div>
      ) : null}

      {/* Os letreiros. O do gancho já está inteiro no quadro 0 (é a capa) e volta, palavra por palavra, no fim. */}
      {t < s(M.missao) + 0.3 ? (
        <div style={{ position: "absolute", left: 0, width: L - 60, top: FAIXA_DE_BAIXO + 6, display: "flex", justifyContent: "center", transform: `translate(${treme.x}px, ${treme.y}px)` }}>
          <Faixa linhas={T.gancho} t={t} ate={s(M.missao) - 0.12} letra={138} visual="fliperama" destaque={[1]} giro={-3} alinhar="centro" pronta />
        </div>
      ) : null}
      {voltando ? (
        <div style={{ position: "absolute", left: 0, width: L - 60, top: FAIXA_DE_BAIXO + 6, display: "flex", justifyContent: "center" }}>
          <Faixa linhas={T.gancho} t={t - volta - 0.12} letra={138} visual="fliperama" destaque={[1]} giro={-3} alinhar="centro" passo={0.07} pronta={quadro >= QUADROS.chefao - 2} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 30, top: FAIXA_DE_BAIXO }}>
        <Faixa linhas={T.missao.linhas} rotulo={T.missao.rotulo} t={t - s(M.missao) - 0.15} ate={s(8) - s(M.missao) - 0.27} letra={112} visual="fliperama" giro={-2} />
      </div>
      {T.golpes.map((palavra, indice) => {
        const de = golpes[indice];
        const ate = indice + 1 < golpes.length ? golpes[indice + 1] : s(17);
        return (
          <div key={palavra} style={{ position: "absolute", left: 0, width: L - 60, top: FAIXA_DE_BAIXO + 60, display: "flex", justifyContent: "center" }}>
            <Faixa linhas={[palavra]} t={t - de} ate={ate - de - 0.1} letra={150} visual="fliperama" giro={indice % 2 === 0 ? -5 : 4} alinhar="centro" />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, width: L - 60, top: FAIXA_DE_BAIXO - 30, display: "flex", justifyContent: "center" }}>
        <Faixa linhas={T.derrotado} t={t - s(M.derrotado)} ate={s(M.fases) - s(M.derrotado) - 0.1} letra={128} visual="fliperama" destaque={[1]} giro={-3} alinhar="centro" passo={0.14} />
      </div>
      <div style={{ position: "absolute", left: 0, width: L - 60, top: FAIXA_DE_BAIXO + 50, display: "flex", justifyContent: "center" }}>
        <Faixa linhas={T.numero} t={t - s(M.fases) - 0.05} ate={finalEm - s(M.fases) - 0.15} letra={124} visual="fliperama" destaque={[0]} giro={-2} alinhar="centro" />
      </div>
    </AbsoluteFill>
  );
}
