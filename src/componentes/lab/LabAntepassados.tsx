"use client";

/*
 * O mostruário dos antepassados (/lab/antepassados): cada um falando do
 * jeito da época (o balão e o som), e todos nas quatro expressões, nos
 * três temas. Para conferir um antepassado antes de usar numa sala nova
 * (guia, seção 32).
 */
import { useState } from "react";
import { FalaAntepassado } from "@/componentes/museu/FalaAntepassado";
import { Antepassado } from "@/componentes/museu/antepassados/Antepassado";
import type { ExpressaoAntepassado } from "@/componentes/museu/antepassados/partes";
import { Botao } from "@/componentes/ui/Botao";
import { FICHAS_ANTEPASSADOS, ORDEM_DO_CORREDOR } from "@/motor/exposicao/antepassados";
import type { IdAntepassado } from "@/motor/exposicao/modelo";
import { TEMAS } from "@/tema/temas";

const EXPRESSOES: readonly ExpressaoAntepassado[] = ["feliz", "curioso", "orgulhoso", "dormindo"];

export function LabAntepassados() {
  const [falando, setFalando] = useState<IdAntepassado>("tecela");
  const [vez, setVez] = useState(0);
  return (
    <main className="min-h-dvh bg-fundo p-4 text-texto sm:p-6">
      <header className="mb-6 flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-black text-primaria">Antepassados</h1>
        <p className="text-texto-suave">A família do computadorzinho, cada um com o seu jeito de falar. Cores só por tokens (--cor-ante-*, --cor-museu-*).</p>
      </header>
      <section className="mb-6 rounded-2xl border-2 border-borda bg-painel p-4" aria-label="Antepassado falando">
        <div className="mb-3 flex flex-wrap gap-2">
          {ORDEM_DO_CORREDOR.map((id) => (
            <Botao
              key={id}
              variante={id === falando ? "primario" : "secundario"}
              tamanho="p"
              onClick={() => {
                setFalando(id);
                setVez((atual) => atual + 1);
              }}
            >
              {FICHAS_ANTEPASSADOS[id].nome}
            </Botao>
          ))}
        </div>
        <FalaAntepassado key={`${falando}-${vez}`} id={falando} texto={FICHAS_ANTEPASSADOS[falando].saudacao} tamanho={140} />
      </section>
      <div className="grid gap-8">
        {TEMAS.filter((tema) => !tema.doJogador).map((tema) => (
          <section key={tema.id} data-theme={tema.id} aria-label={`Tema ${tema.nome}`} className="rounded-2xl border-2 border-borda bg-fundo p-4 text-texto">
            <h2 className="mb-3 text-lg font-black text-primaria">{tema.nome}</h2>
            {ORDEM_DO_CORREDOR.filter((id) => id !== "computadorzinho").map((id) => (
              <div key={id} className="mb-4">
                <h3 className="mb-2 font-black">
                  {FICHAS_ANTEPASSADOS[id].nome} <span className="font-bold text-texto-suave">· {FICHAS_ANTEPASSADOS[id].epoca}</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {EXPRESSOES.map((expressao) => (
                    <figure key={expressao} className="flex flex-col items-center gap-1 rounded-xl border-2 border-borda bg-[var(--cor-museu-parede)] p-2">
                      <Antepassado id={id} expressao={expressao} tamanho={120} />
                      <figcaption className="text-xs font-bold text-texto-suave">{expressao}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
