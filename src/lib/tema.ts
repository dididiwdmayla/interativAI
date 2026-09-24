"use client";

import { atualizarProgresso } from "@/lib/armazemProgresso";
import type { TemaId } from "@/tema/temas";

export function aplicarTemaNoDocumento(tema: TemaId): void {
  document.documentElement.setAttribute("data-theme", tema);
}

export function escolherTema(tema: TemaId): void {
  atualizarProgresso((atual) =>
    atual.temasDesbloqueados.includes(tema) ? { ...atual, tema } : atual,
  );
  aplicarTemaNoDocumento(tema);
}

export function desbloquearTema(tema: TemaId): void {
  atualizarProgresso((atual) =>
    atual.temasDesbloqueados.includes(tema)
      ? atual
      : { ...atual, temasDesbloqueados: [...atual.temasDesbloqueados, tema] },
  );
}
