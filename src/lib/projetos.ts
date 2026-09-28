/*
 * Meus projetos: o que o jogo guarda de cada projeto-ponte (o site, os
 * passos do guia de publicação e o link publicado). Ver ProjetoSalvo em
 * src/lib/progresso.ts.
 */
import { linkPublicadoValido } from "@/conteudo/publicacao";
import { atualizarProgresso } from "./armazemProgresso";
import { type Progresso, PROJETO_VAZIO, type ProjetoSalvo } from "./progresso";

function mudarProjeto(faseId: string, mudar: (projeto: ProjetoSalvo) => ProjetoSalvo): void {
  atualizarProgresso((atual) => ({
    ...atual,
    projetos: { ...atual.projetos, [faseId]: mudar(atual.projetos[faseId] ?? PROJETO_VAZIO) },
  }));
}

/** Marca ou desmarca um passo do guia de publicação. */
export function marcarPassoDoGuia(faseId: string, passoId: string, marcado: boolean): void {
  mudarProjeto(faseId, (projeto) => ({
    ...projeto,
    guia: marcado ? [...new Set([...projeto.guia, passoId])] : projeto.guia.filter((id) => id !== passoId),
  }));
}

/** Guarda o endereço publicado se o formato vale (https:// e um domínio); diz se guardou. Vazio apaga. */
export function salvarLinkPublicado(faseId: string, texto: string): boolean {
  const limpo = texto.trim();
  if (limpo.length > 0 && !linkPublicadoValido(limpo)) return false;
  mudarProjeto(faseId, (projeto) => ({ ...projeto, link: limpo.length > 0 ? limpo : null }));
  return true;
}

/** Recomeçar a fase do projeto: o site volta ao começo; o guia e o link ficam (o site publicado continua no ar). */
export function semOSiteDoProjeto(progresso: Progresso, faseId: string): Progresso["projetos"] {
  const projeto = progresso.projetos[faseId];
  if (!projeto) return progresso.projetos;
  return { ...progresso.projetos, [faseId]: { ...projeto, html: null, css: null, atualizadoEm: null } };
}
