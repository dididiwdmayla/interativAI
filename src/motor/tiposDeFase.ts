/*
 * Registro dos tipos de fase.
 *
 * Hoje há quatro, e todos usam a tela do DevTools (painel + prévia):
 * - "pratica": micro-passos, objetivos guiados e sozinho em sequência;
 * - "desafio": checklist de partes, sem passo a passo, com "Rever";
 * - "projeto-ponte": o site do próprio jogador, com checklist de
 *   requisitos, sem Rever, salvo em Meus projetos e levado pro mundo;
 * - "simulador-campanha": objetivos como na prática, mais a aba Campanha
 *   (orçamento, palavra-chave, lance, o leilão e o dia simulado).
 *
 * Para um tipo novo (ex.: "linha-do-tempo", "comparador",
 * "diagrama-rede"): crie a variante em `Fase` (src/conteudo/tipos.ts),
 * registre aqui com a tela que ele usa, ensine o Jogo a montar essa tela
 * e acrescente as checagens dele em src/conteudo/checagens.ts.
 */
import type { DadosCircuito, Fase, FaseComObjetivos, TipoFase } from "@/conteudo/tipos";

export type TelaDaFase = "devtools" | "circuito";

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
  "simulador-campanha": {
    nome: "Simulador de campanha",
    descricao: "Um anúncio pago por dentro: orçamento, palavra-chave e lance, o leilão e o dia simulado, com a página de destino decidindo quantos cliques viram clientes. Números fictícios.",
    tela: "devtools",
  },
  "circuito-logico": {
    nome: "Circuito lógico",
    descricao: "Portões E, OU e NÃO numa bancada: arrastar, ligar fios, alternar as entradas e ver a corrente acender, com a tabela verdade ao lado e o circuito escrito como código.",
    tela: "circuito",
  },
};

/** A fase tem objetivos em sequência (prática e simulador de campanha): o mesmo motor de objetivos. */
export function temObjetivos(fase: Fase): fase is FaseComObjetivos {
  return fase.tipo === "pratica" || fase.tipo === "simulador-campanha" || fase.tipo === "circuito-logico";
}

/**
 * A bancada do circuito lógico da fase: a de uma fase circuito-logico ou a
 * de um desafio com circuito (inclusive a ponte circuito/Console). Null nas
 * outras.
 */
export function circuitoDaFase(fase: Fase): DadosCircuito | null {
  if (fase.tipo === "circuito-logico") return fase.circuito;
  if (fase.tipo === "desafio") return fase.circuito ?? null;
  return null;
}

/** A fase não tem página de site (programa ou circuito): a validação usa o documento vazio do começo. */
export function semPagina(fase: Fase): boolean {
  return fase.programa !== undefined || circuitoDaFase(fase) !== null;
}

/** Como a fase aparece nos rótulos (barra, conclusão, lista, glossário): "Fase 2", "Desafio" ou "Projeto". */
export function rotuloDaFase(tipo: TipoFase, numero: number): string {
  if (tipo === "desafio") return "Desafio";
  if (tipo === "projeto-ponte") return "Projeto";
  return `Fase ${numero}`;
}
