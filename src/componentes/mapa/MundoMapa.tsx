"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useMusicaDaTela } from "@/audio/ganchos";
import { audioLiberado, tocarEfeito, tocarHover } from "@/audio/motor";
import { IconeCadeado } from "@/componentes/icones/IconeCadeado";
import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { Mascote } from "@/componentes/mascote/Mascote";
import { UNIDADES } from "@/conteudo";
import { ilhasDaTrilha, statusDaUnidade, unidadesDaIlha, unidadesObrigatoriasDaIlha } from "@/curriculo";
import { resolverLente, unidadeNaLente } from "@/lib/lentes";
import type { IlhaCurriculo } from "@/curriculo/tipos";
import { useProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import { estadoDaIlha, type EstadoIlha, ilhaAnterior, ilhaAtual, ilhaCompleta, trilhaDaFonte, unidadeConcluida } from "@/lib/mapa";
import { ROTA_REVISAO, rotaDaIlha } from "@/lib/rotas";
import { diaLocal, temConceitoAprendido, vencidosHoje } from "@/lib/revisao";
import { useSincronizarRevisao } from "@/componentes/revisao/useSincronizarRevisao";
import { ArtePorto } from "./arte/ArtePorto";
import { ARTE_DAS_ILHAS, ArteFutura } from "./arte";
import { AndaimesIlha, BrilhoIlha, NevoaIlha } from "./arte/MarcasDeEstado";
import { Oceano } from "./arte/Oceano";
import { GrupoAnimadoNaTela } from "./arte/useAnimarMapa";
import { type ApiAreaArrastavel, AreaArrastavel } from "./AreaArrastavel";
import { BarraMapa } from "./BarraMapa";
import { desenhoDoMundo } from "./desenhoMundo";
import { caminhoSuave, type Ponto } from "./geometria";
import { useTamanho } from "./useTamanho";

const ROTULO_ESTADO: Record<EstadoIlha, string> = {
  disponivel: "Aberta",
  construcao: "Em construção",
  bloqueada: "Bloqueada",
};

/** A caixa de desenho da arte de uma ilha, em volta do centro dela (unidades do desenho). */
const CAIXA_DA_ARTE = { x: -160, y: -130, largura: 320, altura: 230 };

/**
 * A arte de uma ilha numa camada própria do compositor, centrada no ponto
 * dela: a animação de uma ilha repinta só essa camada, e o resto do mapa
 * (o mar, a rota, as outras ilhas) fica pintado.
 */
function CamadaDaArte({
  x,
  y,
  escala,
  apagada = false,
  children,
  ...dados
}: Ponto & { escala: number; apagada?: boolean; children: ReactNode } & Record<`data-${string}`, string | boolean>) {
  const { x: cx, y: cy, largura, altura } = CAIXA_DA_ARTE;
  return (
    <div
      aria-hidden="true"
      className="camada-ilha pointer-events-none absolute"
      style={{ left: (x + cx) * escala, top: (y + cy) * escala, width: largura * escala, height: altura * escala, opacity: apagada ? 0.35 : 1 }}
    >
      <svg viewBox={`${cx} ${cy} ${largura} ${altura}`} width="100%" height="100%" className="block overflow-visible">
        <GrupoAnimadoNaTela {...dados}>{children}</GrupoAnimadoNaTela>
      </svg>
    </div>
  );
}

/**
 * Barquinho de papel na rota, balançando. Em HTML, em cima do desenho: o
 * balanço é do compositor (transform), sem repintar o mapa.
 */
function Barquinho({ x, y, escala }: Ponto & { escala: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ left: (x - 30) * escala, top: (y - 40) * escala, width: 60 * escala, height: 60 * escala }}
      data-barquinho
    >
      <svg viewBox="-30 -40 60 60" width="100%" height="100%" className="barquinho-balanca block overflow-visible">
        <path d="M-22 0h44l-9 12h-26z" fill="var(--cor-madeira)" />
        <path d="M0-32v31" stroke="var(--cor-madeira)" strokeWidth="2.5" />
        <path d="M2-30l18 26H2z" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="1.5" />
        <path d="M-2-28l-14 24h14z" fill="var(--cor-primaria)" />
      </svg>
    </div>
  );
}

/**
 * O mundo: o mar, as ilhas na ordem do currículo ligadas pela rota, cada
 * uma com a arte e o estado dela (aberta com brilho, em construção com
 * andaimes, bloqueada com névoa e cadeado), e o computadorzinho na ilha
 * atual. Dá para arrastar e rolar.
 */
export function MundoMapa() {
  const carregado = useProgressoCarregado();
  useMusicaDaTela({ tipo: "mundo" });
  if (!carregado) return <TelaCarregando />;
  return <MundoCarregado />;
}

function MundoCarregado() {
  useSincronizarRevisao();
  const progresso = useProgresso();
  const area = useRef<ApiAreaArrastavel>(null);
  const moldura = useRef<HTMLDivElement>(null);
  const { largura: larguraTela, altura: alturaTela } = useTamanho(moldura);
  const [aviso, setAviso] = useState<string | null>(null);
  const centralizado = useRef(false);

  // Voltar ao mapa (depois do primeiro gesto) tem som de chegada.
  useEffect(() => {
    if (audioLiberado()) tocarEfeito("entrar-mapa");
  }, []);

  const fonte = { progresso };
  const trilha = trilhaDaFonte(fonte);
  const lente = resolverLente(progresso.lente);
  /** Quantas unidades da ilha a lente acende (null sem lente). */
  const contaNaLente = (ilha: IlhaCurriculo): number | null =>
    lente ? unidadesDaIlha(ilha).filter((item) => unidadeNaLente(item, lente)).length : null;
  const ilhasDoMundo = ilhasDaTrilha(trilha);
  // As ilhas cabem na altura, com a mesma margem em cima e embaixo; o resto rola de lado.
  const desenho = desenhoDoMundo(trilha, ilhasDoMundo, larguraTela, alturaTela);
  const { largura: LARGURA, altura: ALTURA, escala, posicao: posicaoDa, porto: POSICAO_PORTO } = desenho;
  const atual = ilhaAtual(fonte);
  // Do mundo, o provável é ir para a ilha onde o computadorzinho está.
  useMusicaDaTela(null, { tipo: "ilha", ilhaId: atual.id });
  const rota = ilhasDoMundo.filter((ilha) => !ilha.opcional);
  const indiceAtual = rota.indexOf(atual);
  const posicaoAtual = posicaoDa(atual);
  const proximaDaRota = rota[indiceAtual + 1];
  const posicaoBarco = proximaDaRota
    ? {
        x: (posicaoAtual.x + posicaoDa(proximaDaRota).x) / 2,
        y: (posicaoAtual.y + posicaoDa(proximaDaRota).y) / 2 + 26,
      }
    : { x: posicaoAtual.x + 120, y: posicaoAtual.y + 70 };

  // Começa olhando a ilha atual.
  useEffect(() => {
    if (larguraTela === 0 || centralizado.current) return;
    centralizado.current = true;
    area.current?.centralizar(posicaoAtual.x * escala, posicaoAtual.y * escala);
  }, [larguraTela, escala, posicaoAtual.x, posicaoAtual.y]);

  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(() => setAviso(null), 3500);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  // O Porto aparece depois do primeiro conceito aprendido (com item de revisão) e diz quantos vencem hoje.
  const comPorto = temConceitoAprendido(progresso.revisao);
  const itensDeHoje = comPorto ? vencidosHoje(progresso.revisao, diaLocal()).length : 0;

  const pontosDaRota = rota.map((ilha) => posicaoDa(ilha));
  const opcionais = ilhasDoMundo.filter((ilha) => ilha.opcional);
  const ultimaDaRota = pontosDaRota[pontosDaRota.length - 1];

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-mar" data-mapa="mundo" data-trilha={trilha.id}>
      <BarraMapa caminho={["Mundo"]} lentes />
      <div ref={moldura} className="relative flex min-h-0 flex-1 flex-col">
        <AreaArrastavel ref={area} rotulo="Mapa do mundo. Arraste ou role para ver todas as ilhas.">
          <div className="relative" style={{ width: LARGURA * escala, height: ALTURA * escala }} data-mundo-desenho data-escala={escala.toFixed(3)}>
            <Oceano largura={LARGURA} altura={ALTURA} escala={escala} />
            {/* O brilho das ilhas abertas, embaixo do desenho (pulsa pelo compositor). */}
            {ilhasDoMundo.map((ilha) =>
              estadoDaIlha(ilha, fonte) === "disponivel" ? (
                <div key={ilha.id} className={contaNaLente(ilha) === 0 ? "opacity-35" : undefined}>
                  <BrilhoIlha {...posicaoDa(ilha)} escala={escala} completa={ilhaCompleta(ilha, fonte)} />
                </div>
              ) : null,
            )}
            <svg
              viewBox={`0 0 ${LARGURA} ${ALTURA}`}
              width={LARGURA * escala}
              height={ALTURA * escala}
              className="absolute inset-0"
              aria-hidden="true"
            >
              {/* A rota entre as ilhas, na ordem do currículo. */}
              <path d={caminhoSuave(pontosDaRota)} fill="none" stroke="var(--cor-mar-fundo)" strokeWidth="16" strokeLinecap="round" opacity="0.6" />
              <path
                d={caminhoSuave(pontosDaRota)}
                fill="none"
                stroke="var(--cor-rota)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="1 20"
              />
              {opcionais.map((ilha) => {
                const ponto = posicaoDa(ilha);
                return (
                  <path
                    key={ilha.id}
                    d={caminhoSuave([ultimaDaRota, { x: (ultimaDaRota.x + ponto.x) / 2 + 60, y: (ultimaDaRota.y + ponto.y) / 2 }, ponto])}
                    fill="none"
                    stroke="var(--cor-rota)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="1 18"
                    opacity="0.5"
                  />
                );
              })}
            </svg>
            {/*
              A arte de cada ilha (e do Porto) numa camada própria: o que se mexe
              nela (engrenagens, sinais, a fumaça) repinta só a ilha, e nunca o
              mapa inteiro. Fora da tela, para.
            */}
            {comPorto && (
              <CamadaDaArte {...POSICAO_PORTO} escala={escala} data-porto-arte>
                <ArtePorto comItens={itensDeHoje > 0} />
              </CamadaDaArte>
            )}
            {ilhasDoMundo.map((ilha) => {
              const estado = estadoDaIlha(ilha, fonte);
              const Arte = ARTE_DAS_ILHAS[ilha.id] ?? ArteFutura;
              return (
                <CamadaDaArte key={ilha.id} {...posicaoDa(ilha)} escala={escala} data-ilha-arte={ilha.id} apagada={contaNaLente(ilha) === 0}>
                  <Arte />
                  {estado === "construcao" && <AndaimesIlha />}
                </CamadaDaArte>
              );
            })}
            <Barquinho {...posicaoBarco} escala={escala} />
            {/* A névoa das ilhas bloqueadas, em cima do desenho (desliza pelo compositor). */}
            {ilhasDoMundo.map((ilha) =>
              estadoDaIlha(ilha, fonte) === "bloqueada" ? <NevoaIlha key={ilha.id} {...posicaoDa(ilha)} escala={escala} /> : null,
            )}

            {ilhasDoMundo.map((ilha) => {
              const { x, y } = posicaoDa(ilha);
              const estado = estadoDaIlha(ilha, fonte);
              // As zonas opcionais não contam para a ilha ficar "Completa!".
              const prontas = unidadesObrigatoriasDaIlha(ilha).filter((item) => statusDaUnidade(item.id) === "pronta");
              const concluidas = prontas.filter((item) => {
                const conteudo = UNIDADES.find((unidade) => unidade.id === item.id);
                return conteudo ? unidadeConcluida(conteudo, progresso) : false;
              }).length;
              const detalhe =
                estado === "disponivel"
                  ? concluidas === prontas.length && prontas.length > 0
                    ? "Completa!"
                    : `${concluidas} de ${prontas.length} ${prontas.length === 1 ? "unidade" : "unidades"}`
                  : ROTULO_ESTADO[estado];
              // Com uma lente acesa, cada ilha diz quantas unidades do tema ela tem; as sem nenhuma apagam.
              const naLente = contaNaLente(ilha);
              const rotulo = `Ilha ${ilha.nome}${ilha.opcional ? " (opcional)" : ""}: ${detalhe}${
                naLente === null ? "" : `. ${naLente} ${naLente === 1 ? "unidade" : "unidades"} de ${lente?.nome}`
              }`;
              const apagada = naLente === 0;
              const estilo = {
                left: (x - 115) * escala,
                top: (y - 100) * escala,
                width: 230 * escala,
                height: 170 * escala,
              };
              const etiqueta = (
                <span
                  className="pointer-events-none absolute left-1/2 top-full flex -translate-x-1/2 -translate-y-2 flex-col items-center gap-1 whitespace-nowrap"
                  data-etiqueta-ilha={ilha.id}
                >
                  <span
                    className="rounded-full border-2 border-borda bg-superficie px-3 py-0.5 text-sm font-black text-texto shadow-[0_3px_0_var(--cor-sombra)]"
                    data-nome-ilha={ilha.id}
                  >
                    {ilha.nome}
                  </span>
                  <span className="flex items-center gap-1">
                    {ilha.opcional && (
                      <span className="rounded-full bg-secundaria px-2 py-0.5 text-[11px] font-black uppercase text-sobre-secundaria">
                        Opcional
                      </span>
                    )}
                    {naLente !== null && naLente > 0 && (
                      <span className="rounded-full bg-primaria px-2 py-0.5 text-[11px] font-black text-sobre-primaria" data-lente-conta={naLente}>
                        {naLente} {naLente === 1 ? "unidade" : "unidades"}
                      </span>
                    )}
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-black ${
                        estado === "disponivel" ? "bg-destaque text-sobre-destaque" : "bg-painel text-texto-suave"
                      }`}
                    >
                      {estado === "bloqueada" && <IconeCadeado tamanho={11} />}
                      {detalhe}
                    </span>
                  </span>
                </span>
              );
              if (estado === "bloqueada") {
                const anterior = ilhaAnterior(ilha, fonte);
                return (
                  <button
                    key={ilha.id}
                    type="button"
                    data-ilha={ilha.id}
                    data-estado={estado}
                    data-lente={naLente === null ? undefined : apagada ? "apagada" : "acesa"}
                    aria-label={`${rotulo}. Termine a ilha ${anterior?.nome ?? "anterior"} para abrir.`}
                    onClick={() => setAviso(`A ilha ${ilha.nome} abre quando você terminar a ilha ${anterior?.nome ?? "anterior"}.`)}
                    className={`absolute rounded-[40%] focus-visible:outline-offset-4 ${apagada ? "opacity-40" : ""}`}
                    style={estilo}
                  >
                    {etiqueta}
                  </button>
                );
              }
              return (
                <Link
                  key={ilha.id}
                  href={rotaDaIlha(ilha.id)}
                  onClick={() => tocarEfeito(ilha.sempreAberta ? "clique" : "viagem-ilha")}
                  onPointerEnter={(evento) => evento.pointerType === "mouse" && tocarHover()}
                  data-ilha={ilha.id}
                  data-estado={estado}
                  data-completa={estado === "disponivel" && ilhaCompleta(ilha, fonte) ? "sim" : "nao"}
                  data-lente={naLente === null ? undefined : apagada ? "apagada" : "acesa"}
                  aria-label={rotulo}
                  className={`absolute rounded-[40%] focus-visible:outline-offset-4 ${apagada ? "opacity-40" : ""}`}
                  style={estilo}
                >
                  {etiqueta}
                </Link>
              );
            })}

            {comPorto && (
              <Link
                href={ROTA_REVISAO}
                onClick={() => tocarEfeito("clique")}
                onPointerEnter={(evento) => evento.pointerType === "mouse" && tocarHover()}
                data-porto
                data-porto-itens={itensDeHoje}
                aria-label={`Porto da revisão: ${
                  itensDeHoje === 0 ? "nada pra revisar hoje" : `${itensDeHoje} ${itensDeHoje === 1 ? "item vence" : "itens vencem"} hoje`
                }`}
                className="absolute rounded-[40%] focus-visible:outline-offset-4"
                style={{
                  left: (POSICAO_PORTO.x - 80) * escala,
                  top: (POSICAO_PORTO.y - 60) * escala,
                  width: 200 * escala,
                  height: 110 * escala,
                }}
              >
                <span className="pointer-events-none absolute left-1/2 top-full flex -translate-x-1/2 -translate-y-3 flex-col items-center gap-1 whitespace-nowrap">
                  <span className="rounded-full border-2 border-borda bg-superficie px-3 py-0.5 text-sm font-black text-texto shadow-[0_3px_0_var(--cor-sombra)]">
                    Porto da revisão
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-black ${
                      itensDeHoje > 0 ? "bg-destaque text-sobre-destaque" : "bg-painel text-texto-suave"
                    }`}
                  >
                    {itensDeHoje > 0 ? `${itensDeHoje} hoje` : "Em dia"}
                  </span>
                </span>
              </Link>
            )}

            {/* O computadorzinho mora na ilha atual. */}
            <motion.div
              className="pointer-events-none absolute"
              data-mascote-no-mapa={atual.id}
              initial={false}
              animate={{ left: (posicaoAtual.x + 52) * escala, top: (posicaoAtual.y - 104) * escala }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <Mascote expressao="feliz" tamanho={Math.round(Math.min(72, Math.max(46, 64 * escala)))} />
            </motion.div>
          </div>
        </AreaArrastavel>
        <div role="status" aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
          {aviso && (
            <p className="rounded-2xl border-2 border-borda bg-superficie px-4 py-2 text-sm font-bold text-texto shadow-[0_4px_0_var(--cor-sombra)]">
              {aviso}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
