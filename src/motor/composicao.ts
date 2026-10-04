/*
 * Composição de áreas de trabalho (motor de resolução de problemas).
 *
 * Em vez de mais um tipo fechado de fase, uma fase de prática ou um desafio
 * declara as ÁREAS que usa (`areas: ["plano", "snippet", "palco"]`) e o
 * motor monta a tela com elas: o quadro de passos (o plano), o código (a
 * aba Fontes com o Snippet e o Console), o palco da memória com a linha do
 * tempo, os casos de teste do aluno e, nas ilhas seguintes, outras áreas (a
 * especificação e o código gerado da Ilha IA, os arquivos de um projeto do
 * Ofício).
 *
 * Cada área tem um dono no formato da fase:
 * - "plano": o campo `plano` (os mesmos cartões do ordenar-passos);
 * - "snippet": `programa.snippet` (o código do aluno);
 * - "palco": `programa` (o palco da memória e a linha do tempo);
 * - "testes": o campo `testes` (os casos de teste que o aluno escreve e
 *   roda contra a própria função).
 *
 * Os tipos antigos (prática de DevTools, programa, circuito, ordenar-passos)
 * continuam com as telas deles: a composição só vale para a fase que declara
 * `areas` (ver o guia, seção 29, para o porquê).
 *
 * Puro (sem React): a tela, a simulação dos testes, os validadores e as
 * checagens usam as mesmas funções.
 */
import type { Fase, FaseDesafio, FasePratica } from "@/conteudo/tipos";
import type { DadosOrdenar } from "./ordenar/modelo";
import type { DadosCasos } from "./casos/modelo";

/** As áreas de trabalho que uma fase composta pode declarar, na ordem em que aparecem na tela. */
export const AREAS_TRABALHO = ["plano", "snippet", "palco", "testes"] as const;

export type AreaTrabalho = (typeof AREAS_TRABALHO)[number];

/** Uma fase que declara as áreas de trabalho (prática ou desafio). */
export type FaseComposta = (FasePratica | FaseDesafio) & { areas: AreaTrabalho[] };

/** A fase declara áreas de trabalho: a tela é composta por elas. */
export function faseComposta(fase: Fase): fase is FaseComposta {
  return (fase.tipo === "pratica" || fase.tipo === "desafio") && Array.isArray(fase.areas) && fase.areas.length > 0;
}

/** As áreas da fase, na ordem da tela (vazio: a fase usa a tela do tipo dela). */
export function areasDaFase(fase: Fase): AreaTrabalho[] {
  if (!faseComposta(fase)) return [];
  return AREAS_TRABALHO.filter((area) => fase.areas.includes(area));
}

export function temArea(fase: Fase, area: AreaTrabalho): boolean {
  return faseComposta(fase) && fase.areas.includes(area);
}

/**
 * O quadro de passos da fase: o de uma fase ordenar-passos ou o plano de
 * uma fase composta com a área plano. Null nas outras.
 */
export function quadroDaFase(fase: Fase): DadosOrdenar | null {
  if (fase.tipo === "ordenar-passos") return fase.ordenar;
  if (temArea(fase, "plano") && (fase.tipo === "pratica" || fase.tipo === "desafio")) return fase.plano ?? null;
  return null;
}

/** Os casos de teste da fase (área testes): a função que eles chamam. Null sem a área. */
export function casosDaFase(fase: Fase): DadosCasos | null {
  if (temArea(fase, "testes") && (fase.tipo === "pratica" || fase.tipo === "desafio")) return fase.testes ?? null;
  return null;
}
