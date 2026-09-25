import type { ManifestoMusicas } from "./manifestos";

/*
 * Tabela única tela -> faixa de música. Só este arquivo decide o que toca
 * onde. Uma faixa que ainda não chegou (em "pendentes" no musicas.json, ou
 * sem entrada) toca silêncio, sem erro.
 */

export type TelaDoJogo =
  /** O mapa do mundo (/). */
  | { tipo: "mundo" }
  /** O Museu das Origens (/ilha/origens). */
  | { tipo: "museu" }
  /** Uma ilha (/ilha/[id]). */
  | { tipo: "ilha"; ilhaId: string }
  /** Uma fase (/fase/[id]), dentro de uma zona e unidade de alguma ilha. */
  | { tipo: "fase"; ilhaId: string | null };

/** Faixa do mapa do mundo. */
export const FAIXA_DO_MUNDO = "mapa";

/** Faixa do Museu das Origens. */
export const FAIXA_DO_MUSEU = "origens";

/**
 * Faixa de cada ilha, pelo id do currículo (src/curriculo/curriculo.ts).
 * Vale para a ilha e para todas as zonas, unidades e fases dentro dela.
 * "ia" já tem música mas a ilha ainda não existe no currículo; "frameworks"
 * existe no currículo mas ainda não tem música (toca silêncio).
 */
export const FAIXA_DA_ILHA: Readonly<Record<string, string>> = {
  origens: "origens",
  sites: "sites",
  logica: "logica",
  "paginas-vivas": "paginas-vivas",
  "rede-servidor": "rede-servidor",
  oficio: "oficio",
  ia: "ia",
};

/** A faixa que a tela pede, antes de saber se ela existe. Null: silêncio. */
export function faixaDaTela(tela: TelaDoJogo): string | null {
  switch (tela.tipo) {
    case "mundo":
      return FAIXA_DO_MUNDO;
    case "museu":
      return FAIXA_DO_MUSEU;
    case "ilha":
    case "fase":
      return tela.ilhaId !== null && Object.hasOwn(FAIXA_DA_ILHA, tela.ilhaId) ? FAIXA_DA_ILHA[tela.ilhaId] : null;
  }
}

/** A faixa que de fato toca: a pedida, se ela está no manifesto e não é pendente. Null: silêncio. */
export function faixaTocavel(tela: TelaDoJogo, manifesto: ManifestoMusicas): string | null {
  const faixa = faixaDaTela(tela);
  if (faixa === null || manifesto.pendentes.includes(faixa)) return null;
  return Object.hasOwn(manifesto.faixas, faixa) ? faixa : null;
}
