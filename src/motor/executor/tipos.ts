import type { SintaxeJs } from "./instrumentar";
import type { RastroCena } from "../cena/modelo";

/*
 * Tipos do executor de JavaScript do jogador (Ilha Lógica). Tudo aqui é
 * JSON puro: atravessa o postMessage do Web Worker e o vm do Node do mesmo
 * jeito. O executor roda o código instrumentado e devolve o RASTRO: um passo
 * por comando executado, com a linha, a memória (quadros, escopos e
 * variáveis) e quantas saídas do console já tinham saído.
 */

/** Um valor como o Console mostra (árvore, sem identidade). */
export type ValorExibido =
  | { t: "undefined" }
  | { t: "null" }
  | { t: "boolean"; v: boolean }
  | { t: "number"; v: string }
  | { t: "string"; v: string }
  | { t: "bigint"; v: string }
  | { t: "symbol"; v: string }
  | { t: "array"; itens: ValorExibido[]; tamanho: number; cortado?: true }
  | { t: "objeto"; classe: string | null; entradas: [string, ValorExibido][]; cortado?: true }
  | { t: "map"; entradas: [ValorExibido, ValorExibido][]; tamanho: number }
  | { t: "set"; itens: ValorExibido[]; tamanho: number }
  | { t: "funcao"; nome: string; texto: string; seta: boolean; classe?: true }
  | { t: "erro"; nome: string; mensagem: string }
  | { t: "data"; texto: string }
  /** Além da profundidade que o executor copia (o Console mostraria "{…}"). */
  | { t: "fundo"; resumo: string };

/** Um valor na memória: primitivos por valor, objetos por referência (id no monte). */
export type ValorMemoria =
  | { t: "undefined" }
  | { t: "null" }
  | { t: "boolean"; v: boolean }
  | { t: "number"; v: string }
  | { t: "string"; v: string }
  | { t: "bigint"; v: string }
  | { t: "symbol"; v: string }
  | { t: "funcao"; nome: string; seta: boolean }
  | { t: "ref"; id: number };

export type ObjetoMemoria =
  | { t: "array"; itens: ValorMemoria[]; tamanho: number }
  | { t: "objeto"; classe: string | null; entradas: [string, ValorMemoria][] }
  | { t: "map"; entradas: [ValorMemoria, ValorMemoria][] }
  | { t: "set"; itens: ValorMemoria[] }
  | { t: "erro"; nome: string; mensagem: string }
  | { t: "data"; texto: string };

export type TipoDeclaracao = "let" | "const" | "var" | "funcao" | "parametro" | "classe";

export type VariavelMemoria = { nome: string; declaracao: TipoDeclaracao; valor: ValorMemoria };

export type EscopoMemoria = {
  /** Id estático do escopo no código (o mesmo em todos os passos). */
  id: string;
  tipo: "global" | "funcao" | "bloco";
  variaveis: VariavelMemoria[];
};

/**
 * Um quadro por chamada de função em andamento (o global é o primeiro).
 * `linha`: onde o quadro está agora (no de cima, a linha que vai rodar; nos
 * de baixo, a linha que chamou a função), para a Pilha de chamadas.
 */
export type QuadroMemoria = { nome: string; chamada: number; escopos: EscopoMemoria[]; linha?: number | null };

export type FotoMemoria = { quadros: QuadroMemoria[]; monte: Record<string, ObjetoMemoria> };

export type PassoRastro = {
  /** Linha (1 em diante) do código da origem; null no passo final. */
  linha: number | null;
  coluna: number | null;
  /** "passo" antes de rodar o comando, "retorno" quando uma função devolve, "fim" e "erro" no final. */
  tipo: "passo" | "retorno" | "fim" | "erro";
  memoria: FotoMemoria;
  /** Quantas saídas do console já tinham aparecido neste momento. */
  saidas: number;
  /** No passo de retorno: o valor devolvido e a função. */
  retorno?: { funcao: string; valor: ValorMemoria };
  /** O comando deste passo é a instrução `debugger;` (o depurador pausa aqui). */
  depurador?: true;
  /**
   * As posições de lista que a linha ANTERIOR leu (lista[i]), pelo id da
   * lista no monte: o palco acende esses vagões ("leu"), para ver busca e
   * ordenação acontecendo.
   */
  leituras?: { id: number; indice: number }[];
  /** (Cena programável) O relógio simulado neste passo: a cena anda junto com a linha do tempo. */
  tempoMs?: number;
};

export type NivelSaida = "log" | "info" | "warn" | "error" | "debug";

export type SaidaConsole = {
  nivel: NivelSaida;
  /** Os argumentos, na ordem. */
  partes: ValorExibido[];
  /** O primeiro argumento era texto (formato): os textos seguintes aparecem sem aspas. */
  formato: boolean;
  /** A linha como o Console mostra, em texto (é o que o validador `saida` compara). */
  texto: string;
  linha: number | null;
  /** console.clear(): o Console apaga o que tinha antes. */
  limpar?: true;
};

export type TipoErroExecucao = "sintaxe" | "execucao" | "limite-passos" | "limite-tempo" | "nao-suportado";

export type ErroExecucao = {
  tipo: TipoErroExecucao;
  /** Nome do erro no JavaScript (ReferenceError, TypeError, SyntaxError...). */
  nome: string;
  /** Mensagem original do motor de JavaScript (ou a do jogo, nos limites). */
  mensagem: string;
  linha: number | null;
  coluna: number | null;
  /**
   * (Cena programável, passos demais) O loop não chamou esperar() (o relógio
   * da cena não andou) ou chamou com um tempo curto demais: a explicação dá a
   * dica certa.
   */
  naCena?: "sem-esperar" | "esperar-curto";
};

export type OrigemCodigo = "console" | "snippet" | "teste";

export type ResultadoExecucao = {
  origem: OrigemCodigo;
  codigo: string;
  /** O valor da última expressão (o que o Console responde); undefined depois de declarações. */
  resultado: ValorExibido;
  saidas: SaidaConsole[];
  erro: ErroExecucao | null;
  passos: PassoRastro[];
  /** Passaram de LIMITES.fotos passos: o rastro guardou só os primeiros (e o fim). */
  rastroCortado: boolean;
  totalPassos: number;
  /** A memória no fim (mesmo com o rastro cortado). */
  memoriaFinal: FotoMemoria;
  /** Nomes globais declarados até agora na sessão, com o tipo de declaração. */
  globais: { nome: string; declaracao: TipoDeclaracao }[];
  /** O que o código usa (if, for, arrow...), lido da árvore: validador `usouSintaxe`. */
  sintaxes: SintaxeJs[];
  /** (Cena programável) A simulação depois desta execução: as mudanças dos dispositivos com o instante. */
  cena?: RastroCena;
  /** (Cena, Snippet) A mesma simulação com outras linhas do tempo, pela chave (validador variosCenarios). */
  cenarios?: Record<string, RastroCena>;
};

/** O valor de uma expressão do painel Observar, avaliada numa foto da memória (o momento pausado). */
export type ResultadoAvaliacao = { expressao: string; valor: ValorExibido } | { expressao: string; erro: string };

/**
 * (Cena) O instante de uma pausa do depurador: o relógio da simulação no
 * passo e o índice do passo (as mudanças dos dispositivos até ali valem).
 */
export type InstantePausa = { tempoMs: number; passo: number };

/** O instante da cena num passo de uma execução (undefined: sem cena). */
export function instanteDoPasso(resultado: { passos: readonly { tempoMs?: number }[]; cena?: unknown }, indice: number): InstantePausa | undefined {
  const tempoMs = resultado.passos[indice]?.tempoMs;
  return resultado.cena && tempoMs !== undefined ? { tempoMs, passo: indice } : undefined;
}

/** Uma medição do gráfico de desempenho: a função rodando com uma lista daquele tamanho. */
export type MedicaoPassos = { funcao: string; tamanho: number; passos: number; passouDoLimite: boolean; erro: string | null };

/** Valor esperado num caso de teste de função (JSON). */
export type ValorEsperado = null | boolean | number | string | ValorEsperado[] | { [chave: string]: ValorEsperado };

export type CasoFuncao = { args: ValorEsperado[]; esperado: ValorEsperado };

export type ResultadoCasoFuncao = {
  args: ValorEsperado[];
  esperado: ValorEsperado;
  obtido: ValorExibido | null;
  erro: ErroExecucao | null;
  passou: boolean;
};

export type ResultadoTesteFuncao = {
  nome: string;
  /** A função existe na sessão (senão, todos os casos falham). */
  existe: boolean;
  casos: ResultadoCasoFuncao[];
  passou: boolean;
};

/** Limites da execução (proteção contra loop infinito e rastro grande). */
export const LIMITES = {
  /** Comandos executados antes de parar ("loop infinito?"). */
  passos: 100_000,
  /** Tempo real, em milissegundos, conferido pelos ganchos. */
  tempoMs: 1_500,
  /** Tempo do reserva (o worker é encerrado se não responder). */
  reservaMs: 4_000,
  /** Passos guardados com a memória (o resto só conta). */
  fotos: 1_000,
  /** Profundidade da cópia dos valores do Console. */
  profundidade: 4,
  /** Itens de uma lista e campos de um objeto copiados. */
  itens: 100,
  /** Saídas do console guardadas. */
  saidas: 500,
  /** Passos de uma medição do gráfico de desempenho (mais que isso: "travaria"). */
  passosMedicao: 2_000_000,
  /** Tempo de uma medição, em milissegundos. */
  tempoMedicaoMs: 3_000,
  /** Leituras de lista guardadas por passo. */
  leiturasPorPasso: 8,
} as const;
