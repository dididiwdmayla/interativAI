"use client";

import { type ReactNode, type Ref, useEffect, useImperativeHandle, useRef } from "react";
import { ehElemento } from "@/lib/dom";
import { escreverCssNoDocumento, montarDocumentoSiteAlvo } from "@/lib/documentoSiteAlvo";
import { linkDoAlvo } from "@/lib/linksPrevia";

export type ApiPreview = {
  /** Recarrega o iframe com um novo body (caminho A). */
  recarregar: (body: string) => void;
  /** Troca a folha editável na hora, sem recarregar (fases com CSS). */
  definirCss: (css: string) => void;
  /** A fase tem folha editável. */
  temCss: () => boolean;
  obterDocumento: () => Document | null;
  obterIframe: () => HTMLIFrameElement | null;
};

type Props = {
  head: string;
  bodyInicial: string;
  /** A folha editável inicial (null: a fase não tem CSS). */
  cssInicial?: string | null;
  titulo: string;
  aoCarregar: (documento: Document) => void;
  /** Clique num link da página: a navegação já foi segurada. */
  aoClicarLink?: (link: Element) => void;
  ref?: Ref<ApiPreview>;
  /** Camadas desenhadas por cima do iframe (sobreposição de inspeção). */
  children?: ReactNode;
};

/**
 * O site-alvo roda num iframe com srcdoc e sandbox sem scripts. Como tem
 * allow-same-origin, o jogo consegue ler e alterar o contentDocument.
 */
export function PreviewSiteAlvo({ head, bodyInicial, cssInicial = null, titulo, aoCarregar, aoClicarLink, ref, children }: Props) {
  const iframe = useRef<HTMLIFrameElement>(null);
  const ultimoBody = useRef(bodyInicial);
  const ultimoCss = useRef(cssInicial);
  const headRef = useRef(head);
  const aoCarregarAtual = useRef(aoCarregar);
  const aoClicarLinkAtual = useRef(aoClicarLink);

  useEffect(() => {
    aoCarregarAtual.current = aoCarregar;
    aoClicarLinkAtual.current = aoClicarLink;
  }, [aoCarregar, aoClicarLink]);

  useEffect(() => {
    headRef.current = head;
  }, [head]);

  useEffect(() => {
    const elemento = iframe.current;
    if (!elemento) return;
    elemento.srcdoc = montarDocumentoSiteAlvo(headRef.current, ultimoBody.current, ultimoCss.current);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      recarregar(body) {
        ultimoBody.current = body;
        const elemento = iframe.current;
        if (elemento) elemento.srcdoc = montarDocumentoSiteAlvo(headRef.current, body, ultimoCss.current);
      },
      definirCss(css) {
        if (ultimoCss.current === null) return;
        ultimoCss.current = css;
        try {
          const documento = iframe.current?.contentDocument;
          if (documento) escreverCssNoDocumento(documento, css);
        } catch {
          // Sem acesso ao documento: a próxima recarga já leva o CSS novo.
        }
      },
      temCss() {
        return ultimoCss.current !== null;
      },
      obterDocumento() {
        try {
          return iframe.current?.contentDocument ?? null;
        } catch {
          return null;
        }
      },
      obterIframe() {
        return iframe.current;
      },
    }),
    [],
  );

  const aoTerminarCarga = () => {
    const elemento = iframe.current;
    if (!elemento) return;
    let documento: Document | null = null;
    try {
      documento = elemento.contentDocument;
    } catch {
      documento = null;
    }
    const endereco = documento?.location.href ?? "";
    // Carga inicial vazia do iframe, antes do srcdoc: ignora.
    if (documento && endereco === "about:blank") return;
    // Se um link levou o iframe para fora do site-alvo, volta para ele.
    if (!documento || endereco !== "about:srcdoc") {
      elemento.srcdoc = montarDocumentoSiteAlvo(headRef.current, ultimoBody.current, ultimoCss.current);
      return;
    }
    // A prévia nunca navega: link e formulário não saem do site-alvo (a página
    // sumiria). O link vira aviso para o jogo (rolar até a âncora, a fala).
    documento.addEventListener(
      "click",
      (evento) => {
        const link = linkDoAlvo(evento.target);
        if (link) {
          evento.preventDefault();
          aoClicarLinkAtual.current?.(link);
          return;
        }
        const alvo = evento.target;
        if (ehElemento(alvo) && alvo.closest("form")) evento.preventDefault();
      },
      true,
    );
    // Botão do meio (abrir em outra aba) também não sai do lugar.
    documento.addEventListener(
      "auxclick",
      (evento) => {
        if (linkDoAlvo(evento.target)) evento.preventDefault();
      },
      true,
    );
    documento.addEventListener("submit", (evento) => evento.preventDefault(), true);
    aoCarregarAtual.current(documento);
  };

  return (
    <div className="relative h-full w-full">
      <iframe
        ref={iframe}
        title={titulo}
        sandbox="allow-same-origin"
        onLoad={aoTerminarCarga}
        className="block h-full w-full border-0"
      />
      {children}
    </div>
  );
}
