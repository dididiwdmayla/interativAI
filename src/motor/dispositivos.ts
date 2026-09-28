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
