"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { montarDocumentoSiteAlvo, tagFolhaDoJogo } from "@/lib/documentoSiteAlvo";

type Props = {
  head: string;
  body: string;
  /** A folha editável do site, se a fase tem. */
  css?: string | null;
  /** Modo documento: `body` é o documento inteiro (o head fixo não entra). */
  documentoInteiro?: boolean;
  /** Legenda embaixo (ex.: "Antes", "Depois"). */
  legenda: string;
  /** Título acessível do iframe. */
  rotulo: string;
};

/** Tamanho em que o site é desenhado antes de encolher para caber. */
const LARGURA_VIRTUAL = 960;
const ALTURA_VIRTUAL = 540;

/**
 * Um site-alvo em miniatura, só para ver (sem clique, sem foco). Mesmo
 * sandbox da prévia principal: sem scripts.
 */
/** O srcdoc da miniatura: no modo documento, o documento com a folha editável antes do </head>. */
function montarMiniatura(head: string, body: string, css: string | null, documentoInteiro: boolean): string {
  if (!documentoInteiro) return montarDocumentoSiteAlvo(head, body, css);
  if (css === null) return body;
  const fim = body.search(/<\/head>/i);
  return fim >= 0 ? `${body.slice(0, fim)}${tagFolhaDoJogo(css)}${body.slice(fim)}` : `${tagFolhaDoJogo(css)}${body}`;
}

export function MiniPrevia({ head, body, css = null, documentoInteiro = false, legenda, rotulo }: Props) {
  const caixa = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(0.25);

  useLayoutEffect(() => {
    const elemento = caixa.current;
    if (!elemento) return;
    const observador = new ResizeObserver(() => setEscala(elemento.clientWidth / LARGURA_VIRTUAL));
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <figure className="min-w-0 flex-1">
      <div
        ref={caixa}
        className="relative w-full overflow-hidden rounded-xl border-2 border-borda bg-superficie"
        style={{ height: ALTURA_VIRTUAL * escala }}
      >
        <iframe
          title={rotulo}
          srcDoc={montarMiniatura(head, body, css, documentoInteiro)}
          sandbox="allow-same-origin"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{ width: LARGURA_VIRTUAL, height: ALTURA_VIRTUAL, transform: `scale(${escala})` }}
        />
      </div>
      <figcaption className="mt-1 text-center text-xs font-black uppercase tracking-wide text-texto-suave">{legenda}</figcaption>
    </figure>
  );
}
