import type { Expressao } from "@/motor/expressao";
import type { DegrauAjuda } from "@/motor/tipos";

export type MensagemTutor = { papel: "aluno" | "tutor"; texto: string };

export type EntradaTutor = {
  faseId: string;
  objetivoId: string;
  enunciado: string;
  degrauAtual: DegrauAjuda;
  htmlAtual: string;
  /** CSS da folha editável (fases com CSS); vazio nas outras. */
  cssAtual?: string;
  /** (Fase de programa) O código, o último erro e as variáveis no fim da última execução. */
  programa?: ContextoProgramaTutor;
  pergunta: string;
  historico: MensagemTutor[];
};

/** O que o tutor sabe de uma fase de programa (Ilha Lógica): tudo já em texto curto. */
export type ContextoProgramaTutor = {
  /** O Snippet e as últimas entradas do Console. */
  codigo: string;
  /** "Uncaught TypeError: ... (linha 3)", ou vazio. */
  erro: string;
  /** As variáveis globais no fim da última execução: "total = 15; nomes = (2) ['Ana', 'Bia']". */
  variaveis: string;
};

export type SaidaTutor = { texto: string; expressao: Expressao };

export const LIMITES_TUTOR = {
  html: 6000,
  css: 4000,
  codigo: 4000,
  erro: 400,
  variaveis: 1200,
  pergunta: 300,
  mensagemHistorico: 600,
  historico: 6,
  resposta: 500,
} as const;

/** Por que o tutor não respondeu. Vai no corpo `{ erro: { tipo } }` da rota. */
export type TipoErroTutor = "sobrecarga" | "sem_chave" | "rede" | "desconhecido";

export const TIPOS_ERRO_TUTOR: readonly TipoErroTutor[] = ["sobrecarga", "sem_chave", "rede", "desconhecido"];

export function ehTipoErroTutor(valor: unknown): valor is TipoErroTutor {
  return typeof valor === "string" && (TIPOS_ERRO_TUTOR as readonly string[]).includes(valor);
}

/** Falha de rede ou desconhecida. */
export const FALA_SEM_SINAL = "Estou sem sinal agora. Tenta o botão Me ajuda!";

/** O Gemini está com muita procura (503/429), mesmo depois das novas tentativas. */
export const FALA_SOBRECARGA = "Tem muita gente falando comigo agora. Tenta de novo em alguns segundos!";

/** Sem GEMINI_API_KEY no servidor. */
export const FALA_SEM_CHAVE = "Meu chat ainda não foi ligado. O botão Me ajuda funciona normal!";
