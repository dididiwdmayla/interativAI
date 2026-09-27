"use client";

import Link from "next/link";
import { useState } from "react";
import { tocarEfeito } from "@/audio/motor";
import { IconeInsignia } from "@/componentes/icones/IconeInsignia";
import { IconeProfissoes } from "@/componentes/icones/IconeProfissoes";
import { IconeTrilhas } from "@/componentes/icones/IconeTrilhas";
import { PainelInsignias } from "@/componentes/temas/PainelInsignias";
import { BotaoGlossario } from "./BotaoGlossario";
import { useProgresso } from "@/lib/armazemProgresso";
import { trilhaDaFonte } from "@/lib/mapa";
import { ROTA_PROFISSOES, ROTA_TRILHAS } from "@/lib/rotas";

type Props = {
  /** No menu do celular: um item por linha, com o nome inteiro. */
  noMenu?: boolean;
};

/** Os caminhos para explorar o jogo por outros ângulos, na barra do mapa: trilhas, profissões, glossário e insígnias. */
export function LinksExplorar({ noMenu = false }: Props) {
  const progresso = useProgresso();
  const trilha = trilhaDaFonte({ progresso });
  const classe = noMenu
    ? "flex h-11 items-center gap-2 rounded-xl px-2 text-sm font-black text-texto hover:bg-hover"
    : "flex h-9 items-center gap-1.5 rounded-full border-2 border-borda bg-superficie px-3 text-sm font-black text-texto transition-colors hover:border-primaria hover:text-primaria";
  const [insignias, setInsignias] = useState(false);
  return (
    <>
      <Link href={ROTA_TRILHAS} onClick={() => tocarEfeito("clique")} className={classe} aria-label={`Trilhas (atual: ${trilha.nome})`}>
        <IconeTrilhas />
        <span className={noMenu ? "" : "hidden lg:inline"}>Trilha {trilha.nome}</span>
      </Link>
      <Link href={ROTA_PROFISSOES} onClick={() => tocarEfeito("clique")} className={classe} aria-label="Profissões">
        <IconeProfissoes />
        <span className={noMenu ? "" : "hidden lg:inline"}>Profissões</span>
      </Link>
      <BotaoGlossario noMenu={noMenu} />
      <button
        type="button"
        className={classe}
        aria-label="Abrir o painel Insígnias"
        onClick={() => {
          tocarEfeito("abrir-painel");
          setInsignias(true);
        }}
      >
        <IconeInsignia />
        <span className={noMenu ? "" : "hidden lg:inline"}>Insígnias</span>
      </button>
      <PainelInsignias aberto={insignias} aoFechar={() => setInsignias(false)} />
    </>
  );
}
