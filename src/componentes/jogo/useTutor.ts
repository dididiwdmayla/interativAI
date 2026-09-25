"use client";

import { useRef, useState } from "react";
import { tocarEfeito } from "@/audio/motor";
import { perguntarAoTutor } from "@/lib/tutor/perguntarAoTutor";
import {
  FALA_SEM_CHAVE,
  FALA_SEM_SINAL,
  FALA_SOBRECARGA,
  LIMITES_TUTOR,
  type MensagemTutor,
  type TipoErroTutor,
} from "@/lib/tutor/tipos";
import type { DegrauAjuda, Fala } from "@/motor/tipos";

type Opcoes = {
  faseId: string;
  objetivo: { id: string; enunciado: string } | null;
  degrau: DegrauAjuda;
  htmlAtual: string;
  falar: (fala: Fala) => void;
  /** Chance de responder sem ir ao servidor (easter egg). Devolve a fala, se tratou. */
  interceptar?: (pergunta: string) => Fala | null;
};

/** Fala e expressão do mascote para cada tipo de falha. */
function falaDaFalha(tipo: TipoErroTutor): Fala {
  if (tipo === "sobrecarga") return { texto: FALA_SOBRECARGA, expressao: "pensativo" };
  if (tipo === "sem_chave") return { texto: FALA_SEM_CHAVE, expressao: "dormindo" };
  return { texto: FALA_SEM_SINAL, expressao: "preocupado" };
}

/** Conversa com o computadorzinho pela rota /api/tutor. */
export function useTutor({ faseId, objetivo, degrau, htmlAtual, falar, interceptar }: Opcoes) {
  const [pendente, setPendente] = useState<string | null>(null);
  const carregando = pendente !== null;
  const [ultima, setUltima] = useState<{ pergunta: string; fala: Fala } | null>(null);
  /** Pergunta que falhou por sobrecarga: o balão oferece "Tentar de novo". */
  const [repetir, setRepetir] = useState<{ pergunta: string; fala: Fala } | null>(null);
  const historico = useRef<MensagemTutor[]>([]);

  const responder = (pergunta: string, fala: Fala) => {
    falar(fala);
    setUltima({ pergunta, fala });
  };

  const enviar = async (bruta: string) => {
    const pergunta = bruta.trim().slice(0, LIMITES_TUTOR.pergunta);
    if (!pergunta || carregando) return;
    const falaLocal = interceptar?.(pergunta) ?? null;
    if (falaLocal) {
      responder(pergunta, falaLocal);
      return;
    }

    setPendente(pergunta);
    setRepetir(null);
    try {
      const resposta = await perguntarAoTutor({
        faseId,
        objetivoId: objetivo?.id ?? "livre",
        enunciado: objetivo?.enunciado ?? "Modo livre: a fase já foi concluída.",
        degrauAtual: degrau,
        htmlAtual: htmlAtual.slice(0, LIMITES_TUTOR.html),
        pergunta,
        historico: historico.current,
      });
      if (!resposta.ok) {
        tocarEfeito("aviso");
        const fala = falaDaFalha(resposta.tipo);
        responder(pergunta, fala);
        if (resposta.tipo === "sobrecarga") setRepetir({ pergunta, fala });
        return;
      }
      const saida = resposta.saida;
      historico.current = [
        ...historico.current,
        { papel: "aluno" as const, texto: pergunta },
        { papel: "tutor" as const, texto: saida.texto },
      ].slice(-LIMITES_TUTOR.historico);
      responder(pergunta, saida);
    } finally {
      setPendente(null);
    }
  };

  /** Reenvia a mesma pergunta depois de uma sobrecarga. */
  const tentarDeNovo = () => {
    if (repetir) void enviar(repetir.pergunta);
  };

  return { carregando, pendente, ultima, repetir, enviar, tentarDeNovo };
}
