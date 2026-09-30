/*
 * Revisão: Índice de qualidade (S5, Fase 3).
 *
 * Só previsões: o Índice de qualidade é um diagnóstico do Google (fora do
 * jogo). As duas perguntas dizem o que ele é (1 a 10, por palavra-chave, um
 * DIAGNÓSTICO que NÃO entra no leilão) e as três partes dele. O simulador da unidade é uma simplificação (lance vezes qualidade, números fictícios); o item pergunta o que o Google de verdade considera (conferido em 30/09/2026).
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_INDICE_DE_QUALIDADE: ItemRevisao[] = [
  {
    id: "indice-de-qualidade-1",
    conceito: "indice-de-qualidade",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "lojadeflores.exemplo",
      titulo: "Loja de Flores Pétala",
      body: `<h1>Loja de Flores Pétala</h1>
<p>Buquês e arranjos para todas as datas.</p>`,
    },
    previsao: {
      pergunta: "O Índice de qualidade do Google (1 a 10) serve para...",
      opcoes: [
        "Multiplicar o lance no leilão",
        "Diagnosticar onde o anúncio e a página estão fracos",
        "Escolher o orçamento do dia",
      ],
      correta: 1,
      explicacao: "O Índice de qualidade é uma ferramenta de diagnóstico, por palavra-chave, e não é usado no leilão.",
    },
    ajudas: {
      pergunta: "Ele decide a posição, ou mostra onde melhorar?",
      dica: "É diagnóstico: mostra onde melhorar, e não entra no leilão.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
  {
    id: "indice-de-qualidade-2",
    conceito: "indice-de-qualidade",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "estudiodedanca.exemplo",
      titulo: "Estúdio Movimento",
      body: `<h1>Estúdio Movimento</h1>
<p>Aulas de ballet, jazz e dança de salão.</p>`,
    },
    previsao: {
      pergunta: "Qual destas é uma das três partes do Índice de qualidade?",
      opcoes: ["O tamanho do orçamento diário", "O horário do dia da busca", "A experiência na página de destino"],
      correta: 2,
      explicacao: "As três partes são a taxa de cliques esperada, a relevância do anúncio e a experiência na página de destino.",
    },
    ajudas: {
      pergunta: "Uma das três partes fala da página onde a pessoa cai depois do clique. Qual?",
      dica: "São três: taxa de cliques esperada, relevância do anúncio e experiência na página de destino.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];
