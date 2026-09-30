/*
 * O estado da Revisão do dia que mora no progresso (por conceito, mais a
 * sequência de dias), os dias do calendário local e a leitura segura do
 * que veio do armazenamento. Sem imports de conteúdo: o progresso usa este
 * arquivo. O agendador fica em src/lib/revisao.ts.
 */

export const INTERVALOS = [1, 3, 7, 21, 60] as const;

export type EstadoConceitoRevisao = {
  /** Posição em INTERVALOS (0 a 4). */
  nivel: number;
  /** Dia em que vence ("AAAA-MM-DD"). */
  proxima: string;
  /** Quantas revisões já fez (escolhe a variação da vez). */
  vezes: number;
  /** Último dia em que revisou, ou null. */
  ultima: string | null;
};

export type SequenciaRevisao = {
  /** Dias seguidos com pelo menos uma sessão, até o último. */
  atual: number;
  melhor: number;
  ultimoDia: string | null;
};

export type EstadoRevisao = {
  conceitos: Record<string, EstadoConceitoRevisao>;
  sequencia: SequenciaRevisao;
};

export const REVISAO_PADRAO: EstadoRevisao = {
  conceitos: {},
  sequencia: { atual: 0, melhor: 0, ultimoDia: null },
};

/** Como o item terminou. */
export type ResultadoItem = "sem-ajuda" | "com-ajuda" | "errou";

/* ------------------------------------------------------------------ */
/* Dias                                                               */
/* ------------------------------------------------------------------ */

function dois(numero: number): string {
  return String(numero).padStart(2, "0");
}

/** O dia do calendário local do aparelho ("AAAA-MM-DD"). */
export function diaLocal(agora: Date = new Date()): string {
  return `${agora.getFullYear()}-${dois(agora.getMonth() + 1)}-${dois(agora.getDate())}`;
}

function partes(dia: string): [number, number, number] {
  const [ano, mes, data] = dia.split("-").map(Number);
  return [ano, mes, data];
}

/** O dia `n` dias depois (ou antes, com n negativo). */
export function somarDias(dia: string, n: number): string {
  const [ano, mes, data] = partes(dia);
  // Em UTC: sem horário de verão no meio da conta.
  const alvo = new Date(Date.UTC(ano, mes - 1, data + n));
  return `${alvo.getUTCFullYear()}-${dois(alvo.getUTCMonth() + 1)}-${dois(alvo.getUTCDate())}`;
}

/** Quantos dias de `de` até `ate` (positivo se `ate` vem depois). */
export function diasEntre(de: string, ate: string): number {
  const [a1, m1, d1] = partes(de);
  const [a2, m2, d2] = partes(ate);
  return Math.round((Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1)) / 86_400_000);
}

export function ehDia(valor: unknown): valor is string {
  return typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor);
}

/* ------------------------------------------------------------------ */
/* Leitura do progresso salvo                                         */
/* ------------------------------------------------------------------ */

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function ehInteiro(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor);
}

function lerConceito(valor: unknown): EstadoConceitoRevisao | null {
  if (!ehObjeto(valor) || !ehDia(valor.proxima)) return null;
  return {
    nivel: ehInteiro(valor.nivel) ? Math.min(INTERVALOS.length - 1, Math.max(0, valor.nivel)) : 0,
    proxima: valor.proxima,
    vezes: ehInteiro(valor.vezes) && valor.vezes >= 0 ? valor.vezes : 0,
    ultima: ehDia(valor.ultima) ? valor.ultima : null,
  };
}

/** Converte o que veio do armazenamento (ou nada, em progresso antigo) num estado válido. */
export function lerEstadoRevisao(valor: unknown): EstadoRevisao {
  if (!ehObjeto(valor)) return REVISAO_PADRAO;
  const conceitos: Record<string, EstadoConceitoRevisao> = {};
  if (ehObjeto(valor.conceitos)) {
    for (const [id, item] of Object.entries(valor.conceitos)) {
      const lido = lerConceito(item);
      if (lido) conceitos[id] = lido;
    }
  }
  const sequencia = ehObjeto(valor.sequencia) ? valor.sequencia : {};
  const atual = ehInteiro(sequencia.atual) && sequencia.atual >= 0 ? sequencia.atual : 0;
  return {
    conceitos,
    sequencia: {
      atual,
      melhor: ehInteiro(sequencia.melhor) && sequencia.melhor >= atual ? sequencia.melhor : atual,
      ultimoDia: ehDia(sequencia.ultimoDia) ? sequencia.ultimoDia : null,
    },
  };
}
