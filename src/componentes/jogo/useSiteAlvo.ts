"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ApiEditor } from "@/componentes/painel/editor/EditorCodigo";
import type { ApiPreview } from "@/componentes/preview/PreviewSiteAlvo";
import { construirArvore, type NoArvore } from "@/lib/arvore";
import { formatarHtml } from "@/lib/formatarHtml";

const ESPERA_EDITOR_MS = 300;

/**
 * Fonte única de verdade do site-alvo: o HTML do body.
 *
 * Caminho A: editor muda, espera 300 ms, recarrega o iframe; no load, a
 * versão do documento sobe e quem depende dele (árvore, validação) refaz.
 *
 * Caminho B: a árvore altera o contentDocument direto (sem recarregar),
 * o body é serializado e formatado, e o editor recebe o texto marcado como
 * origem externa, sem disparar o caminho A.
 */
export function useSiteAlvo(bodyInicial: string) {
  const editorRef = useRef<ApiEditor>(null);
  const previewRef = useRef<ApiPreview>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [htmlAtual, setHtmlAtual] = useState(bodyInicial);
  const [versaoDocumento, setVersaoDocumento] = useState(0);
  const [arvore, setArvore] = useState<NoArvore | null>(null);

  const cancelarEspera = useCallback(() => {
    if (temporizador.current !== null) {
      clearTimeout(temporizador.current);
      temporizador.current = null;
    }
  }, []);

  useEffect(() => cancelarEspera, [cancelarEspera]);

  /** Caminho A: chamado a cada tecla no editor. */
  const aoEditarCodigo = useCallback(
    (texto: string) => {
      setHtmlAtual(texto);
      cancelarEspera();
      temporizador.current = setTimeout(() => {
        temporizador.current = null;
        previewRef.current?.recarregar(texto);
      }, ESPERA_EDITOR_MS);
    },
    [cancelarEspera],
  );

  const aoCarregarDocumento = useCallback((documento: Document) => {
    setArvore(construirArvore(documento.body));
    setVersaoDocumento((versao) => versao + 1);
  }, []);

  const obterDocumento = useCallback(() => previewRef.current?.obterDocumento() ?? null, []);

  /**
   * Caminho B: aplica uma mudança direto no documento do iframe.
   * A função recebe o documento e devolve true se mudou algo.
   */
  const editarDocumento = useCallback(
    (mutar: (documento: Document) => boolean): boolean => {
      const documento = previewRef.current?.obterDocumento();
      if (!documento?.body) return false;
      if (!mutar(documento)) return false;
      cancelarEspera();
      const novo = formatarHtml(documento.body.innerHTML);
      editorRef.current?.definirTexto(novo);
      setHtmlAtual(novo);
      setArvore(construirArvore(documento.body));
      setVersaoDocumento((versao) => versao + 1);
      return true;
    },
    [cancelarEspera],
  );

  /** Troca o HTML inteiro (solução, recomeçar fase): editor e iframe juntos. */
  const substituirHtml = useCallback(
    (novo: string) => {
      cancelarEspera();
      editorRef.current?.definirTexto(novo);
      setHtmlAtual(novo);
      previewRef.current?.recarregar(novo);
    },
    [cancelarEspera],
  );

  return {
    editorRef,
    previewRef,
    htmlAtual,
    versaoDocumento,
    arvore,
    aoEditarCodigo,
    aoCarregarDocumento,
    obterDocumento,
    editarDocumento,
    substituirHtml,
  };
}
