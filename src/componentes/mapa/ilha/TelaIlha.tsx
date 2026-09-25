"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMusicaDaTela } from "@/audio/ganchos";
import { tocarEfeito } from "@/audio/motor";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { IconeZona } from "@/componentes/icones/IconeZona";
import { useLayoutJogo } from "@/componentes/jogo/movel/useLayoutJogo";
import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { Mascote } from "@/componentes/mascote/Mascote";
import { UNIDADES } from "@/conteudo";
import { ilhaDoId } from "@/curriculo";
import type { IlhaCurriculo, UnidadeCurriculo } from "@/curriculo/tipos";
import { atualizarProgresso, useProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import {
  acaoDaUnidade,
  estadoDaIlha,
  estadoDaUnidade,
  estrelasDaUnidade,
  ilhaAnterior,
  pontoAtual,
  unidadeConcluida,
  zonaAberta,
} from "@/lib/mapa";
import { ROTA_MUNDO, rotaDaFase } from "@/lib/rotas";
import { Oceano } from "../arte/Oceano";
import { useAnimarMapa } from "../arte/useAnimarMapa";
import { type ApiAreaArrastavel, AreaArrastavel } from "../AreaArrastavel";
import { BarraMapa } from "../BarraMapa";
import { trechosSuaves } from "../geometria";
import { useTamanho } from "../useTamanho";
import { CardUnidade } from "./CardUnidade";
import { desenharIlha } from "./desenhoIlha";
import { PontoUnidade } from "./PontoUnidade";

/** Botão "Mundo" da barra: volta ao mapa das ilhas. */
export function BotaoVoltarAoMundo() {
  return (
    <Link
      href={ROTA_MUNDO}
      className="flex h-11 shrink-0 items-center gap-1 rounded-full border-2 border-borda bg-superficie pl-2 pr-3 text-sm font-black text-texto hover:border-primaria hover:text-primaria"
    >
      <IconeChevron direcao="esquerda" tamanho={14} />
      Mundo
    </Link>
  );
}

/** Placa de madeira "Em construção" (sem o texto técnico do que falta). */
function PlacaConstrucao() {
  return (
    <span className="flex items-center gap-1 rounded-md border-2 border-madeira bg-areia px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-texto">
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path d="M2 14L8 2l6 12z" fill="var(--cor-destaque)" stroke="var(--cor-madeira)" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 6.5v3.5" stroke="var(--cor-texto)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="8" cy="12" r="0.9" fill="var(--cor-texto)" />
      </svg>
      Em construção
    </span>
  );
}

/**
 * A tela de uma ilha: as zonas como regiões ao longo de um caminho
 * sinuoso, cada unidade um ponto (concluída, disponível, bloqueada ou
 * planejada). Tocar num ponto abre o card. O computadorzinho anda até o
 * ponto atual, e uma unidade concluída desde a última visita acende com
 * festa, desenhando o caminho até a próxima.
 */
export function TelaIlha({ ilhaId }: { ilhaId: string }) {
  const carregado = useProgressoCarregado();
  const ilha = ilhaDoId(ilhaId);
  useMusicaDaTela({ tipo: "ilha", ilhaId });
  if (!carregado || !ilha) return <TelaCarregando />;
  return <IlhaCarregada ilha={ilha} />;
}

function IlhaCarregada({ ilha }: { ilha: IlhaCurriculo }) {
  const progresso = useProgresso();
  const router = useRouter();
  const layout = useLayoutJogo();
  const vertical = layout === "retrato";
  const animar = useAnimarMapa();
  const moldura = useRef<HTMLDivElement>(null);
  const area = useRef<ApiAreaArrastavel>(null);
  const { largura: larguraTela, altura: alturaTela } = useTamanho(moldura);
  const [aberto, setAberto] = useState<string | null>(null);
  const fonte = { progresso };
  const estadoIlha = estadoDaIlha(ilha, fonte);

  const desenho = useMemo(() => desenharIlha(ilha, vertical, larguraTela), [ilha, vertical, larguraTela]);
  // Deitado ou no desktop, o caminho cabe na altura (sem encolher os pontos).
  const escala = desenho.vertical || alturaTela === 0 ? 1 : Math.min(1.15, Math.max(0.6, alturaTela / desenho.altura));
  const px = (valor: number) => valor * escala;

  const estados = desenho.pontos.map((ponto) => estadoDaUnidade(ilha, ponto.zona, ponto.item, fonte));
  const conteudoDe = (item: UnidadeCurriculo) => UNIDADES.find((unidade) => unidade.id === item.id);
  const atual = pontoAtual(ilha, fonte);
  const indiceAtual = Math.max(0, desenho.pontos.findIndex((ponto) => ponto.item.id === atual.id));

  // Festa: unidades concluídas desde a última visita. A última delas acende.
  const [comemoracao] = useState(() => {
    const pendentes = desenho.pontos
      .map((ponto) => conteudoDe(ponto.item))
      .filter((unidade) => unidade && unidadeConcluida(unidade, progresso) && !progresso.unidadesComemoradas.includes(unidade.id))
      .map((unidade) => unidade?.id ?? "");
    return pendentes.length > 0 ? { pendentes, acendendo: pendentes[pendentes.length - 1] } : null;
  });
  const [mensagem, setMensagem] = useState<string | null>(() => {
    if (!comemoracao) return null;
    const titulo = desenho.pontos.find((ponto) => ponto.item.id === comemoracao.acendendo)?.item.titulo ?? "";
    return `Unidade concluída: ${titulo}! O caminho até a próxima já apareceu.`;
  });
  // A unidade seguinte que a comemoração abre (o caminho até ela se desenha).
  const indiceAcendendo = comemoracao ? desenho.pontos.findIndex((ponto) => ponto.item.id === comemoracao.acendendo) : -1;
  const abriuProxima = indiceAcendendo >= 0 && estados[indiceAcendendo + 1] === "disponivel";
  const [abriuNaComemoracao] = useState(abriuProxima);
  useEffect(() => {
    if (!comemoracao) return;
    tocarEfeito("unidade-concluida");
    const brilho = abriuNaComemoracao ? setTimeout(() => tocarEfeito("desbloqueio"), 1300) : null;
    const temporizador = setTimeout(() => {
      atualizarProgresso((atual) => ({
        ...atual,
        unidadesComemoradas: [...new Set([...atual.unidadesComemoradas, ...comemoracao.pendentes])],
      }));
    }, 1800);
    return () => {
      clearTimeout(temporizador);
      if (brilho !== null) clearTimeout(brilho);
    };
  }, [comemoracao, abriuNaComemoracao]);
  useEffect(() => {
    if (!mensagem) return;
    const temporizador = setTimeout(() => setMensagem(null), 4200);
    return () => clearTimeout(temporizador);
  }, [mensagem]);

  // O computadorzinho anda de onde parou da última vez até o ponto atual.
  const [indiceInicial] = useState(() => {
    const salvo = progresso.posicaoNoMapa[ilha.id];
    const indice = desenho.pontos.findIndex((ponto) => ponto.item.id === salvo);
    return indice >= 0 ? indice : indiceAtual;
  });
  const passos =
    indiceInicial <= indiceAtual
      ? desenho.pontos.slice(indiceInicial, indiceAtual + 1)
      : desenho.pontos.slice(indiceAtual, indiceInicial + 1).reverse();
  const duracaoCaminhada = animar ? Math.min(1.8, 0.4 * Math.max(0, passos.length - 1)) : 0;

  // Começa olhando o ponto atual.
  const centralizado = useRef(false);
  useEffect(() => {
    if (larguraTela === 0 || centralizado.current) return;
    centralizado.current = true;
    const ponto = desenho.pontos[indiceAtual];
    if (ponto) area.current?.centralizar(px(ponto.x), px(ponto.y));
  });

  const salvarPosicao = () => {
    if (progresso.posicaoNoMapa[ilha.id] === atual.id) return;
    atualizarProgresso((anterior) => ({ ...anterior, posicaoNoMapa: { ...anterior.posicaoNoMapa, [ilha.id]: atual.id } }));
  };

  const jogar = (item: UnidadeCurriculo) => {
    const unidade = conteudoDe(item);
    if (!unidade) return;
    const acao = acaoDaUnidade(unidade, progresso);
    tocarEfeito("clique");
    atualizarProgresso((anterior) => {
      const fasesEmAndamento = { ...anterior.fasesEmAndamento };
      // Jogar de novo: as fases recomeçam do zero (estrelas e conclusões ficam).
      if (acao.rotulo === "Jogar de novo") for (const id of unidade.fases) delete fasesEmAndamento[id];
      return { ...anterior, faseAtual: acao.faseId, fasesEmAndamento };
    });
    router.push(rotaDaFase(acao.faseId));
  };

  const trechos = trechosSuaves(desenho.pontos.map((ponto) => ({ x: px(ponto.x), y: px(ponto.y) })));
  const pontoAberto = desenho.pontos.find((ponto) => ponto.item.id === aberto);
  const motivoBloqueio = (item: UnidadeCurriculo): string => {
    const ponto = desenho.pontos.find((candidato) => candidato.item.id === item.id);
    if (!ponto) return "";
    if (!zonaAberta(ilha, ponto.zona, fonte)) {
      const anterior = ilha.zonas[ilha.zonas.indexOf(ponto.zona) - 1];
      return anterior ? `Termine a zona ${anterior.nome} para abrir.` : "Essa zona ainda está fechada.";
    }
    const antes = ponto.zona.unidades.slice(0, ponto.zona.unidades.indexOf(item)).filter((candidato) => conteudoDe(candidato));
    const ultima = antes[antes.length - 1];
    return ultima ? `Termine a unidade ${ultima.titulo} para abrir.` : "Essa unidade ainda está fechada.";
  };

  if (estadoIlha === "bloqueada") {
    const anterior = ilhaAnterior(ilha);
    return (
      <div className="flex h-dvh flex-col bg-mar">
        <BarraMapa caminho={["Mundo", `Ilha ${ilha.nome}`]} voltar={<BotaoVoltarAoMundo />} />
        <div className="grid flex-1 place-items-center p-6 text-center">
          <div className="max-w-sm rounded-3xl border-2 border-borda bg-superficie p-6">
            <Mascote expressao="pensativo" tamanho={96} className="mx-auto" />
            <p className="mt-2 text-lg font-black text-texto">A ilha {ilha.nome} ainda está coberta de névoa.</p>
            <p className="mt-1 text-sm font-bold text-texto-suave">Ela abre quando você terminar a ilha {anterior?.nome ?? "anterior"}.</p>
            <Link href={ROTA_MUNDO} className="mt-4 inline-block font-black text-primaria underline">
              Voltar ao mundo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const larguraDesenho = px(desenho.largura);
  const alturaDesenho = px(desenho.altura);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-mar" data-mapa="ilha" data-ilha={ilha.id} data-layout={layout}>
      <BarraMapa caminho={["Mundo", `Ilha ${ilha.nome}`]} voltar={<BotaoVoltarAoMundo />} />
      <div ref={moldura} className="relative flex min-h-0 flex-1 flex-col">
        <AreaArrastavel ref={area} rotulo={`Mapa da ilha ${ilha.nome}. Arraste ou role para ver o caminho inteiro.`}>
          <div className="relative" style={{ width: larguraDesenho, height: alturaDesenho }}>
            <svg
              viewBox={`0 0 ${larguraDesenho} ${alturaDesenho}`}
              width={larguraDesenho}
              height={alturaDesenho}
              className="absolute inset-0"
              aria-hidden="true"
            >
              <Oceano largura={larguraDesenho} altura={alturaDesenho} />
              <rect
                x={px(desenho.terra.x)}
                y={px(desenho.terra.y)}
                width={px(desenho.terra.largura)}
                height={px(desenho.terra.altura)}
                rx={px(desenho.terra.raio)}
                fill="var(--cor-areia)"
                stroke="var(--cor-areia-sombra)"
                strokeWidth="4"
              />
              <rect
                x={px(desenho.terra.x + 18)}
                y={px(desenho.terra.y + 18)}
                width={px(desenho.terra.largura - 36)}
                height={px(desenho.terra.altura - 36)}
                rx={px(desenho.terra.raio - 18)}
                fill="var(--cor-grama)"
              />
              {desenho.regioes.map((regiao, indice) => (
                <rect
                  key={regiao.zona.id}
                  x={px(regiao.x)}
                  y={px(regiao.y)}
                  width={px(regiao.largura)}
                  height={px(regiao.altura)}
                  rx="28"
                  fill={indice % 2 === 0 ? "var(--cor-grama-sombra)" : "var(--cor-areia)"}
                  opacity={regiao.zona.requerMotor ? 0.28 : 0.4}
                  stroke="var(--cor-superficie)"
                  strokeWidth="3"
                  strokeDasharray="10 10"
                />
              ))}
              {trechos.map((trecho, indice) => {
                const andado = estados[indice] === "concluida";
                const desenhando = comemoracao !== null && desenho.pontos[indice].item.id === comemoracao.acendendo;
                return (
                  <g key={indice}>
                    <path d={trecho} fill="none" stroke="var(--cor-areia-sombra)" strokeWidth="12" strokeLinecap="round" />
                    <path
                      d={trecho}
                      fill="none"
                      stroke="var(--cor-superficie)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray="2 12"
                    />
                    {andado && (
                      <motion.path
                        d={trecho}
                        fill="none"
                        stroke="var(--cor-primaria)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        data-trecho-andado={indice}
                        initial={desenhando && animar ? { pathLength: 0 } : false}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.1, delay: 0.5, ease: "easeInOut" }}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {desenho.regioes.map((regiao) => (
              <div
                key={regiao.zona.id}
                className="pointer-events-none absolute flex flex-wrap items-center gap-1.5"
                style={{ left: px(regiao.x) + 14, top: px(regiao.y) + 10, maxWidth: px(regiao.largura) - 28 }}
                data-zona={regiao.zona.id}
              >
                <span className="flex items-center gap-1.5 rounded-full bg-superficie px-2.5 py-1 text-sm font-black text-texto shadow-[0_3px_0_var(--cor-sombra)]">
                  <IconeZona icone={regiao.zona.icone} tamanho={18} className="text-primaria" />
                  {regiao.zona.nome}
                </span>
                {regiao.zona.requerMotor && <PlacaConstrucao />}
              </div>
            ))}

            {desenho.pontos.map((ponto, indice) => {
              const conteudo = conteudoDe(ponto.item);
              return (
                <PontoUnidade
                  key={ponto.item.id}
                  ponto={ponto}
                  estado={estados[indice]}
                  estrelas={conteudo ? estrelasDaUnidade(conteudo, progresso) : 0}
                  x={px(ponto.x)}
                  y={px(ponto.y)}
                  acendendo={comemoracao?.acendendo === ponto.item.id}
                  aoAbrir={() => {
                    tocarEfeito("clique");
                    setAberto(ponto.item.id);
                  }}
                />
              );
            })}

            {passos.length > 0 && (
              <motion.div
                key={`${layout}-${escala.toFixed(2)}`}
                className="pointer-events-none absolute z-10"
                data-mascote-no-ponto={atual.id}
                initial={{ left: px(passos[0].x) - 26, top: px(passos[0].y) - 78 }}
                animate={{ left: passos.map((ponto) => px(ponto.x) - 26), top: passos.map((ponto) => px(ponto.y) - 78) }}
                transition={{ duration: duracaoCaminhada, ease: "easeInOut", delay: comemoracao ? 1.2 : 0.2 }}
                onAnimationComplete={salvarPosicao}
              >
                <Mascote expressao={comemoracao ? "comemorando" : "feliz"} tamanho={52} />
              </motion.div>
            )}
          </div>
        </AreaArrastavel>
        <div role="status" aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
          {mensagem && (
            <p className="rounded-2xl border-2 border-borda bg-superficie px-4 py-2 text-sm font-bold text-texto shadow-[0_4px_0_var(--cor-sombra)]" data-comemoracao>
              {mensagem}
            </p>
          )}
        </div>
      </div>
      {pontoAberto && (
        <CardUnidade
          aberto
          zona={pontoAberto.zona}
          item={pontoAberto.item}
          conteudo={conteudoDe(pontoAberto.item)}
          estado={estados[pontoAberto.indice]}
          estrelas={(() => {
            const conteudo = conteudoDe(pontoAberto.item);
            return conteudo ? estrelasDaUnidade(conteudo, progresso) : 0;
          })()}
          acao={(() => {
            const conteudo = conteudoDe(pontoAberto.item);
            return conteudo ? acaoDaUnidade(conteudo, progresso) : null;
          })()}
          motivoBloqueio={motivoBloqueio(pontoAberto.item)}
          aoJogar={() => jogar(pontoAberto.item)}
          aoFechar={() => setAberto(null)}
        />
      )}
    </div>
  );
}
