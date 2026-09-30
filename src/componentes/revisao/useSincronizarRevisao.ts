"use client";

import { useEffect } from "react";
import { atualizarProgresso } from "@/lib/armazemProgresso";
import { diaLocal, sincronizarRevisao } from "@/lib/revisao";

/**
 * Progresso antigo (de antes da revisão existir): os conceitos das fases
 * já concluídas entram na fila para amanhã. Roda uma vez por tela; não
 * grava nada quando não há o que acrescentar.
 */
export function useSincronizarRevisao(): void {
  useEffect(() => {
    atualizarProgresso((atual) => {
      const revisao = sincronizarRevisao(atual.revisao, atual.fasesConcluidas, diaLocal());
      return revisao === atual.revisao ? atual : { ...atual, revisao };
    });
  }, []);
}
