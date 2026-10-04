"use client";

/*
 * O quadro de uma fase ordenar-passos (ou a área plano de uma fase
 * composta): onde está cada cartão (a fonte única
 * de verdade, como o circuito na bancada), o arrastar (mouse e toque, pelo
 * mesmo caminho dos Pointer Events), o "toque no cartão e depois no lugar"
 * e o Rodar do plano de código. As mudanças passam pelo modelo
 * (src/motor/ordenar/modelo.ts), as mesmas funções que as soluções e a
 * simulação dos testes usam.
 */
import { type PointerEvent as EventoPonteiro, useCallback, useEffect, useRef, useState } from "react";
import type { Fase } from "@/conteudo/tipos";
import type { Barramento } from "@/motor/barramento";
import * as modelo from "@/motor/ordenar/modelo";
import { quadroDaFase } from "@/motor/composicao";
import type { Programa } from "./usePrograma";

type Opcoes = {
  fase: Fase;
  barramento: Barramento;
  salvo: modelo.EstadoOrdenar | null;
  programa: Programa;
  aoUsar?: (ferramenta: "quadro-de-passos") => void;
  /** (Fase composta) O plano mudou: chamado antes do evento, para o código acompanhar (os comentários do plano). */
  aoMudarPlano?: (estado: modelo.EstadoOrdenar) => void;
  /** (Fase composta) O cartão escolhido mudou (null: nenhum): o comentário dele acende no código. */
  aoEscolher?: (passo: string | null) => void;
};

/** Onde o cartão cairia agora: num destino (plano ou grupo) numa posição, ou de volta na pilha. */
export type AlvoSoltar = { tipo: "lista"; destino: string; posicao: number } | { tipo: "fora" };

export type Arrasto = { passo: string; x: number; y: number; dx: number; dy: number; inicioX: number; inicioY: number; alvo: AlvoSoltar | null };

/** Menos que isso não é arrastar: é tocar (escolhe o cartão). */
const DISTANCIA_ARRASTO = 6;

/** O estado salvo só vale se os cartões e os destinos ainda existem (a fase pode ter mudado). */
function estadoValido(dados: modelo.DadosOrdenar, salvo: modelo.EstadoOrdenar | null): modelo.EstadoOrdenar {
  const inicial = modelo.estadoInicialOrdenar(dados);
  if (!salvo) return inicial;
  const ids = new Set(dados.cartoes.map((c) => c.id));
  const listas = Object.fromEntries(modelo.destinosDo(dados).map((d) => [d, (salvo.listas[d] ?? []).filter((id) => ids.has(id))]));
  return { listas };
}

/** O alvo debaixo do dedo (ou do mouse): a lista do plano (com a posição pelo meio de cada cartão) ou a pilha. */
function alvoNoPonto(x: number, y: number, arrastado: string): AlvoSoltar | null {
  for (const elemento of document.elementsFromPoint(x, y)) {
    if (!(elemento instanceof HTMLElement)) continue;
    if (elemento.closest("[data-pilha-ordenar]")) return { tipo: "fora" };
    const lista = elemento.closest<HTMLElement>("[data-lista-ordenar]");
    if (!lista) continue;
    const destino = lista.dataset.listaOrdenar ?? modelo.LISTA_DO_PLANO;
    const itens = [...lista.querySelectorAll<HTMLElement>("[data-item-ordenar]")].filter((item) => item.dataset.itemOrdenar !== arrastado);
    let posicao = itens.length;
    for (let i = 0; i < itens.length; i += 1) {
      const caixa = itens[i].getBoundingClientRect();
      if (y < caixa.top + caixa.height / 2) {
        posicao = i;
        break;
      }
    }
    return { tipo: "lista", destino, posicao };
  }
  return null;
}

export function useOrdenar({ fase, barramento, salvo, programa, aoUsar, aoMudarPlano, aoEscolher }: Opcoes) {
  // O quadro de uma fase ordenar-passos ou o plano de uma fase composta (área plano).
  const dados = quadroDaFase(fase);
  const [estado, setEstado] = useState<modelo.EstadoOrdenar | null>(() => (dados ? estadoValido(dados, salvo) : null));
  /** O mesmo estado, lido na hora (as soluções fazem várias ações seguidas). */
  const atual = useRef(estado);
  const [selecionado, setSelecionadoEstado] = useState<string | null>(null);
  /** O mesmo cartão escolhido, lido na hora (tocar de novo solta). */
  const selecionadoAtual = useRef<string | null>(null);
  const setSelecionado = useCallback((passo: string | null) => {
    selecionadoAtual.current = passo;
    setSelecionadoEstado(passo);
  }, []);
  const [destaque, setDestaque] = useState<string | null>(null);
  const [arrasto, setArrasto] = useState<Arrasto | null>(null);
  const arrastoAtual = useRef<Arrasto | null>(null);
  const aoUsarAtual = useRef(aoUsar);
  const aoMudarPlanoAtual = useRef(aoMudarPlano);
  const aoEscolherAtual = useRef(aoEscolher);
  useEffect(() => {
    aoUsarAtual.current = aoUsar;
    aoMudarPlanoAtual.current = aoMudarPlano;
    aoEscolherAtual.current = aoEscolher;
  }, [aoUsar, aoMudarPlano, aoEscolher]);
  const { executarPlano } = programa;

  const trocar = useCallback(
    (novo: modelo.EstadoOrdenar, passo: string) => {
      atual.current = novo;
      setEstado(novo);
      const onde = modelo.ondeEsta(novo, passo);
      aoUsarAtual.current?.("quadro-de-passos");
      aoMudarPlanoAtual.current?.(novo);
      barramento.emitir({ tipo: "moveuPasso", passo, destino: onde?.destino ?? "fora", posicao: onde?.posicao ?? 0 });
    },
    [barramento],
  );

  /** Põe (ou move) o cartão: no ordenar, no plano; no agrupar, no grupo pedido (ou no grupo onde ele já está, ou no primeiro). */
  const porPasso = useCallback(
    (passo: string, posicao?: number, grupo?: string): boolean => {
      const agora = atual.current;
      if (!dados || !agora) return false;
      const destino = grupo ?? (dados.modo === "agrupar" ? (modelo.ondeEsta(agora, passo)?.destino ?? modelo.destinosDo(dados)[0]) : modelo.LISTA_DO_PLANO);
      const novo = modelo.porPasso(dados, agora, passo, destino, posicao);
      if (!novo) return false;
      setSelecionado(null);
      trocar(novo, passo);
      return true;
    },
    [dados, setSelecionado, trocar],
  );

  const tirarPasso = useCallback(
    (passo: string): boolean => {
      const agora = atual.current;
      if (!dados || !agora || !dados.cartoes.some((c) => c.id === passo)) return false;
      setSelecionado(null);
      trocar(modelo.tirarPasso(agora, passo), passo);
      return true;
    },
    [dados, setSelecionado, trocar],
  );

  /** As setas do cartão no plano: uma posição para cima ou para baixo. */
  const moverPasso = useCallback(
    (passo: string, delta: -1 | 1) => {
      const agora = atual.current;
      const onde = agora ? modelo.ondeEsta(agora, passo) : null;
      if (!onde) return;
      porPasso(passo, Math.max(0, onde.posicao + delta), onde.destino);
    },
    [porPasso],
  );

  const rodarPlano = useCallback((): boolean => {
    const agora = atual.current;
    if (!dados?.rodar || !agora || !fase.programa) return false;
    aoUsarAtual.current?.("quadro-de-passos");
    executarPlano(modelo.codigoDoPlano(dados, agora));
    return true;
  }, [dados, executarPlano, fase.programa]);

  /** Tocar num cartão escolhe ele (tocar de novo solta); depois, tocar num lugar do plano põe ele ali. */
  const escolher = useCallback(
    (passo: string | null) => {
      aoUsarAtual.current?.("quadro-de-passos");
      const novo = selecionadoAtual.current === passo ? null : passo;
      setSelecionado(novo);
      aoEscolherAtual.current?.(novo);
    },
    [setSelecionado],
  );

  /* ---------------------------------------------------------------- arrastar (mouse e toque) */

  const comecarArrasto = useCallback((passo: string, evento: EventoPonteiro<HTMLElement>) => {
    if (evento.button !== 0 && evento.pointerType === "mouse") return;
    evento.preventDefault();
    evento.currentTarget.setPointerCapture(evento.pointerId);
    const cartao = (evento.currentTarget.closest("[data-cartao-passo]") as HTMLElement | null) ?? evento.currentTarget;
    const caixa = cartao.getBoundingClientRect();
    const novo: Arrasto = { passo, x: evento.clientX, y: evento.clientY, dx: evento.clientX - caixa.left, dy: evento.clientY - caixa.top, inicioX: evento.clientX, inicioY: evento.clientY, alvo: null };
    arrastoAtual.current = novo;
    setArrasto(novo);
  }, []);

  const moverArrasto = useCallback((evento: EventoPonteiro<HTMLElement>) => {
    const agora = arrastoAtual.current;
    if (!agora) return;
    const novo = { ...agora, x: evento.clientX, y: evento.clientY, alvo: alvoNoPonto(evento.clientX, evento.clientY, agora.passo) };
    arrastoAtual.current = novo;
    setArrasto(novo);
  }, []);

  const soltarArrasto = useCallback(
    (evento: EventoPonteiro<HTMLElement>) => {
      const agora = arrastoAtual.current;
      arrastoAtual.current = null;
      setArrasto(null);
      if (evento.currentTarget.hasPointerCapture(evento.pointerId)) evento.currentTarget.releasePointerCapture(evento.pointerId);
      if (!agora) return;
      // Não andou: foi um toque na alça (escolhe o cartão, como tocar nele).
      if (Math.hypot(evento.clientX - agora.inicioX, evento.clientY - agora.inicioY) < DISTANCIA_ARRASTO) {
        escolher(agora.passo);
        return;
      }
      const alvo = alvoNoPonto(evento.clientX, evento.clientY, agora.passo);
      if (!alvo) return;
      if (alvo.tipo === "fora") {
        if (atual.current && modelo.ondeEsta(atual.current, agora.passo)) tirarPasso(agora.passo);
        return;
      }
      porPasso(agora.passo, alvo.posicao, alvo.destino);
    },
    [escolher, porPasso, tirarPasso],
  );

  const cancelarArrasto = useCallback(() => {
    arrastoAtual.current = null;
    setArrasto(null);
  }, []);

  const ordenarAgora = useCallback(() => (dados && atual.current ? { dados, estado: atual.current } : null), [dados]);

  return {
    ativo: dados !== null,
    dados,
    estado,
    selecionado,
    destaque,
    setDestaque,
    arrasto,
    porPasso,
    tirarPasso,
    moverPasso,
    rodarPlano,
    escolher,
    comecarArrasto,
    moverArrasto,
    soltarArrasto,
    cancelarArrasto,
    ordenarAgora,
  };
}

export type QuadroOrdenar = ReturnType<typeof useOrdenar>;
