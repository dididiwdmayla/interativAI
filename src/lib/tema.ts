"use client";

import { atualizarProgresso } from "@/lib/armazemProgresso";
import type { MeuTema } from "@/lib/meuTema";
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

/** Salva (ou troca) o Meu tema e já liga ele no jogo inteiro. */
export function salvarMeuTema(meuTema: MeuTema): void {
  atualizarProgresso((atual) => ({
    ...atual,
    meuTema,
    tema: "meu",
    temasDesbloqueados: atual.temasDesbloqueados.includes("meu") ? atual.temasDesbloqueados : [...atual.temasDesbloqueados, "meu"],
  }));
  aplicarTemaNoDocumento("meu");
}

/** Apaga o Meu tema; se ele estava ligado, volta para o tema de onde ele partiu. */
export function apagarMeuTema(): void {
  let volta: TemaId | null = null;
  atualizarProgresso((atual) => {
    if (atual.tema === "meu") volta = atual.meuTema?.base ?? "doce";
    return {
      ...atual,
      meuTema: null,
      tema: volta ?? atual.tema,
      temasDesbloqueados: atual.temasDesbloqueados.filter((tema) => tema !== "meu"),
    };
  });
  if (volta) aplicarTemaNoDocumento(volta);
}
