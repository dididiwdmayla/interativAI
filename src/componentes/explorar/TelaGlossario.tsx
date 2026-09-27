"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMusicaDaTela } from "@/audio/ganchos";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { BarraMapa } from "@/componentes/mapa/BarraMapa";
import { useProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import { buscarNoGlossario, destinoDaFase, type DestinoFase, montarGlossario } from "@/lib/glossario";
import { ROTA_MUNDO } from "@/lib/rotas";
import { VerbeteGlossario } from "./VerbeteGlossario";

/** Volta para onde a pessoa estava (a fase, o mapa); aberto direto pelo endereço, vai ao mundo. */
function BotaoVoltar() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => (window.history.length > 1 ? router.back() : router.push(ROTA_MUNDO))}
      className="flex h-11 shrink-0 items-center gap-1 rounded-full border-2 border-borda bg-superficie pl-2 pr-3 text-sm font-black text-texto hover:border-primaria hover:text-primaria"
    >
      <IconeChevron direcao="esquerda" tamanho={14} />
      Voltar
    </button>
  );
}

/**
 * O glossário vivo (/glossario): todo conceito do jogo, com busca que
 * ignora acento e maiúscula (nome e resumo), os temas, onde aprender e
 * onde praticar. Fase liberada abre direto; trancada leva ao ponto da
 * unidade no mapa ("Você chega lá na Ilha X"). /glossario#<id> abre no
 * verbete.
 */
export function TelaGlossario() {
  const carregado = useProgressoCarregado();
  useMusicaDaTela({ tipo: "mundo" });
  if (!carregado) return <TelaCarregando />;
  return <GlossarioCarregado />;
}

function GlossarioCarregado() {
  const progresso = useProgresso();
  const [busca, setBusca] = useState("");
  const entradas = useMemo(() => montarGlossario(), []);
  const achadas = buscarNoGlossario(entradas, busca);
  const destinos = (ids: readonly string[]): DestinoFase[] =>
    ids.map((id) => destinoDaFase(id, progresso)).filter((item): item is DestinoFase => item !== null);

  // Aberto num verbete (/glossario#margin-css): rola até ele.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <div className="flex h-dvh flex-col bg-fundo" data-tela="glossario">
      <BarraMapa caminho={["Glossário"]} voltar={<BotaoVoltar />} />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="sticky top-0 z-10 -mx-4 bg-fundo px-4 pb-3 pt-4 sm:-mx-6 sm:px-6">
            <h1 className="text-2xl font-black text-texto">Glossário</h1>
            <label className="mt-2 block">
              <span className="sr-only">Buscar no glossário</span>
              <input
                type="search"
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
                placeholder="Buscar um termo, como margem ou link"
                aria-label="Buscar no glossário"
                className="h-11 w-full rounded-full border-2 border-borda bg-superficie px-4 text-base font-bold text-texto outline-none placeholder:text-texto-suave focus:border-primaria"
              />
            </label>
            <p role="status" className="mt-1.5 text-xs font-bold text-texto-suave" data-glossario-contagem={achadas.length}>
              {achadas.length === 0
                ? "Nenhum termo com isso. Tente outra palavra."
                : `${achadas.length} ${achadas.length === 1 ? "termo" : "termos"}`}
            </p>
          </div>
          <ul className="flex flex-col gap-3">
            {achadas.map((entrada) => (
              <VerbeteGlossario key={entrada.conceito.id} entrada={entrada} destinos={destinos} />
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
