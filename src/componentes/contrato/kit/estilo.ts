/*
 * O estilo do kit de clientes: cores só por tokens (--cor-cliente-*, nos três
 * temas de src/tema/tokens.css), formas arredondadas, contorno fino e suave
 * como o do computadorzinho e o das cenas, luz de cima (a sombra é uma camada
 * escura e transparente no lado de baixo).
 */
import type { AparenciaCliente } from "@/motor/contrato/clientes";

/** var(--cor-cliente-<nome>). */
export function cor(nome: string): string {
  return `var(--cor-cliente-${nome})`;
}

export const CONTORNO = {
  stroke: "var(--cor-cliente-contorno)",
  strokeOpacity: 0.3,
  strokeWidth: 1.4,
  strokeLinejoin: "round",
  strokeLinecap: "round",
} as const;

/** O traço dos olhos, sobrancelhas e boca. */
export const TRACO = {
  fill: "none",
  stroke: "var(--cor-cliente-rosto)",
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** A camada de sombra (o escuro transparente que dá volume). */
export const SOMBRA = { fill: "var(--cor-cliente-rosto)", opacity: 0.12 } as const;

export type Cores = { pele: string; cabelo: string; roupa: string };

export function coresDe(aparencia: AparenciaCliente): Cores {
  return { pele: cor(`pele-${aparencia.pele}`), cabelo: cor(`cabelo-${aparencia.corCabelo}`), roupa: cor(`roupa-${aparencia.corRoupa}`) };
}

/** O centro da cabeça e dos olhos (o rosto inteiro se desenha em volta disto). */
export const CABECA = { x: 70, y: 64, rx: 34, ry: 37 } as const;
export const OLHOS = { y: 68, esquerdo: 56, direito: 84 } as const;
export const BOCA = { x: 70, y: 87 } as const;
