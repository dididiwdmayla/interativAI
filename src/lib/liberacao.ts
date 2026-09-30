import { FASES, unidadeDoId } from "@/conteudo";
import type { Fase } from "@/conteudo/tipos";
import { localNoCurriculo } from "@/curriculo";
import { estadoDaUnidade } from "./mapa";
import type { Progresso } from "./progresso";

/**
 * Uma fase abre quando a anterior DA UNIDADE foi concluída. A primeira
 * fase de uma unidade abre quando o mapa abre a unidade (a ilha e a zona
 * abertas, a unidade anterior concluída): assim a primeira fase de uma
 * ilha nova não depende da última fase de uma zona opcional que veio antes
 * na lista. Uma fase já começada ou concluída continua aberta. O /lab/mapa
 * (mapaDesbloqueado) abre todas. Fase fora do conteúdo (revisão, lab) abre.
 */
export function faseLiberada(fase: Fase, progresso: Progresso): boolean {
  if (progresso.mapaDesbloqueado) return true;
  if (progresso.fasesConcluidas.includes(fase.id) || progresso.fasesEmAndamento[fase.id] !== undefined) return true;
  const unidade = unidadeDoId(fase.unidadeId);
  const posicao = unidade ? unidade.fases.indexOf(fase.id) : -1;
  if (!unidade || posicao < 0) return FASES.indexOf(fase) <= 0;
  if (posicao > 0) return progresso.fasesConcluidas.includes(unidade.fases[posicao - 1]);
  const local = localNoCurriculo(unidade.id);
  if (!local) return FASES.indexOf(fase) <= 0 || progresso.fasesConcluidas.includes(FASES[FASES.indexOf(fase) - 1].id);
  return estadoDaUnidade(local.ilha, local.zona, local.unidade, { progresso }) !== "bloqueada";
}
