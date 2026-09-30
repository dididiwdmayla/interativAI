/*
 * Regras dos temas (src/curriculo/temas.ts) sobre o mapa: que temas cada
 * unidade tem, quantas unidades de um tema a trilha tem e quantas já
 * foram concluídas (contando as planejadas, porque a ideia é mostrar o
 * percurso inteiro) e os marcos das insígnias.
 */
import { temObjetivos } from "@/motor/tiposDeFase";
import { FASES, UNIDADES } from "@/conteudo";
import { conceitoDoId } from "@/conteudo/conceitos";
import type { Fase, Unidade } from "@/conteudo/tipos";
import { IDS_TEMAS, type IdTema } from "@/curriculo/temas";
import type { Trilha } from "@/curriculo/trilhas";
import type { UnidadeCurriculo } from "@/curriculo/tipos";
import { type ProgressoDeUnidades, progressoDeUnidades, unidadesDaTrilha } from "./mapa";
import type { Progresso } from "./progresso";

/** Na ordem do catálogo, sem repetir. */
function ordenar(temas: Iterable<IdTema>): IdTema[] {
  const conjunto = new Set(temas);
  return IDS_TEMAS.filter((id) => conjunto.has(id));
}

/**
 * Os temas de uma unidade pronta: os dos conceitos que as fases dela
 * ensinam (`conceitos`) e praticam (`pratica`; no desafio, `conceitos`).
 * O `revisa` fica de fora: revisar não é o assunto da unidade.
 */
export function temasDerivados(unidade: Unidade, fases: readonly Fase[] = FASES): IdTema[] {
  const temas: IdTema[] = [];
  for (const id of unidade.fases) {
    const fase = fases.find((item) => item.id === id);
    if (!fase) continue;
    const conceitos = [...fase.conceitos, ...(temObjetivos(fase) ? (fase.pratica ?? []) : [])];
    for (const conceito of conceitos) temas.push(...conceitoDoId(conceito).temas);
  }
  return ordenar(temas);
}

/** Os temas de uma unidade do currículo: pronta, os derivados; planejada, os declarados. */
export function temasDaUnidade(item: UnidadeCurriculo, unidades: readonly Unidade[] = UNIDADES, fases: readonly Fase[] = FASES): IdTema[] {
  const conteudo = unidades.find((unidade) => unidade.id === item.id);
  return conteudo ? temasDerivados(conteudo, fases) : ordenar(item.temas ?? []);
}

/** As unidades da trilha (prontas e planejadas) que tocam em algum dos temas. */
export function unidadesDosTemas(temas: readonly IdTema[], trilha: Trilha): UnidadeCurriculo[] {
  return unidadesDaTrilha(trilha).filter((item) => temasDaUnidade(item).some((tema) => temas.includes(tema)));
}

/** "Segurança: 3 de 14 unidades": o progresso de um tema na trilha. */
export function progressoDoTema(tema: IdTema, trilha: Trilha, progresso: Progresso): ProgressoDeUnidades {
  return progressoDeUnidades(unidadesDosTemas([tema], trilha), progresso);
}

/** Fração concluída (0 quando o tema não tem unidade na trilha). */
export function fracao(conta: ProgressoDeUnidades): number {
  return conta.total === 0 ? 0 : conta.concluidas / conta.total;
}

export const MARCOS = [25, 50, 75, 100] as const;
export type Marco = 0 | (typeof MARCOS)[number];

/** O maior marco (25, 50, 75 ou 100%) já atingido. */
export function marcoAtingido(conta: ProgressoDeUnidades): Marco {
  const porcento = fracao(conta) * 100;
  let atingido: Marco = 0;
  for (const marco of MARCOS) if (porcento >= marco) atingido = marco;
  return atingido;
}

/**
 * Checagem dos temas (testar:conteudo): todo conceito tem pelo menos um
 * tema, e todo tema citado existe; toda unidade do currículo declara
 * temas; numa unidade pronta, os declarados estão contidos nos derivados
 * dos conceitos dela.
 */
export function conferirTemas(
  conceitos: readonly { id: string; temas: readonly string[] }[],
  curriculo: readonly { id: string; zonas: readonly { unidades: readonly UnidadeCurriculo[] }[] }[],
  unidades: readonly Unidade[] = UNIDADES,
  fases: readonly Fase[] = FASES,
): string[] {
  const problemas: string[] = [];
  const existe = (tema: string) => (IDS_TEMAS as readonly string[]).includes(tema);
  for (const conceito of conceitos) {
    if (conceito.temas.length === 0) problemas.push(`o conceito "${conceito.id}" não tem tema (src/conteudo/conceitos.ts)`);
    for (const tema of conceito.temas) {
      if (!existe(tema)) problemas.push(`o conceito "${conceito.id}" cita o tema "${tema}", que não existe (src/curriculo/temas.ts)`);
    }
  }
  for (const ilha of curriculo) {
    for (const item of ilha.zonas.flatMap((zona) => zona.unidades)) {
      const declarados = item.temas ?? [];
      if (declarados.length === 0) problemas.push(`a unidade "${item.id}" do currículo não declara temas`);
      for (const tema of declarados) {
        if (!existe(tema)) problemas.push(`a unidade "${item.id}" cita o tema "${tema}", que não existe`);
      }
      const conteudo = unidades.find((unidade) => unidade.id === item.id);
      if (!conteudo) continue;
      const derivados = temasDerivados(conteudo, fases);
      for (const tema of declarados) {
        if (!derivados.includes(tema)) {
          problemas.push(
            `a unidade pronta "${item.id}" declara o tema "${tema}" no currículo, mas nenhum conceito que ela ensina ou pratica tem esse tema ` +
              `(derivados: ${derivados.join(", ") || "nenhum"})`,
          );
        }
      }
    }
  }
  return problemas;
}
