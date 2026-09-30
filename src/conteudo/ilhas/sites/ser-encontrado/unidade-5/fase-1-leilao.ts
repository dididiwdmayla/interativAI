/*
 * S5, Fase 1: "Quem aparece primeiro" (Pizzaria Forno Vivo). Simulador de
 * campanha (apresenta a aba Campanha).
 *
 * O QUE ENSINA: o leilão do anúncio (quem paga mais NÃO aparece sempre em
 * primeiro), o custo por clique (o lance é o máximo; o custo real costuma
 * ficar abaixo) e a palavra-chave (o que a pessoa digita).
 *
 * SIMPLIFICAÇÃO, e o texto diz: neste simulador a posição sai de lance vezes
 * qualidade. No Google de verdade, a classificação do anúncio é definida pelo
 * lance, pela qualidade do anúncio e da página de destino, pelos limites
 * mínimos de qualidade, pela concorrência do leilão, pelo contexto da pesquisa
 * e pelos recursos do anúncio (conferido em 30/09/2026, em
 * plataformas-marketing.ts). O Índice de qualidade NÃO entra no leilão (a
 * Fase 3 explica). Números fictícios, declarados na tela.
 *
 * ORDEM: 1) guiado, com previsão (a confusão "quem paga mais aparece em
 * primeiro"): comprar o 1º lugar pelo lance; 2) guiado, com previsão sobre o
 * custo por clique: descer para o 2º lugar e olhar o custo; 3) sozinho, em
 * outra palavra-chave (menos buscas): o 2º lugar de novo, com poucos cliques.
 */
import type { DadosCampanha } from "@/motor/campanha";
import type { FaseSimuladorCampanha } from "@/conteudo/tipos";
import { PIZZARIA_FORNO_VIVO } from "./sites/pizzariaFornoVivo";

export const CAMPANHA_S5_F1: DadosCampanha = {
  anunciante: "Pizzaria Forno Vivo",
  palavras: [
    { id: "pizza-em-campinas", texto: "pizza em Campinas", buscasPorDia: 2000, cpcMedio: 1.8, concorrencia: "alta" },
    { id: "pizza-artesanal", texto: "pizza artesanal", buscasPorDia: 700, cpcMedio: 1.1, concorrencia: "media" },
    { id: "pizzaria-no-cambui", texto: "pizzaria no Cambuí", buscasPorDia: 350, cpcMedio: 0.6, concorrencia: "baixa" },
  ],
  concorrentes: [
    { nome: "Pizza Rápida", lance: 2.2, qualidade: 6 },
    { nome: "Forno & Cia", lance: 1.5, qualidade: 8 },
    { nome: "Massa Boa", lance: 1.8, qualidade: 5 },
  ],
  orcamentoInicial: 200,
  palavraInicial: "pizza-em-campinas",
  lanceInicial: 1,
};

export const FASE_S5_F1: FaseSimuladorCampanha = {
  id: "sites-ser-encontrado-u5-f1",
  tipo: "simulador-campanha",
  unidadeId: "sites-ser-encontrado-u5",
  titulo: "Quem aparece primeiro",
  conceitos: ["leilao-de-anuncio", "custo-por-clique", "palavra-chave-de-anuncio"],
  revisa: [],
  prerequisitos: ["conversao"],
  usaFerramentas: ["simulador-campanha"],
  siteAlvo: PIZZARIA_FORNO_VIVO,
  campanha: CAMPANHA_S5_F1,
  introducao: [
    { texto: "Anúncio pago: quando alguém busca, os anunciantes disputam, num leilão, quem aparece. A Pizzaria Forno Vivo quer entrar nessa disputa.", expressao: "curioso" },
    { texto: "Atenção: este simulador é uma simplificação. Aqui a posição sai de lance vezes qualidade, e todos os números são fictícios.", expressao: "apontando" },
    { texto: "No Google de verdade entram mais coisas. Vamos ver isso no fim da fase.", expressao: "pensativo" },
  ],
  objetivos: [
    {
      id: "primeiro-lugar",
      tipo: "previsao",
      modo: "guiado",
      apresentar: ["simulador-campanha"],
      previsao: {
        pergunta: "Quem paga mais (o maior lance) aparece sempre em primeiro no leilão?",
        opcoes: ["Sim: o maior lance ganha sempre", "Não: o lance é só uma das coisas que contam", "Só se o orçamento for alto"],
        correta: 1,
        explicacao: "O lance conta, mas não sozinho: a qualidade do anúncio e da página também pesam. Aqui, por simplificação, a posição sai de lance vezes qualidade.",
      },
      enunciado: {
        mouse: "Abra a aba Campanha e suba o lance até o anúncio ficar em primeiro no leilão.",
        toque: "Abra a aba Campanha e suba o lance até o anúncio ficar em primeiro no leilão.",
      },
      validador: { tipo: "simulacao", metrica: "posicao", op: "==", valor: 1 },
      ajudas: {
        pergunta: "No leilão desta fase, o que decide a posição: só o lance?",
        dica: "Aqui é lance vezes qualidade (uma simplificação). Com a página fraca, a qualidade é baixa: precisa de um lance bem mais alto.",
        linha: { alvo: "ferramenta", ferramenta: "simulador-campanha", fala: "O lance fica aqui em cima. Suba ele até o primeiro lugar." },
        solucao: {
          fala: "Subi o lance para R$ 4,00: primeiro lugar, mas pagando caro. Repare no custo por cliente.",
          acoes: [{ tipo: "configurarCampanha", lance: 4 }],
        },
      },
      falaAoConcluir: { texto: "Primeiro lugar! Mas repare: quantos clientes vieram, e quanto custou cada um?", expressao: "pensativo" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "configurarCampanha", lance: 4 },
      ],
    },
    {
      id: "custo-por-clique",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Seu lance máximo é R$ 4,00. Quanto você paga por cada clique?",
        opcoes: ["Sempre os R$ 4,00 inteiros", "O dobro do lance", "Costuma ser menos: o custo real fica abaixo do lance"],
        correta: 2,
        explicacao: "O lance é o máximo que você aceita pagar. O custo real costuma ficar abaixo dele: aqui, é o mínimo para manter a sua posição.",
      },
      enunciado: {
        mouse: "Olhe o custo por clique no painel e depois baixe o lance até ficar em 2º lugar (não em 1º).",
        toque: "Olhe o custo por clique no painel e depois baixe o lance até ficar em 2º lugar (não em 1º).",
      },
      validador: { tipo: "simulacao", metrica: "posicao", op: "==", valor: 2 },
      ajudas: {
        pergunta: "Se você baixar o lance, o que acontece com a posição e com o custo?",
        dica: "Baixe o lance aos poucos, olhando o leilão: em algum ponto você passa do 1º para o 2º lugar.",
        linha: { alvo: "ferramenta", ferramenta: "simulador-campanha", fala: "O lance está aqui. Baixe um pouco de cada vez, até o 2º lugar." },
        solucao: {
          fala: "Baixei o lance para R$ 2,80: agora é o 2º lugar, pagando menos por clique.",
          acoes: [{ tipo: "configurarCampanha", lance: 2.8 }],
        },
      },
      falaAoConcluir: { texto: "2º lugar, e o custo por cliente caiu um pouco. Mas continuam poucos clientes: a página é que pesa.", expressao: "pensativo" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 2 },
        { tipo: "configurarCampanha", lance: 2.8 },
      ],
    },
    {
      id: "outra-palavra-chave",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Troque a palavra-chave para \"pizzaria no Cambuí\" (menos buscas) e continue em 2º lugar, com no máximo 30 cliques.",
        toque: "Troque a palavra-chave para \"pizzaria no Cambuí\" (menos buscas) e continue em 2º lugar, com no máximo 30 cliques.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "simulacao", metrica: "posicao", op: "==", valor: 2 },
          { tipo: "simulacao", metrica: "cliques", op: "<=", valor: 30 },
        ],
      },
      ajudas: {
        pergunta: "A palavra-chave é o que a pessoa digita. Quem digita \"pizzaria no Cambuí\" são muitas ou poucas pessoas?",
        dica: "Escolha a palavra na aba Campanha: menos buscas por dia, menos cliques. O lance continua o mesmo.",
      },
      falaAoConcluir: { texto: "Outra palavra, menos cliques, mesma posição. Fez sozinho!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "configurarCampanha", palavraChave: "pizzaria-no-cambui" }],
    },
  ],
  conclusao: [
    { texto: "No leilão, o custo por clique real costuma ficar abaixo do lance máximo. E a palavra-chave é o que a pessoa digita na busca.", expressao: "feliz" },
    { texto: "No Google de verdade, a posição vem do lance, da qualidade do anúncio e da página, dos limites mínimos de qualidade e da concorrência.", expressao: "pensativo" },
    { texto: "Também contam o contexto da pesquisa (termos, local, dispositivo, horário) e os recursos do anúncio, como sitelinks (conferido em 30/09/2026).", expressao: "apontando" },
  ],
  missaoDeCampo:
    "Busque no Google algo que dê anúncio (por exemplo, \"pizza perto de mim\"). Quantos anúncios aparecem antes dos resultados normais? O primeiro é o mais conhecido? Anote o que você achou.",
  falaFinal: { texto: "Próxima fase: o orçamento e as palavras-chave.", expressao: "feliz" },
};
