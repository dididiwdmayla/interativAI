"use client";

import { useSyncExternalStore } from "react";
import {
  gravarProgressoNoArmazenamento,
  lerProgressoDoArmazenamento,
  PROGRESSO_PADRAO,
  type Progresso,
} from "@/lib/progresso";

/*
 * Armazém único do progresso. Todos os componentes leem daqui e escrevem
 * com atualizarProgresso, que faz ler-modificar-gravar de forma síncrona.
 */

let cache: Progresso | null = null;
const ouvintes = new Set<() => void>();

export function obterProgresso(): Progresso {
  if (cache === null) cache = lerProgressoDoArmazenamento();
  return cache;
}

export function atualizarProgresso(
  alterar: (atual: Progresso) => Progresso,
): void {
  const novo = alterar(obterProgresso());
  if (novo === cache) return;
  cache = novo;
  gravarProgressoNoArmazenamento(novo);
  for (const ouvinte of ouvintes) ouvinte();
}

function assinar(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

function obterNoServidor(): Progresso {
  return PROGRESSO_PADRAO;
}

/** Progresso reativo. No servidor (e na hidratação) devolve o padrão. */
export function useProgresso(): Progresso {
  return useSyncExternalStore(assinar, obterProgresso, obterNoServidor);
}

/** Verdadeiro só depois da hidratação, quando o progresso real já foi lido. */
export function useProgressoCarregado(): boolean {
  return useSyncExternalStore(
    assinar,
    () => true,
    () => false,
  );
}
