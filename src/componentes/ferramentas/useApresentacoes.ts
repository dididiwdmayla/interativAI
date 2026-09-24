"use client";

import { useCallback, useMemo, useState } from "react";
import type { IdFerramenta } from "@/ferramentas/ids";
import { atualizarProgresso, useProgresso } from "@/lib/armazemProgresso";
import type { EtapaFase, PausaMotor } from "@/motor/estadoMotor";
import type { Fase } from "@/motor/tipos";

type Opcoes = {
  fase: Fase;
  etapa: EtapaFase;
  objetivoAtual: number;
  pausa: PausaMotor;
  /** Não começa apresentação nova enquanto algo cobre a tela (conclusão, caixa aberta). */
  bloqueada: boolean;
};

/**
 * Fila de apresentações de ferramentas. Assim que um objetivo fica ativo,
 * apresenta o que falta da fase (depois da introdução) e dos objetivos até
 * ele, na ordem dos dados. O que já foi visto ou pulado fica salvo no
 * progresso e não repete sozinho; "Rever" força uma apresentação.
 */
export function useApresentacoes({ fase, etapa, objetivoAtual, pausa, bloqueada }: Opcoes) {
  const { apresentacoesVistas } = useProgresso();
  const [forcada, setForcada] = useState<IdFerramenta | null>(null);
  const [emCurso, setEmCurso] = useState<IdFerramenta | null>(null);

  const fila = useMemo(() => {
    if (etapa !== "objetivos" || pausa !== null) return [];
    const pedidas = [
      ...(fase.apresentar ?? []),
      ...fase.objetivos.slice(0, objetivoAtual + 1).flatMap((objetivo) => objetivo.apresentar ?? []),
    ];
    return [...new Set(pedidas)].filter((id) => !apresentacoesVistas.includes(id));
  }, [fase, etapa, objetivoAtual, pausa, apresentacoesVistas]);

  // A apresentação que começou vai até o fim, mesmo se o objetivo concluir no meio.
  const proxima = fila[0] ?? null;
  if (emCurso === null && forcada === null && proxima !== null && !bloqueada) {
    setEmCurso(proxima);
  }

  const concluir = useCallback((id: IdFerramenta) => {
    atualizarProgresso((atual) =>
      atual.apresentacoesVistas.includes(id)
        ? atual
        : { ...atual, apresentacoesVistas: [...atual.apresentacoesVistas, id] },
    );
    setEmCurso((atual) => (atual === id ? null : atual));
    setForcada((atual) => (atual === id ? null : atual));
  }, []);

  const rever = useCallback((id: IdFerramenta) => setForcada(id), []);

  return { atual: forcada ?? emCurso, vistas: apresentacoesVistas, concluir, rever };
}
