"use client";

/*
 * A fala de um antepassado aparecendo no tempo, do jeito da época:
 * - "letra": letra por letra (a tecelã, a sonhadora, o terminal, o PC);
 * - "palavra": palavra por palavra (o gigante: cada palavra acende uma válvula);
 * - "frase": frase por frase (o celular: uma notificação por frase);
 * - "decodificar": o texto inteiro chega embaralhado e vai se ajeitando da
 *   esquerda para a direita (a internet discada saindo do chiado).
 *
 * Enquanto fala, conta como pendência (os testes esperam terminar). Com
 * "menos movimento", o texto aparece inteiro de uma vez. `aoAvancar` toca o
 * som de cada pedaço (o som da época).
 */
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { comecarPendencia } from "@/lib/pendencias";
import { frasesDoTexto } from "@/motor/exposicao/antepassados";

export type ModoFala = "letra" | "palavra" | "frase" | "decodificar";

/** Quanto tempo cada pedaço leva para aparecer, por modo. */
const MS_POR_PASSO: Record<ModoFala, number> = { letra: 30, palavra: 170, frase: 650, decodificar: 22 };

const RUIDO = "#%&*+=<>/\\|~^01";

/** Os pedaços em que o texto aparece (o fim de cada um, no texto). */
function cortes(texto: string, modo: ModoFala): number[] {
  if (modo === "letra" || modo === "decodificar") return Array.from({ length: texto.length }, (_, i) => i + 1);
  if (modo === "palavra") {
    const fins: number[] = [];
    const padrao = /\S+/g;
    let achado: RegExpExecArray | null;
    while ((achado = padrao.exec(texto))) fins.push(achado.index + achado[0].length);
    return fins.length ? fins : [texto.length];
  }
  let soma = 0;
  return frasesDoTexto(texto).map((frase) => {
    soma = texto.indexOf(frase, soma) + frase.length;
    return soma;
  });
}

export type FalaNoTempo = {
  /** O texto que já apareceu. */
  mostrado: string;
  /** (decodificar) O texto inteiro, com o que falta ainda embaralhado. */
  embaralhado: string;
  /** Quantos pedaços já apareceram (palavras acendem válvulas, frases viram notificações). */
  passos: number;
  total: number;
  completo: boolean;
  completar: () => void;
  /** A última letra que apareceu (a boca abre nas vogais). */
  letraAtual: string | undefined;
};

export function useFalaNoTempo(texto: string, modo: ModoFala, aoAvancar?: (passo: number) => void): FalaNoTempo {
  const reduzir = useReducedMotion() ?? false;
  const fins = useMemo(() => cortes(texto, modo), [texto, modo]);
  const [estado, setEstado] = useState({ texto, passos: 0 });
  if (estado.texto !== texto) setEstado({ texto, passos: 0 });
  const passos = reduzir ? fins.length : Math.min(estado.passos, fins.length);
  const completo = passos >= fins.length;
  const avancar = useRef(aoAvancar);
  useEffect(() => {
    avancar.current = aoAvancar;
  }, [aoAvancar]);

  // O passo de agora, lido na hora pelo relógio (o som toca fora da atualização do estado).
  const passosAgora = useRef(passos);
  useEffect(() => {
    passosAgora.current = passos;
  }, [passos]);

  useEffect(() => {
    if (completo) return;
    const encerrar = comecarPendencia();
    const intervalo = setInterval(() => {
      const proximo = passosAgora.current + 1;
      passosAgora.current = proximo;
      setEstado({ texto, passos: proximo });
      avancar.current?.(proximo);
    }, MS_POR_PASSO[modo]);
    return () => {
      clearInterval(intervalo);
      encerrar();
    };
  }, [completo, modo, texto]);

  const completar = useCallback(() => setEstado({ texto, passos: Number.MAX_SAFE_INTEGER }), [texto]);
  const fim = passos === 0 ? 0 : fins[Math.min(passos, fins.length) - 1];
  const mostrado = texto.slice(0, fim);
  const embaralhado =
    modo === "decodificar" && !completo
      ? mostrado + [...texto.slice(fim)].map((c, i) => (c === " " ? " " : RUIDO[(i * 7 + passos) % RUIDO.length])).join("")
      : texto;
  return { mostrado, embaralhado, passos, total: fins.length, completo, completar, letraAtual: mostrado.slice(-1) || undefined };
}
