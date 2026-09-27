"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { tocarEfeito } from "@/audio/motor";
import type { IdTema } from "@/curriculo/temas";
import { atualizarProgresso, obterProgresso } from "@/lib/armazemProgresso";
import { trilhaDaFonte } from "@/lib/mapa";
import { fracao, marcoAtingido, progressoDoTema } from "@/lib/temas";
import { Insignia } from "./Insignia";
import { TEMAS_COM_ICONE } from "./temas";

/** Espera antes de comemorar: a festa da unidade concluída, na ilha, vem primeiro. */
const ESPERA_MS = 2200;
const DURACAO_MS = 3600;

type Marcada = { tema: IdTema; nome: string; marco: number; fracao: number };

/** Os temas que passaram de um marco (25, 50, 75, 100%) desde a última comemoração. */
function marcosNovos(): Marcada[] {
  const progresso = obterProgresso();
  const trilha = trilhaDaFonte({ progresso });
  return TEMAS_COM_ICONE.flatMap((tema) => {
    const conta = progressoDoTema(tema.id, trilha, progresso);
    const marco = marcoAtingido(conta);
    return marco > (progresso.marcosInsignias[tema.id] ?? 0) ? [{ tema: tema.id, nome: tema.nome, marco, fracao: fracao(conta) }] : [];
  });
}

/**
 * Comemoração curta quando uma insígnia atinge um marco: a medalha pula no
 * topo da tela, com o som de insígnia, e o marco fica salvo para não
 * repetir. Não segura toque nenhum.
 */
export function ComemoracaoInsignia() {
  const [novos] = useState(marcosNovos);
  const [mostrando, setMostrando] = useState(false);

  useEffect(() => {
    if (novos.length === 0) return;
    const comecar = setTimeout(() => {
      setMostrando(true);
      tocarEfeito("insignia");
      atualizarProgresso((atual) => ({
        ...atual,
        marcosInsignias: {
          ...atual.marcosInsignias,
          ...Object.fromEntries(novos.map((item) => [item.tema, Math.max(item.marco, atual.marcosInsignias[item.tema] ?? 0)])),
        },
      }));
    }, ESPERA_MS);
    const acabar = setTimeout(() => setMostrando(false), ESPERA_MS + DURACAO_MS);
    return () => {
      clearTimeout(comecar);
      clearTimeout(acabar);
    };
  }, [novos]);

  const [primeiro] = novos;
  return (
    <AnimatePresence>
      {mostrando && primeiro && (
        <motion.div
          role="status"
          data-comemoracao-insignia={primeiro.tema}
          className="pointer-events-none fixed inset-x-0 top-[7.5rem] z-[55] flex justify-center px-4"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          <div className="flex items-center gap-3 rounded-3xl border-4 border-destaque bg-superficie px-4 py-2.5 shadow-[0_8px_0_var(--cor-sombra)]">
            <motion.span initial={{ rotate: -20 }} animate={{ rotate: [-20, 12, 0] }} transition={{ duration: 0.7 }} className="inline-flex">
              <Insignia tema={primeiro.tema} fracao={primeiro.fracao} tamanho={56} />
            </motion.span>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-texto-suave">Insígnia</p>
              <p className="text-lg font-black text-texto">
                {primeiro.nome}: {primeiro.marco}%
              </p>
              {novos.length > 1 && <p className="text-xs font-bold text-texto-suave">e mais {novos.length - 1} no painel Insígnias</p>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
