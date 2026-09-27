/*
 * Lentes sobre o mapa: escolher um tema acende, em todas as ilhas da
 * trilha, as unidades daquele tema (prontas e planejadas) e apaga as
 * outras; escolher uma profissão acende as unidades dos temas dela. A
 * lente fica salva no progresso (`lente`) e vale no mundo e dentro das
 * ilhas.
 */
import { type Profissao, profissaoDoId } from "@/curriculo/profissoes";
import { ehIdTema, type IdTema, temaDoId } from "@/curriculo/temas";
import type { Trilha } from "@/curriculo/trilhas";
import type { UnidadeCurriculo } from "@/curriculo/tipos";
import type { ProgressoDeUnidades } from "./mapa";
import { progressoDeUnidades } from "./mapa";
import type { LenteMapa, Progresso } from "./progresso";
import { temasDaUnidade, unidadesDosTemas } from "./temas";

export type LenteResolvida = {
  lente: LenteMapa;
  /** "Segurança". */
  nome: string;
  /** Os temas que a lente acende. */
  temas: IdTema[];
  /** Lente de profissão: a profissão (o progresso é a média ponderada dos temas). */
  profissao?: Profissao;
};

/** O que uma lente salva acende; lente de id desconhecido é como nenhuma. */
export function resolverLente(lente: LenteMapa | null): LenteResolvida | null {
  if (!lente) return null;
  if (lente.tipo === "tema" && ehIdTema(lente.id)) return { lente, nome: temaDoId(lente.id).nome, temas: [lente.id] };
  const profissao = lente.tipo === "profissao" ? profissaoDoId(lente.id) : undefined;
  if (profissao) return { lente, nome: profissao.nome, temas: profissao.temas.map((item) => item.tema), profissao };
  return null;
}

/** A unidade toca em algum tema da lente. */
export function unidadeNaLente(item: UnidadeCurriculo, lente: LenteResolvida): boolean {
  return temasDaUnidade(item).some((tema) => lente.temas.includes(tema));
}

/** Quantas unidades da trilha a lente acende e quantas delas já foram concluídas. */
export function progressoDaLente(lente: LenteResolvida, trilha: Trilha, progresso: Progresso): ProgressoDeUnidades {
  return progressoDeUnidades(unidadesDosTemas(lente.temas, trilha), progresso);
}
