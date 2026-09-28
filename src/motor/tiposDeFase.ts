/*
 * Registro dos tipos de fase.
 *
 * Hoje há três, e os três usam a tela do DevTools (painel + prévia):
 * - "pratica": micro-passos, objetivos guiados e sozinho em sequência;
 * - "desafio": checklist de partes, sem passo a passo, com "Rever";
 * - "projeto-ponte": o site do próprio jogador, com checklist de
 *   requisitos, sem Rever, salvo em Meus projetos e levado pro mundo.
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
  "projeto-ponte": {
    nome: "Projeto-ponte",
    descricao: "O site do próprio jogador, do zero, no modo documento: requisitos que se marcam sozinhos, tutor que só pergunta, projeto salvo e levado pro mundo.",
    tela: "devtools",
  },
};

/** Como a fase aparece nos rótulos (barra, conclusão, lista, glossário): "Fase 2", "Desafio" ou "Projeto". */
export function rotuloDaFase(tipo: TipoFase, numero: number): string {
  if (tipo === "desafio") return "Desafio";
  if (tipo === "projeto-ponte") return "Projeto";
  return `Fase ${numero}`;
}
