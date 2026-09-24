"use client";

import { MotionConfig } from "framer-motion";
import { type ReactNode, useEffect } from "react";
import { liberarAudio } from "@/lib/som";

/** Configurações globais do cliente: movimento reduzido e liberação do áudio. */
export function Provedores({ children }: { children: ReactNode }) {
  useEffect(() => {
    const liberar = () => {
      liberarAudio();
      window.removeEventListener("pointerdown", liberar);
      window.removeEventListener("keydown", liberar);
    };
    window.addEventListener("pointerdown", liberar);
    window.addEventListener("keydown", liberar);
    return () => {
      window.removeEventListener("pointerdown", liberar);
      window.removeEventListener("keydown", liberar);
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
