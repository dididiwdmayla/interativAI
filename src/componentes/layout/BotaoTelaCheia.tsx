"use client";

import { useEffect, useState } from "react";
import { Dica } from "@/componentes/ui/Dica";

/** O documento permanece montado durante as navegações internas do jogo. */
export function BotaoTelaCheia() {
  const [suporta, setSuporta] = useState(false);
  const [ativa, setAtiva] = useState(false);
  const [pendente, setPendente] = useState(false);
  const [erro, setErro] = useState("");
  useEffect(() => {
    const sincronizar = () => {
      setSuporta(document.fullscreenEnabled === true);
      setAtiva(document.fullscreenElement !== null);
    };
    sincronizar();
    document.addEventListener("fullscreenchange", sincronizar);
    return () => document.removeEventListener("fullscreenchange", sincronizar);
  }, []);

  async function alternar() {
    setPendente(true);
    setErro("");
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setErro("O navegador não permitiu alterar a tela cheia. Tente novamente.");
    } finally {
      setPendente(false);
    }
  }
  if (!suporta) return null;
  const rotulo = ativa ? "Sair da tela cheia" : "Entrar em tela cheia";
  return (
    <div className="relative shrink-0">
      <Dica texto={rotulo} alinhar="fim">
        <button type="button" aria-label={rotulo} aria-pressed={ativa} disabled={pendente} onClick={alternar}
          data-tela-cheia={ativa ? "ativa" : "inativa"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-borda bg-superficie text-texto transition-colors hover:border-primaria hover:text-primaria disabled:opacity-40 pointer-coarse:h-11 pointer-coarse:w-11">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={ativa ? "M3 9h6V3 M15 3v6h6 M21 15h-6v6 M9 21v-6H3" : "M9 3H3v6 M15 3h6v6 M21 15v6h-6 M9 21H3v-6"} />
          </svg>
        </button>
      </Dica>
      {erro && <p role="status" className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border-2 border-borda bg-superficie p-2 text-xs text-texto">{erro}</p>}
    </div>
  );
}
