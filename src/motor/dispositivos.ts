/*
 * Os aparelhos do modo dispositivo (a barra de dispositivo do Chrome,
 * Ctrl+Shift+M) e a conta de uma tela a partir da largura. É dado puro:
 * o modo dispositivo da prévia, os validadores (`larguraTela`) e o
 * motor de cascata usam a mesma lista.
 */
import type { Tela } from "./css/midia";

export type IdModelo = "celular-360" | "celular-390" | "tablet-768" | "notebook-1280";

export type Modelo = {
  id: IdModelo;
  nome: string;
  /** Em pé (retrato): largura menor que a altura, menos no notebook. */
  largura: number;
  altura: number;
  /** Celular e tablet: sem meta viewport, o navegador desenha a página em 980 px e reduz. */
  movel: boolean;
};

export const MODELOS: readonly Modelo[] = [
  { id: "celular-360", nome: "Celular 360", largura: 360, altura: 800, movel: true },
  { id: "celular-390", nome: "Celular 390", largura: 390, altura: 844, movel: true },
  { id: "tablet-768", nome: "Tablet 768", largura: 768, altura: 1024, movel: true },
  { id: "notebook-1280", nome: "Notebook 1280", largura: 1280, altura: 800, movel: false },
];

/**
 * A largura em que um navegador de celular desenha uma página sem
 * `<meta name="viewport">` (a "layout viewport" padrão do Chrome no
 * Android e do Safari no iPhone): 980 px, depois reduzida para caber.
 */
export const LARGURA_SEM_VIEWPORT = 980;

/** Limites da largura livre (arrastando as bordas). */
export const LARGURA_MINIMA = 240;
export const LARGURA_MAXIMA = 1920;

export function modeloDoId(id: string | null | undefined): Modelo | undefined {
  return MODELOS.find((modelo) => modelo.id === id);
}

/**
 * A tela de uma largura: a altura dada, ou a do modelo em pé com essa
 * largura, ou a do modelo deitado com essa largura (a altura dele), ou
 * 800 px.
 */
export function telaDaLargura(largura: number, altura?: number): Tela {
  if (altura !== undefined) return { largura, altura };
  const emPe = MODELOS.find((modelo) => modelo.largura === largura);
  if (emPe) return { largura, altura: emPe.altura };
  const deitado = MODELOS.find((modelo) => modelo.altura === largura && modelo.movel);
  if (deitado) return { largura, altura: deitado.largura };
  return { largura, altura: 800 };
}

/* ------------------------------------------------------------------ */
/* Estado do modo dispositivo (barra de dispositivo do Chrome)          */
/* ------------------------------------------------------------------ */

export type Orientacao = "retrato" | "paisagem";

export type EstadoDispositivo = {
  /** A barra de dispositivo ligada (Ctrl+Shift+M). Desligada, a prévia usa o espaço todo. */
  ligado: boolean;
  /** Um modelo pronto ou "livre" (largura arrastada pelas bordas). */
  modelo: IdModelo | "livre";
  /** Em pé (a largura do modelo, ou a arrastada). */
  largura: number;
  altura: number;
  /** Girado: largura e altura trocam. */
  deitado: boolean;
};

/** Ao ligar pela primeira vez: o Celular 390 em pé. */
export const DISPOSITIVO_INICIAL: EstadoDispositivo = { ligado: false, modelo: "celular-390", largura: 390, altura: 844, deitado: false };

/** Liga a barra (se estava desligada) e escolhe um modelo, ou a largura livre. */
export function trocarModelo(estado: EstadoDispositivo, modelo: IdModelo | "livre", largura?: number): EstadoDispositivo {
  if (modelo === "livre") {
    const nova = Math.round(Math.min(LARGURA_MAXIMA, Math.max(LARGURA_MINIMA, largura ?? estado.largura)));
    return { ...estado, ligado: true, modelo: "livre", largura: estado.deitado ? estado.largura : nova, altura: estado.deitado ? nova : estado.altura };
  }
  const achado = modeloDoId(modelo);
  if (!achado) return estado;
  return { ligado: true, modelo, largura: achado.largura, altura: achado.altura, deitado: false };
}

/** Largura livre (arrastando as bordas): vale a largura da tela como se vê agora (girada ou não). */
export function arrastarLargura(estado: EstadoDispositivo, larguraNaTela: number): EstadoDispositivo {
  const nova = Math.round(Math.min(LARGURA_MAXIMA, Math.max(LARGURA_MINIMA, larguraNaTela)));
  return estado.deitado ? { ...estado, modelo: "livre", altura: nova } : { ...estado, modelo: "livre", largura: nova };
}

export function girarDispositivo(estado: EstadoDispositivo): EstadoDispositivo {
  return { ...estado, ligado: true, deitado: !estado.deitado };
}

/** Largura e altura como aparecem agora (giradas, se deitado). */
export function medidasNaTela(estado: EstadoDispositivo): { largura: number; altura: number } {
  return estado.deitado ? { largura: estado.altura, altura: estado.largura } : { largura: estado.largura, altura: estado.altura };
}

export function orientacaoDe(estado: EstadoDispositivo): Orientacao {
  const { largura, altura } = medidasNaTela(estado);
  return altura >= largura ? "retrato" : "paisagem";
}

/** O aparelho se comporta como celular (e aplica a regra dos 980 px sem meta viewport)? */
export function ehMovel(estado: EstadoDispositivo): boolean {
  if (estado.modelo === "livre") return Math.min(estado.largura, estado.altura) < 1024;
  return modeloDoId(estado.modelo)?.movel ?? false;
}

/** A página tem `<meta name="viewport">` (no head)? */
export function temMetaViewport(documento: Document | null): boolean {
  return !!documento?.querySelector('meta[name="viewport" i]');
}

export type ViewportDoDispositivo = {
  /** O tamanho do aparelho na tela (o que o jogador vê). */
  largura: number;
  altura: number;
  /** A largura em que a página é DESENHADA: a do aparelho, ou 980 px sem meta viewport num celular. */
  larguraLayout: number;
  alturaLayout: number;
  /** A regra dos 980 px está valendo (a prévia avisa: "simulação"). */
  simulandoViewport: boolean;
};

/**
 * Onde a página é desenhada no aparelho. Num celular, página sem meta
 * viewport é desenhada em 980 px e reduzida para caber na largura do
 * aparelho (como o Chrome no Android e o Safari no iPhone fazem); com o
 * meta, a largura do aparelho.
 */
export function viewportDoDispositivo(estado: EstadoDispositivo, documento: Document | null): ViewportDoDispositivo {
  const { largura, altura } = medidasNaTela(estado);
  const simulandoViewport = ehMovel(estado) && !temMetaViewport(documento) && largura < LARGURA_SEM_VIEWPORT;
  const larguraLayout = simulandoViewport ? LARGURA_SEM_VIEWPORT : largura;
  const alturaLayout = Math.round((altura * larguraLayout) / largura);
  return { largura, altura, larguraLayout, alturaLayout, simulandoViewport };
}

/** A tela em que as @media são avaliadas com o aparelho ligado (a largura de desenho), ou null desligado. */
export function telaDoDispositivo(estado: EstadoDispositivo, documento: Document | null): Tela | null {
  if (!estado.ligado) return null;
  const viewport = viewportDoDispositivo(estado, documento);
  return { largura: viewport.larguraLayout, altura: viewport.alturaLayout };
}

/** O zoom para caber no espaço (nunca aumenta): Ajustar à janela do Chrome. */
export function zoomParaCaber(largura: number, altura: number, espaco: { largura: number; altura: number }): number {
  if (espaco.largura <= 0 || espaco.altura <= 0) return 1;
  return Math.min(1, espaco.largura / largura, espaco.altura / altura);
}
