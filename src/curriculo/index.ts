/*
 * Consultas ao currículo (src/curriculo/curriculo.ts): onde cada unidade
 * mora, se está pronta e o que falta no motor.
 */
import { UNIDADES } from "@/conteudo";
import type { Unidade } from "@/conteudo/tipos";
import { CURRICULO } from "./curriculo";
import type { IlhaCurriculo, StatusUnidade, UnidadeCurriculo, ZonaCurriculo } from "./tipos";

export { CURRICULO } from "./curriculo";
export type { IconeZona, IlhaCurriculo, StatusUnidade, UnidadeCurriculo, ZonaCurriculo } from "./tipos";

/** Ilhas da rota principal, na ordem (sem a opcional). */
export const ILHAS_DA_ROTA: readonly IlhaCurriculo[] = CURRICULO.filter((ilha) => !ilha.opcional);

/** Ilhas opcionais (Frameworks), fora da rota. */
export const ILHAS_OPCIONAIS: readonly IlhaCurriculo[] = CURRICULO.filter((ilha) => ilha.opcional);

export function ilhaDoId(id: string): IlhaCurriculo | undefined {
  return CURRICULO.find((ilha) => ilha.id === id);
}

export type LocalNoCurriculo = {
  ilha: IlhaCurriculo;
  zona: ZonaCurriculo;
  unidade: UnidadeCurriculo;
  /** Posição dentro da zona (a partir de 0). */
  indice: number;
};

/** Onde uma unidade mora no currículo, ou undefined se não está nele. */
export function localNoCurriculo(
  unidadeId: string,
  curriculo: readonly IlhaCurriculo[] = CURRICULO,
): LocalNoCurriculo | undefined {
  for (const ilha of curriculo) {
    for (const zona of ilha.zonas) {
      const indice = zona.unidades.findIndex((unidade) => unidade.id === unidadeId);
      if (indice >= 0) return { ilha, zona, unidade: zona.unidades[indice], indice };
    }
  }
  return undefined;
}

/** "pronta" se existe conteúdo registrado com esse id; senão, "planejada". */
export function statusDaUnidade(unidadeId: string, unidades: readonly Unidade[] = UNIDADES): StatusUnidade {
  return unidades.some((unidade) => unidade.id === unidadeId) ? "pronta" : "planejada";
}

/** O que falta no motor para esta unidade (dela ou da zona), ou null se o motor está pronto. */
export function motorQueFalta(zona: ZonaCurriculo, unidade?: UnidadeCurriculo): string | null {
  return unidade?.requerMotor ?? zona.requerMotor ?? null;
}

/** Todas as unidades de uma ilha, na ordem das zonas. */
export function unidadesDaIlha(ilha: IlhaCurriculo): UnidadeCurriculo[] {
  return ilha.zonas.flatMap((zona) => zona.unidades);
}

/** Unidades prontas de uma ilha (as que têm conteúdo). */
export function unidadesProntasDaIlha(ilha: IlhaCurriculo, unidades: readonly Unidade[] = UNIDADES): UnidadeCurriculo[] {
  return unidadesDaIlha(ilha).filter((unidade) => statusDaUnidade(unidade.id, unidades) === "pronta");
}
