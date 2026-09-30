"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMusicaDaTela } from "@/audio/ganchos";
import { tocarEfeito } from "@/audio/motor";
import { JogoFase } from "@/componentes/jogo/JogoFase";
import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { BarraMapa } from "@/componentes/mapa/BarraMapa";
import { Mascote } from "@/componentes/mascote/Mascote";
import { Botao } from "@/componentes/ui/Botao";
import type { LocalDaFase } from "@/conteudo";
import { faseDoItem, UNIDADE_REVISAO } from "@/conteudo/revisao/faseDoItem";
import type { Unidade } from "@/conteudo/tipos";
import { atualizarProgresso, obterProgresso, useProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import {
  aplicarResultado,
  diaLocal,
  type ItemDaSessao,
  registrarSessao,
  type ResultadoItem,
  sessaoDeHoje,
  treinoLivre,
  vencidosHoje,
} from "@/lib/revisao";
import { ROTA_MUNDO } from "@/lib/rotas";
import { ResumoRevisao, type ResultadoDaSessao } from "./ResumoRevisao";
import { useSincronizarRevisao } from "./useSincronizarRevisao";

type Sessao = {
  /** "hoje": os vencidos; "treino": o treino livre (efeito menor no agendamento). */
  tipo: "hoje" | "treino";
  itens: ItemDaSessao[];
  indice: number;
  resultados: ResultadoDaSessao[];
  /** O dia em que a sessão começou (virar a meia-noite no meio não muda nada). */
  dia: string;
};

/** A unidade de mentirinha que a barra e o motor esperam. */
function localDoItem(parte: ItemDaSessao, indice: number): LocalDaFase {
  const fase = faseDoItem(parte.item);
  const unidade: Unidade = {
    id: UNIDADE_REVISAO,
    ilha: "Revisão do dia",
    zona: "Porto da revisão",
    numero: 1,
    titulo: "Revisão do dia",
    meta: { enunciado: "Relembrar o que você já aprendeu." },
    fases: [fase.id],
  };
  return { fase, unidade, numero: indice + 1, indice: 0 };
}

/**
 * A Revisão do dia (/revisao), aberta pelo Porto da revisão no mundo: até
 * 5 itens vencidos (os mais atrasados primeiro, misturando ilhas), um de
 * cada vez, com o tutor só perguntando e o "Me ajuda" até a dica. Sem nada
 * vencido, "Nada pra revisar hoje" e o Treino livre. No fim, o resumo.
 */
export function TelaRevisao() {
  const carregado = useProgressoCarregado();
  useMusicaDaTela({ tipo: "mundo" });
  if (!carregado) return <TelaCarregando />;
  return <RevisaoCarregada />;
}

function RevisaoCarregada() {
  useSincronizarRevisao();
  const progresso = useProgresso();
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const hoje = diaLocal();
  const vencidos = useMemo(() => vencidosHoje(progresso.revisao, hoje), [progresso.revisao, hoje]);

  const comecar = (tipo: Sessao["tipo"]) => {
    tocarEfeito("clique");
    const atual = obterProgresso().revisao;
    const itens = tipo === "hoje" ? sessaoDeHoje(atual, hoje) : treinoLivre(atual, hoje);
    setSessao({ tipo, itens, indice: 0, resultados: [], dia: hoje });
  };

  /** O item acabou: o resultado vai já para o progresso (sair no meio não perde nada). */
  const terminarItem = (resultado: ResultadoItem) => {
    if (!sessao) return;
    const parte = sessao.itens[sessao.indice];
    const ultimo = sessao.indice + 1 >= sessao.itens.length;
    atualizarProgresso((atual) => {
      let revisao = aplicarResultado(atual.revisao, parte.conceito, resultado, sessao.dia, sessao.tipo === "treino");
      if (ultimo) revisao = registrarSessao(revisao, sessao.dia);
      return { ...atual, revisao };
    });
    tocarEfeito(resultado === "errou" ? "clique" : "acerto");
    setSessao({ ...sessao, indice: sessao.indice + 1, resultados: [...sessao.resultados, { parte, resultado }] });
  };

  if (sessao && sessao.indice < sessao.itens.length) {
    const parte = sessao.itens[sessao.indice];
    const local = localDoItem(parte, sessao.indice);
    const rotulo = `${sessao.tipo === "treino" ? "Treino livre" : "Revisão do dia"} › Item ${sessao.indice + 1} de ${sessao.itens.length}`;
    return (
      <div data-revisao="item" data-item-revisao={parte.item.id} data-conceito={parte.conceito}>
        <JogoFase
          key={`${sessao.tipo}-${sessao.indice}-${parte.item.id}`}
          fase={local.fase}
          local={local}
          modo="revisao-dia"
          rotaDoMapa={ROTA_MUNDO}
          aoRecomecar={() => {}}
          aoTerminarRevisao={terminarItem}
          barra={{ caminho: ["Mundo", "Porto da revisão", `Item ${sessao.indice + 1} de ${sessao.itens.length}`], tituloMovel: rotulo }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-fundo" data-tela="revisao" data-revisao={sessao ? "resumo" : "inicio"}>
      <BarraMapa caminho={["Mundo", "Porto da revisão"]} />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 sm:px-6">
        <div className="mx-auto max-w-2xl pt-4">
          {sessao ? (
            <ResumoRevisao
              tipo={sessao.tipo}
              resultados={sessao.resultados}
              revisao={progresso.revisao}
              hoje={sessao.dia}
              restantes={vencidos.length}
              aoTreinar={() => comecar("treino")}
              aoContinuar={() => comecar("hoje")}
            />
          ) : (
            <Inicio vencidos={vencidos.length} aoComecar={() => comecar("hoje")} aoTreinar={() => comecar("treino")} />
          )}
        </div>
      </main>
    </div>
  );
}

function Inicio({ vencidos, aoComecar, aoTreinar }: { vencidos: number; aoComecar: () => void; aoTreinar: () => void }) {
  const nesta = Math.min(5, vencidos);
  return (
    <section className="rounded-3xl border-2 border-borda bg-superficie p-5 shadow-[0_4px_0_var(--cor-sombra)]" data-revisao-inicio>
      <div className="flex items-start gap-3">
        <Mascote expressao={vencidos > 0 ? "curioso" : "feliz"} tamanho={72} className="shrink-0" />
        <div className="min-w-0">
          <h1 className="text-2xl font-black text-texto">Porto da revisão</h1>
          {vencidos > 0 ? (
            <p className="mt-1 text-sm font-bold text-texto-suave" data-vencidos={vencidos}>
              {vencidos === 1 ? "1 item vence hoje." : `${vencidos} itens vencem hoje.`} Cada um leva um ou dois minutos, num site
              que você nunca viu. {vencidos > 5 ? `Nesta rodada vão ${nesta}, os mais atrasados primeiro.` : ""}
            </p>
          ) : (
            <p className="mt-1 text-sm font-bold text-texto-suave" data-vencidos={0}>
              Nada pra revisar hoje. Se quiser, dá pra fazer um treino livre com o que você já aprendeu.
            </p>
          )}
          <p className="mt-2 text-xs font-bold text-texto-suave">
            Aqui eu só faço perguntas, e o Me ajuda vai até a dica. Lembrar sozinho faz o assunto voltar mais tarde; errar faz
            ele voltar amanhã. Tudo bem errar: é assim que a memória firma.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {vencidos > 0 ? (
          <>
            <Botao variante="secundario" onClick={aoTreinar}>
              Treino livre
            </Botao>
            <Botao onClick={aoComecar} data-comecar-revisao>
              Começar
            </Botao>
          </>
        ) : (
          <>
            <Link href={ROTA_MUNDO} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-black text-texto-suave hover:text-texto">
              Voltar ao mapa
            </Link>
            <Botao onClick={aoTreinar} data-treino-livre>
              Treino livre
            </Botao>
          </>
        )}
      </div>
    </section>
  );
}
