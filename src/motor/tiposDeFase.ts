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
 * Uma prática ou um desafio que declara `areas` (src/motor/composicao.ts)
 * não é um tipo novo: o tipo continua o mesmo e a tela é composta pelas
 * áreas de trabalho que a fase pede.
 *
 * O museu (rodada 36) não é tipo novo: é a área `exposicao` da composição
 * (src/motor/exposicao), com a linha do tempo como uma das estações.
 *
 * Para um tipo novo (ex.: "comparador", "diagrama-rede"): crie a variante em `Fase` (src/conteudo/tipos.ts),
 * registre aqui com a tela que ele usa, ensine o Jogo a montar essa tela
 * e acrescente as checagens dele em src/conteudo/checagens.ts.
 */
import type { DadosCircuito, Fase, FaseComObjetivos, TipoFase } from "@/conteudo/tipos";
import { faseComposta } from "./composicao";

export type TelaDaFase = "devtools" | "circuito" | "ordenar";

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
  "ordenar-passos": {
    nome: "Ordenar passos",
    descricao: "Cartões com os passos de um problema para arrastar até o plano; vale qualquer ordem que respeite as dependências, com passos que sobram e a variante agrupar (subpassos dentro dos passos grandes).",
    tela: "ordenar",
  },
};

/** A fase tem objetivos em sequência (prática e simulador de campanha): o mesmo motor de objetivos. */
export function temObjetivos(fase: Fase): fase is FaseComObjetivos {
  return fase.tipo === "pratica" || fase.tipo === "simulador-campanha" || fase.tipo === "circuito-logico" || fase.tipo === "ordenar-passos";
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

/** A fase não tem página de site (programa, circuito, quadro ou composta): a validação usa o documento vazio do começo. */
export function semPagina(fase: Fase): boolean {
  return fase.programa !== undefined || circuitoDaFase(fase) !== null || fase.tipo === "ordenar-passos" || faseComposta(fase);
}

/** Como a fase aparece nos rótulos (barra, conclusão, lista, glossário): "Fase 2", "Desafio", "Contrato" ou "Projeto". */
export function rotuloDaFase(tipo: TipoFase, numero: number, contrato = false): string {
  if (tipo === "desafio") return contrato ? "Contrato" : "Desafio";
  if (tipo === "projeto-ponte") return "Projeto";
  return `Fase ${numero}`;
}
