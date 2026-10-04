"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { comecarPendencia } from "@/lib/pendencias";

/** Quanto tempo cada letra leva para aparecer (a boca do cliente acompanha). */
export const MS_POR_LETRA = 26;

/**
 * O texto aparecendo letra por letra, como alguém falando. Enquanto digita,
 * conta como pendência (os testes esperam a fala terminar). `completar`
 * mostra tudo de uma vez (o "Continuar" no meio da fala). Com "menos
 * movimento", o texto aparece inteiro.
 */
export function useTextoDigitado(texto: string): { mostrado: string; completo: boolean; completar: () => void } {
  const reduzir = useReducedMotion() ?? false;
  const [estado, setEstado] = useState({ texto, letras: 0 });
  // Texto novo: começa do zero (ajuste durante a renderização, sem efeito).
  if (estado.texto !== texto) setEstado({ texto, letras: 0 });
  const letras = reduzir ? texto.length : Math.min(estado.letras, texto.length);
  const completo = letras >= texto.length;

  useEffect(() => {
    if (completo) return;
    const encerrar = comecarPendencia();
    const intervalo = setInterval(() => {
      setEstado((atual) => (atual.texto === texto ? { texto, letras: atual.letras + 1 } : atual));
    }, MS_POR_LETRA);
    return () => {
      clearInterval(intervalo);
      encerrar();
    };
  }, [completo, texto]);

  const completar = useCallback(() => setEstado({ texto, letras: texto.length }), [texto]);
  return { mostrado: texto.slice(0, letras), completo, completar };
}
