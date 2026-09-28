"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { AudioDoJogo } from "./AudioDoJogo";
import { EstiloMeuTema } from "./EstiloMeuTema";

/** Configurações globais do cliente: movimento reduzido, o áudio do jogo e as cores do Meu tema. */
export function Provedores({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AudioDoJogo />
      <EstiloMeuTema />
      {children}
    </MotionConfig>
  );
}
