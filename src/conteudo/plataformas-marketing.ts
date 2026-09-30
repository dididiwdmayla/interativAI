/*
 * Passo a passo das plataformas de marketing (zona opcional "Ser
 * encontrado"): o perfil da empresa no Google, o Search Console, as
 * plataformas de medição e de anúncio.
 *
 * Filosofia da zona (docs/MAPA-CURRICULAR.md): o jogo ensina o que o
 * programador faz e os conceitos que não envelhecem. O passo a passo de
 * cada plataforma muda de tela, de nome e de regra o tempo todo, então
 * ele mora AQUI, só como dado, com a data em que foi conferido. A tela
 * mostra "conferido em <data>" (`rotuloConferido`). Quando uma plataforma
 * mudar, atualize os passos e a data, sem mexer em código.
 *
 * Os textos entram na produção de conteúdo (S3 a S5), conferidos na
 * época, nunca de memória. Por enquanto a lista está vazia: só a
 * estrutura existe. O `testar:conteudo` confere ids únicos, data no
 * formato AAAA-MM-DD e passos não vazios.
 */

export type IdPlataformaMarketing = string;

export type PassoPlataforma = {
  /** Estável, kebab-case (pode ir para o progresso um dia). */
  id: string;
  /** O que fazer, em uma frase. */
  titulo: string;
  /** Um detalhe que tira a dúvida mais comum desse passo. */
  detalhe: string;
};

export type PlataformaMarketing = {
  id: IdPlataformaMarketing;
  /** Nome como aparece na tela ("Perfil da Empresa no Google"). */
  nome: string;
  /** Para que serve, em uma frase de leigo. */
  paraQue: string;
  /** Endereço onde a pessoa vai (texto; abre no navegador, fora do jogo). */
  endereco: string;
  /** Quando os passos foram conferidos pela última vez (AAAA-MM-DD). */
  verificadoEm: string;
  /** Unidades do currículo que citam esta plataforma. */
  usadaEm: readonly string[];
  passos: readonly PassoPlataforma[];
};

/** Vazio até a produção de conteúdo da S3 a S5 (conferido na época). */
export const PLATAFORMAS_MARKETING: readonly PlataformaMarketing[] = [];

/** "conferido em 28/09/2026", para a tela. */
export function rotuloConferido(verificadoEm: string): string {
  const [ano, mes, dia] = verificadoEm.split("-");
  return ano && mes && dia ? `conferido em ${dia}/${mes}/${ano}` : `conferido em ${verificadoEm}`;
}

/** Problemas no arquivo de plataformas (regra geral do testar:conteudo). */
export function conferirPlataformas(plataformas: readonly PlataformaMarketing[]): string[] {
  const problemas: string[] = [];
  const vistos = new Set<string>();
  for (const plataforma of plataformas) {
    if (vistos.has(plataforma.id)) problemas.push(`plataforma com id repetido: "${plataforma.id}"`);
    vistos.add(plataforma.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(plataforma.verificadoEm)) {
      problemas.push(`a plataforma "${plataforma.id}" precisa de verificadoEm no formato AAAA-MM-DD`);
    }
    if (plataforma.passos.length === 0) problemas.push(`a plataforma "${plataforma.id}" não tem passos`);
    const passos = new Set<string>();
    for (const passo of plataforma.passos) {
      if (passos.has(passo.id)) problemas.push(`a plataforma "${plataforma.id}" repete o passo "${passo.id}"`);
      passos.add(passo.id);
    }
  }
  return problemas;
}
