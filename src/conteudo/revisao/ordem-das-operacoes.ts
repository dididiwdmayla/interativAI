/*
 * Revisão: a ordem das operações (Lógica U1, Fase 1). Itens de programa (Console e palco, sem mini-site):
 * a situação nova vem do enunciado e do preparo.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_ORDEM_DAS_OPERACOES: ItemRevisao[] = [
  {
    id: "ordem-das-operacoes-1",
    conceito: "ordem-das-operacoes",
    tipo: "acao",
    enunciado: {
      mouse: "Cinema: 2 ingressos de R$ 20 e R$ 5 de taxa. Faça a conta numa linha só, sem parênteses.",
      toque: "Cinema: 2 ingressos de R$ 20 e R$ 5 de taxa. Faça a conta numa linha só, sem parênteses.",
    },
    siteAlvo: { body: "" },
    programa: {},
    validador: { tipo: "respostaDoConsole", valor: 45 },
    ajudas: { pergunta: "O vezes vem antes ou depois do mais?", dica: "5 + 20 * 2 já faz o vezes primeiro." },
    solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "5 + 20 * 2" }],
  },
  {
    id: "ordem-das-operacoes-2",
    conceito: "ordem-das-operacoes",
    tipo: "previsao",
    enunciado: { mouse: "Confira: escreva (10 + 2) * 3 no Console.", toque: "Confira: escreva (10 + 2) * 3 no Console." },
    siteAlvo: { body: "" },
    programa: {},
    previsao: {
      pergunta: "O que o Console responde para (10 + 2) * 3?",
      opcoes: ["16", "36", "30"],
      correta: 1,
      explicacao: "O parêntese vem primeiro: 10 + 2 = 12, e 12 * 3 = 36. Sem ele, daria 16.",
    },
    validador: { tipo: "respostaDoConsole", valor: 36 },
    ajudas: { pergunta: "O que está entre parênteses é feito quando?", dica: "Antes de tudo, mesmo antes do vezes." },
    solucaoDeTeste: [
      { tipo: "responderPrevisao", opcao: 1 },
      { tipo: "executarNoConsole", codigo: "(10 + 2) * 3" },
    ],
  },
];
