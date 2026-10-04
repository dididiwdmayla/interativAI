/*
 * Cenas programáveis (área "cena" de uma fase composta): o mundo real que o
 * código do aluno controla. Um quarto com uma lâmpada, a vitrine da padaria
 * com um sensor de presença, um portão... O aluno escreve `lampada.ligar()`
 * e vê a lâmpada acender.
 *
 * A cena é DADO: o cenário (peças do kit: paredes, piso, móveis), os
 * dispositivos (objetos que o código usa, com nomes de variável) e a linha
 * do tempo dos acontecimentos (uma pessoa chega no segundo 3 e sai no 8).
 * Criar uma cena nova é montar peças do kit, não desenhar do zero.
 *
 * Puro (sem React): o executor (o relógio simulado e os dispositivos no
 * reino do código), a tela (a animação), os validadores e as checagens usam
 * as mesmas funções. Ver o guia, seção 30.
 */
import { CATALOGO_DISPOSITIVOS, type TipoDispositivo } from "./catalogo";

/** Um valor de dispositivo: ligada, aberto, texto do letreiro, velocidade... */
export type ValorCena = boolean | number | string;

/** As peças do kit que montam o cenário (decoração: o código não mexe nelas). */
export const PECAS_CENARIO = [
  "parede",
  "piso",
  "janela",
  "porta",
  "cama",
  "mesa",
  "prateleira",
  "planta",
  "balcao",
  "quadro",
  "tapete",
  "toldo",
  "vitrine",
] as const;

export type TipoPeca = (typeof PECAS_CENARIO)[number];

/**
 * Uma peça do cenário, no sistema de coordenadas da cena (320 x 200, o
 * canto de cima à esquerda é 0, 0). `largura` e `altura` trocam o tamanho
 * padrão da peça; `variante` escolhe um jeito dela (ver o kit, no guia).
 */
export type PecaCenario = {
  peca: TipoPeca;
  x: number;
  y: number;
  largura?: number;
  altura?: number;
  variante?: string;
  /** Desenha espelhada (vira para o outro lado). */
  espelhar?: boolean;
};

/**
 * Um dispositivo: um objeto que o código do aluno usa. `id` é o nome da
 * variável no código (`lampada`, `luz`, `sensor`); `tipo` diz o que ele é
 * (a ficha, os comandos e o desenho vêm do tipo).
 */
export type DispositivoCena = {
  id: string;
  tipo: TipoDispositivo;
  /** Onde ele fica na cena (o ponto de referência do desenho do tipo). */
  x: number;
  y: number;
  /** Tamanho do desenho (padrão 1). */
  escala?: number;
  /** Um jeito do desenho, quando o tipo tem mais de um (lâmpada: "pendente", o padrão, ou "spot"). */
  variante?: string;
  /** O estado do começo, se não for o padrão do tipo (ex.: o letreiro já mostrando um texto). */
  inicial?: Record<string, ValorCena>;
};

/** O que acontece na cena sozinho, na linha do tempo (o código não controla). */
export type AcontecimentoCena =
  /**
   * Uma pessoa chega em `chegaMs` (os sensores de presença passam a ver
   * gente) e vai embora em `saiMs` (sem `saiMs`, fica até o fim). Ela
   * aparece andando um pouco antes de chegar, vinda do `lado`, e para em `x`
   * (`y` é a linha dos pés, padrão 186: o chão das cenas do kit).
   */
  | { tipo: "pessoa"; chegaMs: number; saiMs?: number; x?: number; y?: number; lado?: "esquerda" | "direita" }
  /** Alguém aperta o interruptor `dispositivo` em `noMs`: ele troca de posição. */
  | { tipo: "interruptor"; dispositivo: string; noMs: number };

/** Os ambientes das cenas: a regra de ritmo compara as cenas por eles. */
export type DadosCena = {
  /** Identificador da cena (kebab-case): "quarto-noite", "vitrine-padaria". */
  id: string;
  /** O nome que aparece no alto da cena. Até 40 caracteres. */
  titulo: string;
  /** O lugar (kebab-case): "quarto", "vitrine", "garagem"... Duas cenas no mesmo ambiente precisam de outro dispositivo ou outra missão. */
  ambiente: string;
  /** Noite: o ambiente fica escuro e a luz das lâmpadas clareia de verdade. */
  periodo: "dia" | "noite";
  /** Quanto tempo a cena dura (o loop de controle termina junto). De 2 a 60 segundos. */
  duracaoMs: number;
  cenario: PecaCenario[];
  dispositivos: DispositivoCena[];
  linhaDoTempo: AcontecimentoCena[];
};

/** Tamanho da cena (o viewBox do desenho). */
export const LARGURA_CENA = 320;
export const ALTURA_CENA = 200;

/** Limites da duração de uma cena. */
export const DURACAO_MINIMA_MS = 2_000;
export const DURACAO_MAXIMA_MS = 60_000;

/** Quanto tempo a pessoa leva andando para chegar (e para sair) da cena, só no desenho. */
export const CAMINHADA_MS = 900;

/**
 * Uma mudança de um dispositivo feita pelo código: o rastro da cena. `acao`
 * é o nome do que aconteceu ("ligar", "desligar", "abrir", "mostrar"...);
 * `execucao` é a execução que fez a mudança e `passo`, o passo do rastro da
 * execução DEPOIS da linha que fez a mudança (a linha do tempo mostra o
 * mundo antes da linha marcada rodar, como a memória). Null quando a
 * execução não gravou passos.
 */
export type MudancaCena = {
  tempoMs: number;
  dispositivo: string;
  propriedade: string;
  valor: ValorCena;
  acao: string;
  execucao: number;
  passo: number | null;
};

/** Os estados dos dispositivos: por id, cada propriedade. */
export type EstadoDispositivos = Record<string, Record<string, ValorCena>>;

/**
 * O rastro de uma simulação (desde o último Executar): tudo o que a tela, os
 * validadores e a meta precisam, sem olhar a fase. JSON puro (atravessa o
 * Web Worker).
 */
export type RastroCena = {
  cenaId: string;
  duracaoMs: number;
  linhaDoTempo: AcontecimentoCena[];
  dispositivos: { id: string; tipo: TipoDispositivo }[];
  /** O estado do começo dos dispositivos que o código controla. */
  inicial: EstadoDispositivos;
  mudancas: MudancaCena[];
  /** Mudanças demais (mais que MAXIMO_MUDANCAS): as seguintes não foram guardadas. */
  cortado: boolean;
  /** O relógio da cena agora. */
  relogioMs: number;
  /** A execução mais recente (o id das mudanças dela). */
  execucao: number;
  /** O relógio quando a execução mais recente começou (Executar recomeça do zero). */
  inicioUltimaMs: number;
  /** Quando o código da execução mais recente parou (null: ainda não rodou nada). */
  fimCodigoMs: number | null;
  /** A execução mais recente terminou porque o tempo da cena acabou (o loop parou junto). */
  terminouPorTempo: boolean;
  /** A execução mais recente chamou esperar(). */
  esperou: boolean;
};

/** Mudanças guardadas por simulação (um loop que pisca a cada 1 ms não lota a memória). */
export const MAXIMO_MUDANCAS = 2_000;

/** O estado do começo dos dispositivos: o padrão do tipo com o `inicial` da cena por cima. */
export function estadoInicialDaCena(dados: DadosCena): EstadoDispositivos {
  const estado: EstadoDispositivos = {};
  for (const dispositivo of dados.dispositivos) estado[dispositivo.id] = { ...CATALOGO_DISPOSITIVOS[dispositivo.tipo].inicial, ...(dispositivo.inicial ?? {}) };
  return estado;
}

/** A cena antes de qualquer código rodar: o rastro sem mudanças (a tela mostra o mundo andando sozinho). */
export function rastroInicial(dados: DadosCena): RastroCena {
  return {
    cenaId: dados.id,
    duracaoMs: dados.duracaoMs,
    linhaDoTempo: dados.linhaDoTempo,
    dispositivos: dados.dispositivos.map(({ id, tipo }) => ({ id, tipo })),
    inicial: estadoInicialDaCena(dados),
    mudancas: [],
    cortado: false,
    relogioMs: 0,
    execucao: 0,
    inicioUltimaMs: 0,
    fimCodigoMs: null,
    terminouPorTempo: false,
    esperou: false,
  };
}

/** Duas linhas do tempo iguais têm a mesma chave (o validador variosCenarios guarda os rastros por ela). */
export function chaveLinhaDoTempo(linha: readonly AcontecimentoCena[]): string {
  return JSON.stringify(linha);
}

/* ------------------------------------------------------------------ */
/* A linha do tempo: o que os sensores veem em cada instante.          */
/* ------------------------------------------------------------------ */

/**
 * Quantas pessoas estão na cena no instante. `antes`: logo antes do
 * instante (o que mudou exatamente nele ainda não conta).
 */
export function pessoasPresentes(linha: readonly AcontecimentoCena[], tempoMs: number, antes = false): number {
  let total = 0;
  for (const item of linha) {
    if (item.tipo !== "pessoa") continue;
    const sai = item.saiMs ?? Number.POSITIVE_INFINITY;
    const presente = antes ? item.chegaMs < tempoMs && tempoMs <= sai : item.chegaMs <= tempoMs && tempoMs < sai;
    if (presente) total += 1;
  }
  return total;
}

/** Quantas vezes o interruptor foi apertado até o instante (com `antes`, sem contar o que acontece nele). */
function apertosAte(linha: readonly AcontecimentoCena[], dispositivo: string, tempoMs: number, antes: boolean): number {
  return linha.filter((item) => item.tipo === "interruptor" && item.dispositivo === dispositivo && (antes ? item.noMs < tempoMs : item.noMs <= tempoMs)).length;
}

/** Os instantes em que a linha do tempo muda alguma coisa (chegadas, saídas, interruptores). */
export function instantesDaLinhaDoTempo(linha: readonly AcontecimentoCena[]): number[] {
  const instantes = linha.flatMap((item) => (item.tipo === "pessoa" ? [item.chegaMs, ...(item.saiMs !== undefined ? [item.saiMs] : [])] : [item.noMs]));
  return [...new Set(instantes)].sort((a, b) => a - b);
}

/* ------------------------------------------------------------------ */
/* O forno: a temperatura sobe ligado e desce desligado.               */
/* ------------------------------------------------------------------ */

/** O relógio da cena: cada hora do dia passa em `msPorHora` da simulação, a partir da hora do começo (o `inicial.hora`). */
export const RELOGIO = { msPorHora: 2_000 } as const;

/** A hora cheia no instante (de 0 a 23), começando em `inicio`. */
export function horaNoTempo(inicio: number, tempoMs: number): number {
  return (inicio + Math.floor(Math.max(0, tempoMs) / RELOGIO.msPorHora)) % 24;
}

/** A hora com a fração (7,5 = 7h30): só o desenho dos ponteiros. */
export function horaComFracao(inicio: number, tempoMs: number): number {
  return (inicio + Math.max(0, tempoMs) / RELOGIO.msPorHora) % 24;
}

export const FORNO = { ambiente: 25, maxima: 250, sobePorSegundo: 40, descePorSegundo: 15 } as const;

/**
 * A temperatura do forno no instante, pelo histórico de liga e desliga
 * (`trocas`: os instantes e o estado depois de cada um, em ordem).
 */
export function temperaturaDoForno(ligadoNoComeco: boolean, trocas: readonly { tempoMs: number; ligado: boolean }[], tempoMs: number): number {
  let temperatura: number = FORNO.ambiente;
  let ligado = ligadoNoComeco;
  let desde = 0;
  const avancar = (ate: number) => {
    const segundos = Math.max(0, ate - desde) / 1000;
    temperatura = ligado ? Math.min(FORNO.maxima, temperatura + FORNO.sobePorSegundo * segundos) : Math.max(FORNO.ambiente, temperatura - FORNO.descePorSegundo * segundos);
    desde = ate;
  };
  for (const troca of trocas) {
    if (troca.tempoMs > tempoMs) break;
    avancar(troca.tempoMs);
    ligado = troca.ligado;
  }
  avancar(tempoMs);
  return Math.round(temperatura);
}

/* ------------------------------------------------------------------ */
/* O estado de todos os dispositivos num instante.                     */
/* ------------------------------------------------------------------ */

/** Até onde as mudanças valem: as de execuções anteriores todas; as da execução, até o passo. */
export type FiltroPasso = { execucao: number; passo: number };

type OpcoesEstado = {
  /** Logo antes do instante: o que muda exatamente nele ainda não conta. */
  antes?: boolean;
  /** (Linha do tempo da execução) Só as mudanças até este passo. */
  filtro?: FiltroPasso | null;
};

export function mudancaVale(mudanca: MudancaCena, tempoMs: number, opcoes: OpcoesEstado): boolean {
  if (opcoes.antes ? mudanca.tempoMs >= tempoMs : mudanca.tempoMs > tempoMs) return false;
  const filtro = opcoes.filtro;
  if (!filtro || mudanca.execucao < filtro.execucao) return true;
  if (mudanca.execucao > filtro.execucao) return false;
  return mudanca.passo === null || mudanca.passo <= filtro.passo;
}

/**
 * O estado de cada dispositivo no instante: o do começo, as mudanças do
 * código até ali e o que os sensores veem na linha do tempo (gente, o
 * interruptor) e o que se calcula (a temperatura do forno).
 */
export function estadoNoTempo(rastro: RastroCena, tempoMs: number, opcoes: OpcoesEstado = {}): EstadoDispositivos {
  const estado: EstadoDispositivos = {};
  for (const { id } of rastro.dispositivos) estado[id] = { ...(rastro.inicial[id] ?? {}) };
  const trocasDoForno: Record<string, { tempoMs: number; ligado: boolean }[]> = {};
  for (const mudanca of rastro.mudancas) {
    if (!mudancaVale(mudanca, tempoMs, opcoes)) continue;
    const alvo = estado[mudanca.dispositivo];
    if (!alvo) continue;
    alvo[mudanca.propriedade] = mudanca.valor;
    if (mudanca.propriedade === "ligado") (trocasDoForno[mudanca.dispositivo] ??= []).push({ tempoMs: mudanca.tempoMs, ligado: mudanca.valor === true });
  }
  const antes = opcoes.antes ?? false;
  for (const { id, tipo } of rastro.dispositivos) {
    if (tipo === "sensor") estado[id].temGente = pessoasPresentes(rastro.linhaDoTempo, tempoMs, antes) > 0;
    if (tipo === "interruptor") estado[id].ligado = (rastro.inicial[id]?.ligado === true) !== (apertosAte(rastro.linhaDoTempo, id, tempoMs, antes) % 2 === 1);
    if (tipo === "relogio") {
      const instante = antes ? Math.max(0, tempoMs - 1e-6) : tempoMs;
      estado[id].hora = horaNoTempo(Number(rastro.inicial[id]?.hora ?? 6), instante);
    }
    if (tipo === "forno") {
      const trocas = trocasDoForno[id] ?? [];
      const instante = antes ? Math.max(0, tempoMs - 1e-6) : tempoMs;
      estado[id].temperatura = temperaturaDoForno(rastro.inicial[id]?.ligado === true, trocas, instante);
    }
  }
  return estado;
}

/** O valor de uma propriedade de um dispositivo no instante (undefined: não existe). */
export function valorNoTempo(rastro: RastroCena, dispositivo: string, propriedade: string, tempoMs: number, opcoes: OpcoesEstado = {}): ValorCena | undefined {
  return estadoNoTempo(rastro, tempoMs, opcoes)[dispositivo]?.[propriedade];
}

/**
 * Até onde a cena toca sozinha depois de uma execução: o Snippet mostra a
 * cena inteira (o relógio vai até o fim); o Console, o pedaço que ele andou.
 */
export function fimDaAnimacao(rastro: RastroCena): number {
  return Math.max(rastro.inicioUltimaMs, rastro.relogioMs);
}

/** Um valor de cena como texto (detalhe dos validadores e da ficha). */
export function textoDoValorCena(valor: ValorCena | undefined): string {
  if (valor === undefined) return "nada";
  return typeof valor === "string" ? `"${valor}"` : String(valor);
}

/** "2,5 s": um instante da cena em segundos, como o relógio da tela mostra. */
export function textoDoTempo(tempoMs: number): string {
  const segundos = Math.round(tempoMs / 100) / 10;
  return `${segundos.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s`;
}

/* ------------------------------------------------------------------ */
/* Onde a pessoa está no desenho (só a tela).                          */
/* ------------------------------------------------------------------ */

export type PessoaNaCena = { indice: number; x: number; y: number; andando: boolean; olhando: "esquerda" | "direita"; presente: boolean };

/** A linha dos pés das pessoas, quando a cena não diz outra. */
export const CHAO_PADRAO = 186;

/** As pessoas visíveis no instante: andando para chegar, paradas (presentes) ou indo embora. */
export function pessoasNoDesenho(linha: readonly AcontecimentoCena[], tempoMs: number, duracaoMs: number): PessoaNaCena[] {
  const pessoas: PessoaNaCena[] = [];
  linha.forEach((item, indice) => {
    if (item.tipo !== "pessoa") return;
    const lado = item.lado ?? "esquerda";
    const parada = item.x ?? LARGURA_CENA / 2;
    const fora = lado === "esquerda" ? -24 : LARGURA_CENA + 24;
    const sai = item.saiMs ?? duracaoMs + CAMINHADA_MS * 2;
    const entra = item.chegaMs - CAMINHADA_MS;
    if (tempoMs < entra || tempoMs > sai + CAMINHADA_MS) return;
    const indo = lado === "esquerda" ? "direita" : "esquerda";
    const y = item.y ?? CHAO_PADRAO;
    if (tempoMs < item.chegaMs) {
      const p = (tempoMs - entra) / CAMINHADA_MS;
      pessoas.push({ indice, x: fora + (parada - fora) * p, y, andando: true, olhando: indo, presente: false });
    } else if (tempoMs < sai) {
      pessoas.push({ indice, x: parada, y, andando: false, olhando: indo, presente: true });
    } else {
      // Vai embora pelo lado de onde veio.
      const p = (tempoMs - sai) / CAMINHADA_MS;
      pessoas.push({ indice, x: parada + (fora - parada) * p, y, andando: true, olhando: lado, presente: false });
    }
  });
  return pessoas;
}
