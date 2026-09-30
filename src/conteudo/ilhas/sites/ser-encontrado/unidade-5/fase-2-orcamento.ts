/*
 * S5, Fase 2: "Verba e palavras-chave" (Ótica Olhar Novo). Simulador de
 * campanha, com a página de destino JÁ BOA (para isolar a verba e a palavra).
 *
 * O QUE ENSINA: o orçamento diário (o teto do que se gasta por dia: acabou,
 * o anúncio para de aparecer) e a escolha da palavra-chave (mais buscas
 * gasta mais rápido; mais específica gasta menos). Os tipos de
 * correspondência (ampla, de frase e exata) aparecem só nas falas, com o que
 * está no arquivo de plataformas (conferido em 30/09/2026).
 *
 * REVISA: o leilão e o custo por clique (Fase 1). Simulação com números
 * fictícios e simplificada (lance vezes qualidade), como diz a Fase 1.
 */
import type { DadosCampanha } from "@/motor/campanha";
import type { FaseSimuladorCampanha } from "@/conteudo/tipos";
import { OTICA_OLHAR_NOVO } from "./sites/oticaOlharNovo";

export const CAMPANHA_S5_F2: DadosCampanha = {
  anunciante: "Ótica Olhar Novo",
  palavras: [
    { id: "oculos-de-grau", texto: "óculos de grau", buscasPorDia: 2000, cpcMedio: 1.8, concorrencia: "alta" },
    { id: "oculos-de-sol", texto: "óculos de sol", buscasPorDia: 700, cpcMedio: 1.1, concorrencia: "media" },
    { id: "otica-no-centro", texto: "ótica no centro de Sorocaba", buscasPorDia: 350, cpcMedio: 0.6, concorrencia: "baixa" },
  ],
  concorrentes: [
    { nome: "Ótica Vista", lance: 2.2, qualidade: 6 },
    { nome: "Lentes & Cia", lance: 1.5, qualidade: 8 },
    { nome: "Visão Fácil", lance: 1.8, qualidade: 5 },
  ],
  orcamentoInicial: 60,
  palavraInicial: "oculos-de-grau",
  lanceInicial: 1.4,
};

export const FASE_S5_F2: FaseSimuladorCampanha = {
  id: "sites-ser-encontrado-u5-f2",
  tipo: "simulador-campanha",
  unidadeId: "sites-ser-encontrado-u5",
  titulo: "Verba e palavras-chave",
  conceitos: ["orcamento-diario"],
  pratica: ["palavra-chave-de-anuncio"],
  revisa: ["leilao-de-anuncio", "custo-por-clique"],
  prerequisitos: ["leilao-de-anuncio", "palavra-chave-de-anuncio"],
  usaFerramentas: ["simulador-campanha"],
  siteAlvo: OTICA_OLHAR_NOVO,
  campanha: CAMPANHA_S5_F2,
  introducao: [
    { texto: "A página da Ótica Olhar Novo já está boa. Agora o foco é a verba: o orçamento diário é o teto do que você gasta por dia.", expressao: "pensativo" },
    { texto: "Toda palavra-chave tem um tipo de correspondência: ampla, de frase ou exata. Guarde os três nomes: são o vocabulário do Google Ads.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "orcamento-acabou",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O orçamento do dia é curto e há muitas buscas. O que acontece no meio da tarde?",
        opcoes: ["O orçamento acaba e o anúncio para de aparecer", "O anúncio continua, e o Google cobra a mais", "O anúncio fica mais barato"],
        correta: 0,
        explicacao: "O orçamento diário é um teto. Quando a verba do dia acaba, o anúncio deixa de aparecer até o dia seguinte.",
      },
      enunciado: {
        mouse: "O orçamento está limitando os cliques. Suba o orçamento do dia até o anúncio receber pelo menos 100 cliques.",
        toque: "O orçamento está limitando os cliques. Suba o orçamento do dia até o anúncio receber pelo menos 100 cliques.",
      },
      validador: { tipo: "simulacao", metrica: "cliques", op: ">=", valor: 100 },
      ajudas: {
        pergunta: "O painel avisa quando o orçamento acaba antes das buscas do dia. Quanto falta para liberar os cliques?",
        dica: "Cada clique custa mais ou menos R$ 1,37: para 100 cliques, você precisa de uns R$ 140 por dia.",
        linha: { alvo: "ferramenta", ferramenta: "simulador-campanha", fala: "O orçamento do dia está aqui. Suba até os cliques passarem de 100." },
        solucao: {
          fala: "Subi o orçamento para R$ 150: o anúncio deixou de ser limitado e recebeu mais de 100 cliques.",
          acoes: [{ tipo: "configurarCampanha", orcamento: 150 }],
        },
      },
      falaAoConcluir: { texto: "Com a verba certa, o anúncio aparece o dia todo. Verba curta demais é dinheiro parado.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "configurarCampanha", orcamento: 150 },
      ],
    },
    {
      id: "comecar-pequeno",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "A campanha é nova: comece pequeno. Ache a palavra que deixa você em 1º lugar, com no máximo 60 cliques e pelo menos 4 clientes.",
        toque: "A campanha é nova: comece pequeno. Ache a palavra que deixa você em 1º lugar, com no máximo 60 cliques e pelo menos 4 clientes.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "simulacao", metrica: "posicao", op: "==", valor: 1 },
          { tipo: "simulacao", metrica: "cliques", op: "<=", valor: 60 },
          { tipo: "simulacao", metrica: "clientes", op: ">=", valor: 4 },
        ],
      },
      ajudas: {
        pergunta: "Qual palavra tem menos buscas que \"óculos de grau\", mas ainda o bastante para 4 clientes?",
        dica: "A palavra com poucas buscas demais não chega a 4 clientes. Teste as duas menores na aba Campanha: \"óculos de sol\" fecha a conta.",
      },
      falaAoConcluir: { texto: "Menos buscas, menos gasto, e o primeiro lugar. Bom jeito de começar. Fez sozinho!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "configurarCampanha", palavraChave: "oculos-de-sol" }],
    },
  ],
  conclusao: [
    { texto: "Palavra com muita busca traz muitos cliques e gasta a verba rápido. Uma palavra mais específica traz menos cliques e gasta menos.", expressao: "feliz" },
    { texto: "Ampla, de frase e exata são os tipos de correspondência da palavra-chave (conferido em 30/09/2026).", expressao: "pensativo" },
  ],
  missaoDeCampo:
    "Pense num negócio do seu bairro e escreva três palavras-chave que uma pessoa digitaria para achar ele: uma bem geral, uma média e uma bem específica. Qual você testaria primeiro?",
  falaFinal: { texto: "Próxima fase: a página de destino, a peça que mais pesa.", expressao: "apontando" },
};
