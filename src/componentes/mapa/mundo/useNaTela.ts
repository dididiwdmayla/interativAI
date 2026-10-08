"use client";

import { type RefObject, useEffect, useRef } from "react";

/*
 * Se um pedaço do mundo está na tela, sem estado do React: o observador marca
 * o próprio elemento (um atributo), e o CSS decide o que fazer (globals.css).
 * Rolar o mundo não renderiza nada. Um observador por área de rolagem e por
 * regra, compartilhado por todos os elementos.
 */

type Regra = {
  /** O atributo que marca quem está fora. */
  atributo: string;
  /** Quanto do elemento precisa estar na tela para contar como dentro (0: um pixel). */
  parte: number;
  /** Folga em volta da tela (px). */
  folga: number;
};

const observadores = new Map<string, WeakMap<Element | Document, IntersectionObserver>>();

/*
 * Enquanto a pessoa rola o mundo, as marcas esperam e entram quando a rolagem
 * para (useMarcarRolando): rolando, tudo já está pausado, e tirar ou devolver
 * a animação de alguém no meio da rolagem obrigava o Chrome a refazer as
 * camadas e repintar a cada pedaço que entrava ou saía da tela.
 */
let rolando = false;
const pendentes = new Map<Element, Map<string, boolean>>();

function marcar(alvo: Element, atributo: string, dentro: boolean) {
  if (dentro) alvo.removeAttribute(atributo);
  else alvo.setAttribute(atributo, "sim");
}

function marcarOuGuardar(alvo: Element, atributo: string, dentro: boolean) {
  if (!rolando) {
    marcar(alvo, atributo, dentro);
    return;
  }
  const doAlvo = pendentes.get(alvo) ?? new Map<string, boolean>();
  doAlvo.set(atributo, dentro);
  pendentes.set(alvo, doAlvo);
}

function marcarPendentes() {
  for (const [alvo, marcas] of pendentes) for (const [atributo, dentro] of marcas) if (alvo.isConnected) marcar(alvo, atributo, dentro);
  pendentes.clear();
}

function observadorDe(regra: Regra, raiz: Element | null): IntersectionObserver {
  const chaveRegra = `${regra.atributo}:${regra.parte}:${regra.folga}`;
  let porRaiz = observadores.get(chaveRegra);
  if (!porRaiz) {
    porRaiz = new WeakMap();
    observadores.set(chaveRegra, porRaiz);
  }
  const chave = raiz ?? document;
  let observador = porRaiz.get(chave);
  if (!observador) {
    observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          marcarOuGuardar(entrada.target, regra.atributo, entrada.isIntersecting && entrada.intersectionRatio >= regra.parte);
        }
      },
      { root: raiz, rootMargin: `${regra.folga}px`, threshold: regra.parte > 0 ? [0, regra.parte] : 0 },
    );
    porRaiz.set(chave, observador);
  }
  return observador;
}

function useMarcar<T extends Element>(regra: Regra): RefObject<T | null> {
  const ref = useRef<T>(null);
  const { atributo, parte, folga } = regra;
  useEffect(() => {
    const elemento = ref.current;
    if (!elemento || typeof IntersectionObserver === "undefined") return;
    const observador = observadorDe({ atributo, parte, folga }, elemento.closest("[data-area-arrastavel]"));
    observador.observe(elemento);
    return () => {
      observador.unobserve(elemento);
      pendentes.get(elemento)?.delete(atributo);
      elemento.removeAttribute(atributo);
    };
  }, [atributo, parte, folga]);
  return ref;
}

/**
 * Pedaços parados do mar (um peixe, a espuma de uma praia, um brilho na água,
 * uma estrela) e a camada da arte de cada ilha: fora da tela, com folga,
 * ganham `data-pausado="sim"` e perdem a animação (e a camada do compositor).
 */
export function useMarcarNaTela<T extends Element>(): RefObject<T | null> {
  return useMarcar<T>({ atributo: "data-pausado", parte: 0, folga: 120 });
}

/**
 * A vida de dentro de uma ilha (as engrenagens, o guindaste, os operários):
 * só anda com pelo menos metade da ilha na tela; menos que isso, ganha
 * `data-parada="sim"` e as animações param onde estão (sem pular quando volta).
 * Limita quantas coisas se mexem ao mesmo tempo: no celular em pé, quase sempre
 * uma ilha por vez.
 */
export function useMarcarIlhaNaTela<T extends Element>(): RefObject<T | null> {
  return useMarcar<T>({ atributo: "data-parada", parte: 0.5, folga: 0 });
}

/**
 * Quanto tempo depois do último movimento da rolagem as animações voltam.
 * Pausar e retomar custa um recálculo de cada animação na tela (num celular
 * fraco, dezenas de ms): entre um arrasto e outro de quem procura uma ilha,
 * o mundo continua pausado.
 */
const VOLTA_DEPOIS_DE_ROLAR_MS = 600;

/**
 * Enquanto a pessoa rola o mundo (e um tiquinho depois), o elemento devolvido
 * ganha `data-rolando="sim"` e o CSS pausa as animações de dentro dele. Cada
 * animação, mesmo as que o compositor anda, custa ao processador principal um
 * recálculo de estilo por quadro (e as de dentro de um SVG, um layout), e
 * rolando há um quadro desses por vsync: num celular intermediário, era o que
 * travava a rolagem. Parado, o mundo volta a se mexer (e as marcas de quem
 * entrou ou saiu da tela entram juntas). A rolagem é ouvida na captura, em
 * `area` (que contém a área que rola); sem estado do React.
 */
export function useMarcarRolando<T extends Element>(area: RefObject<HTMLElement | null>): RefObject<T | null> {
  const alvo = useRef<T>(null);
  useEffect(() => {
    const raiz = area.current;
    if (!raiz) return;
    let temporizador = 0;
    const parar = () => {
      temporizador = 0;
      rolando = false;
      alvo.current?.removeAttribute("data-rolando");
      // As marcas de quem entrou ou saiu da tela durante a rolagem, de uma vez.
      marcarPendentes();
    };
    const aoRolar = () => {
      if (temporizador) window.clearTimeout(temporizador);
      else {
        rolando = true;
        alvo.current?.setAttribute("data-rolando", "sim");
      }
      temporizador = window.setTimeout(parar, VOLTA_DEPOIS_DE_ROLAR_MS);
    };
    raiz.addEventListener("scroll", aoRolar, { passive: true, capture: true });
    return () => {
      raiz.removeEventListener("scroll", aoRolar, { capture: true });
      if (temporizador) {
        window.clearTimeout(temporizador);
        parar();
      }
    };
  }, [area]);
  return alvo;
}
