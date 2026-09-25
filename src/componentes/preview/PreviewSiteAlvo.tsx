"use client";

import { type ReactNode, type Ref, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { ehElemento } from "@/lib/dom";
import { ATRIBUTO_MODO_DOCUMENTO } from "@/lib/dom";
import { escreverCssNoDocumento, montarDocumentoSiteAlvo, prepararDocumentoInteiro } from "@/lib/documentoSiteAlvo";
import { linkDoAlvo } from "@/lib/linksPrevia";

export type ApiPreview = {
  /** Recarrega o iframe com um novo body (caminho A); no modo documento, com o documento inteiro. */
  recarregar: (body: string) => void;
  /** Troca a folha editável na hora, sem recarregar (fases com CSS). */
  definirCss: (css: string) => void;
  /** A fase tem folha editável. */
  temCss: () => boolean;
  /** Mostra um CSS provisório (o jogador digitando no painel); null volta ao de verdade. */
  mostrarCssProvisorio: (css: string | null) => void;
  obterDocumento: () => Document | null;
  obterIframe: () => HTMLIFrameElement | null;
};

type Props = {
  head: string;
  /** O body inicial ou, no modo documento, o documento inteiro. */
  bodyInicial: string;
  /** O jogador edita o documento inteiro: o texto vai direto para o srcdoc. */
  modoDocumento?: boolean;
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
export function PreviewSiteAlvo({
  head,
  bodyInicial,
  modoDocumento = false,
  cssInicial = null,
  titulo,
  aoCarregar,
  aoClicarLink,
  ref,
  children,
}: Props) {
  const iframe = useRef<HTMLIFrameElement>(null);
  const ultimoBody = useRef(bodyInicial);
  const ultimoCss = useRef(cssInicial);
  const headRef = useRef(head);
  const aoCarregarAtual = useRef(aoCarregar);
  const aoClicarLinkAtual = useRef(aoClicarLink);
  const modoDocumentoRef = useRef(modoDocumento);

  /** O srcdoc: no modo documento, o texto do jogador como está; senão, o head fixo com o body. */
  const montar = useCallback(
    (body: string): string => (modoDocumentoRef.current ? body : montarDocumentoSiteAlvo(headRef.current, body, ultimoCss.current)),
    [],
  );

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
    elemento.srcdoc = montar(ultimoBody.current);
  }, [montar]);

  useImperativeHandle(
    ref,
    () => ({
      recarregar(body) {
        ultimoBody.current = body;
        const elemento = iframe.current;
        if (elemento) elemento.srcdoc = montar(body);
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
      mostrarCssProvisorio(css) {
        if (ultimoCss.current === null) return;
        try {
          const documento = iframe.current?.contentDocument;
          if (documento) escreverCssNoDocumento(documento, css ?? ultimoCss.current);
        } catch {
          // Sem acesso ao documento: nada a mostrar.
        }
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
    [montar],
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
      elemento.srcdoc = montar(ultimoBody.current);
      return;
    }
    // Modo documento: os estilos do jogo entram agora (o texto é do jogador).
    if (modoDocumentoRef.current) prepararDocumentoInteiro(documento, ultimoCss.current);
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
        {...(modoDocumento ? { [ATRIBUTO_MODO_DOCUMENTO]: "" } : {})}
        onLoad={aoTerminarCarga}
        className="block h-full w-full border-0"
      />
      {children}
    </div>
  );
}
