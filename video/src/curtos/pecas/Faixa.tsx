/*
 * A faixa de texto dos curtos: o texto-chave (Nunito 900, pelo menos 110 px)
 * sempre em cima de um cartão com o token de superfície e contorno grosso,
 * nunca solto sobre a gravação. As palavras entram inteiras, uma a uma, com
 * mola (nada de máquina de escrever). O rótulo é o texto secundário (pelo
 * menos 60 px), numa etiqueta em cima do cartão.
 *
 * Dois visuais: "doce" (adesivo claro, de "O aprendiz") e "fliperama"
 * (letreiro de arcade, de "O chefão"). As cores vêm dos tokens do tema da composição.
 */
import type { CSSProperties } from "react";
import { spring } from "remotion";
import { FONTE_UI } from "../../fontes";
import { FPS } from "../../roteiro";
import { rampa, sai } from "../../lib/tempo";

type Props = {
  linhas: readonly string[];
  /** Segundos desde que a faixa entrou. */
  t: number;
  /** Segundos em que ela sai (a partir da entrada). Sem isto, fica. */
  ate?: number;
  /** Tamanho da letra do texto-chave, em px (pelo menos 110). */
  letra?: number;
  rotulo?: string;
  visual?: "doce" | "fliperama";
  /** As linhas pintadas com a cor de destaque (índices). */
  destaque?: readonly number[];
  /** Graus de inclinação do cartão. */
  giro?: number;
  /** O intervalo entre uma palavra e a próxima (s). */
  passo?: number;
  alinhar?: "esquerda" | "centro";
  /** Quanto da entrada já vale no primeiro quadro (1: a faixa já nasce inteira, para o quadro 0 e o laço). */
  pronta?: boolean;
  estilo?: CSSProperties;
};

/** Quanto tempo a faixa leva para ficar completa (a última palavra assentada). */
export const tempoDaFaixa = (linhas: readonly string[], passo = 0.09): number => Math.max(0, linhas.join(" ").split(" ").length - 1) * passo + 0.22;

export function Faixa({ linhas, t, ate, letra = 116, rotulo, visual = "doce", destaque = [], giro = -2, passo = 0.09, alinhar = "esquerda", pronta = false, estilo }: Props) {
  if (t < 0 && !pronta) return null;
  if (ate !== undefined && t > ate + 0.2) return null;
  const arcade = visual === "fliperama";
  const quadro = Math.round(t * FPS);
  const entrada = pronta ? 1 : spring({ frame: quadro, fps: FPS, config: { damping: 13, stiffness: 190, mass: 0.7 } });
  const saida = ate === undefined ? 1 : 1 - rampa(t, ate, ate + 0.16, sai);
  const borda = Math.round(letra * 0.075);
  let indice = 0;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: alinhar === "centro" ? "center" : "flex-start", transform: `rotate(${giro}deg) scale(${(0.86 + 0.14 * entrada) * (0.94 + 0.06 * saida)})`, transformOrigin: alinhar === "centro" ? "50% 60%" : "18% 60%", opacity: Math.min(1, entrada * 1.6) * saida, ...estilo }}>
      {rotulo ? (
        <div
          style={{
            marginLeft: alinhar === "centro" ? 0 : letra * 0.2,
            marginBottom: -borda * 1.6,
            position: "relative",
            zIndex: 1,
            padding: `${letra * 0.07}px ${letra * 0.26}px ${letra * 0.09}px`,
            borderRadius: 999,
            border: `${Math.round(borda * 0.8)}px solid ${arcade ? "var(--cor-fundo)" : "var(--cor-texto)"}`,
            background: arcade ? "var(--cor-secundaria)" : "var(--cor-primaria)",
            color: arcade ? "var(--cor-texto-sobre-secundaria)" : "var(--cor-superficie)",
            fontFamily: FONTE_UI,
            fontSize: Math.max(60, Math.round(letra * 0.54)),
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          {rotulo}
        </div>
      ) : null}
      <div
        style={{
          padding: `${letra * 0.2}px ${letra * 0.34}px ${letra * 0.26}px`,
          borderRadius: letra * 0.36,
          border: `${borda}px solid ${arcade ? "var(--cor-secundaria)" : "var(--cor-texto)"}`,
          background: "var(--cor-superficie)",
          boxShadow: arcade ? `0 0 ${letra * 0.34}px var(--cor-secundaria), 0 ${Math.round(letra * 0.12)}px 0 var(--cor-primaria)` : `0 ${Math.round(letra * 0.12)}px 0 var(--cor-texto)`,
          fontFamily: FONTE_UI,
          fontSize: letra,
          fontWeight: 900,
          lineHeight: 1.04,
          letterSpacing: arcade ? "0.01em" : "-0.02em",
          textAlign: alinhar === "centro" ? "center" : "left",
          whiteSpace: "nowrap",
        }}
      >
        {linhas.map((linha, numero) => (
          <div key={`${linha}-${numero}`} style={{ display: "flex", justifyContent: alinhar === "centro" ? "center" : "flex-start", columnGap: letra * 0.26, color: destaque.includes(numero) ? (arcade ? "var(--cor-primaria)" : "var(--cor-primaria)") : arcade ? "var(--cor-destaque)" : "var(--cor-texto)", textShadow: arcade ? `${Math.round(letra * 0.045)}px ${Math.round(letra * 0.045)}px 0 var(--cor-fundo)` : undefined }}>
            {linha.split(" ").map((palavra) => {
              const meu = indice++;
              const p = pronta ? 1 : spring({ frame: quadro - Math.round(meu * passo * FPS), fps: FPS, config: { damping: 11, stiffness: 240, mass: 0.6 } });
              return (
                <span key={`${palavra}-${meu}`} style={{ display: "inline-block", opacity: Math.min(1, p * 2.2), transform: `translateY(${(1 - p) * letra * 0.3}px) scale(${0.6 + 0.4 * p})`, transformOrigin: "50% 80%" }}>
                  {palavra}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
