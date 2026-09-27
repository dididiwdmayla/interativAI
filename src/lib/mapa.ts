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
 *   A rota é a da trilha escolhida (src/curriculo/trilhas.ts): a mesma ilha
 *   pode vir depois de outra em cada trilha. O progresso é da ilha, então o
 *   que foi concluído numa trilha vale nas outras.
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
import { CURRICULO, ilhasDaTrilha, localNoCurriculo, type Trilha, trilhaDoId, trilhasDaIlha } from "@/curriculo";
import type { IlhaCurriculo, UnidadeCurriculo, ZonaCurriculo } from "@/curriculo/tipos";
import type { Progresso } from "./progresso";

export type EstadoIlha = "disponivel" | "construcao" | "bloqueada";
export type EstadoUnidadeMapa = "concluida" | "disponivel" | "bloqueada" | "planejada";

/** O que o mapa consulta. Os padrões são o jogo de verdade; os testes trocam. */
export type FonteMapa = {
  progresso: Progresso;
  unidades?: readonly Unidade[];
  /** Currículo de teste: a rota passa a ser a ordem dele (sem trilha). */
  curriculo?: readonly IlhaCurriculo[];
  /** Padrão: a trilha escolhida no progresso. */
  trilha?: Trilha;
};

/** A trilha que vale para a fonte: a dada, senão a escolhida no progresso. */
export function trilhaDaFonte(fonte: FonteMapa): Trilha {
  return fonte.trilha ?? trilhaDoId(fonte.progresso.trilha);
}

/**
 * A rota (sem a opcional e sem a sempre aberta) em que a ilha é contada: a
 * da trilha escolhida, se a ilha está nela; senão, a da primeira trilha
 * que passa por ela (alguém abriu o endereço de uma ilha de outra trilha).
 */
function rotaDaIlha(ilha: IlhaCurriculo, fonte: FonteMapa): IlhaCurriculo[] {
  if (fonte.curriculo) return fonte.curriculo.filter((item) => !item.opcional && !item.sempreAberta);
  const escolhida = trilhaDaFonte(fonte);
  const trilha = escolhida.ilhas.includes(ilha.id) ? escolhida : (trilhasDaIlha(ilha.id)[0] ?? escolhida);
  return ilhasDaTrilha(trilha).filter((item) => !item.opcional && !item.sempreAberta);
}

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

/**
 * Alguma unidade da lista já foi começada ou concluída: sinal de que o
 * jogador já esteve ali. Usado para o desbloqueio PERMANENTE (ver
 * `zonaComProgresso` e `ilhaComProgresso`): uma unidade nova, registrada
 * numa zona (ou ilha) anterior depois que o jogador já passou por uma zona
 * (ou ilha) seguinte, não pode trancar de novo o que ele já abriu.
 */
function algumaComProgresso(lista: readonly UnidadeCurriculo[], unidades: readonly Unidade[], progresso: Progresso): boolean {
  return lista.some((item) => {
    const conteudo = conteudoDe(item.id, unidades);
    return conteudo !== undefined && (unidadeComecada(conteudo, progresso) || unidadeConcluida(conteudo, progresso));
  });
}

/** A zona já foi aberta alguma vez (alguma unidade dela tem progresso): fica aberta para sempre. */
function zonaComProgresso(zona: ZonaCurriculo, unidades: readonly Unidade[], progresso: Progresso): boolean {
  return algumaComProgresso(zona.unidades, unidades, progresso);
}

/** A ilha já foi aberta alguma vez (alguma unidade de alguma zona tem progresso): fica aberta para sempre. */
function ilhaComProgresso(ilha: IlhaCurriculo, unidades: readonly Unidade[], progresso: Progresso): boolean {
  return ilha.zonas.some((zona) => zonaComProgresso(zona, unidades, progresso));
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
  if (ilha.sempreAberta || fonte.progresso.mapaDesbloqueado) return true;
  // Desbloqueio permanente: já esteve aqui, continua aberta (uma unidade nova
  // registrada numa ilha anterior não tranca de novo o que já foi aberto).
  if (ilhaComProgresso(ilha, fonte.unidades ?? UNIDADES, fonte.progresso)) return true;
  const anterior = ilhaAnterior(ilha, fonte);
  if (!anterior) return true;
  return ilhaAberta(anterior, fonte) && ilhaCompleta(anterior, fonte);
}

export function estadoDaIlha(ilha: IlhaCurriculo, fonte: FonteMapa): EstadoIlha {
  if (!temPronta(ilha, fonte.unidades ?? UNIDADES)) return "construcao";
  return ilhaAberta(ilha, fonte) ? "disponivel" : "bloqueada";
}

/**
 * A ilha anterior na rota da trilha (para a regra de desbloqueio e a dica
 * "Termine a ilha X"). A opcional (fora da rota) segue a última da rota.
 */
export function ilhaAnterior(ilha: IlhaCurriculo, fonte: FonteMapa): IlhaCurriculo | null {
  const rota = rotaDaIlha(ilha, fonte);
  const indice = rota.findIndex((item) => item.id === ilha.id);
  if (indice === 0) return null;
  const anterior = indice > 0 ? rota[indice - 1] : (rota[rota.length - 1] ?? null);
  return anterior && anterior.id !== ilha.id ? anterior : null;
}

/** A zona está aberta: a ilha não está bloqueada e as zonas antes dela têm tudo pronto concluído. */
export function zonaAberta(ilha: IlhaCurriculo, zona: ZonaCurriculo, fonte: FonteMapa): boolean {
  if (fonte.progresso.mapaDesbloqueado) return true;
  const unidades = fonte.unidades ?? UNIDADES;
  // Desbloqueio permanente: já esteve nesta zona, continua aberta, mesmo que
  // uma unidade nova numa zona anterior (ou a ilha) mude o que falta.
  if (zonaComProgresso(zona, unidades, fonte.progresso)) return true;
  if (estadoDaIlha(ilha, fonte) === "bloqueada") return false;
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

/** A ilha onde o jogador está: a da última fase aberta (se for da trilha), ou a primeira da rota da trilha. */
export function ilhaAtual(fonte: FonteMapa): IlhaCurriculo {
  const curriculo = fonte.curriculo ?? CURRICULO;
  const unidades = fonte.unidades ?? UNIDADES;
  const faseAtual = fonte.progresso.faseAtual;
  const unidade = faseAtual ? unidadeDaFase(faseAtual, unidades) : undefined;
  const local = unidade ? localNoCurriculo(unidade.id, curriculo) : undefined;
  if (fonte.curriculo) return local?.ilha ?? curriculo.find((ilha) => ilha.id === "sites") ?? curriculo[0];
  const ilhas = ilhasDaTrilha(trilhaDaFonte(fonte));
  if (local && ilhas.some((ilha) => ilha.id === local.ilha.id)) return local.ilha;
  return ilhas.find((ilha) => !ilha.sempreAberta && !ilha.opcional) ?? ilhas[0] ?? curriculo[0];
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

export type ProgressoDeUnidades = {
  /** Unidades concluídas (todas as fases). */
  concluidas: number;
  /** Unidades com conteúdo. */
  prontas: number;
  /** Todas, contando as planejadas: o percurso inteiro. */
  total: number;
};

/** Quantas das unidades do currículo (prontas e planejadas) já foram concluídas. */
export function progressoDeUnidades(
  itens: readonly UnidadeCurriculo[],
  progresso: Progresso,
  unidades: readonly Unidade[] = UNIDADES,
): ProgressoDeUnidades {
  let concluidas = 0;
  let prontas = 0;
  for (const item of itens) {
    const conteudo = conteudoDe(item.id, unidades);
    if (!conteudo) continue;
    prontas++;
    if (unidadeConcluida(conteudo, progresso)) concluidas++;
  }
  return { concluidas, prontas, total: itens.length };
}

/** As unidades de uma trilha, na ordem do mapa (as ilhas futuras não têm nenhuma ainda). */
export function unidadesDaTrilha(trilha: Trilha): UnidadeCurriculo[] {
  return ilhasDaTrilha(trilha).flatMap((ilha) => ilha.zonas.flatMap((zona) => zona.unidades));
}
