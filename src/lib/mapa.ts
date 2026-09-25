/*
 * Regras do mapa das ilhas: o que está aberto, concluído, em construção ou
 * bloqueado. Tudo sai do currículo (src/curriculo), do conteúdo registrado
 * (src/conteudo) e do progresso; nada disso é guardado à mão.
 *
 * Ilhas:
 * - sem nenhuma unidade pronta: "construcao" (não importa o resto);
 * - Origens (sempreAberta) e Sites: abertas;
 * - cada ilha seguinte da rota abre quando a anterior está aberta e tem
 *   todas as unidades prontas concluídas; a opcional segue a última da rota.
 *
 * Unidades, dentro da ilha:
 * - sem conteúdo: "planejada";
 * - todas as fases concluídas: "concluida";
 * - a zona abre quando a anterior tem todas as unidades prontas concluídas,
 *   e dentro da zona as unidades prontas vão em sequência.
 *
 * O /lab/mapa liga `mapaDesbloqueado`, que abre tudo o que tem conteúdo.
 */
import { UNIDADES } from "@/conteudo";
import type { Unidade } from "@/conteudo/tipos";
import { CURRICULO, localNoCurriculo } from "@/curriculo";
import type { IlhaCurriculo, UnidadeCurriculo, ZonaCurriculo } from "@/curriculo/tipos";
import type { Progresso } from "./progresso";

export type EstadoIlha = "disponivel" | "construcao" | "bloqueada";
export type EstadoUnidadeMapa = "concluida" | "disponivel" | "bloqueada" | "planejada";

/** O que o mapa consulta. Os padrões são o jogo de verdade; os testes trocam. */
export type FonteMapa = {
  progresso: Progresso;
  unidades?: readonly Unidade[];
  curriculo?: readonly IlhaCurriculo[];
};

function conteudoDe(id: string, unidades: readonly Unidade[]): Unidade | undefined {
  return unidades.find((unidade) => unidade.id === id);
}

/** Todas as fases da unidade concluídas. */
export function unidadeConcluida(unidade: Unidade, progresso: Progresso): boolean {
  return unidade.fases.every((id) => progresso.fasesConcluidas.includes(id));
}

/** Alguma fase da unidade concluída ou começada (introdução vista). */
export function unidadeComecada(unidade: Unidade, progresso: Progresso): boolean {
  return unidade.fases.some(
    (id) => progresso.fasesConcluidas.includes(id) || (progresso.fasesEmAndamento[id]?.introducaoVista ?? false),
  );
}

/** Todas as unidades prontas da lista concluídas (vale também sem nenhuma pronta). */
function prontasConcluidas(lista: readonly UnidadeCurriculo[], unidades: readonly Unidade[], progresso: Progresso): boolean {
  return lista.every((item) => {
    const conteudo = conteudoDe(item.id, unidades);
    return !conteudo || unidadeConcluida(conteudo, progresso);
  });
}

function temPronta(ilha: IlhaCurriculo, unidades: readonly Unidade[]): boolean {
  return ilha.zonas.some((zona) => zona.unidades.some((item) => conteudoDe(item.id, unidades) !== undefined));
}

/** A ilha tem todas as unidades prontas concluídas. */
export function ilhaCompleta(ilha: IlhaCurriculo, fonte: FonteMapa): boolean {
  const unidades = fonte.unidades ?? UNIDADES;
  return prontasConcluidas(
    ilha.zonas.flatMap((zona) => zona.unidades),
    unidades,
    fonte.progresso,
  );
}

/** A ilha está aberta pela regra de desbloqueio (sem olhar se tem conteúdo). */
function ilhaAberta(ilha: IlhaCurriculo, fonte: FonteMapa): boolean {
  const curriculo = fonte.curriculo ?? CURRICULO;
  if (ilha.sempreAberta || fonte.progresso.mapaDesbloqueado) return true;
  const rota = curriculo.filter((item) => !item.opcional && !item.sempreAberta);
  const indice = rota.findIndex((item) => item.id === ilha.id);
  if (indice === 0) return true;
  // A opcional (fora da rota) segue a última ilha da rota.
  const anterior = indice > 0 ? rota[indice - 1] : rota[rota.length - 1];
  if (!anterior || anterior.id === ilha.id) return true;
  return ilhaAberta(anterior, fonte) && ilhaCompleta(anterior, fonte);
}

export function estadoDaIlha(ilha: IlhaCurriculo, fonte: FonteMapa): EstadoIlha {
  if (!temPronta(ilha, fonte.unidades ?? UNIDADES)) return "construcao";
  return ilhaAberta(ilha, fonte) ? "disponivel" : "bloqueada";
}

/** A ilha anterior na rota (para a dica "Termine a ilha X"). */
export function ilhaAnterior(ilha: IlhaCurriculo, curriculo: readonly IlhaCurriculo[] = CURRICULO): IlhaCurriculo | null {
  const rota = curriculo.filter((item) => !item.opcional && !item.sempreAberta);
  const indice = rota.findIndex((item) => item.id === ilha.id);
  if (indice === 0) return null;
  return indice > 0 ? rota[indice - 1] : (rota[rota.length - 1] ?? null);
}

/** A zona está aberta: a ilha não está bloqueada e as zonas antes dela têm tudo pronto concluído. */
export function zonaAberta(ilha: IlhaCurriculo, zona: ZonaCurriculo, fonte: FonteMapa): boolean {
  if (estadoDaIlha(ilha, fonte) === "bloqueada") return false;
  if (fonte.progresso.mapaDesbloqueado) return true;
  const unidades = fonte.unidades ?? UNIDADES;
  const indice = ilha.zonas.findIndex((item) => item.id === zona.id);
  return ilha.zonas.slice(0, Math.max(0, indice)).every((anterior) => prontasConcluidas(anterior.unidades, unidades, fonte.progresso));
}

/** Estado de um ponto (unidade) na ilha. */
export function estadoDaUnidade(
  ilha: IlhaCurriculo,
  zona: ZonaCurriculo,
  item: UnidadeCurriculo,
  fonte: FonteMapa,
): EstadoUnidadeMapa {
  const unidades = fonte.unidades ?? UNIDADES;
  const conteudo = conteudoDe(item.id, unidades);
  if (!conteudo) return "planejada";
  if (unidadeConcluida(conteudo, fonte.progresso)) return "concluida";
  if (!zonaAberta(ilha, zona, fonte)) return "bloqueada";
  if (fonte.progresso.mapaDesbloqueado) return "disponivel";
  const anteriores = zona.unidades.slice(0, zona.unidades.findIndex((candidato) => candidato.id === item.id));
  return prontasConcluidas(anteriores, unidades, fonte.progresso) ? "disponivel" : "bloqueada";
}

export type AcaoUnidade = { rotulo: "Jogar" | "Continuar" | "Jogar de novo"; faseId: string };

/**
 * O botão do card da unidade: abre a próxima fase não concluída. Tudo
 * concluído: "Jogar de novo", do começo.
 */
export function acaoDaUnidade(unidade: Unidade, progresso: Progresso): AcaoUnidade {
  const proxima = unidade.fases.find((id) => !progresso.fasesConcluidas.includes(id));
  if (!proxima) return { rotulo: "Jogar de novo", faseId: unidade.fases[0] };
  return { rotulo: unidadeComecada(unidade, progresso) ? "Continuar" : "Jogar", faseId: proxima };
}

/** Estrelas da unidade: a média das fases concluídas (0 a 3). */
export function estrelasDaUnidade(unidade: Unidade, progresso: Progresso): number {
  const notas = unidade.fases.map((id) => progresso.estrelasPorFase[id] ?? 0);
  return notas.length === 0 ? 0 : Math.round(notas.reduce((soma, nota) => soma + nota, 0) / notas.length);
}

/** Total de estrelas do jogo (barra do mapa). */
export function totalDeEstrelas(progresso: Progresso): number {
  return Object.values(progresso.estrelasPorFase).reduce((soma, nota) => soma + nota, 0);
}

/** A unidade de conteúdo de uma fase, se houver. */
function unidadeDaFase(faseId: string, unidades: readonly Unidade[]): Unidade | undefined {
  return unidades.find((unidade) => unidade.fases.includes(faseId));
}

/** A ilha onde o jogador está: a da última fase aberta, ou Sites. */
export function ilhaAtual(fonte: FonteMapa): IlhaCurriculo {
  const curriculo = fonte.curriculo ?? CURRICULO;
  const unidades = fonte.unidades ?? UNIDADES;
  const faseAtual = fonte.progresso.faseAtual;
  const unidade = faseAtual ? unidadeDaFase(faseAtual, unidades) : undefined;
  const local = unidade ? localNoCurriculo(unidade.id, curriculo) : undefined;
  return local?.ilha ?? curriculo.find((ilha) => ilha.id === "sites") ?? curriculo[0];
}

/**
 * O ponto da ilha onde o computadorzinho fica: a unidade da última fase
 * aberta, se for desta ilha; senão, a primeira disponível; senão, a última
 * concluída; senão, a primeira.
 */
export function pontoAtual(ilha: IlhaCurriculo, fonte: FonteMapa): UnidadeCurriculo {
  const unidades = fonte.unidades ?? UNIDADES;
  const todos = ilha.zonas.flatMap((zona) => zona.unidades.map((item) => ({ zona, item })));
  const faseAtual = fonte.progresso.faseAtual;
  const daFase = faseAtual ? unidadeDaFase(faseAtual, unidades) : undefined;
  const atual = daFase ? todos.find(({ item }) => item.id === daFase.id) : undefined;
  if (atual) {
    const estado = estadoDaUnidade(ilha, atual.zona, atual.item, fonte);
    // Acabou a unidade: o computadorzinho segue para a próxima aberta, se houver.
    if (estado !== "concluida") return atual.item;
  }
  const disponivel = todos.find(({ zona, item }) => estadoDaUnidade(ilha, zona, item, fonte) === "disponivel");
  if (disponivel) return disponivel.item;
  const concluidas = todos.filter(({ zona, item }) => estadoDaUnidade(ilha, zona, item, fonte) === "concluida");
  return (concluidas[concluidas.length - 1] ?? todos[0]).item;
}
