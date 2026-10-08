/*
 * A lista de objetivos da "Fase 0", com o visual da ListaObjetivos do jogo
 * (src/componentes/mascote/ListaObjetivos.tsx: painel com borda, o contador
 * "N de M", o objetivo ativo em destaque com anel, os concluídos riscados),
 * recriada para o vídeo. Cada objetivo marcado ganha o tique desenhado em
 * SVG e um brilho curto. O último nunca é marcado: no fim, ele pisca.
 */
import type { CSSProperties } from "react";
import { FONTE_UI } from "../fontes";
import { OBJETIVOS, TITULO_DA_FASE } from "../roteiro";
import { elastico, rampa, sai, vaiEVolta } from "../lib/tempo";

export type Marcado = { indice: number; em: number; lado?: "esquerda" | "direita" };

/** Quantos objetivos já estão marcados no instante `t`. */
export const marcadosEm = (marcados: Marcado[], t: number): number => marcados.filter((item) => t >= item.em).length;

function Tique({ p, tamanho }: { p: number; tamanho: number }) {
  // O traço do tique se desenha de 0 a 1 (comprimento ~17 no viewBox de 24).
  const comprimento = 17;
  return (
    <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} style={{ display: "block" }}>
      <circle cx="12" cy="12" r="10.5" fill="var(--cor-sucesso)" stroke="var(--cor-sucesso)" strokeWidth={1.5} />
      <path d="M6.8 12.6 L10.6 16.2 L17.4 8.6" fill="none" stroke="var(--cor-superficie)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={comprimento} strokeDashoffset={comprimento * (1 - p)} />
    </svg>
  );
}

type PropsLista = {
  /** Segundos do vídeo. */
  t: number;
  marcados: Marcado[];
  letra: number;
  largura: number;
  /** O último objetivo pisca (o convite do fim). */
  ultimoPisca?: boolean;
  estilo?: CSSProperties;
};

/** A lista inteira, aberta. */
export function ListaDaFase({ t, marcados, letra, largura, ultimoPisca = false, estilo }: PropsLista) {
  const feitos = marcadosEm(marcados, t);
  const borda = Math.max(3, Math.round(letra * 0.13));
  return (
    <div
      style={{
        width: largura,
        boxSizing: "border-box",
        padding: `${letra * 0.6}px ${letra * 0.7}px ${letra * 0.7}px`,
        borderRadius: letra * 0.95,
        border: `${borda}px solid var(--cor-borda)`,
        background: "var(--cor-painel)",
        boxShadow: `0 ${Math.round(letra * 0.28)}px 0 var(--cor-sombra)`,
        fontFamily: FONTE_UI,
        color: "var(--cor-texto)",
        ...estilo,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: letra * 0.5, marginBottom: letra * 0.45 }}>
        <span style={{ fontSize: letra * 0.72, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--cor-texto-suave)" }}>{TITULO_DA_FASE}</span>
        <span style={{ flexShrink: 0, padding: `${letra * 0.12}px ${letra * 0.45}px`, borderRadius: 999, background: "var(--cor-superficie)", fontSize: letra * 0.7, fontWeight: 900 }}>
          {feitos} de {OBJETIVOS.length}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: letra * 0.14 }}>
        {OBJETIVOS.map((objetivo, indice) => {
          const marca = marcados.find((item) => item.indice === indice);
          const feito = marca !== undefined && t >= marca.em;
          const desde = marca ? t - marca.em : -1;
          const atual = !feito && indice === feitos;
          const ultimo = indice === OBJETIVOS.length - 1;
          const pulso = feito ? 1 + 0.05 * Math.sin(rampa(desde, 0, 0.45) * Math.PI) : 1;
          const brilho = feito ? 1 - rampa(desde, 0.05, 0.9, sai) : 0;
          const pisca = ultimo && ultimoPisca ? 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 1.4) : 0;
          return (
            <div
              key={objetivo}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: letra * 0.5,
                padding: `${letra * 0.24}px ${letra * 0.4}px`,
                borderRadius: letra * 0.55,
                fontSize: letra,
                lineHeight: 1.2,
                fontWeight: atual || (ultimo && ultimoPisca) ? 800 : 700,
                color: atual || (ultimo && ultimoPisca) ? "var(--cor-texto)" : "var(--cor-texto-suave)",
                background: atual || (ultimo && ultimoPisca) ? "var(--cor-superficie)" : "transparent",
                boxShadow: atual || (ultimo && ultimoPisca) ? `0 0 0 ${borda}px var(--cor-primaria)${ultimo && ultimoPisca ? `, 0 0 ${letra * (0.3 + 0.9 * pisca)}px var(--cor-primaria)` : ""}` : brilho > 0 ? `0 0 ${letra * 1.2 * brilho}px var(--cor-destaque)` : "none",
                transform: `scale(${pulso * (ultimo && ultimoPisca ? 1 + 0.02 * pisca : 1)})`,
              }}
            >
              <span style={{ width: letra * 1.15, height: letra * 1.15, flexShrink: 0, display: "grid", placeItems: "center" }}>
                {feito ? (
                  <span style={{ transform: `scale(${rampa(desde, 0, 0.3, elastico)})` }}>
                    <Tique p={rampa(desde, 0.08, 0.42, vaiEVolta)} tamanho={letra * 1.15} />
                  </span>
                ) : (
                  <span
                    style={{
                      width: letra * 1.05,
                      height: letra * 1.05,
                      boxSizing: "border-box",
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      fontSize: letra * 0.62,
                      fontWeight: 900,
                      background: atual || (ultimo && ultimoPisca) ? "var(--cor-primaria)" : "transparent",
                      color: atual || (ultimo && ultimoPisca) ? "var(--cor-texto-sobre-primaria)" : "var(--cor-texto-suave)",
                      border: atual || (ultimo && ultimoPisca) ? "none" : `${Math.max(2, borda - 1)}px solid var(--cor-borda)`,
                    }}
                  >
                    {indice + 1}
                  </span>
                )}
              </span>
              <span style={{ textDecoration: feito ? "line-through" : "none", textDecorationThickness: Math.max(2, letra * 0.08) }}>{objetivo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type PropsPilula = {
  t: number;
  marcados: Marcado[];
  /** Quando a pílula aparece e some (s). */
  de: number;
  ate: number;
  formato: "16x9" | "9x16";
  /** Trechos em que a pílula sai da frente (s do vídeo). */
  escondida?: { de: number; ate: number }[];
};

/**
 * No canto, a lista fica recolhida numa pílula ("2 de 6"). No 16:9, ela abre
 * por 2 s a cada objetivo marcado; no 9:16, fica sempre recolhida (o
 * objetivo marcado aparece ao lado da pílula por um instante).
 */
export function ChecklistDoCanto({ t, marcados, de, ate, formato, escondida = [] }: PropsPilula) {
  if (t < de - 0.05 || t > ate + 0.3) return null;
  const vertical = formato === "9x16";
  const letra = vertical ? 42 : 36;
  const fora = escondida.reduce((maior, trecho) => Math.max(maior, rampa(t, trecho.de, trecho.de + 0.25, sai) * (1 - rampa(t, trecho.ate - 0.05, trecho.ate + 0.25, sai))), 0);
  const aparece = rampa(t, de, de + 0.35, elastico) * (1 - rampa(t, ate, ate + 0.25, sai)) * (1 - fora);
  const feitos = marcadosEm(marcados, t);
  const ultima = [...marcados].reverse().find((item) => t >= item.em - 0.25);
  const desde = ultima ? t - ultima.em : 99;
  // Abre um pouco antes de marcar e fecha 2 s depois.
  const aberta = vertical ? 0 : ultima ? rampa(desde, -0.25, 0.05, vaiEVolta) * (1 - rampa(desde, 2.0, 2.3, vaiEVolta)) : 0;
  const pulso = ultima && desde >= 0 ? 1 + 0.12 * Math.sin(rampa(desde, 0, 0.4) * Math.PI) : 1;
  const borda = vertical ? 5 : 4;
  // 9:16: a pílula fica no topo da área segura (abaixo dos 220 px de cima).
  const posicao: CSSProperties = vertical ? { left: 44, top: 236 } : { right: 40, top: 34 };
  const recado = vertical && ultima && desde >= 0 ? rampa(desde, 0, 0.25, elastico) * (1 - rampa(desde, 2.0, 2.25, sai)) : 0;
  return (
    <div style={{ position: "absolute", ...posicao, transform: `scale(${aparece})`, transformOrigin: vertical ? "0% 0%" : "100% 0%" }}>
      {aberta > 0.01 ? (
        // No 16:9, a lista aberta pode ir para a esquerda quando a ação está no canto direito.
        <div style={{ position: "relative", left: ultima?.lado === "esquerda" ? -(1920 - 40 - 40 - 560) : 0, opacity: Math.min(1, aberta * 1.5), transform: `scale(${0.6 + 0.4 * aberta})`, transformOrigin: ultima?.lado === "esquerda" ? "0% 0%" : "100% 0%" }}>
          <ListaDaFase t={t} marcados={marcados} letra={30} largura={560} />
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: letra * 0.5 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: letra * 0.45,
              padding: `${letra * 0.28}px ${letra * 0.4}px ${letra * 0.28}px ${letra * 0.6}px`,
              borderRadius: 999,
              border: `${borda}px solid var(--cor-borda)`,
              background: "var(--cor-painel)",
              boxShadow: "0 6px 0 var(--cor-sombra)",
              fontFamily: FONTE_UI,
              fontSize: letra * 0.8,
              fontWeight: 900,
              color: "var(--cor-texto-suave)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              transform: `scale(${pulso})`,
              transformOrigin: vertical ? "0% 50%" : "100% 50%",
            }}
          >
            Fase 0
            <span style={{ padding: `${letra * 0.1}px ${letra * 0.5}px`, borderRadius: 999, background: "var(--cor-superficie)", color: "var(--cor-texto)", fontSize: letra * 0.86, textTransform: "none", letterSpacing: 0 }}>
              {feitos} de {OBJETIVOS.length}
            </span>
          </div>
          {recado > 0.01 && ultima ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: letra * 0.3,
                maxWidth: 560,
                padding: `${letra * 0.24}px ${letra * 0.55}px ${letra * 0.24}px ${letra * 0.3}px`,
                borderRadius: 999,
                border: `${borda}px solid var(--cor-borda)`,
                background: "var(--cor-superficie)",
                boxShadow: "0 6px 0 var(--cor-sombra)",
                fontFamily: FONTE_UI,
                fontSize: letra * 0.8,
                fontWeight: 800,
                lineHeight: 1.15,
                color: "var(--cor-texto)",
                transform: `scale(${recado})`,
                transformOrigin: "0% 50%",
                opacity: Math.min(1, recado * 1.5),
              }}
            >
              <span style={{ flexShrink: 0 }}>
                <Tique p={rampa(desde, 0.08, 0.42, vaiEVolta)} tamanho={letra * 1.1} />
              </span>
              {OBJETIVOS[ultima.indice]}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
