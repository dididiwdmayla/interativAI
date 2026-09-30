"use client";

import Link from "next/link";
import { Mascote } from "@/componentes/mascote/Mascote";
import { Botao } from "@/componentes/ui/Botao";
import { conceitoDoId } from "@/conteudo/conceitos";
import { type EstadoRevisao, type ItemDaSessao, quandoVolta, type ResultadoItem, sequenciaDeHoje } from "@/lib/revisao";
import { ROTA_MUNDO, rotaDaFase } from "@/lib/rotas";

export type ResultadoDaSessao = { parte: ItemDaSessao; resultado: ResultadoItem };

const ROTULO: Record<ResultadoItem, string> = {
  "sem-ajuda": "Lembrou sozinho",
  "com-ajuda": "Lembrou com uma ajudinha",
  errou: "Ainda não firmou",
};

type Props = {
  tipo: "hoje" | "treino";
  resultados: readonly ResultadoDaSessao[];
  revisao: EstadoRevisao;
  hoje: string;
  /** Quantos ainda vencem hoje (para "Mais uma rodada"). */
  restantes: number;
  aoTreinar: () => void;
  aoContinuar: () => void;
};

/**
 * O fim da sessão: por conceito, como foi e quando volta, com o link para
 * a fase onde ele foi ensinado, e a sequência de dias. A sequência quebrada
 * não ganha bronca: só recomeça, com o número novo.
 */
export function ResumoRevisao({ tipo, resultados, revisao, hoje, restantes, aoTreinar, aoContinuar }: Props) {
  if (resultados.length === 0) {
    return (
      <section className="rounded-3xl border-2 border-borda bg-superficie p-5" data-revisao-resumo data-vazio>
        <div className="flex items-start gap-3">
          <Mascote expressao="pensativo" tamanho={64} className="shrink-0" />
          <p className="text-sm font-bold text-texto">
            Ainda não tem nada para treinar aqui. Conclua uma fase no mapa e o assunto dela aparece no porto no dia seguinte.
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <Link href={ROTA_MUNDO} className="font-black text-primaria underline">
            Voltar ao mapa
          </Link>
        </div>
      </section>
    );
  }
  const sequencia = sequenciaDeHoje(revisao, hoje);
  const lembrou = resultados.filter((item) => item.resultado !== "errou").length;
  return (
    <section className="rounded-3xl border-2 border-borda bg-superficie p-5 shadow-[0_4px_0_var(--cor-sombra)]" data-revisao-resumo>
      <div className="flex items-start gap-3">
        <Mascote expressao="comemorando" tamanho={72} className="shrink-0" />
        <div className="min-w-0">
          <h1 className="text-2xl font-black text-texto">{tipo === "treino" ? "Treino feito!" : "Revisão feita!"}</h1>
          <p className="mt-1 text-sm font-bold text-texto-suave">
            Você lembrou {lembrou} de {resultados.length}. O que ainda não firmou volta amanhã, sem pressa.
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-painel px-3 py-1 text-sm font-black text-texto" data-sequencia={sequencia}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M8 1.5c1.8 2.6 4.5 4.4 4.5 8a4.5 4.5 0 0 1-9 0c0-2 1-3.2 2-4.2.2 1.4.9 2.3 1.9 2.7C7 5.8 7.3 3.6 8 1.5z" fill="var(--cor-destaque)" />
            </svg>
            {sequencia <= 1 ? "Primeiro dia da sequência" : `${sequencia} dias seguidos`}
          </p>
        </div>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {resultados.map(({ parte, resultado }, indice) => {
          const estado = revisao.conceitos[parte.conceito];
          return (
            <li
              key={`${parte.item.id}-${indice}`}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border-2 border-borda bg-fundo px-3 py-2"
              data-resumo-conceito={parte.conceito}
              data-resultado={resultado}
            >
              <span className="min-w-0 flex-1">
                <span className="block font-black text-texto">{conceitoDoId(parte.conceito).nome}</span>
                <span className={`text-xs font-bold ${resultado === "errou" ? "text-alerta" : "text-sucesso"}`}>{ROTULO[resultado]}</span>
              </span>
              <span className="text-xs font-black text-texto-suave" data-volta>
                {estado ? `Volta ${quandoVolta(estado, hoje)}` : ""}
              </span>
              {parte.faseQueEnsina && (
                <Link href={rotaDaFase(parte.faseQueEnsina)} className="text-xs font-black text-primaria underline" data-rever-onde-aprendi>
                  Rever onde aprendi
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Link href={ROTA_MUNDO} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-black text-texto-suave hover:text-texto" data-voltar-mapa>
          Voltar ao mapa
        </Link>
        {tipo === "hoje" && restantes > 0 ? (
          <Botao onClick={aoContinuar}>Mais uma rodada</Botao>
        ) : (
          <Botao variante="secundario" onClick={aoTreinar}>
            Treino livre
          </Botao>
        )}
      </div>
    </section>
  );
}
