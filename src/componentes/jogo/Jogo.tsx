"use client";

import { useState } from "react";
import { FASE_INICIAL, faseDoId, localDaFase } from "@/conteudo";
import type { Fase } from "@/conteudo/tipos";
import { atualizarProgresso, useProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import { faseLiberada } from "@/lib/liberacao";
import type { EstadoFaseSalvo, Progresso } from "@/lib/progresso";
import { JogoFase } from "./JogoFase";
import { TelaCarregando } from "./TelaCarregando";

/** Revisão aberta pelo "Rever" do desafio: qual fase rever e para qual desafio voltar. */
type Revisao = { faseId: string; desafioId: string };

/** A fase salva como atual, se ainda existir e estiver aberta; senão, a primeira. */
function faseDoProgresso(progresso: Progresso): Fase {
  const salva = progresso.faseAtual ? faseDoId(progresso.faseAtual) : undefined;
  return salva && faseLiberada(salva, progresso) ? salva : FASE_INICIAL;
}

/**
 * Só monta a fase no navegador, depois de ler o progresso salvo. Assim o
 * editor e o iframe já nascem com o HTML de onde o jogador parou. Também
 * cuida da navegação entre fases e da revisão pedida pelo desafio.
 */
export function Jogo() {
  const carregado = useProgressoCarregado();
  const progresso = useProgresso();
  const [rodada, setRodada] = useState(0);
  const [revisao, setRevisao] = useState<Revisao | null>(null);

  if (!carregado) return <TelaCarregando />;

  const faseDoJogo = faseDoProgresso(progresso);
  const fase = revisao ? (faseDoId(revisao.faseId) ?? faseDoJogo) : faseDoJogo;

  const irParaFase = (faseId: string) => {
    setRevisao(null);
    atualizarProgresso((atual) => ({ ...atual, faseAtual: faseId }));
  };

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

  return (
    <JogoFase
      key={`${fase.id}-${revisao ? "revisao" : "jogo"}-${rodada}`}
      fase={fase}
      local={localDaFase(fase)}
      modo={revisao ? "revisao" : "jogo"}
      aoRecomecar={recomecar}
      aoIrParaFase={irParaFase}
      aoRever={(faseId) => setRevisao({ faseId, desafioId: fase.id })}
      aoVoltarAoDesafio={() => setRevisao(null)}
    />
  );
}
