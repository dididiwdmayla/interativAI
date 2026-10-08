"use client";

import { useEffect, useState } from "react";
import { agendarRastreado } from "@/lib/pendencias";

/** Quanto a fala do anfitrião fica na tela, depois de terminar de aparecer, antes de dar a vez à próxima. */
const ESPERA_DEPOIS_DA_FALA_MS = 1500;

/**
 * A fila do anfitrião do museu: uma fala nova espera a de agora terminar de
 * aparecer (no jeito da época) e ficar um tempinho na tela. Antes, a fala
 * trocava no meio da frase quando o aluno fazia duas partes do desafio
 * seguidas. Devolve a fala da vez e o aviso de que ela terminou.
 */
export function useFilaDoAnfitriao(fala: string): { mostrada: string; aoCompletar: () => void } {
  const [mostrada, setMostrada] = useState(fala);
  const [fila, setFila] = useState<string[]>([]);
  /** Quando a fala da vez terminou de aparecer (null: ainda aparecendo). */
  const [completaDesde, setCompletaDesde] = useState<number | null>(null);
  const [conhecida, setConhecida] = useState(fala);
  if (conhecida !== fala) {
    setConhecida(fala);
    const ultima = fila[fila.length - 1] ?? mostrada;
    if (fala !== ultima) setFila([...fila, fala]);
  }

  useEffect(() => {
    if (completaDesde === null || fila.length === 0) return;
    const temporizador = agendarRastreado(
      () => {
        setMostrada(fila[0]);
        setFila(fila.slice(1));
        setCompletaDesde(null);
      },
      Math.max(0, completaDesde + ESPERA_DEPOIS_DA_FALA_MS - Date.now()),
    );
    return () => temporizador.cancelar();
  }, [completaDesde, fila]);

  return { mostrada, aoCompletar: () => setCompletaDesde((atual) => atual ?? Date.now()) };
}
