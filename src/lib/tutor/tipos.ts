import type { Expressao } from "@/motor/expressao";
import type { DegrauAjuda } from "@/motor/tipos";

export type MensagemTutor = { papel: "aluno" | "tutor"; texto: string };

export type EntradaTutor = {
  faseId: string;
  objetivoId: string;
  enunciado: string;
  degrauAtual: DegrauAjuda;
  htmlAtual: string;
  pergunta: string;
  historico: MensagemTutor[];
};

export type SaidaTutor = { texto: string; expressao: Expressao };

export const LIMITES_TUTOR = {
  html: 6000,
  pergunta: 300,
  mensagemHistorico: 600,
  historico: 6,
  resposta: 500,
} as const;

/** Mensagem única mostrada quando o tutor não responde (sem chave, 429, rede). */
export const FALA_SEM_SINAL = "Estou sem sinal agora. Tenta o botão Me ajuda!";
