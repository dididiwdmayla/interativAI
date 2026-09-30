/*
 * Simulador de campanha (zona "Ser encontrado", S5): um anúncio pago numa
 * busca, por dentro. NÚMEROS FICTÍCIOS, e a tela diz isso: o modelo é uma
 * simplificação para mostrar as relações, não uma previsão de verdade.
 *
 * A lição central: a página de destino decide quantos cliques viram
 * clientes. A taxa de conversão sai da nota da página (Lighthouse e
 * busca), então melhorar a página melhora o resultado com a MESMA verba.
 *
 * O modelo (simplificado):
 * - nota da página (0 a 100) = 60% a média das três notas da auditoria do
 *   jogo + 40% a nota de busca (título e descrição declarados e sem corte,
 *   página indexável);
 * - qualidade do anúncio (1 a 10) = 1 + 9 x nota / 100;
 * - leilão: cada anunciante tem pontuação = lance x qualidade; a maior fica
 *   em primeiro. O custo por clique de quem ganha é o mínimo para continuar
 *   na frente: a pontuação do de baixo dividida pela própria qualidade,
 *   mais 1 centavo, nunca acima do lance. O último paga metade do custo
 *   médio da palavra. É por isso que uma página boa paga MENOS pelo mesmo
 *   lugar;
 * - cliques = buscas por dia x taxa de cliques da posição (8%, 5%, 3%, 2%),
 *   limitados pelo orçamento do dia;
 * - taxa de conversão = 1% + 7% x nota / 100 (de 1% a 8%);
 * - clientes = cliques x taxa; custo por cliente = gasto / clientes.
 */
import { auditar } from "./auditoria";
import { resultadoNaBusca } from "./busca";

export type Concorrencia = "baixa" | "media" | "alta";

export type PalavraChave = {
  /** kebab-case, estável. */
  id: string;
  /** Como a pessoa digita na busca. */
  texto: string;
  /** Buscas por dia (fictício). */
  buscasPorDia: number;
  /** Custo por clique médio da palavra, em reais (fictício). */
  cpcMedio: number;
  concorrencia: Concorrencia;
};

export type Concorrente = {
  nome: string;
  /** Lance máximo por clique, em reais. */
  lance: number;
  /** Qualidade do anúncio e da página dele (1 a 10). */
  qualidade: number;
};

/** Os dados da campanha de uma fase (só dados). */
export type DadosCampanha = {
  /** O nome do negócio do jogador, no leilão. */
  anunciante: string;
  palavras: PalavraChave[];
  /** Os outros anunciantes (2 ou 3), para o leilão ter 3 ou 4. */
  concorrentes: Concorrente[];
  /** Estado inicial. */
  orcamentoInicial: number;
  palavraInicial: string;
  lanceInicial: number;
};

export type EstadoCampanha = {
  /** Orçamento do dia, em reais. */
  orcamento: number;
  /** Id da palavra-chave escolhida. */
  palavra: string;
  /** Lance máximo por clique, em reais. */
  lance: number;
};

export type MetricaCampanha = "cliques" | "clientes" | "custoPorCliente" | "posicao" | "taxaConversao" | "qualidade" | "notaPagina";

export type LanceNoLeilao = {
  nome: string;
  lance: number;
  qualidade: number;
  pontuacao: number;
  posicao: number;
  jogador: boolean;
  /** Quanto paga por clique (só o jogador interessa, mas todos têm). */
  custoPorClique: number;
};

export type ResultadoCampanha = {
  notaPagina: number;
  notaBusca: number;
  qualidade: number;
  /** De 0 a 1. */
  taxaConversao: number;
  leilao: LanceNoLeilao[];
  posicao: number;
  custoPorClique: number;
  cliques: number;
  clientes: number;
  gasto: number;
  /** null sem nenhum cliente. */
  custoPorCliente: number | null;
  /** O orçamento acabou antes das buscas do dia. */
  limitadoPeloOrcamento: boolean;
};

export const TAXA_DE_CLIQUES = [0.08, 0.05, 0.03, 0.02] as const;

export function estadoInicialDaCampanha(dados: DadosCampanha): EstadoCampanha {
  return { orcamento: dados.orcamentoInicial, palavra: dados.palavraInicial, lance: dados.lanceInicial };
}

function arredondar(valor: number, casas = 2): number {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

/** A nota de busca da página (0 a 100): título, descrição e indexável. */
export function notaDeBusca(documento: Document): number {
  const resultado = resultadoNaBusca(documento, "");
  let nota = 0;
  if (!resultado.titulo.inventado) nota += 25;
  if (!resultado.titulo.inventado && !resultado.titulo.cortou) nota += 15;
  if (!resultado.descricao.inventado) nota += 25;
  if (!resultado.descricao.inventado && !resultado.descricao.cortou) nota += 10;
  if (resultado.indexavel) nota += 25;
  return nota;
}

/** A nota da página de destino (0 a 100), com as duas partes. */
export function notaDaPagina(documento: Document): { nota: number; auditoria: number; busca: number } {
  const { notas } = auditar(documento);
  const auditoria = (notas.acessibilidade + notas["boas-praticas"] + notas.seo) / 3;
  const busca = notaDeBusca(documento);
  return { nota: Math.round(0.6 * auditoria + 0.4 * busca), auditoria: Math.round(auditoria), busca };
}

/** A simulação do dia, com o documento da página de destino de agora. */
export function simularCampanha(dados: DadosCampanha, estado: EstadoCampanha, documento: Document): ResultadoCampanha {
  const palavra = dados.palavras.find((item) => item.id === estado.palavra) ?? dados.palavras[0];
  const { nota, busca } = notaDaPagina(documento);
  const qualidade = arredondar(1 + (9 * nota) / 100, 1);
  const participantes = [
    { nome: dados.anunciante, lance: estado.lance, qualidade, jogador: true },
    ...dados.concorrentes.map((concorrente) => ({ ...concorrente, jogador: false })),
  ].map((item) => ({ ...item, pontuacao: arredondar(item.lance * item.qualidade) }));
  // Maior pontuação primeiro; no empate, o de maior qualidade.
  const ordem = [...participantes].sort((a, b) => b.pontuacao - a.pontuacao || b.qualidade - a.qualidade);
  const leilao: LanceNoLeilao[] = ordem.map((item, indice) => {
    const deBaixo = ordem[indice + 1];
    const custo = deBaixo ? Math.min(item.lance, deBaixo.pontuacao / item.qualidade + 0.01) : Math.min(item.lance, palavra.cpcMedio / 2);
    return { ...item, posicao: indice + 1, custoPorClique: arredondar(custo) };
  });
  const eu = leilao.find((item) => item.jogador) ?? leilao[0];
  const taxaDeCliques = TAXA_DE_CLIQUES[Math.min(TAXA_DE_CLIQUES.length - 1, eu.posicao - 1)];
  const cliquesPossiveis = Math.floor(palavra.buscasPorDia * taxaDeCliques);
  const cabeNoOrcamento = eu.custoPorClique > 0 ? Math.floor(estado.orcamento / eu.custoPorClique) : cliquesPossiveis;
  const cliques = Math.max(0, Math.min(cliquesPossiveis, cabeNoOrcamento));
  const taxaConversao = arredondar(0.01 + (0.07 * nota) / 100, 4);
  const clientes = Math.round(cliques * taxaConversao);
  const gasto = arredondar(cliques * eu.custoPorClique);
  return {
    notaPagina: nota,
    notaBusca: busca,
    qualidade,
    taxaConversao,
    leilao,
    posicao: eu.posicao,
    custoPorClique: eu.custoPorClique,
    cliques,
    clientes,
    gasto,
    custoPorCliente: clientes > 0 ? arredondar(gasto / clientes) : null,
    limitadoPeloOrcamento: cabeNoOrcamento < cliquesPossiveis,
  };
}

/** O valor de uma métrica (a taxa de conversão em porcentagem, 0 a 100). */
export function valorDaMetrica(resultado: ResultadoCampanha, metrica: MetricaCampanha): number | null {
  switch (metrica) {
    case "cliques":
      return resultado.cliques;
    case "clientes":
      return resultado.clientes;
    case "custoPorCliente":
      return resultado.custoPorCliente;
    case "posicao":
      return resultado.posicao;
    case "taxaConversao":
      return arredondar(resultado.taxaConversao * 100, 2);
    case "qualidade":
      return resultado.qualidade;
    case "notaPagina":
      return resultado.notaPagina;
  }
}

/** Reais em PT-BR: "R$ 12,50". */
export function emReais(valor: number): string {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}
