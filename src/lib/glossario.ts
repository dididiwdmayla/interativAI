/*
 * O glossário vivo: todo conceito do catálogo, com os temas, onde se
 * aprende (fases que ensinam) e onde se pratica (fases que praticam e
 * revisam). Sai do mesmo índice do /lab/fases (`montarIndice`), a base do
 * futuro computadorzinho navegador.
 */
import { rotuloDaFase } from "@/motor/tiposDeFase";
import { FASES, localDaFase } from "@/conteudo";
import { CONCEITOS, type Conceito } from "@/conteudo/conceitos";
import { montarIndice } from "@/conteudo/indice";
import type { Fase } from "@/conteudo/tipos";
import { localNoCurriculo } from "@/curriculo";
import { faseLiberada } from "./liberacao";
import type { Progresso } from "./progresso";
import { rotaDaFase, rotaDaIlha } from "./rotas";

export type EntradaGlossario = {
  conceito: Conceito;
  /** Fases que ensinam, na ordem do jogo. */
  aprender: string[];
  /** Fases que praticam ou revisam, sem repetir, na ordem do jogo. */
  praticar: string[];
};

/** Um verbete por conceito do catálogo (também os que nenhuma fase usa ainda), em ordem alfabética. */
export function montarGlossario(fases: readonly Fase[] = FASES): EntradaGlossario[] {
  const indice = montarIndice(fases);
  const ordem = fases.map((fase) => fase.id);
  const naOrdem = (ids: string[]) => [...new Set(ids)].sort((a, b) => ordem.indexOf(a) - ordem.indexOf(b));
  return CONCEITOS.map((conceito) => {
    const entrada = indice.find((item) => item.conceito.id === conceito.id);
    return {
      conceito,
      aprender: naOrdem(entrada?.ensinam ?? []),
      praticar: naOrdem([...(entrada?.praticam ?? []), ...(entrada?.revisam ?? [])]).filter(
        (id) => !(entrada?.ensinam ?? []).includes(id),
      ),
    };
  }).sort((a, b) => a.conceito.nome.localeCompare(b.conceito.nome, "pt-BR"));
}

/** Sem acento, minúsculo e sem espaço sobrando: "Márgin " vira "margin". */
export function normalizarBusca(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Busca pelo nome e pelo resumo, ignorando acento e maiúscula. Busca vazia devolve tudo. */
export function buscarNoGlossario(entradas: readonly EntradaGlossario[], busca: string): EntradaGlossario[] {
  const termo = normalizarBusca(busca);
  if (termo.length === 0) return [...entradas];
  return entradas.filter((entrada) =>
    normalizarBusca(`${entrada.conceito.nome} ${entrada.conceito.resumo} ${entrada.conceito.id}`).includes(termo),
  );
}

export type DestinoFase = {
  faseId: string;
  /** "Unidade 3 · Fase 2: Títulos e textos". */
  rotulo: string;
  /** A fase, se liberada; senão, o ponto da unidade no mapa (a ilha com o card aberto). */
  href: string;
  liberada: boolean;
  /** Fase trancada: "Você chega lá na Ilha Sites". */
  aviso: string | null;
};

/** Para onde o link de uma fase leva: a própria fase, se liberada, ou o ponto da unidade no mapa. */
export function destinoDaFase(faseId: string, progresso: Progresso, fases: readonly Fase[] = FASES): DestinoFase | null {
  const fase = fases.find((item) => item.id === faseId);
  if (!fase) return null;
  const { unidade, numero } = localDaFase(fase);
  const rotulo = `${unidade.titulo} · ${rotuloDaFase(fase.tipo, numero)}`;
  if (faseLiberada(fase, progresso)) return { faseId, rotulo, href: rotaDaFase(faseId), liberada: true, aviso: null };
  const local = localNoCurriculo(unidade.id);
  const ilha = local?.ilha;
  return {
    faseId,
    rotulo,
    href: ilha ? `${rotaDaIlha(ilha.id)}#${unidade.id}` : rotaDaFase(faseId),
    liberada: false,
    aviso: `Você chega lá na Ilha ${ilha?.nome ?? unidade.ilha.replace(/^Ilha /, "")}`,
  };
}
