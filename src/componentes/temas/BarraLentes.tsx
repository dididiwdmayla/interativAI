"use client";

import { tocarEfeito } from "@/audio/motor";
import { IconeFechar } from "@/componentes/icones/IconeFechar";
import { useLayoutJogo } from "@/componentes/jogo/movel/useLayoutJogo";
import { atualizarProgresso, useProgresso } from "@/lib/armazemProgresso";
import { progressoDaLente, resolverLente } from "@/lib/lentes";
import { progressoDaProfissao } from "@/lib/profissoes";
import { trilhaDaFonte } from "@/lib/mapa";
import type { LenteMapa } from "@/lib/progresso";
import { TEMAS_COM_ICONE } from "./temas";

function trocarLente(lente: LenteMapa | null) {
  tocarEfeito("clique");
  atualizarProgresso((atual) => ({ ...atual, lente }));
}

/**
 * A barra de temas do mapa (mundo e ilha): escolher um tema acende as
 * unidades dele em todas as ilhas e mostra o progresso, contando as
 * planejadas ("Segurança: 3 de 14 unidades"). Tocar de novo apaga a lente.
 * Uma lente de profissão (escolhida na tela Profissões) aparece aqui com o
 * progresso do caminho dela.
 */
export function BarraLentes() {
  const progresso = useProgresso();
  const layout = useLayoutJogo();
  const lente = resolverLente(progresso.lente);
  const trilha = trilhaDaFonte({ progresso });
  const conta = lente ? progressoDaLente(lente, trilha, progresso) : null;
  const unidades = conta && conta.total === 1 ? "unidade" : "unidades";
  // Profissão: o progresso é a média ponderada dos temas dela (a tela Profissões explica).
  const resumo =
    lente && conta
      ? lente.profissao
        ? `${lente.nome}: ${Math.round(progressoDaProfissao(lente.profissao, trilha, progresso) * 100)}% do caminho`
        : `${lente.nome}: ${conta.concluidas} de ${conta.total} ${unidades}`
      : null;

  return (
    <div
      className={`relative z-30 flex shrink-0 items-center gap-2 border-b-2 border-borda bg-superficie/95 px-2 sm:px-4 ${
        layout === "paisagem" ? "h-10" : "h-12"
      }`}
      data-barra-lentes
    >
      {lente && conta ? (
        <p
          role="status"
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-destaque py-1 pl-3 pr-1 text-xs font-black text-sobre-destaque"
          data-progresso-lente={`${conta.concluidas}/${conta.total}`}
        >
          <span className="whitespace-nowrap">{resumo}</span>
          <button
            type="button"
            onClick={() => trocarLente(null)}
            aria-label={`Apagar a lente ${lente.nome}`}
            className="grid h-7 w-7 place-items-center rounded-full hover:bg-superficie/40 pointer-coarse:h-9 pointer-coarse:w-9"
          >
            <IconeFechar tamanho={14} />
          </button>
        </p>
      ) : (
        <span className="shrink-0 text-xs font-black uppercase tracking-wide text-texto-suave">Temas</span>
      )}
      <ul className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-1" aria-label="Acender um tema no mapa">
        {TEMAS_COM_ICONE.map((tema) => {
          const ativo = progresso.lente?.tipo === "tema" && progresso.lente.id === tema.id;
          return (
            <li key={tema.id} className="shrink-0">
              <button
                type="button"
                aria-pressed={ativo}
                data-tema={tema.id}
                title={tema.descricao}
                onClick={() => trocarLente(ativo ? null : { tipo: "tema", id: tema.id })}
                className={`flex h-8 items-center gap-1 rounded-full border-2 px-2.5 text-xs font-black transition-colors pointer-coarse:h-9 ${
                  ativo ? "border-primaria bg-primaria text-sobre-primaria" : "border-borda bg-superficie text-texto hover:border-primaria"
                }`}
              >
                <tema.Icone tamanho={15} />
                {tema.nome}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
