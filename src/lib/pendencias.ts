"use client";

import { useSyncExternalStore } from "react";

/*
 * Pendências do jogo: o que ainda vai mudar a tela sozinho, sem ninguém
 * mexer (um roteiro agendado, a validação que espera o site acalmar, a
 * prévia recarregando, a espera do editor). Enquanto houver alguma, a
 * fase não está "pronta" (`data-pronto` no JogoFase), e os testes de
 * navegador esperam por esse estado em vez de dormir um tempo fixo.
 *
 * Não muda o comportamento de nada: só conta.
 */

let contagem = 0;
const ouvintes = new Set<() => void>();

function avisar() {
  for (const ouvinte of ouvintes) ouvinte();
}

/** Começa uma pendência. A função devolvida encerra (só conta a primeira chamada). */
export function comecarPendencia(): () => void {
  contagem++;
  avisar();
  let encerrada = false;
  return () => {
    if (encerrada) return;
    encerrada = true;
    contagem--;
    avisar();
  };
}

export type TemporizadorRastreado = { cancelar: () => void };

/** setTimeout que conta como pendência até disparar (ou ser cancelado). */
export function agendarRastreado(fazer: () => void, espera: number): TemporizadorRastreado {
  const encerrar = comecarPendencia();
  const id = setTimeout(() => {
    try {
      fazer();
    } finally {
      encerrar();
    }
  }, espera);
  return {
    cancelar: () => {
      clearTimeout(id);
      encerrar();
    },
  };
}

function assinar(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

/** Quantas pendências existem agora (reativo). */
export function usePendencias(): number {
  return useSyncExternalStore(
    assinar,
    () => contagem,
    () => 0,
  );
}
