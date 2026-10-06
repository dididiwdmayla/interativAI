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
import { ilhaDoId, trilhasDaIlha } from "@/curriculo";
import type { IlhaCurriculo, UnidadeCurriculo } from "@/curriculo/tipos";
import { atualizarProgresso, useProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import {
  acaoDaUnidade,
  estadoDaIlha,
  estadoDaUnidade,
  estrelasDaUnidade,
  ilhaAnterior,
  ilhaCompleta,
  pontoAtual,
  unidadeConcluida,
  zonaAberta,
} from "@/lib/mapa";
import { resolverLente, unidadeNaLente } from "@/lib/lentes";
import { ROTA_MUNDO, ROTA_PROJETOS, rotaDaFase } from "@/lib/rotas";
import { Oceano } from "../arte/Oceano";
import { useAnimarMapa } from "../arte/useAnimarMapa";
import { type ApiAreaArrastavel, AreaArrastavel } from "../AreaArrastavel";
import { BarraMapa } from "../BarraMapa";
import { trechosSuaves } from "../geometria";
import { useTamanho } from "../useTamanho";
import { CardUnidade } from "./CardUnidade";
import { ChaoDaIlha, TONS_DAS_ZONAS } from "./ChaoDaIlha";
import { desenharIlha, type Enfeite, type RegiaoZona } from "./desenhoIlha";
import { pecaAnimadaDaIlha } from "./EnfeitesIlha";
import { PontoUnidade } from "./PontoUnidade";

/**
 * Uma camada de HTML do tamanho do desenho com um contorno da ilha: a
 * espuma que respira e a borda acesa da ilha completa. Só a opacidade anima,
 * pelo compositor (o desenho grande da ilha não repinta).
 */
function CamadaDoContorno({
  caminho,
  largura,
  altura,
  escala,
  className,
  traco,
  ...dados
}: {
  caminho: string;
  largura: number;
  altura: number;
  escala: number;
  className: string;
  traco: { cor: string; largura: number; tracejado?: string };
} & Record<`data-${string}`, string | boolean>) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} {...dados}>
      <svg viewBox={`0 0 ${largura} ${altura}`} width={largura} height={altura} className="block">
        <path
          d={caminho}
          transform={`scale(${escala})`}
          fill="none"
          stroke={traco.cor}
          strokeWidth={traco.largura}
          strokeDasharray={traco.tracejado}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** O enfeite da ilha que se mexe (o mais perto do computadorzinho), numa camada própria. */
function EnfeiteAnimado({ ilhaId, enfeite, px }: { ilhaId: string; enfeite: Enfeite; px: (valor: number) => number }) {
  const peca = pecaAnimadaDaIlha(ilhaId);
  if (!peca) return null;
  const lado = px(56 * enfeite.escala);
  return (
    <div
      aria-hidden="true"
      className={`enfeite-${peca.animacao} pointer-events-none absolute`}
      style={{ left: px(enfeite.x) - lado / 2, top: px(enfeite.y) - lado / 2, width: lado, height: lado }}
      data-enfeite-animado={peca.animacao}
    >
      <svg viewBox="-28 -28 56 56" width="100%" height="100%" className="block overflow-visible">
        {peca.desenho()}
      </svg>
    </div>
  );
}

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
/** Zona opcional: não conta para concluir a ilha nem tranca o caminho. */
function PlacaOpcional() {
  return (
    <span
      data-placa-opcional
      className="flex items-center gap-1 rounded-md border-2 border-borda bg-superficie px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-texto-suave"
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path d="M3 8h10M8 3v10" stroke="var(--cor-primaria)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2.2" />
      </svg>
      Opcional
    </span>
  );
}

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
 * A placa de uma zona: o quadro de madeira com o ícone (no tom da zona), o
 * nome e as plaquinhas, num poste. Fica no alto da zona, do lado que não tem
 * o primeiro ponto (lá em cima dele para o computadorzinho).
 */
function PlacaDaZona({ regiao, px }: { regiao: RegiaoZona; px: (valor: number) => number }) {
  const { zona, placa } = regiao;
  const direita = placa.lado === "direita";
  return (
    <div
      className={`pointer-events-none absolute flex flex-col ${direita ? "-translate-x-full items-end" : "items-start"}`}
      style={{ left: px(placa.x), top: px(placa.y), maxWidth: px(placa.larguraMaxima) }}
      data-zona={zona.id}
      data-placa-zona={placa.lado}
    >
      <div className="flex flex-col gap-1 rounded-xl border-[3px] border-madeira bg-superficie py-1 pl-1 pr-2.5 shadow-[0_3px_0_var(--cor-sombra)]">
        <span className="flex items-center gap-1.5">
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 border-madeira"
            style={{ background: TONS_DAS_ZONAS[regiao.indice % TONS_DAS_ZONAS.length] }}
          >
            <IconeZona icone={zona.icone} tamanho={17} className="text-texto" />
          </span>
          <span className="min-w-0 text-sm font-black leading-tight text-texto" data-nome-zona>
            {zona.nome}
          </span>
        </span>
        {(zona.opcional || zona.requerMotor) && (
          <span className="flex flex-wrap gap-1 pl-0.5">
            {zona.opcional && <PlacaOpcional />}
            {zona.requerMotor && <PlacaConstrucao />}
          </span>
        )}
      </div>
      <span aria-hidden="true" className={`h-3 w-1.5 rounded-b bg-madeira ${direita ? "mr-5" : "ml-5"}`} />
    </div>
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
  if (ilha.zonas.length === 0) return <IlhaSoNomeada ilha={ilha} />;
  return <IlhaCarregada ilha={ilha} />;
}

/** Ilha de uma trilha em construção: só o nome, sem zonas ainda. */
function IlhaSoNomeada({ ilha }: { ilha: IlhaCurriculo }) {
  const trilhas = trilhasDaIlha(ilha.id);
  return (
    <div className="flex h-dvh flex-col bg-mar" data-mapa="ilha" data-ilha={ilha.id}>
      <BarraMapa caminho={["Mundo", `Ilha ${ilha.nome}`]} voltar={<BotaoVoltarAoMundo />} />
      <div className="grid flex-1 place-items-center p-6 text-center">
        <div className="max-w-sm rounded-3xl border-2 border-borda bg-superficie p-6" data-ilha-em-construcao>
          <Mascote expressao="dormindo" tamanho={96} className="mx-auto" />
          <div className="mt-2 flex justify-center">
            <PlacaConstrucao />
          </div>
          <p className="mt-2 text-lg font-black text-texto">A ilha {ilha.nome} ainda é só um terreno.</p>
          <p className="mt-1 text-sm font-bold text-texto-suave">
            Ela faz parte da trilha {trilhas.map((trilha) => trilha.nome).join(" e ")}, que está em construção. Enquanto isso, as
            ilhas do núcleo comum (Origens, Lógica, IA e Ofício) já contam pra ela.
          </p>
          <Link href={ROTA_MUNDO} className="mt-4 inline-block font-black text-primaria underline">
            Voltar ao mundo
          </Link>
        </div>
      </div>
    </div>
  );
}

function IlhaCarregada({ ilha }: { ilha: IlhaCurriculo }) {
  const progresso = useProgresso();
  const router = useRouter();
  // Da ilha, o provável é voltar ao mundo.
  useMusicaDaTela(null, { tipo: "mundo" });
  const layout = useLayoutJogo();
  const vertical = layout === "retrato";
  const animar = useAnimarMapa();
  const moldura = useRef<HTMLDivElement>(null);
  const area = useRef<ApiAreaArrastavel>(null);
  const { largura: larguraTela, altura: alturaTela } = useTamanho(moldura);
  // Endereço com o ponto (/ilha/sites#sites-estilos-u2, vindo do glossário): abre o card dele.
  const [idDoEndereco] = useState(() => {
    const id = typeof window === "undefined" ? "" : decodeURIComponent(window.location.hash.slice(1));
    return ilha.zonas.some((zona) => zona.unidades.some((item) => item.id === id)) ? id : null;
  });
  const [aberto, setAberto] = useState<string | null>(idDoEndereco);
  // Na navegação do próprio jogo (link do glossário), o endereço pode mudar
  // depois da primeira pintura: confere de novo no quadro seguinte e a cada
  // troca de hash.
  useEffect(() => {
    const abrirDoEndereco = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (ilha.zonas.some((zona) => zona.unidades.some((item) => item.id === id))) setAberto(id);
    };
    const quadro = requestAnimationFrame(abrirDoEndereco);
    window.addEventListener("hashchange", abrirDoEndereco);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("hashchange", abrirDoEndereco);
    };
  }, [ilha]);
  const fonte = { progresso };
  const estadoIlha = estadoDaIlha(ilha, fonte);
  const lente = resolverLente(progresso.lente);

  const desenho = useMemo(() => desenharIlha(ilha, vertical, larguraTela, alturaTela), [ilha, vertical, larguraTela, alturaTela]);
  // Deitado ou no desktop, o caminho cabe na altura (sem encolher os pontos).
  const escala = desenho.escala;
  const px = (valor: number) => valor * escala;

  const estados = desenho.pontos.map((ponto) => estadoDaUnidade(ilha, ponto.zona, ponto.item, fonte));
  const conteudoDe = (item: UnidadeCurriculo) => UNIDADES.find((unidade) => unidade.id === item.id);
  const atual = pontoAtual(ilha, fonte);
  const indiceAtual = Math.max(0, desenho.pontos.findIndex((ponto) => ponto.item.id === atual.id));
  // A peça que se mexe: o enfeite mais perto do ponto atual (uma só por ilha; com menos movimento, fica parada).
  const enfeiteAnimado = useMemo(() => {
    const alvo = desenho.pontos[indiceAtual];
    if (!alvo || !pecaAnimadaDaIlha(ilha.id)) return null;
    return desenho.enfeites.reduce<Enfeite | null>(
      (melhor, enfeite) => (!melhor || Math.hypot(enfeite.x - alvo.x, enfeite.y - alvo.y) < Math.hypot(melhor.x - alvo.x, melhor.y - alvo.y) ? enfeite : melhor),
      null,
    );
  }, [desenho, indiceAtual, ilha.id]);

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
  // A ilha inteira concluída: ela acende (a borda brilha) e, uma vez só, o computadorzinho comemora.
  const completa = estadoIlha === "disponivel" && ilhaCompleta(ilha, fonte);
  const [festaDaIlha, setFestaDaIlha] = useState<"esperando" | "aberta" | null>(() =>
    completa && !progresso.ilhasComemoradas.includes(ilha.id) ? "esperando" : null,
  );
  useEffect(() => {
    if (festaDaIlha !== "esperando") return;
    // Depois da comemoração da unidade (se houver), para uma festa não cobrir a outra.
    const temporizador = setTimeout(
      () => {
        setFestaDaIlha("aberta");
        tocarEfeito("fase-concluida");
        atualizarProgresso((atual) => ({ ...atual, ilhasComemoradas: [...new Set([...atual.ilhasComemoradas, ilha.id])] }));
      },
      comemoracao ? 2600 : 600,
    );
    return () => clearTimeout(temporizador);
  }, [festaDaIlha, comemoracao, ilha.id]);
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

  const pontoDoEndereco = desenho.pontos.find((ponto) => ponto.item.id === idDoEndereco) ?? null;

  // Começa olhando o ponto atual (ou o do endereço).
  const centralizado = useRef(false);
  useEffect(() => {
    if (larguraTela === 0 || centralizado.current) return;
    centralizado.current = true;
    const ponto = pontoDoEndereco ?? desenho.pontos[indiceAtual];
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
    const anterior = ilhaAnterior(ilha, fonte);
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
    <div
      className="flex h-dvh flex-col overflow-hidden bg-mar"
      data-mapa="ilha"
      data-ilha={ilha.id}
      data-layout={layout}
      data-ilha-completa={completa ? "sim" : "nao"}
    >
      <BarraMapa caminho={["Mundo", `Ilha ${ilha.nome}`]} voltar={<BotaoVoltarAoMundo />} lentes />
      <div ref={moldura} className="relative flex min-h-0 flex-1 flex-col">
        <AreaArrastavel ref={area} rotulo={`Mapa da ilha ${ilha.nome}. Arraste ou role para ver o caminho inteiro.`}>
          <div className="relative" style={{ width: larguraDesenho, height: alturaDesenho }} data-ilha-desenho>
            <Oceano largura={larguraDesenho} altura={alturaDesenho} escala={1} />
            <CamadaDoContorno
              caminho={desenho.contorno.espuma}
              largura={larguraDesenho}
              altura={alturaDesenho}
              escala={escala}
              className="espuma-respira"
              traco={{ cor: "var(--cor-espuma)", largura: 3, tracejado: "16 10" }}
              data-espuma
            />
            {completa && (
              <CamadaDoContorno
                caminho={desenho.contorno.espuma}
                largura={larguraDesenho}
                altura={alturaDesenho}
                escala={escala}
                className="anel-ilha"
                traco={{ cor: "var(--cor-destaque)", largura: 8 }}
                data-borda-acesa
              />
            )}
            <svg
              viewBox={`0 0 ${larguraDesenho} ${alturaDesenho}`}
              width={larguraDesenho}
              height={alturaDesenho}
              className="absolute inset-0"
              aria-hidden="true"
            >
              <ChaoDaIlha ilhaId={ilha.id} desenho={desenho} px={px} enfeiteAnimado={enfeiteAnimado} />
              {trechos.map((trecho, indice) => {
                const andado = estados[indice] === "concluida";
                const desenhando = comemoracao !== null && desenho.pontos[indice].item.id === comemoracao.acendendo;
                // Depois do ponto atual, o caminho ainda é só uma trilha apagada.
                const adiante = indice >= indiceAtual;
                return (
                  <g key={indice} opacity={adiante ? 0.75 : 1}>
                    <path d={trecho} fill="none" stroke="var(--cor-caminho-borda)" strokeWidth={px(17)} strokeLinecap="round" />
                    <path d={trecho} fill="none" stroke="var(--cor-caminho)" strokeWidth={px(11)} strokeLinecap="round" />
                    {!andado && (
                      <path d={trecho} fill="none" stroke="var(--cor-caminho-borda)" strokeWidth={px(3.5)} strokeLinecap="round" strokeDasharray={`${px(2)} ${px(11)}`} />
                    )}
                    {andado && (
                      <motion.path
                        d={trecho}
                        fill="none"
                        stroke="var(--cor-primaria)"
                        strokeWidth={px(7)}
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
            {enfeiteAnimado && <EnfeiteAnimado ilhaId={ilha.id} enfeite={enfeiteAnimado} px={px} />}

            {desenho.regioes.map((regiao) => (
              <PlacaDaZona key={regiao.zona.id} regiao={regiao} px={px} />
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
                  atual={indice === indiceAtual && estados[indice] !== "concluida"}
                  lente={lente ? (unidadeNaLente(ponto.item, lente) ? "acesa" : "apagada") : null}
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
          {festaDaIlha === "aberta" ? (
            <div
              className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border-2 border-destaque bg-superficie px-4 py-3 text-texto shadow-[0_4px_0_var(--cor-sombra)]"
              data-festa-ilha={ilha.id}
            >
              <Mascote expressao="comemorando" tamanho={56} className="shrink-0" />
              <div className="min-w-0">
                <p className="font-black">Ilha {ilha.nome} completa!</p>
                <p className="text-sm font-bold text-texto-suave">A ilha inteira acendeu: do primeiro elemento até o seu site no mundo.</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm font-black">
                  <Link href={ROTA_PROJETOS} className="text-primaria underline" data-festa-projetos>
                    Ver Meus projetos
                  </Link>
                  <button type="button" className="text-texto-suave underline" onClick={() => setFestaDaIlha(null)}>
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          ) : mensagem && (
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
