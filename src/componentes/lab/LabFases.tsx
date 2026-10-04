"use client";

import { useState } from "react";
import { JogoFase } from "@/componentes/jogo/JogoFase";
import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { FASE_INICIAL, faseDoId, type LocalDaFase, localDaFase } from "@/conteudo";
import { FASES_LABORATORIO, UNIDADES_LABORATORIO } from "@/conteudo/laboratorio/bancadaEstilos";
import type { Fase } from "@/conteudo/tipos";
import { atualizarProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import { PainelLab } from "./PainelLab";

/** Fase do conteúdo ou da bancada do motor (fora do currículo). */
function faseDoLab(id: string): { fase: Fase; local: LocalDaFase } | null {
  const doConteudo = faseDoId(id);
  if (doConteudo) return { fase: doConteudo, local: localDaFase(doConteudo) };
  const daBancada = FASES_LABORATORIO.find((fase) => fase.id === id);
  const unidade = daBancada ? UNIDADES_LABORATORIO.find((item) => item.id === daBancada.unidadeId) : undefined;
  if (!daBancada || !unidade) return null;
  return { fase: daBancada, local: { fase: daBancada, unidade, numero: unidade.fases.indexOf(daBancada.id) + 1, indice: -1 } };
}

/** A fase pedida no endereço (/lab/fases?fase=<id>), para abrir direto. */
function faseDoEndereco(): string {
  if (typeof window === "undefined") return FASE_INICIAL.id;
  return new URLSearchParams(window.location.search).get("fase") ?? FASE_INICIAL.id;
}

/**
 * /lab/fases?fase=<id>&modo=jogo: a fase abre como no jogo (meta com antes e
 * depois, apresentações, estrelas, progresso salvo e o Rever do desafio),
 * sem a gaveta do lab. Serve para jogar uma bancada do começo ao fim, como a
 * do desafio composto.
 */
function comoNoJogo(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("modo") === "jogo";
}

/**
 * /lab/fases: abre qualquer fase direto no primeiro objetivo, sem salvar
 * progresso e sem apresentações, com a gaveta do lab por cima. Também abre
 * as fases de bancada do motor (src/conteudo/laboratorio), fora do
 * currículo.
 */
export function LabFases() {
  const carregado = useProgressoCarregado();
  const [faseId, setFaseId] = useState(faseDoEndereco);
  const [rodada, setRodada] = useState(0);
  const [jogo] = useState(comoNoJogo);
  /** (Como no jogo) A fase aberta pelo Rever do desafio, em modo revisão. */
  const [revendo, setRevendo] = useState<string | null>(null);

  if (!carregado) return <TelaCarregando />;
  const { fase, local } = faseDoLab(revendo ?? faseId) ?? { fase: FASE_INICIAL, local: localDaFase(FASE_INICIAL) };

  const resetar = () => setRodada((valor) => valor + 1);

  if (jogo) {
    const recomecar = () => {
      atualizarProgresso((atual) => {
        const fasesEmAndamento = { ...atual.fasesEmAndamento };
        delete fasesEmAndamento[fase.id];
        return { ...atual, fasesEmAndamento };
      });
      resetar();
    };
    return (
      <JogoFase
        key={`${fase.id}-${revendo ? "revisao" : "jogo"}-${rodada}`}
        fase={fase}
        local={local}
        modo={revendo ? "revisao" : "jogo"}
        aoRecomecar={recomecar}
        aoRever={(id) => setRevendo(id)}
        aoVoltarAoDesafio={() => setRevendo(null)}
        buscarFase={(id) => faseDoLab(id)?.fase}
      />
    );
  }

  return (
    <JogoFase
      key={`${fase.id}-${rodada}`}
      fase={fase}
      local={local}
      modo="lab"
      aoRecomecar={resetar}
      painelLab={(api) => (
        <PainelLab
          api={api}
          faseId={fase.id}
          aoTrocarFase={(id) => {
            setFaseId(id);
            resetar();
          }}
          aoResetar={resetar}
        />
      )}
    />
  );
}
