"use client";

import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { DestaqueArvore } from "@/componentes/painel/arvore/tipos";
import type { ApiEditor } from "@/componentes/painel/editor/EditorCodigo";
import { chavesAncestrais, elementoDoNo } from "@/lib/arvore";
import { caminhoDoNo, ehElemento, ehTexto, noPeloCaminho } from "@/lib/dom";
import { linhaDoNo } from "@/lib/linhasCodigo";
import { medirNo, type Realce } from "@/lib/medirElemento";
import type { EventoFase, OrigemSelecao } from "@/motor/eventos";

type Opcoes = {
  editorRef: RefObject<ApiEditor | null>;
  obterDocumento: () => Document | null;
  editarDocumento: (mutar: (documento: Document) => boolean) => boolean;
  aoEvento: (evento: EventoFase) => void;
};

function tagDoNo(no: Node | null): string {
  if (ehElemento(no)) return no.tagName.toLowerCase();
  return elementoDoNo(no)?.tagName.toLowerCase() ?? "";
}

/** Elemento sob um ponto do iframe; o <html> vira <body>. */
function elementoNoPonto(documento: Document, x: number, y: number): Element | null {
  const elemento = documento.elementFromPoint(x, y);
  if (!elemento || elemento === documento.documentElement) return documento.body;
  return elemento;
}

/**
 * Estado da aba Elementos: seleção, nós recolhidos, realce no preview,
 * modo inspecionar e edição pela árvore (caminho B).
 */
export function usePainelElementos({ editorRef, obterDocumento, editarDocumento, aoEvento }: Opcoes) {
  const [caminhoSelecionado, setCaminhoSelecionado] = useState<number[] | null>(null);
  const [recolhidos, setRecolhidos] = useState<ReadonlySet<string>>(() => new Set());
  const [realce, setRealce] = useState<Realce | null>(null);
  const [inspecionando, setInspecionando] = useState(false);
  const [destaque, setDestaque] = useState<DestaqueArvore | null>(null);
  const noRealcado = useRef<Node | null>(null);
  const aoEventoAtual = useRef(aoEvento);

  useEffect(() => {
    aoEventoAtual.current = aoEvento;
  }, [aoEvento]);

  const realcar = useCallback((no: Node | null) => {
    noRealcado.current = no;
    setRealce(medirNo(no));
  }, []);

  const remedirRealce = useCallback(() => {
    if (noRealcado.current) setRealce(medirNo(noRealcado.current));
  }, []);

  const expandirAte = useCallback((caminho: readonly number[]) => {
    const ancestrais = chavesAncestrais(caminho);
    setRecolhidos((atual) => {
      if (!ancestrais.some((chave) => atual.has(chave))) return atual;
      const novo = new Set(atual);
      for (const chave of ancestrais) novo.delete(chave);
      return novo;
    });
  }, []);

  const selecionar = useCallback(
    (caminho: number[], origem: OrigemSelecao) => {
      const documento = obterDocumento();
      const no = documento?.body ? noPeloCaminho(documento.body, caminho) : null;
      setCaminhoSelecionado(caminho);
      expandirAte(caminho);
      const editor = editorRef.current;
      if (editor && no) {
        const linha = linhaDoNo(editor.obterTexto(), no);
        if (linha !== null) editor.rolarParaLinha(linha);
      }
      aoEventoAtual.current({ tipo: "selecionou", tag: tagDoNo(no), caminho, origem });
    },
    [editorRef, expandirAte, obterDocumento],
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
    setInspecionando(false);
    realcar(null);
  }, [realcar]);

  const alternarInspecao = useCallback(() => {
    setInspecionando((ativo) => !ativo);
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
      const caminho = caminhoDoNo(documento.body, elemento);
      if (!caminho) return;
      setInspecionando(false);
      realcar(null);
      selecionar(caminho, "inspecao");
      aoEventoAtual.current({ tipo: "inspecionou", tag: tagDoNo(elemento), caminho });
    },
    [obterDocumento, realcar, selecionar],
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

  const editarTexto = useCallback(
    (caminho: number[], texto: string) => {
      let tag = "";
      const mudou = editarDocumento((documento) => {
        const no = noPeloCaminho(documento.body, caminho);
        if (!no) return false;
        tag = tagDoNo(no);
        if (ehTexto(no)) {
          if (no.nodeValue === texto) return false;
          no.nodeValue = texto;
          return true;
        }
        if (ehElemento(no)) {
          if (no.textContent === texto) return false;
          no.textContent = texto;
          return true;
        }
        return false;
      });
      if (mudou) aoEventoAtual.current({ tipo: "editouTexto", tag, caminho, texto });
    },
    [editarDocumento],
  );

  const editarAtributo = useCallback(
    (caminho: number[], nome: string, valor: string) => {
      let tag = "";
      const mudou = editarDocumento((documento) => {
        const no = noPeloCaminho(documento.body, caminho);
        if (!ehElemento(no) || no.getAttribute(nome) === valor) return false;
        tag = tagDoNo(no);
        no.setAttribute(nome, valor);
        return true;
      });
      if (mudou) {
        aoEventoAtual.current({ tipo: "editouAtributo", tag, caminho, atributo: nome, valor });
      }
    },
    [editarDocumento],
  );

  /** Chamado a cada novo load do iframe (caminho A). */
  const aoRecarregarDocumento = useCallback(
    (documento: Document) => {
      realcar(null);
      documento.defaultView?.addEventListener("scroll", remedirRealce, { passive: true });
    },
    [realcar, remedirRealce],
  );

  return {
    caminhoSelecionado,
    recolhidos,
    realce,
    inspecionando,
    destaque,
    setDestaque,
    selecionar,
    alternarRecolhido,
    realcar,
    alternarInspecao,
    sairDaInspecao,
    apontarNaTela,
    escolherNaTela,
    rolarTela,
    editarTexto,
    editarAtributo,
    aoRecarregarDocumento,
  };
}
