/*
 * O executor por linguagem: o mesmo programa rodando em linguagens
 * diferentes, com UMA interface de saída e de erros (a do executor de
 * JavaScript: SaidaConsole e ErroExecucao). Nasce no comparador do Museu
 * das Origens (sala 3) e é a base da futura Ilha Python.
 *
 * - JavaScript roda no executor que já existe (Web Worker no jogo, vm no Node).
 * - Python roda de verdade, no Pyodide (CPython compilado para WebAssembly),
 *   num Web Worker próprio, carregado só quando alguém pede.
 * - C, Java, COBOL e BASIC não rodam no navegador: a saída é a que o
 *   conteúdo declara (conferida fora do jogo) e a tela marca "simulado".
 *
 * Tudo aqui é JSON puro (atravessa o postMessage do worker).
 */
import type { ErroExecucao, SaidaConsole } from "../executor/tipos";

export const LINGUAGENS = ["javascript", "python", "c", "java", "cobol", "basic"] as const;

export type Linguagem = (typeof LINGUAGENS)[number];

export function ehLinguagem(valor: unknown): valor is Linguagem {
  return typeof valor === "string" && (LINGUAGENS as readonly string[]).includes(valor);
}

/** A versão do Pyodide servida pelo próprio jogo (public/pyodide/<versão>/, copiada do node_modules). */
export const VERSAO_PYODIDE = "314.0.7";

/** Onde o navegador busca o Pyodide (no próprio site: sem CDN de fora). */
export const ENDERECO_PYODIDE = `/pyodide/${VERSAO_PYODIDE}/`;

/** Como cada linguagem roda no jogo. */
export type ComoRoda = "executa" | "simulado";

export type FichaLinguagem = {
  id: Linguagem;
  /** "Python". */
  nome: string;
  /** Quando nasceu, sem data inventada (na dúvida, a década). */
  nasceu: string;
  /** "executa": roda de verdade no navegador; "simulado": saída pronta, conferida fora do jogo. */
  roda: ComoRoda;
  /** O jeito de traduzir mais comum (para a ideia de compilar e interpretar). */
  traducao: "compilada" | "interpretada" | "meio a meio";
};

/*
 * Fatos conferidos (rodada 38), sem data exata quando não precisa:
 * - COBOL: fim dos anos 1950 (a especificação é de 1959-1960), feito para
 *   negócios (bancos, folha de pagamento); compilado.
 * - BASIC: anos 1960 (Dartmouth, 1964), popular nos computadores de casa
 *   dos anos 1980; quase sempre interpretado nessas máquinas.
 * - C: início dos anos 1970 (Bell Labs, junto com o Unix); compilado.
 * - Python: início dos anos 1990 (Guido van Rossum); interpretado (por
 *   dentro, vira bytecode antes de rodar).
 * - Java: meados dos anos 1990 (Sun); compilado para bytecode, que a
 *   máquina virtual roda: meio a meio.
 * - JavaScript: meados dos anos 1990 (Netscape, 1995); interpretado pelo
 *   navegador, hoje com compilação na hora (JIT) para ficar rápido.
 */
export const FICHAS_LINGUAGENS: Record<Linguagem, FichaLinguagem> = {
  cobol: { id: "cobol", nome: "COBOL", nasceu: "fim dos anos 1950", roda: "simulado", traducao: "compilada" },
  basic: { id: "basic", nome: "BASIC", nasceu: "anos 1960", roda: "simulado", traducao: "interpretada" },
  c: { id: "c", nome: "C", nasceu: "início dos anos 1970", roda: "simulado", traducao: "compilada" },
  python: { id: "python", nome: "Python", nasceu: "início dos anos 1990", roda: "executa", traducao: "interpretada" },
  java: { id: "java", nome: "Java", nasceu: "meados dos anos 1990", roda: "simulado", traducao: "meio a meio" },
  javascript: { id: "javascript", nome: "JavaScript", nasceu: "meados dos anos 1990", roda: "executa", traducao: "interpretada" },
};

/**
 * O resultado de rodar um programa numa linguagem: as linhas da saída (no
 * formato do Console do jogo) e o erro (no formato do executor de
 * JavaScript, com o nome original do erro: NameError, SyntaxError...).
 */
export type ResultadoLinguagem = {
  linguagem: Linguagem;
  codigo: string;
  saidas: SaidaConsole[];
  erro: ErroExecucao | null;
  /** A saída é a declarada pelo conteúdo, não de uma execução de verdade. */
  simulado: boolean;
};

/** O andamento da carga do Python (a primeira vez baixa uns 12 MB; depois, vem do cache). */
export type CargaPython =
  | { etapa: "baixando"; baixados: number; total: number }
  | { etapa: "acordando" }
  | { etapa: "pronto" }
  | { etapa: "falhou"; mensagem: string };

/** Limites do Python no navegador. */
export const LIMITES_PYTHON = {
  /** Tempo de uma execução, em milissegundos (depois disso, o worker é encerrado e o Python acorda de novo). */
  tempoMs: 5_000,
  /** Tempo para baixar e acordar o Python. */
  cargaMs: 120_000,
  /** Linhas de saída guardadas. */
  saidas: 500,
} as const;

/** Uma linha de saída no formato do Console do jogo. */
export function linhaDeSaida(texto: string, nivel: SaidaConsole["nivel"] = "log"): SaidaConsole {
  return { nivel, partes: [{ t: "string", v: texto }], formato: true, texto, linha: null };
}

/** O texto de cada linha (sem as de limpar). */
export function textosDaSaida(resultado: Pick<ResultadoLinguagem, "saidas">): string[] {
  return resultado.saidas.filter((saida) => !saida.limpar).map((saida) => saida.texto);
}

/** O resultado de uma linguagem simulada: a saída que o conteúdo declara. */
export function resultadoSimulado(linguagem: Linguagem, codigo: string, saida: readonly string[]): ResultadoLinguagem {
  return { linguagem, codigo, saidas: saida.map((linha) => linhaDeSaida(linha)), erro: null, simulado: true };
}
