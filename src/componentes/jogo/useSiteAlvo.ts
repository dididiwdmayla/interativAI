"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ApiEditor } from "@/componentes/painel/editor/EditorCodigo";
import type { ApiPreview } from "@/componentes/preview/PreviewSiteAlvo";
import { construirArvore, type NoArvore } from "@/lib/arvore";
import { formatarHtml } from "@/lib/formatarHtml";

const ESPERA_EDITOR_MS = 300;
/** Espera depois da última tecla no CSS para conferir os objetivos. */
const ESPERA_CSS_MS = 300;

/**
 * Fontes de verdade do site-alvo: o HTML do body e, nas fases com CSS, o
 * texto da folha editável (o <style data-folha-jogo>).
 *
 * Caminho A (HTML): editor muda, espera 300 ms, recarrega o iframe; no
 * load, a versão do documento sobe e quem depende dele (árvore, validação)
 * refaz.
 *
 * Caminho B (HTML): a árvore altera o contentDocument direto (sem
 * recarregar), o body é serializado e formatado, e o editor recebe o texto
 * marcado como origem externa, sem disparar o caminho A.
 *
 * CSS: qualquer mudança (editor CSS, painel Estilos, desfazer) troca o
 * textContent do <style> no iframe na hora, sem recarregar: a prévia muda
 * instantaneamente e a seleção fica onde estava. A versão do CSS sobe
 * (logo, para o painel; com espera, para a validação).
 */
export function useSiteAlvo(bodyInicial: string, cssInicial: string | null) {
  const editorRef = useRef<ApiEditor>(null);
  const editorCssRef = useRef<ApiEditor>(null);
  const previewRef = useRef<ApiPreview>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const temporizadorCss = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [htmlAtual, setHtmlAtual] = useState(bodyInicial);
  const [cssAtual, setCssAtual] = useState<string | null>(cssInicial);
  const [versaoDocumento, setVersaoDocumento] = useState(0);
  /** Sobe a cada mudança de CSS (o painel Estilos recalcula). */
  const [versaoCss, setVersaoCss] = useState(0);
  /** Sobe um pouco depois da última mudança de CSS (a validação confere). */
  const [versaoCssCalma, setVersaoCssCalma] = useState(0);
  const [arvore, setArvore] = useState<NoArvore | null>(null);

  const cancelarEspera = useCallback(() => {
    if (temporizador.current !== null) {
      clearTimeout(temporizador.current);
      temporizador.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      cancelarEspera();
      if (temporizadorCss.current !== null) clearTimeout(temporizadorCss.current);
    },
    [cancelarEspera],
  );

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

  /** O CSS mudou: a prévia muda na hora e as versões sobem. */
  const aplicarCssNaTela = useCallback((texto: string) => {
    setCssAtual(texto);
    previewRef.current?.definirCss(texto);
    setVersaoCss((versao) => versao + 1);
    if (temporizadorCss.current !== null) clearTimeout(temporizadorCss.current);
    temporizadorCss.current = setTimeout(() => {
      temporizadorCss.current = null;
      setVersaoCssCalma((versao) => versao + 1);
    }, ESPERA_CSS_MS);
  }, []);

  /** Tecla no editor CSS. */
  const aoEditarCss = useCallback((texto: string) => aplicarCssNaTela(texto), [aplicarCssNaTela]);

  /**
   * CSS mudado de fora do editor (painel Estilos, ações, desfazer): o
   * editor CSS recebe o texto marcado como origem externa.
   */
  const editarCss = useCallback(
    (texto: string): boolean => {
      // Estável de propósito: o núcleo do painel guarda esta função uma vez só.
      if (!previewRef.current?.temCss()) return false;
      editorCssRef.current?.definirTexto(texto);
      aplicarCssNaTela(texto);
      return true;
    },
    [aplicarCssNaTela],
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
    editorCssRef,
    previewRef,
    htmlAtual,
    cssAtual,
    versaoDocumento,
    versaoCss,
    versaoCssCalma,
    arvore,
    aoEditarCodigo,
    aoEditarCss,
    editarCss,
    aoCarregarDocumento,
    obterDocumento,
    editarDocumento,
    substituirHtml,
  };
}
