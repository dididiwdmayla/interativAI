"use client";

import { useState } from "react";
import { JogoFase } from "@/componentes/jogo/JogoFase";
import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { FASE_INICIAL, faseDoId, localDaFase } from "@/conteudo";
import { useProgressoCarregado } from "@/lib/armazemProgresso";
import { PainelLab } from "./PainelLab";

/**
 * /lab/fases: abre qualquer fase direto no primeiro objetivo, sem salvar
 * progresso e sem apresentações, com a gaveta do lab por cima.
 */
export function LabFases() {
  const carregado = useProgressoCarregado();
  const [faseId, setFaseId] = useState(FASE_INICIAL.id);
  const [rodada, setRodada] = useState(0);

  if (!carregado) return <TelaCarregando />;
  const fase = faseDoId(faseId) ?? FASE_INICIAL;

  const resetar = () => setRodada((valor) => valor + 1);

  return (
    <JogoFase
      key={`${fase.id}-${rodada}`}
      fase={fase}
      local={localDaFase(fase)}
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
