"use client";

import { useRouter } from "next/navigation";
import { useMusicaDaTela } from "@/audio/ganchos";
import { tocarEfeito } from "@/audio/motor";
import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { BarraMapa } from "@/componentes/mapa/BarraMapa";
import { BotaoVoltarAoMundo } from "@/componentes/mapa/ilha/TelaIlha";
import { temaComIcone } from "@/componentes/temas/temas";
import { Botao } from "@/componentes/ui/Botao";
import { BarraProgresso } from "@/componentes/ui/BarraProgresso";
import { type Profissao, PROFISSOES } from "@/curriculo/profissoes";
import { atualizarProgresso, useProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import { trilhaDaFonte } from "@/lib/mapa";
import { progressoDaProfissao } from "@/lib/profissoes";
import { ROTA_MUNDO } from "@/lib/rotas";

const PESO: Record<1 | 2 | 3, string> = { 1: "um pouco", 2: "bastante", 3: "o centro do trabalho" };

/**
 * As profissões: um card por profissão com o que ela faz, um dia de
 * trabalho, os temas envolvidos e o progresso do jogador no caminho dela
 * (média dos temas, ponderada pelos pesos, contando as unidades
 * planejadas). "Acender no mapa" vira uma lente, igual à de tema.
 */
export function TelaProfissoes() {
  const carregado = useProgressoCarregado();
  useMusicaDaTela({ tipo: "mundo" });
  if (!carregado) return <TelaCarregando />;
  return <ProfissoesCarregadas />;
}

function ProfissoesCarregadas() {
  const progresso = useProgresso();
  const router = useRouter();
  const trilha = trilhaDaFonte({ progresso });

  const acender = (profissao: Profissao) => {
    tocarEfeito("clique");
    atualizarProgresso((atual) => ({ ...atual, lente: { tipo: "profissao", id: profissao.id } }));
    router.push(ROTA_MUNDO);
  };

  return (
    <div className="flex h-dvh flex-col bg-fundo" data-tela="profissoes">
      <BarraMapa caminho={["Mundo", "Profissões"]} voltar={<BotaoVoltarAoMundo />} />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-black text-texto">O que faz cada tipo de programador?</h1>
          <p className="mt-1 max-w-2xl text-sm font-bold text-texto-suave">
            Cada profissão usa mais alguns temas do que outros. O progresso é a média dos temas dela, dando mais peso ao que é o centro do
            trabalho, e conta também as unidades que ainda vão chegar.
          </p>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {PROFISSOES.map((profissao) => {
              const valor = progressoDaProfissao(profissao, trilha, progresso);
              const porcento = Math.round(valor * 100);
              const ativa = progresso.lente?.tipo === "profissao" && progresso.lente.id === profissao.id;
              return (
                <li
                  key={profissao.id}
                  data-card-profissao={profissao.id}
                  data-porcento={porcento}
                  className={`flex flex-col gap-3 rounded-3xl border-2 bg-superficie p-4 shadow-[0_4px_0_var(--cor-sombra)] ${
                    ativa ? "border-primaria" : "border-borda"
                  }`}
                >
                  <h2 className="text-lg font-black text-texto">{profissao.nome}</h2>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wide text-texto-suave">O que faz</h3>
                    <p className="mt-0.5 text-sm font-bold leading-snug text-texto">{profissao.oQueFaz}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wide text-texto-suave">Um dia de trabalho</h3>
                    <p className="mt-0.5 text-sm font-bold leading-snug text-texto">{profissao.umDiaDeTrabalho}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wide text-texto-suave">Temas</h3>
                    <ul className="mt-1 flex flex-wrap gap-1.5">
                      {[...profissao.temas]
                        .sort((a, b) => b.peso - a.peso)
                        .map(({ tema: id, peso }) => {
                          const tema = temaComIcone(id);
                          return (
                            <li
                              key={id}
                              title={`${tema.nome}: ${PESO[peso]}`}
                              className={`flex items-center gap-1 rounded-full border-2 px-2 py-0.5 text-xs font-bold ${
                                peso === 3 ? "border-primaria text-texto" : "border-borda text-texto-suave"
                              }`}
                            >
                              <tema.Icone tamanho={13} />
                              {tema.nome}
                              <span className="sr-only">: {PESO[peso]}</span>
                              <span aria-hidden="true" className="flex gap-0.5">
                                {Array.from({ length: peso }, (_, indice) => (
                                  <span key={indice} className="h-1.5 w-1.5 rounded-full bg-primaria" />
                                ))}
                              </span>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                  <div className="mt-auto flex flex-col gap-1.5">
                    <BarraProgresso fracao={valor} rotulo={`${porcento}% do caminho de ${profissao.nome}`} />
                    <p className="text-xs font-bold text-texto-suave">{porcento}% do caminho, na trilha {trilha.nome}</p>
                  </div>
                  {ativa ? (
                    <Botao
                      variante="secundario"
                      onClick={() => {
                        tocarEfeito("clique");
                        atualizarProgresso((atual) => ({ ...atual, lente: null }));
                      }}
                    >
                      Apagar do mapa
                    </Botao>
                  ) : (
                    <Botao onClick={() => acender(profissao)}>Acender {profissao.nome} no mapa</Botao>
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
