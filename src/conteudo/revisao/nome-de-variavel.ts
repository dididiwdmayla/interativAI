/*
 * Revisão: o nome de variável (Lógica U1, Fase 3). Itens de programa (Console e palco, sem mini-site):
 * a situação nova vem do enunciado e do preparo.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_NOME_DE_VARIAVEL: ItemRevisao[] = [
  {
    id: "nome-de-variavel-1",
    conceito: "nome-de-variavel",
    tipo: "acao",
    enunciado: {
      mouse: "Guarde 30 na caixinha da idade do cliente, com o nome idadeDoCliente (colado, cada palavra nova em maiúscula).",
      toque: "Guarde 30 na caixinha da idade do cliente, com o nome idadeDoCliente (colado, cada palavra nova em maiúscula).",
    },
    siteAlvo: { body: "" },
    programa: {},
    validador: { tipo: "valorVariavel", nome: "idadeDoCliente", valor: 30 },
    ajudas: { pergunta: "Como escrever idade do cliente sem espaço?", dica: "Palavras coladas, a partir da segunda com a primeira letra maiúscula." },
    solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "let idadeDoCliente = 30" }],
  },
  {
    id: "nome-de-variavel-2",
    conceito: "nome-de-variavel",
    tipo: "previsao",
    enunciado: { mouse: "Agora crie a caixinha certa: quantidadeDeOvos com 12.", toque: "Agora crie a caixinha certa: quantidadeDeOvos com 12." },
    siteAlvo: { body: "" },
    programa: {},
    previsao: {
      pergunta: "Qual destes nomes o JavaScript NÃO aceita para uma caixinha?",
      opcoes: ["quantidadeDeOvos", "quantidade de ovos", "totalDoDia"],
      correta: 1,
      explicacao: "Com espaço, o JavaScript acha que são três nomes soltos e dá erro de escrita. Nome de caixinha é tudo junto.",
    },
    validador: { tipo: "valorVariavel", nome: "quantidadeDeOvos", valor: 12 },
    ajudas: { pergunta: "O que um espaço faz no meio de um nome?", dica: "Quebra o nome em pedaços: junte as palavras." },
    solucaoDeTeste: [
      { tipo: "responderPrevisao", opcao: 1 },
      { tipo: "executarNoConsole", codigo: "let quantidadeDeOvos = 12" },
    ],
  },
];
