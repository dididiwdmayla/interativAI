"use client";

import { useEffect } from "react";
import { definirAjustes, liberarAudio, prepararAudio, tocarEfeito } from "@/audio/motor";
import { useProgresso } from "@/lib/armazemProgresso";
import { ROTA_MUNDO } from "@/lib/rotas";

/** Gestos que valem como "o jogador interagiu" para a política de autoplay. */
const GESTOS = ["pointerdown", "pointerup", "touchend", "keydown", "click"] as const;

/**
 * Liga o motor de áudio à página: baixa os manifestos (e, na tela inicial,
 * o arquivo do boot) antes de qualquer gesto, libera o AudioContext a cada
 * gesto (a primeira vez cria; as outras retomam se o navegador suspendeu),
 * toca o "boot" no primeiro gesto na tela inicial e aplica os volumes salvos.
 */
export function AudioDoJogo() {
  const { som, volumeMusica, volumeEfeitos, volumeVoz } = useProgresso();

  useEffect(() => {
    definirAjustes({ mudo: !som, musica: volumeMusica, efeitos: volumeEfeitos, voz: volumeVoz });
  }, [som, volumeMusica, volumeEfeitos, volumeVoz]);

  useEffect(() => {
    prepararAudio({ boot: window.location.pathname === ROTA_MUNDO });
    let primeiro = true;
    const aoGesto = () => {
      liberarAudio();
      if (!primeiro) return;
      primeiro = false;
      // O arquivo do boot já vem decodificado; se não deu tempo, toca o sintetizado.
      if (window.location.pathname === ROTA_MUNDO) tocarEfeito("boot", { naHora: true });
    };
    for (const gesto of GESTOS) window.addEventListener(gesto, aoGesto, { capture: true, passive: true });
    return () => {
      for (const gesto of GESTOS) window.removeEventListener(gesto, aoGesto, { capture: true });
    };
  }, []);

  return null;
}
