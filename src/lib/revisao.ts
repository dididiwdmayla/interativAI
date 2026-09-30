/*
 * Revisão do dia: o agendador (revisão espaçada simples, por conceito).
 *
 * - Intervalos: 1, 3, 7, 21 e 60 dias (`INTERVALOS`). O nível de um
 *   conceito é a posição do intervalo atual.
 * - Um conceito entra na fila 1 dia depois de concluir a fase que o ensina
 *   (nível 0). Se a fase precisou de solução (degrau 4) ou de "Rever" no
 *   desafio, e o conceito já estava na fila, ele volta para o dia seguinte
 *   com o intervalo reiniciado. A ajuda de cada fase é aproximada pelas
 *   estrelas (só a solução e o Rever tiram estrela).
 * - Na revisão: acertou sem ajuda sobe um intervalo; acertou com ajuda
 *   (pergunta ou dica) mantém; errou ou desistiu volta para 1 dia.
 * - Treino livre (conceitos já aprendidos, sem nada vencido) tem efeito
 *   menor: acertar não muda nada; errar ou desistir só traz a próxima
 *   revisão para amanhã, sem baixar o nível.
 * - Dias pelo calendário local do aparelho ("AAAA-MM-DD"), nunca por
 *   horas corridas: revisar às 23h e às 8h do dia seguinte são dias
 *   diferentes.
 *
 * Tudo aqui é função pura sobre o progresso e um "hoje" dado (os testes
 * usam relógio falso). Quem chama pega o dia com `diaLocal()`.
 */
import { FASES, UNIDADES } from "@/conteudo";
import type { IdConceito } from "@/conteudo/conceitos";
import { ITENS_REVISAO } from "@/conteudo/revisao";
import type { Fase, ItemRevisao } from "@/conteudo/tipos";
import { localNoCurriculo } from "@/curriculo";
import {
  diasEntre,
  type EstadoConceitoRevisao,
  type EstadoRevisao,
  INTERVALOS,
  type ResultadoItem,
  somarDias,
} from "./estadoRevisao";

export * from "./estadoRevisao";

/** Máximo de itens numa sessão. */
export const ITENS_POR_SESSAO = 5;


/* ------------------------------------------------------------------ */
/* Entrar na fila                                                     */
/* ------------------------------------------------------------------ */

/** Os conceitos que uma fase ensina: os da fase (prática) e os declarados nos objetivos. */
export function conceitosEnsinadosPor(fase: Fase): IdConceito[] {
  if (fase.tipo !== "pratica") return [];
  return [...new Set([...fase.conceitos, ...fase.objetivos.flatMap((objetivo) => objetivo.conceitos ?? [])])];
}

/**
 * Os conceitos que uma fase põe na fila: os que ela ensina e, num desafio,
 * os que ele pratica (a ajuda do desafio é o Rever).
 */
function conceitosDaFase(fase: Fase): IdConceito[] {
  return fase.tipo === "pratica" ? conceitosEnsinadosPor(fase) : fase.tipo === "desafio" ? [...fase.conceitos] : [];
}

function novoConceito(hoje: string): EstadoConceitoRevisao {
  return { nivel: 0, proxima: somarDias(hoje, 1), vezes: 0, ultima: null };
}

/**
 * A fase foi concluída hoje: os conceitos dela entram na fila (amanhã,
 * nível 0). Com ajuda pesada (solução ou Rever), os que já estavam na fila
 * reiniciam para amanhã também.
 */
export function registrarFaseConcluida(estado: EstadoRevisao, fase: Fase, precisouDeAjuda: boolean, hoje: string): EstadoRevisao {
  const conceitos = { ...estado.conceitos };
  let mudou = false;
  for (const id of conceitosDaFase(fase)) {
    const atual = conceitos[id];
    if (!atual) {
      // Desafio só reinicia o que a prática já pôs na fila; não inventa conceito novo.
      if (fase.tipo !== "pratica") continue;
      conceitos[id] = novoConceito(hoje);
      mudou = true;
    } else if (precisouDeAjuda) {
      conceitos[id] = { ...atual, nivel: 0, proxima: somarDias(hoje, 1) };
      mudou = true;
    }
  }
  return mudou ? { ...estado, conceitos } : estado;
}

/**
 * Progresso antigo (de antes da revisão existir) ou fase concluída fora do
 * caminho normal: todo conceito ensinado por uma fase concluída e que
 * ainda não está na fila entra para amanhã. Nada que já está na fila muda.
 */
export function sincronizarRevisao(
  estado: EstadoRevisao,
  fasesConcluidas: readonly string[],
  hoje: string,
  fases: readonly Fase[] = FASES,
): EstadoRevisao {
  const conceitos = { ...estado.conceitos };
  let mudou = false;
  for (const fase of fases) {
    if (!fasesConcluidas.includes(fase.id)) continue;
    for (const id of conceitosEnsinadosPor(fase)) {
      if (conceitos[id]) continue;
      conceitos[id] = novoConceito(hoje);
      mudou = true;
    }
  }
  return mudou ? { ...estado, conceitos } : estado;
}

/* ------------------------------------------------------------------ */
/* Depois de revisar                                                  */
/* ------------------------------------------------------------------ */

/** O intervalo do nível (dias). */
export function intervaloDo(nivel: number): number {
  return INTERVALOS[Math.min(INTERVALOS.length - 1, Math.max(0, nivel))];
}

/** Aplica o resultado de um item ao conceito. `treino`: efeito menor (ver o topo do arquivo). */
export function aplicarResultado(
  estado: EstadoRevisao,
  conceito: string,
  resultado: ResultadoItem,
  hoje: string,
  treino = false,
): EstadoRevisao {
  const atual = estado.conceitos[conceito] ?? novoConceito(hoje);
  const vezes = atual.vezes + 1;
  let novo: EstadoConceitoRevisao;
  if (treino) {
    const amanha = somarDias(hoje, 1);
    const proxima = resultado === "errou" && diasEntre(amanha, atual.proxima) > 0 ? amanha : atual.proxima;
    novo = { ...atual, proxima, vezes, ultima: hoje };
  } else if (resultado === "sem-ajuda") {
    const nivel = Math.min(INTERVALOS.length - 1, atual.nivel + 1);
    novo = { nivel, proxima: somarDias(hoje, intervaloDo(nivel)), vezes, ultima: hoje };
  } else if (resultado === "com-ajuda") {
    novo = { ...atual, proxima: somarDias(hoje, intervaloDo(atual.nivel)), vezes, ultima: hoje };
  } else {
    novo = { nivel: 0, proxima: somarDias(hoje, 1), vezes, ultima: hoje };
  }
  return { ...estado, conceitos: { ...estado.conceitos, [conceito]: novo } };
}

/**
 * Fim de uma sessão: a sequência de dias. Mesmo dia não conta de novo;
 * ontem continua; mais longe recomeça em 1 (sem culpa: a tela só mostra o
 * número novo).
 */
export function registrarSessao(estado: EstadoRevisao, hoje: string): EstadoRevisao {
  const { sequencia } = estado;
  if (sequencia.ultimoDia === hoje) return estado;
  const seguida = sequencia.ultimoDia !== null && diasEntre(sequencia.ultimoDia, hoje) === 1;
  const atual = seguida ? sequencia.atual + 1 : 1;
  return { ...estado, sequencia: { atual, melhor: Math.max(sequencia.melhor, atual), ultimoDia: hoje } };
}

/** A sequência que vale hoje: quebrada (mais de 1 dia sem sessão) vale 0. */
export function sequenciaDeHoje(estado: EstadoRevisao, hoje: string): number {
  const { ultimoDia, atual } = estado.sequencia;
  if (ultimoDia === null) return 0;
  return diasEntre(ultimoDia, hoje) <= 1 ? atual : 0;
}

/* ------------------------------------------------------------------ */
/* A fila de hoje                                                     */
/* ------------------------------------------------------------------ */

export type ItemDaSessao = {
  conceito: IdConceito;
  item: ItemRevisao;
  /** Dias de atraso (0 = vence hoje). */
  atraso: number;
  /** A ilha onde o conceito foi ensinado (para misturar ilhas). */
  ilha: string;
  /** A fase que ensina o conceito ("Rever onde aprendi"). */
  faseQueEnsina: string | null;
};

export type FonteRevisao = {
  itens?: readonly ItemRevisao[];
  fases?: readonly Fase[];
};

/** A primeira fase (na ordem do jogo) que ensina o conceito. */
export function faseQueEnsina(conceito: string, fases: readonly Fase[] = FASES): Fase | undefined {
  return fases.find((fase) => conceitosEnsinadosPor(fase).includes(conceito as IdConceito));
}

function ilhaDaFase(fase: Fase | undefined): string {
  if (!fase) return "";
  const unidade = UNIDADES.find((item) => item.id === fase.unidadeId);
  return (unidade && localNoCurriculo(unidade.id)?.ilha.id) ?? fase.unidadeId.split("-")[0] ?? "";
}

/** A variação da vez: roda entre os itens do conceito a cada revisão. */
export function itemDaVez(conceito: string, vezes: number, itens: readonly ItemRevisao[]): ItemRevisao | undefined {
  const doConceito = itens.filter((item) => item.conceito === conceito);
  return doConceito.length === 0 ? undefined : doConceito[vezes % doConceito.length];
}

function montarItem(conceito: string, estadoConceito: EstadoConceitoRevisao, hoje: string, fonte: FonteRevisao): ItemDaSessao | null {
  const itens = fonte.itens ?? ITENS_REVISAO;
  const item = itemDaVez(conceito, estadoConceito.vezes, itens);
  if (!item) return null;
  const fase = faseQueEnsina(conceito, fonte.fases ?? FASES);
  return {
    conceito: item.conceito,
    item,
    atraso: Math.max(0, diasEntre(estadoConceito.proxima, hoje)),
    ilha: ilhaDaFase(fase),
    faseQueEnsina: fase?.id ?? null,
  };
}

/**
 * Mistura as ilhas sem desrespeitar o atraso: vai sempre no mais atrasado
 * e, no empate, prefere uma ilha diferente da do item anterior.
 */
function misturarIlhas(lista: ItemDaSessao[]): ItemDaSessao[] {
  const restantes = [...lista];
  const saida: ItemDaSessao[] = [];
  while (restantes.length > 0) {
    const maior = Math.max(...restantes.map((item) => item.atraso));
    const empatados = restantes.filter((item) => item.atraso === maior);
    const anterior = saida[saida.length - 1]?.ilha;
    const escolhido = empatados.find((item) => item.ilha !== anterior) ?? empatados[0];
    saida.push(escolhido);
    restantes.splice(restantes.indexOf(escolhido), 1);
  }
  return saida;
}

/** Os conceitos vencidos hoje que têm item (os que a sessão pode mostrar), dos mais atrasados. */
export function vencidosHoje(estado: EstadoRevisao, hoje: string, fonte: FonteRevisao = {}): ItemDaSessao[] {
  const lista = Object.entries(estado.conceitos)
    .filter(([, atual]) => diasEntre(atual.proxima, hoje) >= 0)
    .map(([conceito, atual]) => montarItem(conceito, atual, hoje, fonte))
    .filter((item): item is ItemDaSessao => item !== null);
  return misturarIlhas(lista);
}

/** A sessão de hoje: até 5 itens vencidos, os mais atrasados primeiro, misturando ilhas. */
export function sessaoDeHoje(estado: EstadoRevisao, hoje: string, fonte: FonteRevisao = {}): ItemDaSessao[] {
  return vencidosHoje(estado, hoje, fonte).slice(0, ITENS_POR_SESSAO);
}

/**
 * Treino livre: conceitos já aprendidos (na fila e com item), os revisados
 * há mais tempo primeiro. Não mexe no nível (ver `aplicarResultado`).
 */
export function treinoLivre(estado: EstadoRevisao, hoje: string, fonte: FonteRevisao = {}): ItemDaSessao[] {
  const lista = Object.entries(estado.conceitos)
    .map(([conceito, atual]) => ({ atual, item: montarItem(conceito, atual, hoje, fonte) }))
    .filter((par): par is { atual: EstadoConceitoRevisao; item: ItemDaSessao } => par.item !== null)
    .sort((a, b) => (a.atual.ultima ?? "") .localeCompare(b.atual.ultima ?? ""))
    .map((par) => ({ ...par.item, atraso: 0 }));
  return misturarIlhas(lista).slice(0, ITENS_POR_SESSAO);
}

/** Algum conceito já aprendido com item de revisão: o Porto aparece no mapa. */
export function temConceitoAprendido(estado: EstadoRevisao, fonte: FonteRevisao = {}): boolean {
  const itens = fonte.itens ?? ITENS_REVISAO;
  return Object.keys(estado.conceitos).some((conceito) => itens.some((item) => item.conceito === conceito));
}

/** Quando o conceito volta, em palavras ("amanhã", "em 3 dias"). */
export function quandoVolta(estadoConceito: EstadoConceitoRevisao, hoje: string): string {
  const dias = diasEntre(hoje, estadoConceito.proxima);
  if (dias <= 0) return "hoje";
  if (dias === 1) return "amanhã";
  return `em ${dias} dias`;
}

