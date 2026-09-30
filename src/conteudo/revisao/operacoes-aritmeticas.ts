/*
 * Revisão: as operações de conta (Lógica U1, Fase 1). Itens de programa (Console e palco, sem mini-site):
 * a situação nova vem do enunciado e do preparo.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_OPERACOES_ARITMETICAS: ItemRevisao[] = [
  {
    id: "operacoes-aritmeticas-1",
    conceito: "operacoes-aritmeticas",
    tipo: "acao",
    enunciado: {
      mouse: "Uma pizza de R$ 45 dividida entre 3 amigos: pergunte ao Console quanto cada um paga.",
      toque: "Uma pizza de R$ 45 dividida entre 3 amigos: pergunte ao Console quanto cada um paga.",
    },
    siteAlvo: { body: "" },
    programa: {},
    validador: { tipo: "respostaDoConsole", valor: 15 },
    ajudas: { pergunta: "Qual sinal divide no JavaScript?", dica: "A barra: / divide, * multiplica." },
    solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "45 / 3" }],
  },
  {
    id: "operacoes-aritmeticas-2",
    conceito: "operacoes-aritmeticas",
    tipo: "previsao",
    enunciado: { mouse: "Confira: escreva 7 % 2 no Console.", toque: "Confira: escreva 7 % 2 no Console." },
    siteAlvo: { body: "" },
    programa: {},
    previsao: {
      pergunta: "O sinal % dá o resto da divisão. O que o Console responde para 7 % 2?",
      opcoes: ["3.5", "0", "1"],
      correta: 2,
      explicacao: "7 dividido por 2 dá 3 e sobra 1. O % responde o que sobra: 1. Serve para saber se um número é par.",
    },
    validador: { tipo: "respostaDoConsole", valor: 1 },
    ajudas: { pergunta: "Quantas vezes o 2 cabe no 7, e quanto sobra?", dica: "O % não é porcentagem: é o resto da divisão." },
    solucaoDeTeste: [
      { tipo: "responderPrevisao", opcao: 2 },
      { tipo: "executarNoConsole", codigo: "7 % 2" },
    ],
  },
];
