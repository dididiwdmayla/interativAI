"use client";

import { type PointerEvent, type ReactNode, type Ref, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { ehElemento } from "@/lib/dom";
import { ATRIBUTO_MODO_DOCUMENTO } from "@/lib/dom";
import { comBaseNeutra, escreverCssNoDocumento, montarDocumentoSiteAlvo, prepararDocumentoInteiro } from "@/lib/documentoSiteAlvo";
import { linkDoAlvo } from "@/lib/linksPrevia";
import { comecarPendencia } from "@/lib/pendencias";
import { type ViewportDoDispositivo, zoomParaCaber } from "@/motor/dispositivos";

/** Teto da pendência de carga: se o load nunca vier, a fase não fica "ocupada" para sempre. */
const TETO_CARGA_MS = 5000;

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
  /** Qualquer clique num elemento da página (a Medição simulada lê o data-evento). */
  aoClicarElemento?: (elemento: Element) => void;
  ref?: Ref<ApiPreview>;
  /** Camadas desenhadas por cima do iframe (sobreposição de inspeção). */
  children?: ReactNode;
  /**
   * Modo dispositivo ligado: o iframe ganha a largura de desenho de verdade
   * (as @media reagem) e encolhe para caber (zoom). Null: ocupa o espaço todo.
   */
  dispositivo?: ViewportDoDispositivo | null;
  /** Arrastar as bordas do aparelho: a largura nova, como aparece na tela (px do aparelho). */
  aoArrastarLargura?: (largura: number) => void;
  /** Soltou a alça: a largura livre ficou escolhida. */
  aoSoltarAlca?: () => void;
  /** O zoom mudou (para a barra de dispositivo mostrar). */
  aoMudarZoom?: (zoom: number) => void;
  /** O iframe mudou de tamanho (painéis que medem o layout recalculam). */
  aoRedimensionar?: () => void;
};

/** Espaço de cada alça de arrastar, dos dois lados do aparelho. */
const ALCA = 14;
/** Folga em volta do aparelho, dentro da área cinza. */
const FOLGA = 12;

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
  aoClicarElemento,
  ref,
  children,
  dispositivo = null,
  aoArrastarLargura,
  aoSoltarAlca,
  aoMudarZoom,
  aoRedimensionar,
}: Props) {
  const iframe = useRef<HTMLIFrameElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const [espaco, setEspaco] = useState({ largura: 0, altura: 0 });
  useLayoutEffect(() => {
    const elemento = area.current;
    if (!elemento) return;
    const medir = () => setEspaco({ largura: elemento.clientWidth, altura: elemento.clientHeight });
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);
  const zoom = dispositivo
    ? zoomParaCaber(dispositivo.largura, dispositivo.altura, {
        largura: espaco.largura - 2 * (ALCA + FOLGA),
        altura: espaco.altura - 2 * FOLGA,
      })
    : 1;
  useEffect(() => {
    if (dispositivo) aoMudarZoom?.(zoom);
  }, [aoMudarZoom, dispositivo, zoom]);
  const aoRedimensionarAtual = useRef(aoRedimensionar);
  useEffect(() => {
    aoRedimensionarAtual.current = aoRedimensionar;
  }, [aoRedimensionar]);
  useEffect(() => {
    const elemento = iframe.current;
    if (!elemento) return;
    let primeira = true;
    const observador = new ResizeObserver(() => {
      // A primeira medida é a do começo: nada mudou ainda.
      if (primeira) {
        primeira = false;
        return;
      }
      aoRedimensionarAtual.current?.();
    });
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);
  /** Arrasto de uma alça: a largura de partida e o x do dedo (ou do mouse). */
  const arrasto = useRef<{ largura: number; x: number; lado: 1 | -1 } | null>(null);
  const ultimoBody = useRef(bodyInicial);
  const ultimoCss = useRef(cssInicial);
  const headRef = useRef(head);
  const aoCarregarAtual = useRef(aoCarregar);
  const aoClicarLinkAtual = useRef(aoClicarLink);
  const modoDocumentoRef = useRef(modoDocumento);
  /** A prévia está carregando um srcdoc novo (conta como pendência da fase). */
  const carga = useRef<{ encerrar: () => void; teto: ReturnType<typeof setTimeout> } | null>(null);

  const encerrarCarga = useCallback(() => {
    if (!carga.current) return;
    clearTimeout(carga.current.teto);
    carga.current.encerrar();
    carga.current = null;
  }, []);

  /** Troca o srcdoc, marcando a carga como pendente até o load. */
  const definirSrcdoc = useCallback(
    (elemento: HTMLIFrameElement, texto: string) => {
      if (!carga.current) {
        const encerrar = comecarPendencia();
        carga.current = { encerrar, teto: setTimeout(encerrarCarga, TETO_CARGA_MS) };
      }
      elemento.srcdoc = texto;
    },
    [encerrarCarga],
  );

  useEffect(() => encerrarCarga, [encerrarCarga]);

  /** O srcdoc: no modo documento, o texto do jogador como está; senão, o head fixo com o body. */
  const montar = useCallback(
    (body: string): string => (modoDocumentoRef.current ? comBaseNeutra(body) : montarDocumentoSiteAlvo(headRef.current, body, ultimoCss.current)),
    [],
  );

  const aoClicarElementoAtual = useRef(aoClicarElemento);
  useEffect(() => {
    aoCarregarAtual.current = aoCarregar;
    aoClicarLinkAtual.current = aoClicarLink;
    aoClicarElementoAtual.current = aoClicarElemento;
  }, [aoCarregar, aoClicarLink, aoClicarElemento]);

  useEffect(() => {
    headRef.current = head;
  }, [head]);

  useEffect(() => {
    const elemento = iframe.current;
    if (!elemento) return;
    definirSrcdoc(elemento, montar(ultimoBody.current));
  }, [montar, definirSrcdoc]);

  useImperativeHandle(
    ref,
    () => ({
      recarregar(body) {
        ultimoBody.current = body;
        const elemento = iframe.current;
        if (elemento) definirSrcdoc(elemento, montar(body));
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
    [montar, definirSrcdoc],
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
      definirSrcdoc(elemento, montar(ultimoBody.current));
      return;
    }
    // Modo documento: os estilos do jogo entram agora (o texto é do jogador).
    if (modoDocumentoRef.current) prepararDocumentoInteiro(documento, ultimoCss.current);
    // A prévia nunca navega: link e formulário não saem do site-alvo (a página
    // sumiria). O link vira aviso para o jogo (rolar até a âncora, a fala).
    documento.addEventListener(
      "click",
      (evento) => {
        if (ehElemento(evento.target)) aoClicarElementoAtual.current?.(evento.target);
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
    encerrarCarga();
  };

  // O mesmo iframe nos dois modos (ligar o aparelho não recarrega a página):
  // área > aparelho > página desenhada na largura de layout, encolhida pelo zoom.
  const escala = dispositivo ? (zoom * dispositivo.largura) / dispositivo.larguraLayout : 1;

  const comecarArrasto = (lado: 1 | -1) => (evento: PointerEvent<HTMLDivElement>) => {
    if (!dispositivo) return;
    arrasto.current = { largura: dispositivo.largura, x: evento.clientX, lado };
    try {
      evento.currentTarget.setPointerCapture(evento.pointerId);
    } catch {
      // Ponteiro que já saiu (ou sintético): o arrasto segue sem captura.
    }
  };
  const arrastar = (evento: PointerEvent<HTMLDivElement>) => {
    const inicio = arrasto.current;
    if (!inicio || !dispositivo) return;
    // O aparelho fica no meio: cada lado anda metade, então a largura muda o dobro do arrasto.
    aoArrastarLargura?.(inicio.largura + (2 * inicio.lado * (evento.clientX - inicio.x)) / zoom);
  };
  const soltar = () => {
    if (!arrasto.current) return;
    arrasto.current = null;
    aoSoltarAlca?.();
  };

  const alca = (lado: 1 | -1) =>
    dispositivo && aoArrastarLargura ? (
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={lado === 1 ? "Arrastar a borda direita do aparelho" : "Arrastar a borda esquerda do aparelho"}
        data-alca-dispositivo={lado === 1 ? "direita" : "esquerda"}
        onPointerDown={comecarArrasto(lado)}
        onPointerMove={arrastar}
        onPointerUp={soltar}
        onPointerCancel={soltar}
        className="absolute top-1/2 z-30 grid h-16 -translate-y-1/2 cursor-ew-resize touch-none place-items-center rounded-full bg-borda hover:bg-primaria pointer-coarse:h-20"
        style={{ width: ALCA, [lado === 1 ? "right" : "left"]: -(ALCA + 4) }}
      >
        <span className="h-8 w-0.5 rounded-full bg-superficie" aria-hidden="true" />
      </div>
    ) : null;

  return (
    <div
      ref={area}
      className={`relative h-full w-full ${dispositivo ? "grid place-items-center overflow-hidden bg-painel" : ""}`}
      data-area-previa
    >
      <div
        className={dispositivo ? "relative shrink-0 rounded-md border-2 border-borda bg-superficie shadow-[0_4px_0_var(--cor-sombra)]" : "relative h-full w-full"}
        style={dispositivo ? { width: dispositivo.largura * zoom + 4, height: dispositivo.altura * zoom + 4 } : undefined}
        data-aparelho={dispositivo ? "ligado" : "desligado"}
        data-largura={dispositivo?.largura}
        data-altura={dispositivo?.altura}
        data-largura-layout={dispositivo?.larguraLayout}
        data-zoom={dispositivo ? Math.round(zoom * 100) : undefined}
      >
        <div
          className={dispositivo ? "absolute left-0 top-0 origin-top-left overflow-hidden" : "relative h-full w-full"}
          style={
            dispositivo
              ? { width: dispositivo.larguraLayout, height: dispositivo.alturaLayout, transform: `scale(${escala})` }
              : undefined
          }
        >
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
        {alca(-1)}
        {alca(1)}
      </div>
    </div>
  );
}
