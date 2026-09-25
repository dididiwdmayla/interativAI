import type { Fase, Unidade } from "@/conteudo/tipos";
import type { Progresso } from "./progresso";

/**
 * A unidade já tem progresso: alguma fase concluída ou começada de verdade
 * (introdução vista). Uma fase aberta só até a meta não conta.
 */
export function unidadeComProgresso(unidade: Unidade, progresso: Progresso): boolean {
  return unidade.fases.some(
    (id) => progresso.fasesConcluidas.includes(id) || (progresso.fasesEmAndamento[id]?.introducaoVista ?? false),
  );
}

/**
 * A tela de meta (antes/depois) abre esta fase? Só quando a unidade tem
 * desafio e:
 * - é o desafio: a meta é o X, então aparece sempre que ele começa;
 * - é a primeira fase da unidade, a pessoa ainda não viu a meta dela
 *   (`metasVistas`) e não tem nenhum progresso na unidade. Assim a meta da
 *   entrada aparece uma vez só, e preencher `meta.desafioId` numa unidade
 *   já jogada não muda o que quem já jogou vê.
 */
export function faseAbreComMeta(fase: Fase, unidade: Unidade, progresso: Progresso): boolean {
  if (!unidade.meta.desafioId) return false;
  if (fase.tipo === "desafio") return fase.id === unidade.meta.desafioId;
  return (
    unidade.fases[0] === fase.id &&
    !progresso.metasVistas.includes(unidade.id) &&
    !unidadeComProgresso(unidade, progresso)
  );
}
