/*
 * Bloco 10: o convite. A lista da Fase 0 abre inteira, com cinco objetivos
 * marcados e o sexto piscando. Ao lado, um cartão com o visual do painel
 * Elementos mostra o link que marca o sexto; o cursor passa por cima, com o
 * realce de inspecionar. Depois, a tela final: o endereço, grande.
 * O pós-créditos reaproveita a tela final: o computadorzinho boceja, dorme, e
 * o monitor desliga na mesma linha horizontal da abertura.
 */
import type { ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONTE_CODIGO, FONTE_UI } from "../../fontes";
import { ASSINATURA, CONVITE, ENDERECO, FALAS, FPS, OBJETIVOS, type BlocoNoTempo } from "../../roteiro";
import { elastico, mistura, rampa, sai, vaiEVolta } from "../../lib/tempo";
import { duracaoDaVoz, duracaoDoBalao } from "../../lib/voz";
import { Balao } from "../../pecas/Balao";
import { ListaDaFase, type Marcado } from "../../pecas/Checklist";
import { MascoteVideo } from "../../pecas/MascoteVideo";
import { expressaoEm, falaEm } from "../../pecas/Narrador";
import { useFalasDoBloco, Fundo, medidas, TelaApagada, tempoDoBloco, type Formato } from "./comum";

const COR = { tag: "var(--cor-codigo-tag)", atributo: "var(--cor-codigo-atributo)", valor: "var(--cor-codigo-valor)", texto: "var(--cor-codigo-texto)" } as const;

/** O link do convite, com o realce de sintaxe do jogo (as cores do editor vêm dos tokens --cor-codigo-*). */
function CodigoDoLink({ letra, realce }: { letra: number; realce: number }) {
  const linha = (conteudo: ReactNode, recuo = 0) => <div style={{ paddingLeft: recuo * letra * 1.2, whiteSpace: "pre" }}>{conteudo}</div>;
  return (
    <div style={{ position: "relative", fontFamily: FONTE_CODIGO, fontSize: letra, fontWeight: 500, lineHeight: 1.62, fontVariantLigatures: "none", color: COR.texto }}>
      <div style={{ position: "absolute", left: -letra * 0.5, right: -letra * 0.5, top: -letra * 0.18, bottom: -letra * 0.18, borderRadius: letra * 0.4, background: "var(--cor-selecao)", opacity: realce }} />
      <div style={{ position: "relative" }}>
        {linha(
          <>
            <span style={{ color: COR.tag }}>{"<a"}</span> <span style={{ color: COR.atributo }}>href</span>
            <span style={{ color: COR.tag }}>=</span>
            <span style={{ color: COR.valor }}>{`"https://${ENDERECO}"`}</span>
            <span style={{ color: COR.tag }}>{">"}</span>
          </>,
        )}
        {linha(OBJETIVOS[5], 1)}
        {linha(<span style={{ color: COR.tag }}>{"</a>"}</span>)}
      </div>
    </div>
  );
}

/** A setinha do cursor, igual à das tomadas. */
function Ponteiro({ x, y, aperto = 0 }: { x: number; y: number; aperto?: number }) {
  return (
    <svg viewBox="0 0 28 38" width={44} height={60} style={{ position: "absolute", left: x - 4, top: y - 4, transform: `scale(${1 - 0.14 * aperto})`, transformOrigin: "10% 8%", filter: "drop-shadow(0 4px 3px var(--cor-sombra))" }}>
      <path d="M3 3 L3 29 L10 22.5 L15 34 L20 31.8 L15.2 20.6 L24.5 20.6 Z" fill="var(--cor-superficie)" stroke="var(--cor-texto)" strokeWidth={2.4} strokeLinejoin="round" />
    </svg>
  );
}

type Props = { bloco: BlocoNoTempo; formato: Formato; marcados: Marcado[]; /** O pós-créditos: os momentos do bloco de fim (boceja, dorme, desliga, preto) e o tempo dentro dele. */ fim?: { t: number; momentos: Record<string, number> } };

export function Convite({ bloco, formato, marcados, fim }: Props) {
  const quadroDoBloco = useCurrentFrame();
  const duracao = bloco.fim - bloco.inicio;
  // No pós-créditos, a tela do convite fica parada no último instante.
  const t = fim ? duracao : tempoDoBloco(quadroDoBloco);
  const quadro = fim ? Math.round(duracao * FPS) + quadroDoBloco : quadroDoBloco;
  const m = bloco.momentos ?? {};
  const { l, a } = medidas(formato);
  const vertical = formato === "9x16";
  const util = vertical ? l - 120 : l;
  const falas = useFalasDoBloco(bloco).filter((item) => item.inicio >= 0);
  // A lista marca tudo o que o vídeo marcou (os tempos absolutos já passaram).
  const tAbsoluto = bloco.inicio + t;

  // Parte 1: a lista e o cartão do link.
  const sai1 = rampa(t, m.final - 0.25, m.final + 0.15, vaiEVolta);
  const lista = rampa(t, m.lista, m.lista + 0.4, elastico);
  const cartao = rampa(t, m.cartao, m.cartao + 0.4, elastico);
  const realce = rampa(t, m.realce, m.realce + 0.18, sai);
  const letraDaLista = vertical ? 44 : 40;
  const larguraDaLista = vertical ? 860 : 760;
  const larguraDoCartao = vertical ? 880 : 940;
  const letraDoCodigo = vertical ? 30 : 33;
  const posLista = vertical ? { left: (util - larguraDaLista) / 2 + 20, top: 250 } : { left: 100, top: 300 };
  const posCartao = vertical ? { left: (util - larguraDoCartao) / 2 + 20, top: 960 } : { left: 900, top: 350 };
  // O cursor vem de fora e para em cima do botão do cartão.
  const alvo = { x: posCartao.left + larguraDoCartao * 0.34, y: posCartao.top + (vertical ? 420 : 446) };
  const origem = { x: alvo.x + 420, y: alvo.y + 330 };
  const anda = rampa(t, m.cursor, m.realce, vaiEVolta);
  const clique = t >= m.final - 0.42 ? 1 - rampa(t, m.final - 0.42, m.final - 0.22, sai) : 0;

  // Parte 2: a tela final.
  const final = rampa(t, m.final - 0.12, m.final + 0.33, vaiEVolta);
  const estado = expressaoEm(falas, t, t >= m.final ? "comemorando" : "feliz");
  const ativa = falaEm(falas, t);
  const tamanhoDoMascote = vertical ? 520 : 470;
  const posMascote = vertical ? { left: (util - tamanhoDoMascote) / 2 + 20, top: 470 } : { left: 150, top: 375 };
  const entraTexto = (atraso: number) => rampa(t, m.endereco + atraso, m.endereco + atraso + 0.4, sai);
  const pisca = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 1.4);

  // Pós-créditos: boceja, dorme, e o monitor desliga.
  const f = fim?.momentos;
  const tf = fim?.t ?? 0;
  const bocejo = f ? Math.sin(rampa(tf, f.boceja, f.dorme) * Math.PI) : 0;
  const dormindo = f ? tf >= f.dorme - 0.05 : false;
  const desliga = f ? rampa(tf, f.desliga, f.desliga + 0.34, vaiEVolta) : 0;
  const some = f ? rampa(tf, f.desliga + 0.3, f.preto, vaiEVolta) : 0;
  const alturaVisivel = Math.max(6, a * (1 - desliga));
  const larguraVisivel = l * (1 - 0.97 * some);

  const cena = (
    <Fundo>
      {/* Parte 1 */}
      {sai1 < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - sai1, transform: `scale(${1 - 0.06 * sai1})` }}>
          <div style={{ position: "absolute", ...posLista, transform: `scale(${lista})`, transformOrigin: "30% 40%" }}>
            <ListaDaFase t={tAbsoluto} marcados={marcados} letra={letraDaLista} largura={larguraDaLista} ultimoPisca />
          </div>
          <div
            style={{
              position: "absolute",
              ...posCartao,
              width: larguraDoCartao,
              boxSizing: "border-box",
              borderRadius: 36,
              border: "5px solid var(--cor-borda)",
              background: "var(--cor-painel)",
              boxShadow: "0 12px 0 var(--cor-sombra)",
              overflow: "hidden",
              fontFamily: FONTE_UI,
              transform: `scale(${cartao})`,
              transformOrigin: "50% 40%",
              opacity: Math.min(1, cartao * 1.5),
            }}
          >
            {/* A aba, como no painel do jogo. */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 34, padding: "20px 34px 0", borderBottom: "4px solid var(--cor-borda)", fontSize: 30, fontWeight: 800 }}>
              <span style={{ padding: "12px 6px 14px", color: "var(--cor-primaria)", borderBottom: "6px solid var(--cor-primaria)", marginBottom: -4 }}>Elementos</span>
              <span style={{ padding: "12px 6px 14px", color: "var(--cor-texto-suave)" }}>Console</span>
            </div>
            <div style={{ padding: "34px 44px 30px", background: "var(--cor-codigo-fundo)" }}>
              <CodigoDoLink letra={letraDoCodigo} realce={realce} />
            </div>
            {/* O link de verdade, do jeito que ele aparece na página. */}
            <div style={{ padding: "30px 44px 40px", borderTop: "4px solid var(--cor-borda)", background: "var(--cor-superficie)" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <div style={{ padding: "20px 40px", borderRadius: 999, background: "var(--cor-primaria)", color: "var(--cor-texto-sobre-primaria)", fontSize: vertical ? 40 : 42, fontWeight: 900, boxShadow: `0 ${8 - 5 * clique}px 0 var(--cor-mascote-moldura-sombra)`, transform: `translateY(${5 * clique}px)` }}>{OBJETIVOS[5]}</div>
                {/* O realce de inspecionar na caixa do link. */}
                <div style={{ position: "absolute", inset: -8, borderRadius: 999, background: "var(--cor-realce-inspecao)", opacity: 0.28 * realce }} />
                <div style={{ position: "absolute", inset: -8, borderRadius: 999, border: "4px solid var(--cor-realce-inspecao)", opacity: realce }} />
                <div style={{ position: "absolute", left: 8, top: -52, padding: "4px 14px", borderRadius: 10, background: "var(--cor-texto)", color: "var(--cor-superficie)", fontFamily: FONTE_CODIGO, fontSize: 24, fontWeight: 600, opacity: realce }}>a</div>
              </div>
            </div>
          </div>
          {anda > 0 ? <Ponteiro x={mistura(origem.x, alvo.x, anda)} y={mistura(origem.y, alvo.y, anda)} aperto={clique} /> : null}
        </AbsoluteFill>
      ) : null}

      {/* Parte 2: a tela final */}
      {final > 0 ? (
        <AbsoluteFill style={{ opacity: final }}>
          <div style={{ position: "absolute", ...posMascote, transform: `scale(${0.7 + 0.3 * rampa(t, m.final, m.final + 0.4, elastico)})`, transformOrigin: "50% 80%" }}>
            <MascoteVideo
              tamanho={tamanhoDoMascote}
              expressao={dormindo ? "dormindo" : estado.expressao}
              anterior={dormindo ? "feliz" : estado.anterior}
              troca={dormindo && f ? rampa(tf, f.dorme - 0.05, f.dorme + 0.2) : estado.troca}
              boca={bocejo > 0.05 && !dormindo ? bocejo : estado.boca}
              quadro={quadro}
              semente={23}
            />
          </div>
          {ativa ? (
            <div style={vertical ? { position: "absolute", left: 0, width: util + 40, top: posMascote.top - 150, display: "flex", justifyContent: "center" } : { position: "absolute", left: posMascote.left + tamanhoDoMascote * 0.52, top: posMascote.top - 96 }}>
              <Balao texto={FALAS[ativa.fala].texto} t={ativa.local} voz={duracaoDaVoz(ativa.fala)} duracao={duracaoDoBalao(ativa.fala)} letra={vertical ? 60 : 56} rabo={vertical ? "baixo" : "baixo-esquerda"} />
            </div>
          ) : null}
          <div style={vertical ? { position: "absolute", left: 40, width: util - 40, top: 1010, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", fontFamily: FONTE_UI } : { position: "absolute", left: 720, top: 292, width: 1120, fontFamily: FONTE_UI }}>
            <div style={{ fontSize: vertical ? 62 : 70, fontWeight: 800, lineHeight: 1.14, color: "var(--cor-texto)" }}>
              {CONVITE.map((frase, indice) => (
                <div key={frase} style={{ opacity: entraTexto(indice * 0.18), transform: `translateY(${(1 - entraTexto(indice * 0.18)) * 30}px)`, color: indice === 0 ? "var(--cor-texto)" : "var(--cor-texto-suave)" }}>
                  {frase}
                </div>
              ))}
            </div>
            {/* O sexto objetivo, que só o espectador pode marcar. */}
            <div
              style={{
                marginTop: vertical ? 44 : 46,
                display: "inline-flex",
                alignItems: "center",
                gap: 20,
                padding: "16px 34px 16px 18px",
                borderRadius: 26,
                background: "var(--cor-superficie)",
                boxShadow: `0 0 0 5px var(--cor-primaria), 0 0 ${16 + 40 * pisca}px var(--cor-primaria)`,
                fontSize: vertical ? 46 : 46,
                fontWeight: 800,
                color: "var(--cor-texto)",
                opacity: entraTexto(0.4),
                transform: `scale(${(0.9 + 0.1 * entraTexto(0.4)) * (1 + 0.02 * pisca)})`,
                transformOrigin: vertical ? "50% 50%" : "0% 50%",
              }}
            >
              <span style={{ width: 56, height: 56, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--cor-primaria)", color: "var(--cor-texto-sobre-primaria)", fontSize: 32, fontWeight: 900 }}>6</span>
              {OBJETIVOS[5]}
            </div>
            <div
              style={{
                marginTop: vertical ? 50 : 52,
                fontSize: vertical ? 76 : 104,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                color: "var(--cor-primaria)",
                whiteSpace: "nowrap",
                opacity: entraTexto(0.62),
                transform: `scale(${0.86 + 0.14 * rampa(t, m.endereco + 0.62, m.endereco + 1.0, elastico)})`,
                transformOrigin: vertical ? "50% 50%" : "0% 50%",
              }}
            >
              {ENDERECO}
            </div>
            <div style={{ marginTop: vertical ? 40 : 44, fontSize: vertical ? 38 : 34, fontWeight: 700, color: "var(--cor-texto-suave)", opacity: entraTexto(1.0) }}>{ASSINATURA}</div>
          </div>
        </AbsoluteFill>
      ) : null}
    </Fundo>
  );

  if (!f) return cena;
  // O monitor desliga: a imagem fecha numa linha horizontal e a linha some no centro.
  return (
    <AbsoluteFill>
      <TelaApagada />
      {some < 1 ? (
        <div style={{ position: "absolute", left: (l - larguraVisivel) / 2, top: (a - alturaVisivel) / 2, width: larguraVisivel, height: alturaVisivel, overflow: "hidden", borderRadius: desliga > 0 ? 6 : 0 }}>
          <div style={{ position: "absolute", left: -(l - larguraVisivel) / 2, top: -(a - alturaVisivel) / 2, width: l, height: a }}>{cena}</div>
          <AbsoluteFill style={{ background: "var(--cor-mascote-tela)", opacity: Math.min(1, desliga * 1.2) }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
}
