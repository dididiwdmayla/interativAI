"use client";

import { useEffect } from "react";
import type { Expressao } from "@/motor/expressao";
import { calar, definirTelaMusical, falar, preCarregarTelaMusical } from "./motor";
import type { TelaDoJogo } from "./telas";
import { HUMOR_DA_EXPRESSAO } from "./vozModem";

/*
 * Camada fina entre o motor de áudio (sem React) e os componentes.
 */

/**
 * A tela diz qual é; a música certa entra (ou continua, se for a mesma).
 * `proxima`: a tela mais provável depois desta, cuja faixa é pré-carregada.
 */
export function useMusicaDaTela(tela: TelaDoJogo | null, proxima: TelaDoJogo | null = null): void {
  const chave = tela ? JSON.stringify(tela) : null;
  const chaveProxima = proxima ? JSON.stringify(proxima) : null;
  useEffect(() => {
    if (chave === null) return;
    definirTelaMusical(JSON.parse(chave) as TelaDoJogo);
  }, [chave]);
  useEffect(() => {
    if (chaveProxima === null) return;
    // Um pouco depois de a tela entrar, para não disputar a rede com a faixa atual.
    const espera = setTimeout(() => preCarregarTelaMusical(JSON.parse(chaveProxima) as TelaDoJogo), 2500);
    return () => clearTimeout(espera);
  }, [chaveProxima]);
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
