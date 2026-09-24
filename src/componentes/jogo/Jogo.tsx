"use client";

import { useState } from "react";
import { BarraSuperior } from "@/componentes/layout/BarraSuperior";
import { AreaMascote } from "@/componentes/mascote/AreaMascote";
import { BotaoInspecionar } from "@/componentes/painel/BotaoInspecionar";
import { Painel } from "@/componentes/painel/Painel";
import { JanelaNavegador } from "@/componentes/preview/JanelaNavegador";
import type { Aba } from "@/motor/abas";

const TRILHA = ["Ilha Sites", "Elementos", "Fase 1"] as const;

export function Jogo() {
  const [aba, setAba] = useState<Aba>("elementos");
  const [inspecionando, setInspecionando] = useState(false);

  return (
    <div className="flex h-dvh flex-col">
      <BarraSuperior trilha={TRILHA} estrelas={3} />
      <main className="flex min-h-0 flex-1 gap-4 p-4">
        <section aria-label="Painel" className="flex min-h-0 w-[45%] flex-col">
          <Painel
            abaAtiva={aba}
            abasDesbloqueadas={["elementos"]}
            aoTrocarAba={setAba}
            ferramentas={
              <BotaoInspecionar
                ativo={inspecionando}
                aoAlternar={() => setInspecionando((valor) => !valor)}
              />
            }
          >
            <div className="flex-1 p-4 text-texto-suave">Árvore de elementos</div>
            <div className="h-1 bg-borda" />
            <div className="flex-1 bg-codigo-fundo p-4 font-codigo text-codigo-texto">
              Editor de código
            </div>
          </Painel>
        </section>
        <section aria-label="Tela do site" className="flex min-h-0 flex-1 flex-col">
          <JanelaNavegador url="padaria-pao-quentinho.site">
            <div className="grid h-full place-items-center text-texto-suave">Prévia do site</div>
          </JanelaNavegador>
        </section>
      </main>
      <AreaMascote
        mascote={<div className="h-24 w-24 rounded-3xl bg-primaria" />}
        fala={<p className="rounded-2xl bg-painel p-3 font-bold">Oi! Eu sou o computadorzinho.</p>}
        objetivos={<p className="text-sm text-texto-suave">Objetivos da fase</p>}
      />
    </div>
  );
}
