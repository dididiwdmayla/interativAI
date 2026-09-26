"use client";

import { useState } from "react";
import { IconeFechar } from "@/componentes/icones/IconeFechar";
import { Botao } from "@/componentes/ui/Botao";
import { SeletorSegmentado } from "@/componentes/ui/SeletorSegmentado";
import { FASES, UNIDADES } from "@/conteudo";
import { FASES_LABORATORIO } from "@/conteudo/laboratorio/bancadaEstilos";
import { ListaChecagens } from "./ListaChecagens";
import { ListaValidadores } from "./ListaValidadores";
import { TabelaIndice } from "./TabelaIndice";
import type { ApiLab } from "./tipos";

type Props = {
  api: ApiLab;
  faseId: string;
  aoTrocarFase: (id: string) => void;
  aoResetar: () => void;
};

type Aba = "validadores" | "checagens" | "indice";

/** Gaveta do /lab/fases: escolher fase, ver validadores ao vivo, aplicar solução, resetar. */
export function PainelLab({ api, faseId, aoTrocarFase, aoResetar }: Props) {
  const [aberto, setAberto] = useState(true);
  const [aba, setAba] = useState<Aba>("validadores");
  const [erro, setErro] = useState<string | null>(null);

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="fixed right-2 top-16 z-[55] rounded-full border-2 border-primaria bg-superficie px-3 py-1.5 text-sm font-black text-primaria shadow-[0_4px_0_var(--cor-sombra)]"
      >
        Lab
      </button>
    );
  }

  return (
    <aside
      aria-label="Lab de fases"
      data-lab
      className="fixed bottom-2 right-2 top-16 z-[55] flex w-[min(400px,calc(100vw-16px))] flex-col rounded-2xl border-2 border-borda bg-painel text-texto shadow-[0_8px_0_var(--cor-sombra)]"
    >
      <header className="flex items-center gap-2 border-b-2 border-borda px-3 py-2">
        <h2 className="flex-1 text-sm font-black uppercase tracking-wide">Lab de fases</h2>
        <button
          type="button"
          onClick={() => setAberto(false)}
          aria-label="Recolher o lab"
          className="grid h-8 w-8 place-items-center rounded-full text-texto-suave hover:bg-hover hover:text-texto"
        >
          <IconeFechar />
        </button>
      </header>
      <div className="space-y-2 border-b-2 border-borda p-3">
        <label className="block text-xs font-bold text-texto-suave">
          Fase
          <select
            value={faseId}
            onChange={(evento) => aoTrocarFase(evento.target.value)}
            className="mt-1 block w-full rounded-lg border-2 border-borda bg-superficie px-2 py-1.5 text-sm font-bold text-texto"
          >
            {UNIDADES.map((unidade) => (
              <optgroup key={unidade.id} label={`Unidade ${unidade.numero}: ${unidade.titulo}`}>
                {unidade.fases.map((id) => {
                  const fase = FASES.find((item) => item.id === id);
                  return (
                    <option key={id} value={id}>
                      {id} {fase ? `(${fase.titulo})` : ""}
                    </option>
                  );
                })}
              </optgroup>
            ))}
            <optgroup label="Bancada do motor (fora do currículo)">
              {FASES_LABORATORIO.map((fase) => (
                <option key={fase.id} value={fase.id}>
                  {fase.id} ({fase.titulo})
                </option>
              ))}
            </optgroup>
          </select>
        </label>
        <div className="flex flex-wrap gap-2">
          <Botao tamanho="p" onClick={() => setErro(api.aplicarSolucaoAtual())}>
            Aplicar solução do objetivo atual
          </Botao>
          <Botao
            tamanho="p"
            variante="secundario"
            onClick={() => {
              setErro(null);
              aoResetar();
            }}
          >
            Resetar fase
          </Botao>
        </div>
        {erro && <p className="rounded-lg bg-superficie p-2 font-codigo text-xs text-erro">{erro}</p>}
      </div>
      <div className="px-3 pt-2">
        <SeletorSegmentado
          rotulo="O que ver no lab"
          opcoes={[
            { id: "validadores", rotulo: "Validadores" },
            { id: "checagens", rotulo: "Checagens" },
            { id: "indice", rotulo: "Conceitos" },
          ]}
          valor={aba}
          aoTrocar={setAba}
          className="w-full"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {aba === "validadores" && <ListaValidadores itens={api.avaliarItens()} />}
        {aba === "checagens" && <ListaChecagens />}
        {aba === "indice" && <TabelaIndice />}
      </div>
    </aside>
  );
}
