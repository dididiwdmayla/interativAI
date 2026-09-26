"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMusicaDaTela } from "@/audio/ganchos";
import { audioLiberado, tocarEfeito, tocarHover } from "@/audio/motor";
import { IconeCadeado } from "@/componentes/icones/IconeCadeado";
import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { Mascote } from "@/componentes/mascote/Mascote";
import { UNIDADES } from "@/conteudo";
import { CURRICULO, unidadesProntasDaIlha } from "@/curriculo";
import type { IlhaCurriculo } from "@/curriculo/tipos";
import { useProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import { estadoDaIlha, type EstadoIlha, ilhaAnterior, ilhaAtual, unidadeConcluida } from "@/lib/mapa";
import { rotaDaIlha } from "@/lib/rotas";
import { ARTE_DAS_ILHAS } from "./arte";
import { AndaimesIlha, BrilhoIlha, NevoaIlha } from "./arte/MarcasDeEstado";
import { Oceano } from "./arte/Oceano";
import { useAnimarMapa } from "./arte/useAnimarMapa";
import { type ApiAreaArrastavel, AreaArrastavel } from "./AreaArrastavel";
import { BarraMapa } from "./BarraMapa";
import { caminhoSuave, type Ponto } from "./geometria";
import { useTamanho } from "./useTamanho";

/** Tamanho do desenho do mundo (as posições abaixo usam estas medidas). */
const LARGURA = 1840;
const ALTURA = 820;

/** Onde cada ilha fica no mundo, na ordem da rota. Frameworks fica afastada. */
const POSICOES: Record<string, Ponto> = {
  origens: { x: 180, y: 480 },
  sites: { x: 430, y: 280 },
  logica: { x: 680, y: 530 },
  "paginas-vivas": { x: 930, y: 280 },
  "rede-servidor": { x: 1180, y: 530 },
  ia: { x: 1430, y: 280 },
  oficio: { x: 1680, y: 530 },
  frameworks: { x: 1450, y: 700 },
};

/** Ilha nova sem posição: vai para a direita, no mar aberto. */
function posicaoDa(ilha: IlhaCurriculo, indice: number): Ponto {
  return POSICOES[ilha.id] ?? { x: 180 + indice * 240, y: indice % 2 === 0 ? 480 : 280 };
}

const ROTULO_ESTADO: Record<EstadoIlha, string> = {
  disponivel: "Aberta",
  construcao: "Em construção",
  bloqueada: "Bloqueada",
};

/** Barquinho de papel na rota, balançando. */
function Barquinho({ x, y }: Ponto) {
  const animar = useAnimarMapa();
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g
        animate={animar ? { rotate: [-4, 4, -4], y: [0, -3, 0] } : undefined}
        transition={animar ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <path d="M-22 0h44l-9 12h-26z" fill="var(--cor-madeira)" />
        <path d="M0-32v31" stroke="var(--cor-madeira)" strokeWidth="2.5" />
        <path d="M2-30l18 26H2z" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="1.5" />
        <path d="M-2-28l-14 24h14z" fill="var(--cor-primaria)" />
      </motion.g>
    </g>
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

  // O mundo cobre a tela e rola o resto (no celular, arrasta de lado).
  const escala =
    larguraTela > 0 ? Math.min(1.35, Math.max(0.55, alturaTela / ALTURA, larguraTela / LARGURA)) : 1;
  const fonte = { progresso };
  const atual = ilhaAtual(fonte);
  const rota = CURRICULO.filter((ilha) => !ilha.opcional);
  const indiceAtual = rota.indexOf(atual);
  const posicaoAtual = posicaoDa(atual, CURRICULO.indexOf(atual));
  const proximaDaRota = rota[indiceAtual + 1];
  const posicaoBarco = proximaDaRota
    ? {
        x: (posicaoAtual.x + posicaoDa(proximaDaRota, CURRICULO.indexOf(proximaDaRota)).x) / 2,
        y: (posicaoAtual.y + posicaoDa(proximaDaRota, CURRICULO.indexOf(proximaDaRota)).y) / 2 + 26,
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

  const pontosDaRota = rota.map((ilha) => posicaoDa(ilha, CURRICULO.indexOf(ilha)));
  const opcionais = CURRICULO.filter((ilha) => ilha.opcional);
  const ultimaDaRota = pontosDaRota[pontosDaRota.length - 1];

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-mar" data-mapa="mundo">
      <BarraMapa caminho={["Mundo"]} />
      <div ref={moldura} className="relative flex min-h-0 flex-1 flex-col">
        <AreaArrastavel ref={area} rotulo="Mapa do mundo. Arraste ou role para ver todas as ilhas.">
          <div className="relative" style={{ width: LARGURA * escala, height: ALTURA * escala }}>
            <svg
              viewBox={`0 0 ${LARGURA} ${ALTURA}`}
              width={LARGURA * escala}
              height={ALTURA * escala}
              className="absolute inset-0"
              aria-hidden="true"
            >
              <Oceano largura={LARGURA} altura={ALTURA} />
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
                const ponto = posicaoDa(ilha, CURRICULO.indexOf(ilha));
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
              <Barquinho {...posicaoBarco} />
              {CURRICULO.map((ilha, indice) => {
                const { x, y } = posicaoDa(ilha, indice);
                const estado = estadoDaIlha(ilha, fonte);
                const Arte = ARTE_DAS_ILHAS[ilha.id] ?? ARTE_DAS_ILHAS.frameworks;
                return (
                  <g key={ilha.id} transform={`translate(${x} ${y})`} data-ilha-arte={ilha.id}>
                    {estado === "disponivel" && <BrilhoIlha />}
                    <Arte />
                    {estado === "construcao" && <AndaimesIlha />}
                    {estado === "bloqueada" && <NevoaIlha />}
                  </g>
                );
              })}
            </svg>

            {CURRICULO.map((ilha, indice) => {
              const { x, y } = posicaoDa(ilha, indice);
              const estado = estadoDaIlha(ilha, fonte);
              const prontas = unidadesProntasDaIlha(ilha);
              const concluidas = prontas.filter((item) => {
                const conteudo = UNIDADES.find((unidade) => unidade.id === item.id);
                return conteudo ? unidadeConcluida(conteudo, progresso) : false;
              }).length;
              const detalhe =
                estado === "disponivel" ? `${concluidas} de ${prontas.length} ${prontas.length === 1 ? "unidade" : "unidades"}` : ROTULO_ESTADO[estado];
              const rotulo = `Ilha ${ilha.nome}${ilha.opcional ? " (opcional)" : ""}: ${detalhe}`;
              const estilo = {
                left: (x - 115) * escala,
                top: (y - 100) * escala,
                width: 230 * escala,
                height: 170 * escala,
              };
              const etiqueta = (
                <span className="pointer-events-none absolute left-1/2 top-full flex -translate-x-1/2 -translate-y-2 flex-col items-center gap-1 whitespace-nowrap">
                  <span className="rounded-full border-2 border-borda bg-superficie px-3 py-0.5 text-sm font-black text-texto shadow-[0_3px_0_var(--cor-sombra)]">
                    {ilha.nome}
                  </span>
                  <span className="flex items-center gap-1">
                    {ilha.opcional && (
                      <span className="rounded-full bg-secundaria px-2 py-0.5 text-[11px] font-black uppercase text-sobre-secundaria">
                        Opcional
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
                const anterior = ilhaAnterior(ilha);
                return (
                  <button
                    key={ilha.id}
                    type="button"
                    data-ilha={ilha.id}
                    data-estado={estado}
                    aria-label={`${rotulo}. Termine a ilha ${anterior?.nome ?? "anterior"} para abrir.`}
                    onClick={() => setAviso(`A ilha ${ilha.nome} abre quando você terminar a ilha ${anterior?.nome ?? "anterior"}.`)}
                    className="absolute rounded-[40%] focus-visible:outline-offset-4"
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
                  aria-label={rotulo}
                  className="absolute rounded-[40%] focus-visible:outline-offset-4"
                  style={estilo}
                >
                  {etiqueta}
                </Link>
              );
            })}

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
