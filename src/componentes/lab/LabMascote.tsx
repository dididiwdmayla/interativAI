"use client";

import { useState } from "react";
import { Carinha, type TomCarinha, type VarianteCarinha } from "@/componentes/mascote/Carinha";
import { Mascote } from "@/componentes/mascote/Mascote";
import { EXPRESSOES, type Expressao } from "@/motor/expressao";
import { TEMAS } from "@/tema/temas";

const VARIANTES: readonly VarianteCarinha[] = ["feliz", "dormindo", "surpresa"];
const TONS: readonly TomCarinha[] = ["destaque", "sucesso", "primaria", "suave"];

/** Bancada de ajustes visuais: todas as expressões e carinhas em todos os temas. */
export function LabMascote() {
  const [aoVivo, setAoVivo] = useState<Expressao>("feliz");

  return (
    <main className="min-h-dvh bg-fundo p-6 text-texto">
      <header className="mb-6 flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-black text-primaria">Laboratório do mascote</h1>
        <p className="text-texto-suave">
          Todas as expressões e carinhas, em todos os temas (inclusive o secreto).
        </p>
      </header>

      <section className="mb-8 rounded-2xl border-2 border-borda bg-superficie p-4" aria-label="Transição ao vivo">
        <h2 className="mb-3 font-black">Transição ao vivo</h2>
        <div className="flex flex-wrap items-center gap-6">
          <Mascote expressao={aoVivo} tamanho={180} />
          <div className="flex flex-wrap gap-2">
            {EXPRESSOES.map((expressao) => (
              <button
                key={expressao}
                type="button"
                onClick={() => setAoVivo(expressao)}
                aria-pressed={aoVivo === expressao}
                className={`rounded-full border-2 px-3 py-1 text-sm font-bold ${
                  aoVivo === expressao
                    ? "border-primaria bg-primaria text-sobre-primaria"
                    : "border-borda bg-painel hover:border-primaria"
                }`}
              >
                {expressao}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6">
        {TEMAS.map((tema) => (
          <section
            key={tema.id}
            data-theme={tema.id}
            aria-label={`Tema ${tema.nome}`}
            className="rounded-2xl border-2 border-borda bg-fundo p-4 text-texto"
          >
            <h2 className="mb-3 text-lg font-black text-primaria">
              {tema.nome} <span className="text-sm font-bold text-texto-suave">{tema.descricao}</span>
            </h2>
            <div className="flex flex-wrap gap-4">
              {EXPRESSOES.map((expressao) => (
                <figure
                  key={expressao}
                  className="flex flex-col items-center gap-1 rounded-xl bg-superficie p-3"
                >
                  <Mascote expressao={expressao} tamanho={120} />
                  <figcaption className="text-xs font-bold text-texto-suave">{expressao}</figcaption>
                </figure>
              ))}
              {(["esquerda", "direita"] as const).map((direcao) => (
                <figure
                  key={direcao}
                  className="flex flex-col items-center gap-1 rounded-xl bg-superficie p-3"
                >
                  <Mascote expressao="apontando" direcao={direcao} tamanho={120} />
                  <figcaption className="text-xs font-bold text-texto-suave">apontando ({direcao})</figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl bg-superficie p-3">
              {TONS.map((tom) => (
                <div key={tom} className="flex items-center gap-1.5">
                  {VARIANTES.map((variante) => (
                    <Carinha key={variante} variante={variante} tom={tom} tamanho={28} rotulo={`${variante} ${tom}`} />
                  ))}
                  <span className="text-xs font-bold text-texto-suave">{tom}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
