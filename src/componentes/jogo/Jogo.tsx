"use client";

import { useState } from "react";
import { FASE_INICIAL, localDaFase } from "@/conteudo";
import { atualizarProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import type { EstadoFaseSalvo } from "@/lib/progresso";
import { JogoFase } from "./JogoFase";
import { TelaCarregando } from "./TelaCarregando";

/**
 * Só monta a fase no navegador, depois de ler o progresso salvo. Assim o
 * editor e o iframe já nascem com o HTML de onde o jogador parou.
 */
export function Jogo() {
  const carregado = useProgressoCarregado();
  const [rodada, setRodada] = useState(0);

  if (!carregado) return <TelaCarregando />;

  const fase = FASE_INICIAL;
  if (fase.tipo !== "pratica") return null;

  const recomecar = () => {
    atualizarProgresso((atual) => {
      const fasesEmAndamento: Record<string, EstadoFaseSalvo> = {};
      for (const [id, estado] of Object.entries(atual.fasesEmAndamento)) {
        if (id !== fase.id) fasesEmAndamento[id] = estado;
      }
      return { ...atual, fasesEmAndamento };
    });
    setRodada((valor) => valor + 1);
  };

  return <JogoFase key={rodada} fase={fase} local={localDaFase(fase)} aoRecomecar={recomecar} />;
}
