"use client";

import { useRouter } from "next/navigation";
import { useMusicaDaTela } from "@/audio/ganchos";
import { tocarEfeito } from "@/audio/motor";
import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { BarraMapa } from "@/componentes/mapa/BarraMapa";
import { BotaoVoltarAoMundo } from "@/componentes/mapa/ilha/TelaIlha";
import { Botao } from "@/componentes/ui/Botao";
import { BarraProgresso } from "@/componentes/ui/BarraProgresso";
import { ilhasDaTrilha, NUCLEO_COMUM, type Trilha, TRILHAS } from "@/curriculo";
import { atualizarProgresso, useProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import { progressoDeUnidades, trilhaDaFonte, unidadesDaTrilha } from "@/lib/mapa";
import { ROTA_MUNDO } from "@/lib/rotas";

/**
 * As trilhas: um card por trilha (nome, o que você consegue fazer no fim,
 * as ilhas, o progresso e o estado). Escolher uma troca as ilhas do mundo;
 * o progresso das ilhas do núcleo comum vale em todas.
 */
export function TelaTrilhas() {
  const carregado = useProgressoCarregado();
  useMusicaDaTela({ tipo: "mundo" });
  if (!carregado) return <TelaCarregando />;
  return <TrilhasCarregadas />;
}

function TrilhasCarregadas() {
  const progresso = useProgresso();
  const router = useRouter();
  const escolhida = trilhaDaFonte({ progresso });

  const escolher = (trilha: Trilha) => {
    tocarEfeito("clique");
    atualizarProgresso((atual) => (atual.trilha === trilha.id ? atual : { ...atual, trilha: trilha.id }));
    router.push(ROTA_MUNDO);
  };

  return (
    <div className="flex h-dvh flex-col bg-fundo" data-tela="trilhas">
      <BarraMapa caminho={["Mundo", "Trilhas"]} voltar={<BotaoVoltarAoMundo />} />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-black text-texto">Trilhas</h1>
          <p className="mt-1 max-w-2xl text-sm font-bold text-texto-suave">
            Cada trilha é um caminho até uma profissão de verdade. As ilhas do núcleo comum (Origens, Lógica, IA e Ofício) servem pra
            todas: o que você concluir numa trilha conta nas outras.
          </p>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {TRILHAS.map((trilha) => {
              const atual = trilha.id === escolhida.id;
              const conta = progressoDeUnidades(unidadesDaTrilha(trilha), progresso);
              const emConstrucao = trilha.status === "em-construcao";
              const rotuloConta = `${conta.concluidas} de ${conta.total} unidades concluídas`;
              return (
                <li
                  key={trilha.id}
                  data-card-trilha={trilha.id}
                  data-atual={atual ? "sim" : "nao"}
                  className={`flex flex-col gap-3 rounded-3xl border-2 bg-superficie p-4 shadow-[0_4px_0_var(--cor-sombra)] ${
                    atual ? "border-primaria" : "border-borda"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black text-texto">{trilha.nome}</h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-black uppercase ${
                        emConstrucao ? "bg-areia text-texto" : "bg-destaque text-sobre-destaque"
                      }`}
                    >
                      {emConstrucao ? "Em construção" : "Ativa"}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-texto">{trilha.descricao}</p>
                  <ol className="flex flex-wrap gap-1.5" aria-label={`Ilhas da trilha ${trilha.nome}, na ordem`}>
                    {ilhasDaTrilha(trilha).map((ilha) => (
                      <li
                        key={ilha.id}
                        className={`rounded-full border-2 px-2 py-0.5 text-xs font-bold ${
                          NUCLEO_COMUM.includes(ilha.id) ? "border-borda bg-painel text-texto-suave" : "border-primaria text-texto"
                        }`}
                      >
                        {ilha.nome}
                        {ilha.opcional ? " (opcional)" : ""}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-auto flex flex-col gap-1.5">
                    <BarraProgresso fracao={conta.total === 0 ? 0 : conta.concluidas / conta.total} rotulo={rotuloConta} />
                    <p className="text-xs font-bold text-texto-suave">
                      {rotuloConta}
                      {emConstrucao ? ". As ilhas próprias ainda não têm fases." : ""}
                    </p>
                  </div>
                  {atual ? (
                    <Botao variante="secundario" disabled>
                      Trilha atual
                    </Botao>
                  ) : (
                    <Botao onClick={() => escolher(trilha)}>Escolher {trilha.nome}</Botao>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );
}
