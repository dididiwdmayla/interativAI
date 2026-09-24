/*
 * Registro dos tipos de fase.
 *
 * Hoje há dois, e os dois usam a tela do DevTools (painel + prévia):
 * - "pratica": micro-passos, objetivos guiados e sozinho em sequência;
 * - "desafio": checklist de partes, sem passo a passo, com "Rever".
 *
 * Para um tipo novo (ex.: "linha-do-tempo", "comparador",
 * "diagrama-rede"): crie a variante em `Fase` (src/conteudo/tipos.ts),
 * registre aqui com a tela que ele usa, ensine o Jogo a montar essa tela
 * e acrescente as checagens dele em src/conteudo/checagens.ts.
 */
import type { TipoFase } from "@/conteudo/tipos";

export type TelaDaFase = "devtools";

export type DefinicaoTipoFase = {
  nome: string;
  descricao: string;
  /** Qual tela monta a fase. */
  tela: TelaDaFase;
};

export const TIPOS_DE_FASE: Record<TipoFase, DefinicaoTipoFase> = {
  pratica: {
    nome: "Prática",
    descricao: "Micro-passos: cada habilidade primeiro guiada, depois sozinho em outra situação.",
    tela: "devtools",
  },
  desafio: {
    nome: "Desafio",
    descricao: "Junta tudo da unidade num site novo, sem passo a passo; o checklist marca as partes.",
    tela: "devtools",
  },
};
