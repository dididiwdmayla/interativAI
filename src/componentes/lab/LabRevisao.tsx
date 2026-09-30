"use client";

import { useMemo, useState } from "react";
import { JogoFase } from "@/componentes/jogo/JogoFase";
import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { conceitoDoId, ehIdConceito } from "@/conteudo/conceitos";
import { type LocalDaFase, localDaFase } from "@/conteudo";
import { ITENS_REVISAO, itemDoId } from "@/conteudo/revisao";
import { faseDoItem, UNIDADE_REVISAO } from "@/conteudo/revisao/faseDoItem";
import type { ItemRevisao, Unidade } from "@/conteudo/tipos";
import { useProgressoCarregado } from "@/lib/armazemProgresso";
import { faseQueEnsina } from "@/lib/revisao";

type Conceito = { id: string; nome: string; itens: ItemRevisao[] };
type Zona = { nome: string; conceitos: Conceito[] };

/** Os itens agrupados por zona e conceito, na ordem do jogo (a zona de quem ensina o conceito). */
function agrupar(): Zona[] {
  const zonas = new Map<string, Map<string, Conceito>>();
  for (const item of ITENS_REVISAO) {
    const fase = faseQueEnsina(item.conceito);
    const zona = fase ? localDaFase(fase).unidade.zona : "Sem fase que ensine";
    const conceitos = zonas.get(zona) ?? new Map<string, Conceito>();
    const nome = ehIdConceito(item.conceito) ? conceitoDoId(item.conceito).nome : item.conceito;
    const atual = conceitos.get(item.conceito) ?? { id: item.conceito, nome, itens: [] };
    atual.itens.push(item);
    conceitos.set(item.conceito, atual);
    zonas.set(zona, conceitos);
  }
  return [...zonas].map(([nome, conceitos]) => ({ nome, conceitos: [...conceitos.values()] }));
}

/** O item pedido no endereço (/lab/revisao?item=<id>), para abrir direto. */
function itemDoEndereco(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("item");
}

function localDoItem(item: ItemRevisao): LocalDaFase {
  const fase = faseDoItem(item);
  const unidade: Unidade = {
    id: UNIDADE_REVISAO,
    ilha: "Laboratório",
    zona: "Revisão",
    numero: 1,
    titulo: "Revisão do dia",
    meta: { enunciado: "Conferir um item de revisão." },
    fases: [fase.id],
  };
  return { fase, unidade, numero: 1, indice: 0 };
}

/**
 * /lab/revisao, só para conferir a qualidade (fora da navegação do jogo):
 * lista todos os itens de revisão por zona e conceito e abre qualquer um
 * direto, do jeito que a Revisão do dia joga (o tutor só pergunta, o "Me
 * ajuda" para na dica). Nada aqui mexe no progresso nem no agendamento.
 */
export function LabRevisao() {
  const carregado = useProgressoCarregado();
  const zonas = useMemo(() => agrupar(), []);
  const [itemId, setItemId] = useState<string | null>(itemDoEndereco);
  const [rodada, setRodada] = useState(0);

  if (!carregado) return <TelaCarregando />;
  const item = itemId ? itemDoId(itemId) : undefined;

  if (item) {
    const local = localDoItem(item);
    const voltar = () => {
      setItemId(null);
      window.history.replaceState(null, "", "/lab/revisao");
    };
    return (
      <div data-lab-revisao="item" data-item-revisao={item.id} data-conceito={item.conceito}>
        <JogoFase
          key={`${item.id}-${rodada}`}
          fase={local.fase}
          local={local}
          modo="revisao-dia"
          rotaDoMapa="/lab/revisao"
          aoRecomecar={() => setRodada((valor) => valor + 1)}
          aoTerminarRevisao={voltar}
          barra={{ caminho: ["Lab", "Revisão", item.id], tituloMovel: `Lab › ${item.id}` }}
        />
      </div>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-4 p-4" data-lab-revisao="lista">
      <header>
        <h1 className="text-2xl font-black text-primaria">Laboratório da revisão</h1>
        <p className="text-sm font-bold text-texto-suave">
          Só para conferir a qualidade. {ITENS_REVISAO.length} itens; abra qualquer um e jogue. Nada aqui muda o progresso.
        </p>
      </header>
      {zonas.map((zona) => (
        <section key={zona.nome} className="rounded-2xl border-2 border-borda bg-superficie p-4" data-zona={zona.nome}>
          <h2 className="text-lg font-black">
            {zona.nome} <span className="text-sm font-bold text-texto-suave">({zona.conceitos.length} conceitos)</span>
          </h2>
          <ul className="mt-2 space-y-2">
            {zona.conceitos.map((conceito) => (
              <li key={conceito.id} className="flex flex-wrap items-center gap-2" data-conceito={conceito.id}>
                <span className="min-w-40 flex-1 text-sm font-bold">{conceito.nome}</span>
                {conceito.itens.map((it, indice) => (
                  <button
                    key={it.id}
                    type="button"
                    data-abrir-item={it.id}
                    onClick={() => {
                      setItemId(it.id);
                      window.history.replaceState(null, "", `/lab/revisao?item=${it.id}`);
                    }}
                    className="rounded-full border-2 border-borda px-3 py-1 text-xs font-black hover:bg-hover"
                  >
                    {indice + 1} · {it.tipo === "previsao" ? "previsão" : "ação"}
                  </button>
                ))}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
