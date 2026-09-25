import { FASES } from "@/conteudo";
import type { Fase } from "@/conteudo/tipos";
import type { Progresso } from "./progresso";

/**
 * Uma fase abre quando a anterior (na ordem das unidades) foi concluída.
 * A primeira está sempre aberta, e uma fase já começada ou concluída
 * continua aberta. O /lab/mapa (mapaDesbloqueado) abre todas.
 */
export function faseLiberada(fase: Fase, progresso: Progresso): boolean {
  const indice = FASES.indexOf(fase);
  if (indice <= 0 || progresso.mapaDesbloqueado) return true;
  return (
    progresso.fasesConcluidas.includes(fase.id) ||
    progresso.fasesConcluidas.includes(FASES[indice - 1].id) ||
    progresso.fasesEmAndamento[fase.id] !== undefined
  );
}
