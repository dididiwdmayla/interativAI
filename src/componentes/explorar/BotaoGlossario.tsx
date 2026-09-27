"use client";

import Link from "next/link";
import { tocarEfeito } from "@/audio/motor";
import { IconeGlossario } from "@/componentes/icones/IconeGlossario";
import { ROTA_GLOSSARIO } from "@/lib/rotas";

type Props = {
  /** No menu do celular: linha inteira, com o nome. */
  noMenu?: boolean;
};

/** "Glossário": na barra do mapa e dentro da fase (o progresso da fase fica salvo, e Voltar traz de volta). */
export function BotaoGlossario({ noMenu = false }: Props) {
  const classe = noMenu
    ? "flex h-11 items-center gap-2 rounded-xl px-2 text-sm font-black text-texto hover:bg-hover"
    : "flex h-9 items-center gap-1.5 rounded-full border-2 border-borda bg-superficie px-3 text-sm font-black text-texto transition-colors hover:border-primaria hover:text-primaria";
  return (
    <Link href={ROTA_GLOSSARIO} onClick={() => tocarEfeito("clique")} className={classe} aria-label="Glossário" data-botao-glossario>
      <IconeGlossario />
      <span className={noMenu ? "" : "hidden lg:inline"}>Glossário</span>
    </Link>
  );
}
