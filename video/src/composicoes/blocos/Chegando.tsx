/*
 * Bloco 9: chegando. O fim do mundo, com as ilhas em construção e os
 * operários de capacete (T18). Os nomes das ilhas que ainda vêm aparecem em
 * sequência: um anel em volta de cada ilha da gravação e o nome numa fileira.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONTE_UI } from "../../fontes";
import { ILHAS_CHEGANDO } from "../../roteiro";
import { elastico, rampa } from "../../lib/tempo";
import { ilhasDa } from "../../lib/tomadas";
import { CenaDaTomada } from "../../pecas/Tomada";
import { medidas, tempoDoBloco, type PropsDoBloco } from "./comum";

export function Chegando({ bloco, formato }: PropsDoBloco) {
  const quadro = useCurrentFrame();
  const t = tempoDoBloco(quadro);
  const m = bloco.momentos ?? {};
  const { l, a } = medidas(formato);
  const corte = bloco.cortes[0];
  const quando = (indice: number) => m.nomes + indice * m.passo;
  return (
    <AbsoluteFill>
      <CenaDaTomada corte={corte} largura={l} altura={a}>
        {({ take, escala }) => (
          <>
            {ILHAS_CHEGANDO.map((ilha, indice) => {
              const caixa = ilhasDa(take).find((item) => item.ilha === ilha.id);
              if (!caixa?.arte) return null;
              const entra = rampa(t, quando(indice), quando(indice) + 0.34, elastico);
              if (entra <= 0) return null;
              const pulso = 1 + 0.035 * Math.sin((t - quando(indice)) * Math.PI * 1.6);
              const esquerda = Math.min(caixa.arte.x, caixa.x) - 16;
              const direita = Math.max(caixa.arte.x + caixa.arte.l, caixa.x + caixa.l) + 16;
              const topo = caixa.arte.y - 14;
              const base = caixa.y + caixa.a + 12;
              return (
                <div
                  key={ilha.id}
                  style={{
                    position: "absolute",
                    left: esquerda * escala,
                    top: topo * escala,
                    width: (direita - esquerda) * escala,
                    height: (base - topo) * escala,
                    boxSizing: "border-box",
                    borderRadius: 44,
                    border: "7px dashed var(--cor-destaque)",
                    boxShadow: "0 0 30px var(--cor-destaque)",
                    opacity: Math.min(1, entra * 1.4) * 0.95,
                    transform: `scale(${(0.8 + 0.2 * entra) * pulso})`,
                  }}
                />
              );
            })}
          </>
        )}
      </CenaDaTomada>
      <div style={{ position: "absolute", left: 0, width: l, top: 118, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, fontFamily: FONTE_UI }}>
        <div
          style={{
            padding: "12px 26px",
            borderRadius: 999,
            background: "var(--cor-destaque)",
            color: "var(--cor-texto-sobre-destaque)",
            border: "5px solid var(--cor-superficie)",
            boxShadow: "0 7px 0 var(--cor-sombra)",
            fontSize: 38,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            transform: `scale(${rampa(t, m.nomes - 0.35, m.nomes - 0.05, elastico)})`,
          }}
        >
          Chegando
        </div>
        {ILHAS_CHEGANDO.map((ilha, indice) => {
          const entra = rampa(t, quando(indice), quando(indice) + 0.3, elastico);
          return (
            <div
              key={ilha.id}
              style={{
                padding: "12px 26px",
                borderRadius: 999,
                background: "var(--cor-superficie)",
                color: "var(--cor-texto)",
                border: "5px solid var(--cor-borda)",
                boxShadow: "0 7px 0 var(--cor-sombra)",
                fontSize: 40,
                fontWeight: 800,
                whiteSpace: "nowrap",
                transform: `scale(${entra})`,
                opacity: Math.min(1, entra * 1.5),
              }}
            >
              {ilha.nome}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
