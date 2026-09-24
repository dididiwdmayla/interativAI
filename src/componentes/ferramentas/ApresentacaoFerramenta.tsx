"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Mascote } from "@/componentes/mascote/Mascote";
import { Botao } from "@/componentes/ui/Botao";
import type { Ferramenta } from "@/ferramentas/registro";
import { assinarUso } from "@/ferramentas/uso";
import { tocarSom } from "@/lib/som";
import type { Expressao } from "@/motor/expressao";

type Props = {
  ferramenta: Ferramenta;
  toque: boolean;
  /** Deixa o alvo visível antes de medir (troca de aba, de vista...). */
  aoPreparar: (ferramenta: Ferramenta) => void;
  /** Terminou (usou a ferramenta) ou pulou. */
  aoConcluir: () => void;
};

type Caixa = { x: number; y: number; largura: number; altura: number };

const FOLGA = 6;
const MARGEM = 12;
const PASSOS_FALA = 3;
const ESPERA_COMEMORAR_MS = 1100;

/** Primeiro elemento visível que casa com o seletor. */
function acharAlvo(seletor: string): HTMLElement | null {
  for (const elemento of Array.from(document.querySelectorAll<HTMLElement>(seletor))) {
    const caixa = elemento.getBoundingClientRect();
    if (caixa.width > 0 && caixa.height > 0) return elemento;
  }
  return null;
}

function medir(elemento: HTMLElement | null): Caixa | null {
  if (!elemento) return null;
  const caixa = elemento.getBoundingClientRect();
  const largura = window.innerWidth;
  const altura = window.innerHeight;
  // Recorta na tela: um alvo maior que a tela ainda tem um buraco visível.
  const x = Math.max(FOLGA, caixa.left - FOLGA);
  const y = Math.max(FOLGA, caixa.top - FOLGA);
  const direita = Math.min(largura - FOLGA, caixa.right + FOLGA);
  const baixo = Math.min(altura - FOLGA, caixa.bottom + FOLGA);
  if (direita <= x || baixo <= y) return null;
  return { x, y, largura: direita - x, altura: baixo - y };
}

function iguais(a: Caixa | null, b: Caixa | null): boolean {
  if (!a || !b) return a === b;
  return (
    Math.abs(a.x - b.x) < 0.5 &&
    Math.abs(a.y - b.y) < 0.5 &&
    Math.abs(a.largura - b.largura) < 0.5 &&
    Math.abs(a.altura - b.altura) < 0.5
  );
}

/** Lugar do cartão do mascote: ao lado do alvo, sem cobri-lo, se couber. */
function posicionarCartao(alvo: Caixa | null, largura: number, altura: number): { x: number; y: number } {
  const telaL = window.innerWidth;
  const telaA = window.innerHeight;
  const limitarX = (x: number) => Math.min(Math.max(MARGEM, x), telaL - largura - MARGEM);
  const limitarY = (y: number) => Math.min(Math.max(MARGEM, y), telaA - altura - MARGEM);
  if (!alvo) return { x: limitarX((telaL - largura) / 2), y: limitarY((telaA - altura) / 2) };

  const lados = {
    direita: { x: alvo.x + alvo.largura + MARGEM, y: limitarY(alvo.y), cabe: alvo.x + alvo.largura + MARGEM + largura <= telaL - MARGEM },
    esquerda: { x: alvo.x - MARGEM - largura, y: limitarY(alvo.y), cabe: alvo.x - MARGEM - largura >= MARGEM },
    abaixo: { x: limitarX(alvo.x), y: alvo.y + alvo.altura + MARGEM, cabe: alvo.y + alvo.altura + MARGEM + altura <= telaA - MARGEM },
    acima: { x: limitarX(alvo.x), y: alvo.y - MARGEM - altura, cabe: alvo.y - MARGEM - altura >= MARGEM },
  };
  const largo = alvo.largura > telaL * 0.5;
  const ordem = largo
    ? (["abaixo", "acima", "direita", "esquerda"] as const)
    : (["direita", "esquerda", "abaixo", "acima"] as const);
  for (const lado of ordem) {
    if (lados[lado].cabe) return { x: lados[lado].x, y: lados[lado].y };
  }
  // Alvo grande demais: o cartão vai para a borda mais longe do centro dele.
  const centro = alvo.y + alvo.altura / 2;
  return { x: limitarX((telaL - largura) / 2), y: centro > telaA / 2 ? MARGEM : telaA - altura - MARGEM };
}

/**
 * Apresentação guiada de uma ferramenta: escurece a tela menos o alvo, o
 * mascote explica em 3 falas e, no passo "Experimente", só o alvo fica
 * interativo até o jogador usar a ferramenta de verdade.
 */
export function ApresentacaoFerramenta({ ferramenta, toque, aoPreparar, aoConcluir }: Props) {
  const idMascara = useId().replace(/:/g, "");
  const idTexto = useId();
  const [passo, setPasso] = useState(0);
  const [comemorando, setComemorando] = useState(false);
  const [caixa, setCaixa] = useState<Caixa | null>(null);
  /** Se o alvo não aparecer logo, o cartão surge no centro mesmo assim (sempre dá pra pular). */
  const [esperouAlvo, setEsperouAlvo] = useState(false);
  const [tamanhoCartao, setTamanhoCartao] = useState({ largura: 340, altura: 200 });
  const cartao = useRef<HTMLDivElement>(null);
  const botaoContinuar = useRef<HTMLButtonElement>(null);
  const aoConcluirAtual = useRef(aoConcluir);
  const experimentando = passo >= PASSOS_FALA;
  const experimentandoRef = useRef(experimentando);
  const [extras, setExtras] = useState<(Caixa | null)[]>([]);
  const modo = toque ? "toque" : "mouse";

  useEffect(() => {
    experimentandoRef.current = experimentando;
  }, [experimentando]);

  useEffect(() => {
    aoConcluirAtual.current = aoConcluir;
  }, [aoConcluir]);

  // Prepara o alvo (aba, vista) e rola até ele; depois mede a cada quadro.
  useEffect(() => {
    aoPreparar(ferramenta);
    let quadro = 0;
    let rolou = false;
    const acompanhar = () => {
      const elemento = acharAlvo(ferramenta.alvo);
      if (elemento && !rolou) {
        rolou = true;
        elemento.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
      const nova = medir(elemento);
      setCaixa((atual) => (iguais(atual, nova) ? atual : nova));
      const novasExtras = experimentandoRef.current
        ? (ferramenta.liberarNoExperimente ?? []).map((seletor) => medir(acharAlvo(seletor)))
        : [];
      setExtras((atuais) =>
        atuais.length === novasExtras.length && atuais.every((caixaAtual, indice) => iguais(caixaAtual, novasExtras[indice]))
          ? atuais
          : novasExtras,
      );
      quadro = requestAnimationFrame(acompanhar);
    };
    quadro = requestAnimationFrame(acompanhar);
    return () => cancelAnimationFrame(quadro);
    // aoPreparar muda a cada render do pai; só importa na entrada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ferramenta]);

  useEffect(() => {
    const temporizador = setTimeout(() => setEsperouAlvo(true), 900);
    return () => clearTimeout(temporizador);
  }, []);

  useLayoutEffect(() => {
    const elemento = cartao.current;
    if (!elemento) return;
    const observador = new ResizeObserver(() => {
      const { offsetWidth, offsetHeight } = elemento;
      setTamanhoCartao((atual) =>
        atual.largura === offsetWidth && atual.altura === offsetHeight
          ? atual
          : { largura: offsetWidth, altura: offsetHeight },
      );
    });
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  const concluir = useCallback(() => aoConcluirAtual.current(), []);

  const avancar = useCallback(() => {
    if (experimentando) return;
    tocarSom("clique");
    setPasso((atual) => Math.min(atual + 1, PASSOS_FALA));
  }, [experimentando]);

  const jaComemorou = useRef(false);
  const comemorar = useCallback(() => {
    if (jaComemorou.current) return;
    jaComemorou.current = true;
    setComemorando(true);
    tocarSom("acerto");
    setTimeout(() => aoConcluirAtual.current(), ESPERA_COMEMORAR_MS);
  }, []);

  // Enter avança as falas; Esc pula. Capturado antes dos atalhos do jogo.
  useEffect(() => {
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape" && !experimentando) {
        evento.preventDefault();
        evento.stopPropagation();
        concluir();
      } else if (evento.key === "Enter" && !experimentando) {
        evento.preventDefault();
        evento.stopPropagation();
        avancar();
      }
    };
    window.addEventListener("keydown", aoTeclar, true);
    return () => window.removeEventListener("keydown", aoTeclar, true);
  }, [avancar, concluir, experimentando]);

  useEffect(() => {
    if (!experimentando) botaoContinuar.current?.focus({ preventScroll: true });
  }, [experimentando, passo]);

  // "Experimente": espera o uso de verdade.
  useEffect(() => {
    if (!experimentando || comemorando) return;
    if (ferramenta.uso === "sinal") {
      return assinarUso((id) => {
        if (id === ferramenta.id) comemorar();
      });
    }
    const elemento = acharAlvo(ferramenta.alvo);
    if (!elemento) return;
    const alvos: EventTarget[] = [elemento];
    // O preview é um iframe: os toques dentro dele não sobem para o jogo.
    for (const iframe of Array.from(elemento.querySelectorAll("iframe"))) {
      try {
        if (iframe.contentDocument) alvos.push(iframe.contentDocument);
      } catch {
        // Iframe de outra origem: fica só o elemento.
      }
    }
    const aoUsar = () => comemorar();
    for (const alvo of alvos) {
      alvo.addEventListener("pointerdown", aoUsar, true);
      alvo.addEventListener("wheel", aoUsar, { capture: true, passive: true });
      alvo.addEventListener("scroll", aoUsar, { capture: true, passive: true });
    }
    elemento.querySelector<HTMLInputElement>("input:not([disabled])")?.focus({ preventScroll: true });
    return () => {
      for (const alvo of alvos) {
        alvo.removeEventListener("pointerdown", aoUsar, true);
        alvo.removeEventListener("wheel", aoUsar, true);
        alvo.removeEventListener("scroll", aoUsar, true);
      }
    };
  }, [experimentando, comemorando, ferramenta, comemorar]);

  const falas = [ferramenta.oQueFaz, ferramenta.praQueServe, ferramenta.comoUsarAqui[modo]];
  const expressoes: Expressao[] = ["feliz", "curioso", "apontando"];
  const expressao: Expressao = comemorando ? "comemorando" : experimentando ? "apontando" : expressoes[passo];
  const posicao = posicionarCartao(caixa, tamanhoCartao.largura, tamanhoCartao.altura);
  const { Icone } = ferramenta;

  const buracos = [caixa, ...extras].filter((item): item is Caixa => item !== null);
  // Nas falas, a tela toda bloqueia e o toque avança. No "Experimente", o
  // bloqueio tem buracos (clip-path evenodd): só o alvo fica livre.
  const recorte =
    experimentando && buracos.length > 0
      ? `path(evenodd, "M0 0H${window.innerWidth}V${window.innerHeight}H0Z ${buracos
          .map(({ x, y, largura, altura }) => `M${x} ${y}h${largura}v${altura}h${-largura}Z`)
          .join(" ")}")`
      : undefined;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[60]" data-apresentacao={ferramenta.id}>
      <svg className="pointer-events-none fixed inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <mask id={idMascara}>
            <rect width="100%" height="100%" fill="white" />
            {buracos.map(({ x, y, largura, altura }) => (
              <rect key={`${x}-${y}`} x={x} y={y} width={largura} height={altura} rx="14" fill="black" />
            ))}
          </mask>
        </defs>
        <motion.rect
          width="100%"
          height="100%"
          fill="var(--cor-veu)"
          mask={`url(#${idMascara})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </svg>
      {buracos.map(({ x, y, largura, altura }, indice) => (
        <div
          key={indice}
          className="contorno-apresentacao pointer-events-none fixed rounded-[14px] border-[3px] border-destaque"
          style={{ left: x, top: y, width: largura, height: altura }}
          aria-hidden="true"
        />
      ))}
      <div
        className="pointer-events-auto fixed inset-0"
        style={{ clipPath: recorte }}
        onClick={avancar}
        aria-hidden="true"
      />
      <motion.div
        ref={cartao}
        role="dialog"
        aria-modal={!experimentando}
        aria-labelledby={idTexto}
        onClick={avancar}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={caixa || esperouAlvo ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        style={{ left: posicao.x, top: posicao.y }}
        className={`cartao-apresentacao pointer-events-auto fixed flex w-[min(360px,calc(100vw-24px))] gap-3 rounded-3xl border-2 border-borda bg-superficie p-3 text-texto shadow-[0_8px_0_var(--cor-sombra)] ${
          experimentando ? "" : "cursor-pointer"
        }`}
      >
        <div className="shrink-0 self-start pt-1">
          <Mascote expressao={expressao} tamanho={64} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-texto-suave">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-painel text-primaria">
              <Icone tamanho={16} />
            </span>
            <span className="min-w-0 flex-1 truncate">{ferramenta.nome}</span>
            <span className="flex gap-1" aria-label={`Passo ${Math.min(passo, PASSOS_FALA) + 1} de ${PASSOS_FALA + 1}`}>
              {Array.from({ length: PASSOS_FALA + 1 }, (_, indice) => (
                <span
                  key={indice}
                  className={`h-1.5 w-1.5 rounded-full ${indice <= passo ? "bg-primaria" : "bg-borda"}`}
                />
              ))}
            </span>
          </div>
          <div id={idTexto} aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={comemorando ? "viva" : passo}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
                className="space-y-2"
              >
                {comemorando ? (
                  <p className="text-[15px] font-bold leading-snug">Isso aí! Agora essa ferramenta é sua.</p>
                ) : experimentando ? (
                  <>
                    <p className="text-[15px] font-bold leading-snug">
                      <span className="text-primaria">Experimente:</span> {ferramenta.experimente[modo]}
                    </p>
                    <p className="rounded-xl bg-painel px-3 py-2 text-sm leading-snug">
                      <span className="font-black">No F12 de verdade:</span> {ferramenta.noF12DeVerdade}
                    </p>
                  </>
                ) : (
                  <p className="text-[15px] font-bold leading-snug">{falas[passo]}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(evento) => {
                evento.stopPropagation();
                concluir();
              }}
              className="min-h-11 rounded-full px-3 text-xs font-bold text-texto-suave underline decoration-dotted underline-offset-2 hover:text-texto"
            >
              Pular
            </button>
            {!experimentando && (
              <Botao
                ref={botaoContinuar}
                className="ml-auto min-h-11"
                onClick={(evento) => {
                  evento.stopPropagation();
                  avancar();
                }}
              >
                {passo === PASSOS_FALA - 1 ? "Quero tentar" : "Continuar"}
              </Botao>
            )}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
