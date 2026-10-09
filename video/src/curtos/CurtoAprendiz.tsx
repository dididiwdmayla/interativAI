/*
 * "O aprendiz" (tema Doce, 1080 x 1920): a gente acompanha um aprendiz
 * aprendendo a programar como quem joga uma partida, com ele mesmo reagindo
 * numa câmera de streamer no canto. Os tempos, os textos, as tomadas e a
 * câmera vêm do roteiro (src/curtos/roteiro.ts); aqui é só o desenho.
 *
 * O laço: o último quadro é o quadro 0 (o aprendiz em close, preocupado, na
 * frente do muro de código, com a faixa do gancho).
 */
import { AbsoluteFill, Freeze, Sequence, spring, useCurrentFrame } from "remotion";
import { FONTE_UI } from "../fontes";
import { elastico, mistura, rampa, sai, vaiEVolta } from "../lib/tempo";
import { Icone } from "../composicoes/blocos/Titulo";
import { Balao } from "../pecas/Balao";
import { Fundo } from "../pecas/Fundo";
import { MascoteVideo, RostoNaTela } from "../pecas/MascoteVideo";
import { centroInicial, MergulhoNaTela, unidadeInicial } from "../pecas/MergulhoNaTela";
import { Carimbo } from "./pecas/Carimbo";
import { Faixa } from "./pecas/Faixa";
import { MuroDeCodigo, QUEDA } from "./pecas/MuroDeCodigo";
import { Personagem, PremioNoAr, type ExpressaoCliente } from "./pecas/Personagem";
import { EstrelasVoando, Placar, VOO_DA_ESTRELA } from "./pecas/Placar";
import { TomadaCurta } from "./pecas/TomadaCurta";
import { APARENCIA_DO_APRENDIZ, cortesDo, DURACAO, ENDERECO, FALAS_DOS_CURTOS, FPS, MOMENTOS_DO_APRENDIZ as M, quadroDa, QUADROS, segundoDa, TEXTOS } from "./roteiro";
import { TrilhaCurta } from "./TrilhaCurta";
import { bocaDaVoz, vozDe } from "./voz";

const C = "aprendiz" as const;
const L = 1080;
const A = 1920;
const s = (batida: number): number => segundoDa(C, batida);
const T = TEXTOS.aprendiz;

/* ------------------------------------------------------------------ */
/* Onde cada coisa fica                                                */
/* ------------------------------------------------------------------ */

/** A câmera de streamer: um quadro arredondado logo abaixo da área segura de cima. */
const CAMERA = { x: 40, y: 240, lado: 380 };
/** As três poses do aprendiz: em close (o quadro 0 e o final), de lado (olhando o computadorzinho) e dentro da câmera. */
const POSES = {
  close: { cx: 440, cy: 642, tamanho: 720 },
  lado: { cx: 205, cy: 1352, tamanho: 300 },
  camera: { cx: CAMERA.x + CAMERA.lado / 2, cy: CAMERA.y + CAMERA.lado / 2 + 26, tamanho: 330 },
} as const;
const PLACAR = { direita: 960, y: 250 };
/** De onde as estrelas saem (o meio da faixa de ação) e onde entram (a estrela da pílula). */
const ESTRELAS = { de: { x: 540, y: 860 }, ate: { x: 800, y: 300 } };
const FAIXA_DAS_FASES = { x: 34, y: 1146 };

/* ------------------------------------------------------------------ */
/* O aprendiz ao longo do vídeo                                        */
/* ------------------------------------------------------------------ */

type Humor = { em: number; expressao: ExpressaoCliente };
/** As expressões dele, em batidas. As das fases seguem os acontecimentos reais das tomadas (as marcas do take.json). */
const HUMORES: Humor[] = [
  { em: 0, expressao: "preocupado" },
  { em: M.racha + 0.25, expressao: "empolgado" },
  { em: 3.3, expressao: "feliz" },
  { em: 5, expressao: "pensativo" },
  { em: M.vitorias[0], expressao: "empolgado" },
  { em: 9, expressao: "feliz" },
  { em: M.vitorias[1], expressao: "empolgado" },
  { em: 13, expressao: "feliz" },
  { em: M.vitorias[2], expressao: "empolgado" },
  { em: 17, expressao: "feliz" },
  { em: M.pausa, expressao: "pensativo" },
  { em: M.vitorias[3], expressao: "satisfeito" },
  { em: 21, expressao: "empolgado" },
  { em: M.final, expressao: "satisfeito" },
];
const TROCA = 0.2;

function humorEm(t: number): { expressao: ExpressaoCliente; anterior?: ExpressaoCliente; troca: number } {
  // Na volta do laço, o rosto do quadro 0 (preocupado) já chega pronto no último quadro.
  const volta = s(M.volta) + 0.12;
  if (t >= volta) return { expressao: "preocupado", anterior: "satisfeito", troca: rampa(t, volta, volta + TROCA) };
  let atual = HUMORES[0];
  let anterior: Humor | undefined;
  for (const humor of HUMORES) {
    if (t < s(humor.em)) break;
    anterior = atual;
    atual = humor;
  }
  const troca = rampa(t, s(atual.em), s(atual.em) + TROCA);
  return { expressao: atual.expressao, anterior: troca < 1 && anterior && anterior !== atual ? anterior.expressao : undefined, troca };
}

/** A posição e o tamanho dele: close -> de lado -> na câmera -> close. */
function poseEm(t: number): { cx: number; cy: number; tamanho: number; moldura: number } {
  const entre = (a: (typeof POSES)[keyof typeof POSES], b: (typeof POSES)[keyof typeof POSES], p: number) => ({ cx: mistura(a.cx, b.cx, p), cy: mistura(a.cy, b.cy, p), tamanho: Math.exp(mistura(Math.log(a.tamanho), Math.log(b.tamanho), p)) });
  if (t < s(M.mergulho)) return { ...entre(POSES.close, POSES.lado, rampa(t, s(M.racha) + 0.12, s(M.caiu) + 0.1, vaiEVolta)), moldura: 0 };
  if (t < s(M.final)) {
    const p = rampa(t, s(M.mergulho), s(5), vaiEVolta);
    return { ...entre(POSES.lado, POSES.camera, p), moldura: rampa(t, s(M.mergulho) + 0.1, s(5)) };
  }
  const p = rampa(t, s(M.final), s(M.final) + 0.4, vaiEVolta);
  return { ...entre(POSES.camera, POSES.close, p), moldura: 1 - rampa(t, s(M.final), s(M.final) + 0.16) };
}

/** Cada prêmio (o boné depois da fase 1, os óculos depois da fase 3): quando sai voando e quando chega. */
const PREMIOS = [
  { item: "bone" as const, sai: M.vitorias[0] + 0.9, chega: M.vitorias[0] + 1.6 },
  { item: "oculos" as const, sai: M.vitorias[2] + 0.9, chega: M.vitorias[2] + 1.6 },
];

/** Os instantes em que cada estrela entra na pílula (três por fase). */
const CHEGADAS: number[][] = M.vitorias.map((vitoria) => [0, 1, 2].map((estrela) => s(vitoria + 0.75 + estrela * 0.3)));
const TODAS_AS_CHEGADAS = CHEGADAS.flat();

/* ------------------------------------------------------------------ */
/* Peças pequenas, só deste vídeo                                      */
/* ------------------------------------------------------------------ */

/** A moldura da câmera de streamer, com a etiqueta "AO VIVO". `p`: quanto dela já apareceu. */
function MolduraDaCamera({ p, quadro }: { p: number; quadro: number }) {
  if (p <= 0) return null;
  const pisca = 0.55 + 0.45 * Math.cos((quadro / FPS) * Math.PI * 2 * 1.1);
  return (
    <>
      <div style={{ position: "absolute", left: CAMERA.x, top: CAMERA.y, width: CAMERA.lado, height: CAMERA.lado, boxSizing: "border-box", borderRadius: 64, border: "12px solid var(--cor-primaria)", boxShadow: "0 12px 0 var(--cor-mascote-moldura-sombra)", opacity: p, transform: `scale(${0.9 + 0.1 * p})` }} />
      <div
        style={{
          position: "absolute",
          left: CAMERA.x + 26,
          top: CAMERA.y + CAMERA.lado - 34,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "8px 24px 10px 20px",
          borderRadius: 999,
          border: "7px solid var(--cor-texto)",
          background: "var(--cor-superficie)",
          fontFamily: FONTE_UI,
          fontSize: 60,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "0.02em",
          color: "var(--cor-texto)",
          whiteSpace: "nowrap",
          opacity: rampa(p, 0.5, 1),
          transform: `scale(${0.8 + 0.2 * p})`,
          transformOrigin: "20% 50%",
        }}
      >
        <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--cor-alerta)", boxShadow: "0 0 0 6px var(--cor-selecao)", opacity: pisca }} />
        {T.aoVivo}
      </div>
    </>
  );
}

/** O botão JOGAR, no visual dos botões primários do jogo, e o dedo que toca nele. */
function BotaoJogar({ t }: { t: number }) {
  const de = s(M.botao);
  const toque = s(M.toque);
  if (t < de || t > s(5)) return null;
  const entrada = spring({ frame: Math.round((t - de) * FPS), fps: FPS, config: { damping: 11, stiffness: 220, mass: 0.6 } });
  const aperto = rampa(t, toque - 0.04, toque + 0.05) * (1 - rampa(t, toque + 0.08, toque + 0.2));
  const some = 1 - rampa(t, s(M.mergulho) + 0.05, s(M.mergulho) + 0.22, sai);
  const dedo = rampa(t, toque - 0.22, toque - 0.04, sai) * (1 - rampa(t, toque + 0.1, toque + 0.28, sai));
  const anel = rampa(t, toque, toque + 0.35, sai);
  return (
    <div style={{ position: "absolute", left: 404, top: 1296, opacity: some, transform: `scale(${entrada * (0.9 + 0.1 * some)})`, transformOrigin: "50% 50%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "30px 62px 34px 50px",
          borderRadius: 999,
          border: "8px solid var(--cor-texto)",
          background: "var(--cor-primaria)",
          boxShadow: `0 ${16 - 12 * aperto}px 0 var(--cor-texto)`,
          transform: `translateY(${12 * aperto}px)`,
          fontFamily: FONTE_UI,
          fontSize: 104,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "0.03em",
          color: "var(--cor-texto-sobre-primaria)",
          whiteSpace: "nowrap",
        }}
      >
        <svg viewBox="0 0 24 24" width={84} height={84} style={{ display: "block" }}>
          <path d="M7 4.5 L20 12 L7 19.5 Z" fill="var(--cor-texto-sobre-primaria)" stroke="var(--cor-texto-sobre-primaria)" strokeWidth={2.4} strokeLinejoin="round" />
        </svg>
        {T.jogar}
      </div>
      {anel > 0 && anel < 1 ? <div style={{ position: "absolute", left: 270 - 60 - 110 * anel, top: 86 - 60 - 110 * anel, width: 120 + 220 * anel, height: 120 + 220 * anel, boxSizing: "border-box", borderRadius: "50%", border: `${10 * (1 - anel * 0.6)}px solid var(--cor-secundaria)`, opacity: 1 - anel }} /> : null}
      {dedo > 0.01 ? (
        <div style={{ position: "absolute", left: 270 - 52, top: 86 - 52, width: 104, height: 104, opacity: dedo, transform: `scale(${1.25 - 0.25 * dedo})` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--cor-secundaria)", opacity: 0.4 }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "7px solid var(--cor-superficie)", boxShadow: "0 0 0 5px var(--cor-secundaria)" }} />
        </div>
      ) : null}
    </div>
  );
}

/** O logo do jogo (o ícone e o nome, como na apresentação) e o endereço, num cartão. */
function LogoEEndereco({ t }: { t: number }) {
  if (t < 0) return null;
  const entrada = spring({ frame: Math.round(t * FPS), fps: FPS, config: { damping: 13, stiffness: 200, mass: 0.7 } });
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 4, padding: "18px 34px 22px", borderRadius: 40, border: "8px solid var(--cor-texto)", background: "var(--cor-superficie)", boxShadow: "0 12px 0 var(--cor-texto)", fontFamily: FONTE_UI, fontWeight: 900, lineHeight: 1.1, whiteSpace: "nowrap", opacity: Math.min(1, entrada * 2), transform: `translateY(${(1 - entrada) * 60}px) scale(${0.9 + 0.1 * entrada})`, transformOrigin: "20% 50%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 64, letterSpacing: "-0.02em", color: "var(--cor-primaria)" }}>
        <Icone tamanho={70} />
        InterativAI
      </div>
      <div style={{ fontSize: 60, letterSpacing: "-0.02em", color: "var(--cor-texto)" }}>{ENDERECO}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* A composição                                                        */
/* ------------------------------------------------------------------ */

export const QUADROS_DO_APRENDIZ = QUADROS.aprendiz;

/** `so`: só o som (para a revisão medir as partes em separado e para a mixagem final, que sai sem renderizar a imagem). */
type Props = { so?: "musica" | "voz" | "efeitos" | "tudo" };

export function CurtoAprendiz({ so }: Props) {
  const quadro = useCurrentFrame();
  if (so) return <TrilhaCurta curto={C} so={so === "tudo" ? undefined : so} />;
  const t = quadro / FPS;
  const total = DURACAO.aprendiz;
  const cortes = cortesDo(C);
  const pose = poseEm(t);
  const humor = humorEm(t);
  const voltando = t >= s(M.volta);

  // O muro: inteiro no começo, racha na batida 2, cai; no fim, o mesmo movimento ao contrário.
  const quebra = s(M.racha);
  const muroNoComeco = t < quebra + QUEDA + 0.25;
  const muroNoFim = t > total - QUEDA - 0.22;
  const muro = muroNoComeco ? <MuroDeCodigo rola={t} rachado={Math.max(0.22 * rampa(t, s(M.trinco), s(M.trinco) + 0.07), rampa(t, quebra - 0.14, quebra))} quebrado={t - quebra} /> : muroNoFim ? <MuroDeCodigo rola={t - total} quebrado={total - t} contorno={rampa(total - t, 0.08, 0.3)} inteiro={1 - rampa(total - t, 0.03, 0.16)} /> : null;

  // O computadorzinho atrás do muro, do tamanho exato do começo do mergulho.
  const u = unidadeInicial(L, A);
  const centro = centroInicial(L, A);
  const fala = FALAS_DOS_CURTOS.start;
  const falaEm = s(3.08);
  const voz = vozDe(fala.id);
  const mergulho = spring({ frame: quadro - quadroDa(C, M.mergulho), fps: FPS, durationInFrames: quadroDa(C, 5) - quadroDa(C, M.mergulho), config: { damping: 200 } });
  const primeiroCorte = cortes[0];

  // Os prêmios: quais ele já usa e qual está no ar.
  const usados = PREMIOS.filter((premio) => t >= s(premio.chega)).map((premio) => premio.item);
  const noAr = PREMIOS.find((premio) => t >= s(premio.sai) && t < s(premio.chega));
  const sumindo = voltando ? rampa(t, s(M.volta) + 0.06, s(M.volta) + 0.36) : 0;
  const piscando = t >= s(M.volta) - 0.04 && t < s(M.volta) + 0.12;
  const vitoria = M.vitorias.findLast((batida) => t >= s(batida));
  const pulinho = vitoria === undefined ? 0 : Math.sin(rampa(t, s(vitoria), s(vitoria) + 0.3) * Math.PI);
  const uauEm = s(M.vitorias[2]) + 0.1;
  const uau = t >= uauEm && t < uauEm + 1.15;
  const letraDoUau = uau && t - uauEm < 0.4 ? T.uau[Math.min(T.uau.length - 1, Math.floor(((t - uauEm) / 0.4) * T.uau.length))] : undefined;
  const k = pose.tamanho / 140;
  const esquerda = pose.cx - pose.tamanho / 2;
  const topo = pose.cy - (pose.tamanho * 162) / 140 / 2;
  // Dentro da câmera, o que passa da moldura é cortado; fora dela, nada é cortado.
  const folga = (1 - pose.moldura) * 2400;
  const corteDaMoldura = pose.moldura > 0 ? `inset(${CAMERA.y + 6 - folga}px ${L - CAMERA.x - CAMERA.lado + 6 - folga}px ${A - CAMERA.y - CAMERA.lado + 6 - folga}px ${CAMERA.x + 6 - folga}px round ${58 + folga}px)` : undefined;

  const fase = [5, 9, 13, 17].findLastIndex((batida) => t >= s(batida));
  const finalEm = s(M.final);

  return (
    <AbsoluteFill data-theme="doce" style={{ background: "var(--cor-fundo)" }}>
      <Fundo />

      {/* O computadorzinho, a fala dele e o botão JOGAR (batidas 3 a 5); depois, o mergulho na tela. */}
      {t >= quebra && t < s(M.mergulho) ? (
        <div style={{ position: "absolute", left: centro.x - 70 * u, top: centro.y - 61 * u }}>
          <MascoteVideo tamanho={140 * u} expressao="feliz" quadro={quadro} boca={t >= falaEm ? bocaDaVoz(fala.id, t - falaEm) : null} respira={false} semente={5} />
        </div>
      ) : null}
      {t >= s(M.mergulho) && t < s(5) ? (
        <MergulhoNaTela p={mergulho} largura={L} altura={A} porCima={mergulho < 0.35 ? <RostoNaTela expressao="feliz" opacidade={1 - mergulho / 0.35} /> : null}>
          <Freeze frame={0}>
            <TomadaCurta curto={C} corte={primeiroCorte} />
          </Freeze>
        </MergulhoNaTela>
      ) : null}

      {/* As gravações do jogo, um corte por batida do roteiro. */}
      {cortes.map((corte) => (
        <Sequence key={`${corte.tomada}-${corte.de}`} from={quadroDa(C, corte.de)} durationInFrames={quadroDa(C, corte.ate) - quadroDa(C, corte.de)}>
          <TomadaCurta curto={C} corte={corte} />
        </Sequence>
      ))}

      {/* O muro chega um pouco mais perto até rachar (o primeiro segundo não fica parado). */}
      {muro ? <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.05 * rampa(t, 0, quebra, sai) * (muroNoComeco ? 1 : 0)})`, transformOrigin: "50% 40%" }}>{muro}</div> : null}

      {/* A fala do computadorzinho e o botão. */}
      {t >= falaEm && t < s(M.mergulho) + 0.1 ? (
        <div style={{ position: "absolute", left: 0, width: L, top: 262, display: "flex", justifyContent: "center", opacity: 1 - rampa(t, s(M.mergulho), s(M.mergulho) + 0.1) }}>
          <Balao texto={fala.texto} t={t - falaEm} voz={voz.duracao} duracao={3} letra={84} rabo="baixo" />
        </div>
      ) : null}
      <BotaoJogar t={t} />

      {/* O aprendiz: em close, de lado ou na câmera de streamer. */}
      <MolduraDaCamera p={pose.moldura} quadro={quadro} />
      <div style={{ position: "absolute", inset: 0, clipPath: corteDaMoldura }}>
        {pose.moldura > 0 ? <div style={{ position: "absolute", left: CAMERA.x, top: CAMERA.y, width: CAMERA.lado, height: CAMERA.lado, borderRadius: 64, background: "var(--cor-painel)", opacity: pose.moldura }} /> : null}
        <div style={{ position: "absolute", left: esquerda, top: topo, filter: pose.moldura < 0.5 ? "drop-shadow(0 14px 0 var(--cor-veu))" : undefined }}>
          <Personagem aparencia={APARENCIA_DO_APRENDIZ} tamanho={pose.tamanho} quadro={quadro} expressao={humor.expressao} anterior={humor.anterior} troca={humor.troca} acessorios={usados} sumindo={sumindo} piscando={piscando} pulo={pulinho} letra={letraDoUau} semente={11} laco={total} />
        </div>
      </div>
      {noAr ? (
        <div style={{ position: "absolute", left: esquerda, top: topo }}>
          <PremioNoAr aparencia={APARENCIA_DO_APRENDIZ} tamanho={pose.tamanho} item={noAr.item} p={rampa(t, s(noAr.sai), s(noAr.chega), vaiEVolta)} de={{ x: (ESTRELAS.de.x - pose.cx) / k, y: (ESTRELAS.de.y - pose.cy) / k }} />
        </div>
      ) : null}
      {uau ? (
        <div style={{ position: "absolute", left: CAMERA.x + CAMERA.lado + 30, top: CAMERA.y - 6 }}>
          <Balao texto={T.uau} t={t - uauEm} voz={0.4} duracao={1} letra={76} rabo="esquerda" />
        </div>
      ) : null}

      {/* O placar de estrelas: pequeno no canto durante a partida, grande ao lado dele no final. */}
      {t >= s(M.mergulho) + 0.2 ? (
        (() => {
          const aparece = rampa(t, s(M.mergulho) + 0.2, s(5), elastico);
          const cresce = rampa(t, finalEm, finalEm + 0.45, vaiEVolta);
          const some = 1 - rampa(t, s(M.volta), s(M.volta) + 0.2);
          return (
            <div style={{ position: "absolute", right: L - mistura(PLACAR.direita, 990, cresce), top: mistura(PLACAR.y, 470, cresce), opacity: some, transform: `scale(${aparece * (0.8 + 0.2 * some)})`, transformOrigin: "100% 50%" }}>
              <Placar chegadas={TODAS_AS_CHEGADAS} t={t} letra={mistura(68, 104, cresce)} />
            </div>
          );
        })()
      ) : null}

      {/* A faixa do gancho: já está inteira no quadro 0 (é a capa) e volta, palavra por palavra, no fim. */}
      {t < quebra + 0.5 ? (
        <div style={{ position: "absolute", left: 50, top: 1078 }}>
          <Faixa linhas={T.gancho} t={t} ate={quebra + 0.3} letra={118} destaque={[2]} giro={-2} pronta />
        </div>
      ) : null}
      {voltando ? (
        <div style={{ position: "absolute", left: 50, top: 1078 }}>
          <Faixa linhas={T.gancho} t={t - s(M.volta) - 0.1} letra={118} destaque={[2]} giro={-2} passo={0.05} pronta={quadro >= QUADROS.aprendiz - 2} />
        </div>
      ) : null}

      {/* A faixa de cada fase, o carimbo, as estrelas. */}
      {fase >= 0 && t < s(21) + 0.2
        ? T.fases.map((texto, indice) => {
            const de = s(5 + indice * 4);
            const ate = s(9 + indice * 4) - 0.14;
            return (
              <div key={texto.rotulo} style={{ position: "absolute", left: FAIXA_DAS_FASES.x, top: FAIXA_DAS_FASES.y }}>
                <Faixa linhas={texto.linhas} rotulo={texto.rotulo} t={t - de} ate={ate - de} letra={112} giro={indice % 2 === 0 ? -2 : 1.6} />
              </div>
            );
          })
        : null}
      {M.vitorias.map((batida, indice) => {
        const de = s(batida) + 0.06;
        return (
          <div key={batida} style={{ position: "absolute", left: 446, top: 432, width: 520, display: "flex", justifyContent: "center" }}>
            <Carimbo linhas={T.concluida} t={t - de} ate={0.98} letra={74} giro={indice % 2 === 0 ? -7 : 6} />
          </div>
        );
      })}
      {CHEGADAS.map((chegadas, indice) => (
        <EstrelasVoando key={indice} chegadas={chegadas} t={t} de={ESTRELAS.de} ate={ESTRELAS.ate} />
      ))}

      {/* O mundo: uma faixa só por cima dos três cortes. */}
      <div style={{ position: "absolute", left: FAIXA_DAS_FASES.x, top: FAIXA_DAS_FASES.y + 40 }}>
        <Faixa linhas={T.numero} t={t - s(21)} ate={s(24) - s(21) - 0.12} letra={124} destaque={[0]} giro={-2} />
      </div>

      {/* O final: "Programe jogando.", o logo e o endereço. Tudo sai na volta do laço. */}
      {t >= finalEm ? (
        <>
          <div style={{ position: "absolute", left: 50, top: 978 }}>
            <Faixa linhas={T.final} t={t - s(M.palavras[0])} ate={s(M.volta) - s(M.palavras[0])} letra={132} destaque={[1]} giro={-2} passo={(s(M.palavras[1]) - s(M.palavras[0]))} />
          </div>
          <div style={{ position: "absolute", left: 64, top: 1334, opacity: 1 - rampa(t, s(M.volta), s(M.volta) + 0.16), transform: `scale(${1 - 0.1 * rampa(t, s(M.volta), s(M.volta) + 0.16)})`, transformOrigin: "20% 50%" }}>
            <LogoEEndereco t={t - s(M.endereco)} />
          </div>
        </>
      ) : null}

      <TrilhaCurta curto={C} />
    </AbsoluteFill>
  );
}

/** Para as contas dos scripts e da revisão. */
export const VOO = VOO_DA_ESTRELA;
