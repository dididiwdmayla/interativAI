"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { AudioDoJogo } from "./AudioDoJogo";

/** Configurações globais do cliente: movimento reduzido e o áudio do jogo. */
export function Provedores({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AudioDoJogo />
      {children}
    </MotionConfig>
  );
}
