"use client";

import { useRef, useState } from "react";
import { perguntarAoTutor } from "@/lib/tutor/perguntarAoTutor";
import { FALA_SEM_SINAL, LIMITES_TUTOR, type MensagemTutor } from "@/lib/tutor/tipos";
import type { DegrauAjuda, Fala } from "@/motor/tipos";

type Opcoes = {
  faseId: string;
  objetivo: { id: string; enunciado: string } | null;
  degrau: DegrauAjuda;
  htmlAtual: string;
  falar: (fala: Fala) => void;
  /** Chance de responder sem ir ao servidor (easter egg). Devolve true se tratou. */
  interceptar?: (pergunta: string) => boolean;
};

/** Conversa com o computadorzinho pela rota /api/tutor. */
export function useTutor({ faseId, objetivo, degrau, htmlAtual, falar, interceptar }: Opcoes) {
  const [pendente, setPendente] = useState<string | null>(null);
  const carregando = pendente !== null;
  const [ultima, setUltima] = useState<{ pergunta: string; fala: Fala } | null>(null);
  const historico = useRef<MensagemTutor[]>([]);

  const responder = (pergunta: string, fala: Fala) => {
    falar(fala);
    setUltima({ pergunta, fala });
  };

  const enviar = async (bruta: string) => {
    const pergunta = bruta.trim().slice(0, LIMITES_TUTOR.pergunta);
    if (!pergunta || carregando) return;
    if (interceptar?.(pergunta)) {
      setUltima(null);
      return;
    }

    setPendente(pergunta);
    try {
      const saida = await perguntarAoTutor({
        faseId,
        objetivoId: objetivo?.id ?? "livre",
        enunciado: objetivo?.enunciado ?? "Modo livre: a fase já foi concluída.",
        degrauAtual: degrau,
        htmlAtual: htmlAtual.slice(0, LIMITES_TUTOR.html),
        pergunta,
        historico: historico.current,
      });
      historico.current = [
        ...historico.current,
        { papel: "aluno" as const, texto: pergunta },
        { papel: "tutor" as const, texto: saida.texto },
      ].slice(-LIMITES_TUTOR.historico);
      responder(pergunta, saida);
    } catch {
      responder(pergunta, { texto: FALA_SEM_SINAL, expressao: "preocupado" });
    } finally {
      setPendente(null);
    }
  };

  return { carregando, pendente, ultima, enviar };
}
