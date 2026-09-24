"use client";

import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { DestaqueArvore } from "@/componentes/painel/arvore/tipos";
import type { ApiEditor } from "@/componentes/painel/editor/EditorCodigo";
import { chavesAncestrais, elementoDoNo } from "@/lib/arvore";
import { type AlvoCodigo, alvoDoElemento, elementoDoAlvo } from "@/lib/caminhoElementos";
import { caminhoDoNo } from "@/lib/dom";
import { medirNo, type Realce } from "@/lib/medirElemento";
import type { EventoFase, OrigemSelecao } from "@/motor/eventos";
import { criarNucleoPainel, type Selecao } from "@/motor/nucleoPainel";

type Opcoes = {
  editorRef: RefObject<ApiEditor | null>;
  obterDocumento: () => Document | null;
  editarDocumento: (mutar: (documento: Document) => boolean) => boolean;
  aoEvento: (evento: EventoFase) => void;
};

/** Elemento sob um ponto do iframe; o <html> vira <body>. */
function elementoNoPonto(documento: Document, x: number, y: number): Element | null {
  const elemento = documento.elementFromPoint(x, y);
  if (!elemento || elemento === documento.documentElement) return documento.body;
  return elemento;
}

/** Alvo de código do elemento dono de um nó do iframe. */
function alvoDoNo(documento: Document | null, no: Node | null): AlvoCodigo | null {
  const elemento = elementoDoNo(no);
  if (!documento?.body || !elemento) return null;
  return alvoDoElemento(documento.body, elemento);
}

/**
 * Estado da aba Elementos na interface: seleção, nós recolhidos, realce no
 * preview, modo inspecionar e as edições pela árvore (caminho B).
 *
 * Seleção, edições e a pilha de desfazer moram no núcleo
 * (src/motor/nucleoPainel.ts), que é o mesmo código que os testes de
 * conteúdo usam. Este hook só liga o núcleo à interface.
 *
 * Sincronia tripla: a seleção (pela árvore, inspeção, trilha ou código)
 * acende o nó na árvore, o trecho no editor e a caixa no preview. O hover
 * na árvore só troca a caixa do preview, sem mudar a seleção.
 */
export function usePainelElementos({ editorRef, obterDocumento, editarDocumento, aoEvento }: Opcoes) {
  const [caminhoSelecionado, setCaminhoSelecionado] = useState<number[] | null>(null);
  const [recolhidos, setRecolhidos] = useState<ReadonlySet<string>>(() => new Set());
  const [realce, setRealce] = useState<Realce | null>(null);
  const [inspecionando, setInspecionando] = useState(false);
  const [destaque, setDestaque] = useState<DestaqueArvore | null>(null);
  const [historico, setHistorico] = useState({ podeDesfazer: false, podeRefazer: false });
  const noRealcado = useRef<Node | null>(null);
  const inspecionandoAtual = useRef(false);
  const [nucleo] = useState(() => criarNucleoPainel({ obterDocumento, mutarDocumento: editarDocumento }));

  useEffect(() => {
    inspecionandoAtual.current = inspecionando;
  }, [inspecionando]);

  const noSelecionado = nucleo.noSelecionado;

  /** A caixa do preview mostra o nó sob o mouse ou, sem hover, o selecionado. */
  const remedirRealce = useCallback(() => {
    const alvo = noRealcado.current ?? (inspecionandoAtual.current ? null : noSelecionado());
    setRealce(medirNo(alvo));
  }, [noSelecionado]);

  const realcar = useCallback(
    (no: Node | null) => {
      noRealcado.current = no;
      remedirRealce();
    },
    [remedirRealce],
  );

  /** Acende no editor o trecho do selecionado. */
  const destacarNoEditor = useCallback(
    (rolar: boolean) => {
      editorRef.current?.destacarElemento(alvoDoNo(obterDocumento(), noSelecionado()), { rolar });
    },
    [editorRef, noSelecionado, obterDocumento],
  );

  const expandirAte = useCallback((caminho: readonly number[]) => {
    const ancestrais = chavesAncestrais(caminho);
    setRecolhidos((atual) => {
      if (!ancestrais.some((chave) => atual.has(chave))) return atual;
      const novo = new Set(atual);
      for (const chave of ancestrais) novo.delete(chave);
      return novo;
    });
  }, []);

  // Avisos do núcleo viram efeitos na interface.
  useEffect(() => {
    nucleo.definirAvisos({
      aoEvento,
      aoSelecionar: (selecao: Selecao | null) => {
        setCaminhoSelecionado(selecao?.caminho ?? null);
        if (selecao) expandirAte(selecao.caminho);
        // Seleção vinda do código não mexe no editor: o cursor já está lá.
        if (selecao?.origem !== "codigo") destacarNoEditor(selecao?.origem !== "sistema");
        remedirRealce();
      },
      aoMudar: () => {
        destacarNoEditor(false);
        remedirRealce();
      },
      aoMudarHistorico: () => {
        setHistorico({ podeDesfazer: nucleo.podeDesfazer(), podeRefazer: nucleo.podeRefazer() });
      },
    });
  }, [aoEvento, destacarNoEditor, expandirAte, nucleo, remedirRealce]);

  /**
   * Seleciona um nó. É a função que a árvore, a setinha, a trilha, o
   * código e as soluções chamam; a setinha também sai do modo inspecionar.
   */
  const selecionar = useCallback(
    (caminho: number[], origem: OrigemSelecao) => {
      if (origem === "inspecao") {
        inspecionandoAtual.current = false;
        setInspecionando(false);
        noRealcado.current = null;
      }
      nucleo.selecionar(caminho, origem);
    },
    [nucleo],
  );

  /** Cursor no editor: seleciona o elemento mais interno ali, se o DOM concordar. */
  const selecionarPeloCodigo = useCallback(
    (alvo: AlvoCodigo | null) => {
      const documento = obterDocumento();
      const elemento = documento?.body && alvo ? elementoDoAlvo(documento.body, alvo) : null;
      const caminho = documento?.body && elemento ? caminhoDoNo(documento.body, elemento) : null;
      if (!caminho) {
        editorRef.current?.destacarElemento(null);
        return;
      }
      selecionar(caminho, "codigo");
      editorRef.current?.destacarElemento(alvo);
    },
    [editorRef, obterDocumento, selecionar],
  );

  /** Destaque pulsante da escada de ajuda; abre os ancestrais para ele aparecer. */
  const destacarNaArvore = useCallback(
    (novo: DestaqueArvore | null) => {
      if (novo) expandirAte(novo.caminho);
      setDestaque(novo);
    },
    [expandirAte],
  );

  const alternarRecolhido = useCallback((chave: string, recolher: boolean) => {
    setRecolhidos((atual) => {
      if (atual.has(chave) === recolher) return atual;
      const novo = new Set(atual);
      if (recolher) novo.add(chave);
      else novo.delete(chave);
      return novo;
    });
  }, []);

  const sairDaInspecao = useCallback(() => {
    inspecionandoAtual.current = false;
    setInspecionando(false);
    realcar(null);
  }, [realcar]);

  const alternarInspecao = useCallback(() => {
    inspecionandoAtual.current = !inspecionandoAtual.current;
    setInspecionando(inspecionandoAtual.current);
    realcar(null);
  }, [realcar]);

  const apontarNaTela = useCallback(
    (x: number, y: number) => {
      const documento = obterDocumento();
      if (documento) realcar(elementoNoPonto(documento, x, y));
    },
    [obterDocumento, realcar],
  );

  const escolherElemento = useCallback(
    (elemento: Element) => {
      const documento = obterDocumento();
      if (!documento?.body) return;
      const caminho = elemento === documento.body ? [] : caminhoDoNo(documento.body, elemento);
      if (!caminho) return;
      selecionar(caminho, "inspecao");
    },
    [obterDocumento, selecionar],
  );

  const escolherNaTela = useCallback(
    (x: number, y: number) => {
      const documento = obterDocumento();
      const elemento = documento ? elementoNoPonto(documento, x, y) : null;
      if (elemento) escolherElemento(elemento);
    },
    [escolherElemento, obterDocumento],
  );

  const rolarTela = useCallback(
    (deltaY: number) => {
      obterDocumento()?.defaultView?.scrollBy(0, deltaY);
    },
    [obterDocumento],
  );

  // No modo inspecionar: Esc sai; setas percorrem os elementos e Enter escolhe.
  useEffect(() => {
    if (!inspecionando) return;
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        evento.stopPropagation();
        sairDaInspecao();
        return;
      }
      const documento = obterDocumento();
      if (!documento?.body) return;
      const todos = [documento.body, ...Array.from(documento.body.querySelectorAll("*"))];
      const atual = elementoDoNo(noRealcado.current);
      const indice = atual ? todos.indexOf(atual) : -1;
      const tratada = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Enter"].includes(evento.key);
      if (tratada) evento.stopPropagation();
      if (evento.key === "ArrowDown" || evento.key === "ArrowRight") {
        evento.preventDefault();
        const proximo = todos[Math.min(indice + 1, todos.length - 1)];
        realcar(proximo);
        proximo.scrollIntoView({ block: "nearest" });
      } else if (evento.key === "ArrowUp" || evento.key === "ArrowLeft") {
        evento.preventDefault();
        const anterior = todos[Math.max(indice - 1, 0)];
        realcar(anterior);
        anterior.scrollIntoView({ block: "nearest" });
      } else if (evento.key === "Enter" && atual) {
        evento.preventDefault();
        escolherElemento(atual);
      }
    };
    window.addEventListener("keydown", aoTeclar, true);
    return () => window.removeEventListener("keydown", aoTeclar, true);
  }, [inspecionando, obterDocumento, realcar, sairDaInspecao, escolherElemento]);

  /** Chamado a cada novo load do iframe (caminho A). */
  const aoRecarregarDocumento = useCallback(
    (documento: Document) => {
      realcar(null);
      destacarNoEditor(false);
      documento.defaultView?.addEventListener("scroll", remedirRealce, { passive: true });
    },
    [destacarNoEditor, realcar, remedirRealce],
  );

  return {
    caminhoSelecionado,
    recolhidos,
    realce,
    inspecionando,
    destaque,
    historico,
    destacarNaArvore,
    selecionar,
    selecionarPeloCodigo,
    destacarNoEditor,
    alternarRecolhido,
    realcar,
    alternarInspecao,
    sairDaInspecao,
    apontarNaTela,
    escolherNaTela,
    rolarTela,
    noSelecionado,
    selecao: nucleo.selecao,
    editarTexto: nucleo.editarTexto,
    editarAtributo: nucleo.editarAtributo,
    alternarEsconder: nucleo.alternarEsconder,
    apagar: nucleo.apagar,
    duplicar: nucleo.duplicar,
    inserirHtml: nucleo.inserirHtml,
    desfazer: nucleo.desfazer,
    refazer: nucleo.refazer,
    antesDeEditarCodigo: nucleo.antesDeEditarCodigo,
    aoRecarregarDocumento,
  };
}
