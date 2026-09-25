/*
 * Congelamento do conteúdo publicado.
 *
 * O progresso do jogador é salvo pelos ids: fases concluídas, estrelas e
 * fases em andamento pelo id da fase; o objetivo atual pela POSIÇÃO na
 * lista de objetivos; o checklist do desafio pelos ids das partes; a meta
 * vista pelo id da unidade. Mudar qualquer um desses ids (ou a ordem dos
 * objetivos) depois de publicado apaga o progresso de quem já jogou.
 *
 * `publicados.json` guarda os ids de tudo o que já foi publicado. O
 * `npm run testar:conteudo` falha se algum sumir ou mudar, e o
 * `npm run publicar:conteudo` atualiza o arquivo de propósito quando uma
 * unidade nova é publicada.
 */
import DADOS from "./publicados.json";
import type { Fase, Unidade } from "./tipos";

export type FasePublicada = {
  /** Fase de prática: ids dos objetivos, em ordem. */
  objetivos?: string[];
  /** Desafio: ids das partes, em ordem. */
  partes?: string[];
};

export type RegistroPublicados = {
  aviso?: string;
  /** Unidade publicada -> ids das fases dela, em ordem. */
  unidades: Record<string, string[]>;
  fases: Record<string, FasePublicada>;
};

export const PUBLICADOS: RegistroPublicados = DADOS;

export const AVISO_PUBLICADOS =
  "Ids publicados: nunca mude nem apague (isso apaga o progresso de quem já jogou). Atualize só com npm run publicar:conteudo.";

type Contexto = { unidades: readonly Unidade[]; fases: readonly Fase[] };

function idsDaFase(fase: Fase): FasePublicada {
  return fase.tipo === "pratica"
    ? { objetivos: fase.objetivos.map((objetivo) => objetivo.id) }
    : { partes: fase.partes.map((parte) => parte.id) };
}

/** O registro de tudo o que está no jogo agora (o que o publicar:conteudo grava). */
export function montarPublicados({ unidades, fases }: Contexto): RegistroPublicados {
  const registro: RegistroPublicados = { aviso: AVISO_PUBLICADOS, unidades: {}, fases: {} };
  for (const unidade of unidades) registro.unidades[unidade.id] = [...unidade.fases];
  for (const fase of fases) registro.fases[fase.id] = idsDaFase(fase);
  return registro;
}

function lista(ids: readonly string[]): string {
  return ids.length === 0 ? "nenhum" : ids.map((id) => `"${id}"`).join(", ");
}

/** Explica a diferença entre a lista publicada e a atual, ou null se forem iguais. */
function diferenca(publicada: readonly string[], atual: readonly string[]): string | null {
  if (publicada.join("|") === atual.join("|")) return null;
  const sumiram = publicada.filter((id) => !atual.includes(id));
  const novos = atual.filter((id) => !publicada.includes(id));
  const partes = [`publicado: [${publicada.join(", ")}]`, `agora: [${atual.join(", ")}]`];
  if (sumiram.length > 0) partes.push(`sumiram ${lista(sumiram)}`);
  if (novos.length > 0) partes.push(`entraram ${lista(novos)}`);
  if (sumiram.length === 0 && novos.length === 0) partes.push("a ordem mudou");
  return partes.join("; ");
}

const MOTIVO = "Ids publicados nunca mudam: isso apaga o progresso de quem já jogou.";

/**
 * Confere o conteúdo atual contra o publicado. Lista vazia = nada
 * publicado sumiu nem mudou. Conteúdo NOVO (ainda não publicado) é livre.
 */
export function conferirPublicados(publicados: RegistroPublicados, { unidades, fases }: Contexto): string[] {
  const problemas: string[] = [];
  for (const [id, fasesPublicadas] of Object.entries(publicados.unidades)) {
    const unidade = unidades.find((item) => item.id === id);
    if (!unidade) {
      problemas.push(`a unidade publicada "${id}" sumiu ou mudou de id. ${MOTIVO}`);
      continue;
    }
    const mudou = diferenca(fasesPublicadas, unidade.fases);
    if (mudou) {
      problemas.push(
        `a unidade publicada "${id}" mudou a lista de fases (${mudou}). ${MOTIVO} ` +
          "Fase nova entra numa unidade nova, e a ordem das publicadas não muda.",
      );
    }
  }
  for (const [id, publicada] of Object.entries(publicados.fases)) {
    const fase = fases.find((item) => item.id === id);
    if (!fase) {
      problemas.push(`a fase publicada "${id}" sumiu ou mudou de id. ${MOTIVO}`);
      continue;
    }
    const atual = idsDaFase(fase);
    if (publicada.objetivos && !atual.objetivos) {
      problemas.push(`a fase publicada "${id}" era de prática e virou desafio. ${MOTIVO}`);
    } else if (publicada.partes && !atual.partes) {
      problemas.push(`a fase publicada "${id}" era desafio e virou prática. ${MOTIVO}`);
    }
    const objetivos = diferenca(publicada.objetivos ?? [], atual.objetivos ?? []);
    if (publicada.objetivos && atual.objetivos && objetivos) {
      problemas.push(
        `a fase publicada "${id}" mudou os objetivos (${objetivos}). ${MOTIVO} ` +
          "O progresso guarda quantos objetivos a pessoa já fez, então nem a ordem pode mudar.",
      );
    }
    const partes = diferenca(publicada.partes ?? [], atual.partes ?? []);
    if (publicada.partes && atual.partes && partes) {
      problemas.push(`o desafio publicado "${id}" mudou as partes (${partes}). ${MOTIVO}`);
    }
  }
  return problemas;
}
