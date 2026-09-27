"use client";

import Link from "next/link";
import { tocarEfeito } from "@/audio/motor";
import { IconeTrilhas } from "@/componentes/icones/IconeTrilhas";
import { useProgresso } from "@/lib/armazemProgresso";
import { trilhaDaFonte } from "@/lib/mapa";
import { ROTA_TRILHAS } from "@/lib/rotas";

type Props = {
  /** No menu do celular: um item por linha, com o nome inteiro. */
  noMenu?: boolean;
};

/** Os caminhos para explorar o jogo por outros ângulos, na barra do mapa: as trilhas. */
export function LinksExplorar({ noMenu = false }: Props) {
  const progresso = useProgresso();
  const trilha = trilhaDaFonte({ progresso });
  const classe = noMenu
    ? "flex h-11 items-center gap-2 rounded-xl px-2 text-sm font-black text-texto hover:bg-hover"
    : "flex h-9 items-center gap-1.5 rounded-full border-2 border-borda bg-superficie px-3 text-sm font-black text-texto transition-colors hover:border-primaria hover:text-primaria";
  return (
    <Link href={ROTA_TRILHAS} onClick={() => tocarEfeito("clique")} className={classe} aria-label={`Trilhas (atual: ${trilha.nome})`}>
      <IconeTrilhas />
      <span className={noMenu ? "" : "hidden lg:inline"}>Trilha {trilha.nome}</span>
    </Link>
  );
}
