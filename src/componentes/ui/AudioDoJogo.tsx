"use client";

import { useEffect } from "react";
import { definirAjustes, liberarAudio, tocarEfeito } from "@/audio/motor";
import { useProgresso } from "@/lib/armazemProgresso";
import { ROTA_MUNDO } from "@/lib/rotas";

/** Gestos que valem como "o jogador interagiu" para a política de autoplay. */
const GESTOS = ["pointerdown", "pointerup", "touchend", "keydown", "click"] as const;

/**
 * Liga o motor de áudio à página: libera o AudioContext a cada gesto (a
 * primeira vez cria; as outras retomam se o navegador suspendeu), toca o
 * "boot" no primeiro gesto na tela inicial e aplica os volumes salvos.
 */
export function AudioDoJogo() {
  const { som, volumeMusica, volumeEfeitos, volumeVoz } = useProgresso();

  useEffect(() => {
    definirAjustes({ mudo: !som, musica: volumeMusica, efeitos: volumeEfeitos, voz: volumeVoz });
  }, [som, volumeMusica, volumeEfeitos, volumeVoz]);

  useEffect(() => {
    let primeiro = true;
    const aoGesto = () => {
      liberarAudio();
      if (!primeiro) return;
      primeiro = false;
      if (window.location.pathname === ROTA_MUNDO) tocarEfeito("boot");
    };
    for (const gesto of GESTOS) window.addEventListener(gesto, aoGesto, { capture: true, passive: true });
    return () => {
      for (const gesto of GESTOS) window.removeEventListener(gesto, aoGesto, { capture: true });
    };
  }, []);

  return null;
}
