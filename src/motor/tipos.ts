import type { Aba } from "./abas";
import type { EventoFase } from "./eventos";
import type { Expressao } from "./expressao";

export type Fala = { texto: string; expressao: Expressao };

/** O que a validação de um objetivo pode olhar. */
export type ContextoValidacao = {
  /** Documento vivo do site-alvo (dentro do iframe). */
  documento: Document;
  /** Nó selecionado na árvore, se houver. */
  selecionado: Node | null;
  /** Eventos desde que o objetivo atual ficou ativo. */
  eventos: readonly EventoFase[];
  /** Todos os eventos da fase. */
  todosEventos: readonly EventoFase[];
  /** Documento solto com o estado inicial, para comparar. */
  inicial: Document;
};

/** Ações que a solução (degrau 4) pode usar para resolver o objetivo. */
export type ContextoFase = {
  documento: Document;
  /** Seleciona o primeiro elemento do seletor, como se o jogador tivesse clicado. */
  selecionar: (seletor: string, opcoes?: { comoInspecao?: boolean }) => void;
  /** Troca o texto de um elemento pela árvore (caminho B). */
  editarTexto: (seletor: string, texto: string) => void;
  /** Transforma o código do editor (caminho A). */
  editarCodigo: (transformar: (html: string) => string) => void;
};

export type AjudaLinha =
  | { alvo: "arvore"; seletor: string; parte?: "no" | "texto"; fala: string }
  | { alvo: "editor"; buscarTexto: string; fala: string }
  | { alvo: "inspecionar"; fala: string };

export type Ajudas = {
  /** Degrau 1: uma pergunta que faz pensar. */
  pergunta: string;
  /** Degrau 2: o conceito. */
  dica: string;
  /** Degrau 3: aponta onde olhar. */
  linha: AjudaLinha;
  /** Degrau 4: aplica a solução (custa 1 estrela). */
  solucao: {
    fala: string;
    aplicar: (contexto: ContextoFase) => void;
  };
};

export type Objetivo = {
  id: string;
  enunciado: string;
  validar: (contexto: ContextoValidacao) => boolean;
  ajudas: Ajudas;
  falaAoConcluir: Fala;
};

export type Fase = {
  id: string;
  ilha: string;
  zona: string;
  numero: number;
  titulo: string;
  introducao: Fala[];
  urlSiteAlvo: string;
  tituloSiteAlvo: string;
  headSiteAlvo: string;
  bodyInicial: string;
  abasDesbloqueadas: Aba[];
  objetivos: Objetivo[];
  conclusao: Fala[];
  missaoDeCampo: string;
  /** Última fala depois da missão de campo. */
  falaFinal: Fala;
};

export type DegrauAjuda = 0 | 1 | 2 | 3 | 4;

export const ESTRELAS_INICIAIS = 3;
export const ESTRELAS_MINIMAS = 1;
