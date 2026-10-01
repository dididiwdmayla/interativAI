/*
 * O quadro de "ordenar passos" (fase do tipo ordenar-passos, zona Resolvendo
 * problemas): cartões com os passos de um problema, em português ou em
 * código, que o jogador arrasta para o plano. Não existe UMA ordem certa
 * decorada: cada cartão diz de quais passos ele depende (`depoisDe`), e
 * qualquer ordem que respeite essas dependências vale. Cartões que sobram
 * (`sobra`) são distrações e têm que ficar fora.
 *
 * Variante "agrupar": os passos grandes (grupos) já estão no quadro e o
 * jogador separa os subpassos dentro de cada um, para aprender a decompor
 * um problema. A dependência entre subpassos de grupos diferentes vale pela
 * ordem dos grupos.
 *
 * Puro (sem React): a tela (useOrdenar), a simulação dos testes e os
 * validadores usam as mesmas funções.
 */

export type CartaoPasso = {
  /** Único no quadro, kebab-case. */
  id: string;
  /** O passo como aparece no cartão (português ou código). Até 80 caracteres. */
  texto: string;
  /** (Com `rodar`) O código que este cartão vira quando o plano roda. Sem ele, vale o `texto`. */
  codigo?: string;
  /** Este passo só pode vir depois destes (ids). Sem dependência: pode vir em qualquer lugar. */
  depoisDe?: string[];
  /** Distração: não faz parte do plano e tem que ficar fora. */
  sobra?: true;
  /** (Agrupar) O passo grande (id do grupo) a que este subpasso pertence. */
  grupo?: string;
};

export type GrupoPassos = { id: string; titulo: string };

export type DadosOrdenar = {
  /** "ordenar": um plano só; "agrupar": os subpassos vão dentro dos passos grandes. */
  modo: "ordenar" | "agrupar";
  /** O que o plano resolve, em uma frase ("Passar um café"). Aparece em cima do plano. */
  problema: string;
  cartoes: CartaoPasso[];
  /** (Agrupar) Os passos grandes, na ordem em que acontecem. */
  grupos?: GrupoPassos[];
  /** Cartões que já começam no plano, na ordem (no agrupar, cada um vai no grupo dele). */
  inicial?: string[];
  /**
   * O plano roda como programa (os cartões são linhas de código): a fase
   * precisa de `programa`, e o botão Rodar executa o código na ordem do
   * plano (saída, erro e validadores de código, como no Snippet).
   */
  rodar?: true;
};

/** Onde cada cartão está: listas por destino ("plano" no ordenar, o id de cada grupo no agrupar). */
export type EstadoOrdenar = { listas: Record<string, string[]> };

export const LISTA_DO_PLANO = "plano";

/** Os destinos do quadro: o plano, ou um por grupo. */
export function destinosDo(dados: DadosOrdenar): string[] {
  return dados.modo === "agrupar" ? (dados.grupos ?? []).map((g) => g.id) : [LISTA_DO_PLANO];
}

export function estadoInicialOrdenar(dados: DadosOrdenar): EstadoOrdenar {
  const listas: Record<string, string[]> = Object.fromEntries(destinosDo(dados).map((d) => [d, [] as string[]]));
  for (const id of dados.inicial ?? []) {
    const cartao = dados.cartoes.find((c) => c.id === id);
    if (!cartao) continue;
    const destino = dados.modo === "agrupar" ? (cartao.grupo ?? destinosDo(dados)[0]) : LISTA_DO_PLANO;
    if (listas[destino] && !listas[destino].includes(id)) listas[destino].push(id);
  }
  return { listas };
}

/** O destino em que o cartão está agora (null: na pilha de cartões, fora do plano). */
export function ondeEsta(estado: EstadoOrdenar, passo: string): { destino: string; posicao: number } | null {
  for (const [destino, lista] of Object.entries(estado.listas)) {
    const posicao = lista.indexOf(passo);
    if (posicao >= 0) return { destino, posicao };
  }
  return null;
}

/** Os cartões fora do plano, na ordem do quadro (a pilha de onde o jogador puxa). */
export function cartoesFora(dados: DadosOrdenar, estado: EstadoOrdenar): CartaoPasso[] {
  return dados.cartoes.filter((cartao) => ondeEsta(estado, cartao.id) === null);
}

/**
 * Põe (ou move) o cartão no destino, na posição (padrão: no fim). Devolve
 * null se o cartão ou o destino não existem.
 */
export function porPasso(dados: DadosOrdenar, estado: EstadoOrdenar, passo: string, destino: string = LISTA_DO_PLANO, posicao?: number): EstadoOrdenar | null {
  if (!dados.cartoes.some((c) => c.id === passo) || !(destino in estado.listas)) return null;
  const listas: Record<string, string[]> = {};
  for (const [nome, lista] of Object.entries(estado.listas)) listas[nome] = lista.filter((id) => id !== passo);
  const alvo = listas[destino];
  const onde = posicao === undefined ? alvo.length : Math.max(0, Math.min(alvo.length, posicao));
  alvo.splice(onde, 0, passo);
  return { listas };
}

/** Tira o cartão do plano (volta para a pilha). */
export function tirarPasso(estado: EstadoOrdenar, passo: string): EstadoOrdenar {
  const listas: Record<string, string[]> = {};
  for (const [nome, lista] of Object.entries(estado.listas)) listas[nome] = lista.filter((id) => id !== passo);
  return { listas };
}

/** A ordem completa do plano (no agrupar, grupo por grupo). */
export function ordemDoPlano(dados: DadosOrdenar, estado: EstadoOrdenar): string[] {
  return destinosDo(dados).flatMap((destino) => estado.listas[destino] ?? []);
}

const nomeDe = (dados: DadosOrdenar, id: string) => `"${dados.cartoes.find((c) => c.id === id)?.texto ?? id}"`;

export type ConferenciaOrdem = {
  valida: boolean;
  /** Os passos que faltam no plano. */
  faltam: string[];
  /** Os passos que sobram e estão no plano. */
  sobrando: string[];
  /** Os passos no grupo errado (agrupar). */
  foraDoGrupo: string[];
  /** Dependências quebradas: [passo, o que devia vir antes]. */
  quebradas: [string, string][];
  /** A explicação, em PT-BR, do primeiro problema (vazio se valida). */
  motivo: string;
};

/**
 * Confere o plano pelas dependências: todos os passos necessários estão
 * lá, nenhum que sobra, cada um no grupo dele (agrupar) e cada passo
 * depois dos que ele depende. Qualquer ordem que respeite isso vale.
 */
export function conferirOrdem(dados: DadosOrdenar, estado: EstadoOrdenar): ConferenciaOrdem {
  const ordem = ordemDoPlano(dados, estado);
  const posicao = new Map(ordem.map((id, i) => [id, i]));
  const necessarios = dados.cartoes.filter((c) => !c.sobra);
  const faltam = necessarios.filter((c) => !posicao.has(c.id)).map((c) => c.id);
  const sobrando = dados.cartoes.filter((c) => c.sobra && posicao.has(c.id)).map((c) => c.id);
  const foraDoGrupo =
    dados.modo === "agrupar"
      ? necessarios.filter((c) => posicao.has(c.id) && c.grupo !== undefined && !(estado.listas[c.grupo] ?? []).includes(c.id)).map((c) => c.id)
      : [];
  const quebradas: [string, string][] = [];
  for (const cartao of necessarios) {
    const aqui = posicao.get(cartao.id);
    if (aqui === undefined) continue;
    for (const antes of cartao.depoisDe ?? []) {
      const ali = posicao.get(antes);
      if (ali !== undefined && ali > aqui) quebradas.push([cartao.id, antes]);
    }
  }
  const motivo = sobrando.length
    ? `${nomeDe(dados, sobrando[0])} não faz parte do plano`
    : foraDoGrupo.length
      ? `${nomeDe(dados, foraDoGrupo[0])} está no passo grande errado`
      : quebradas.length
        ? `${nomeDe(dados, quebradas[0][0])} veio antes de ${nomeDe(dados, quebradas[0][1])}`
        : faltam.length
          ? `falta ${nomeDe(dados, faltam[0])}`
          : "";
  return { valida: motivo === "", faltam, sobrando, foraDoGrupo, quebradas, motivo };
}

/** Uma ordem que vale (ordenação topológica pelas dependências), ou null se as dependências formam um ciclo. */
export function umaOrdemValida(dados: DadosOrdenar): string[] | null {
  const necessarios = dados.cartoes.filter((c) => !c.sobra);
  const grupos = destinosDo(dados);
  const peso = (c: CartaoPasso) => (dados.modo === "agrupar" ? grupos.indexOf(c.grupo ?? "") : 0);
  const feitos: string[] = [];
  const restantes = [...necessarios].sort((a, b) => peso(a) - peso(b));
  while (restantes.length) {
    const i = restantes.findIndex((c) => (c.depoisDe ?? []).every((d) => feitos.includes(d) || !necessarios.some((n) => n.id === d)));
    if (i < 0) return null;
    feitos.push(restantes[i].id);
    restantes.splice(i, 1);
  }
  return feitos;
}

/** O código do plano, cartão por cartão, na ordem (o que o botão Rodar executa). */
export function codigoDoPlano(dados: DadosOrdenar, estado: EstadoOrdenar): string {
  return ordemDoPlano(dados, estado)
    .map((id) => {
      const cartao = dados.cartoes.find((c) => c.id === id);
      return cartao ? (cartao.codigo ?? cartao.texto) : "";
    })
    .join("\n");
}
