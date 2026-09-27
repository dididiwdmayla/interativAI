/*
 * Regras das profissões (src/curriculo/profissoes.ts): o progresso no
 * caminho de uma profissão é a média dos temas dela, ponderada pelos
 * pesos, contando as unidades planejadas; e a checagem dos dados.
 */
import { IDS_TEMAS } from "@/curriculo/temas";
import type { Profissao } from "@/curriculo/profissoes";
import type { Trilha } from "@/curriculo/trilhas";
import type { Progresso } from "./progresso";
import { fracao, progressoDoTema } from "./temas";

/** De 0 a 1: a média ponderada do progresso de cada tema da profissão na trilha. */
export function progressoDaProfissao(profissao: Profissao, trilha: Trilha, progresso: Progresso): number {
  let soma = 0;
  let pesos = 0;
  for (const { tema, peso } of profissao.temas) {
    const conta = progressoDoTema(tema, trilha, progresso);
    // Tema sem nenhuma unidade na trilha não entra na média (não dá para avançar nele).
    if (conta.total === 0) continue;
    soma += peso * fracao(conta);
    pesos += peso;
  }
  return pesos === 0 ? 0 : soma / pesos;
}

/** Checagem (testar:conteudo): ids únicos, textos, temas que existem, sem repetir, pesos de 1 a 3. */
export function conferirProfissoes(profissoes: readonly Profissao[]): string[] {
  const problemas: string[] = [];
  const ids = new Set<string>();
  for (const profissao of profissoes) {
    if (ids.has(profissao.id)) problemas.push(`profissão com id repetido: "${profissao.id}"`);
    ids.add(profissao.id);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(profissao.id)) problemas.push(`id de profissão "${profissao.id}" não está em kebab-case`);
    for (const campo of ["nome", "oQueFaz", "umDiaDeTrabalho"] as const) {
      if (profissao[campo].trim().length === 0) problemas.push(`a profissão "${profissao.id}" está sem ${campo}`);
    }
    if (profissao.temas.length === 0) problemas.push(`a profissão "${profissao.id}" não tem temas`);
    const vistos = new Set<string>();
    for (const { tema, peso } of profissao.temas) {
      if (!(IDS_TEMAS as readonly string[]).includes(tema)) problemas.push(`a profissão "${profissao.id}" usa o tema "${tema}", que não existe`);
      if (vistos.has(tema)) problemas.push(`a profissão "${profissao.id}" repete o tema "${tema}"`);
      vistos.add(tema);
      if (![1, 2, 3].includes(peso)) problemas.push(`a profissão "${profissao.id}" dá peso ${peso} ao tema "${tema}" (vale 1, 2 ou 3)`);
    }
  }
  return problemas;
}
