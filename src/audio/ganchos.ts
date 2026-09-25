"use client";

import { useEffect } from "react";
import type { Expressao } from "@/motor/expressao";
import { calar, definirTelaMusical, falar } from "./motor";
import type { TelaDoJogo } from "./telas";
import { HUMOR_DA_EXPRESSAO } from "./vozModem";

/*
 * Camada fina entre o motor de áudio (sem React) e os componentes.
 */

/** A tela diz qual é; a música certa entra (ou continua, se for a mesma). */
export function useMusicaDaTela(tela: TelaDoJogo | null): void {
  const chave = tela ? JSON.stringify(tela) : null;
  useEffect(() => {
    if (chave === null) return;
    definirTelaMusical(JSON.parse(chave) as TelaDoJogo);
  }, [chave]);
}

/**
 * O computadorzinho fala o texto com a voz de modem, uma vez por fala nova.
 * Sair da tela (balão fechado, fala pulada) cala na hora.
 */
export function useVozDoMascote(texto: string, expressao: Expressao, ativa = true): void {
  useEffect(() => {
    if (!ativa) return;
    const id = falar(texto, HUMOR_DA_EXPRESSAO[expressao]);
    return () => calar(id);
  }, [texto, expressao, ativa]);
}
