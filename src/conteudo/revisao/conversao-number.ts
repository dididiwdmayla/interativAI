/* Revisão de conversao-number: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_CONVERSAO_NUMBER: ItemRevisao[] = [
  {
    "id": "conversao-number-1",
    "conceito": "conversao-number",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Ingressos: some \"35\" e 5 corretamente, guardando o número em totalIngressos.",
      "toque": "Ingressos: some \"35\" e 5 corretamente, guardando o número em totalIngressos."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "valorVariavel",
      "nome": "totalIngressos",
      "valor": 40
    },
    "ajudas": {
      "pergunta": "Qual valor essa tarefa precisa produzir?",
      "dica": "Converta com Number antes de somar; o resultado passa a ser numérico."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let totalIngressos = Number(\"35\") + 5"
      }
    ]
  },
  {
    "id": "conversao-number-2",
    "conceito": "conversao-number",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite executando o código da pergunta.",
      "toque": "Confira seu palpite executando o código da pergunta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "O que o Console responde para Number(\"9\") + 1?",
      "opcoes": [
        "'91'",
        "10",
        "NaN"
      ],
      "correta": 1,
      "explicacao": "Converta com Number antes de somar; o resultado passa a ser numérico."
    },
    "validador": {
      "tipo": "respostaDoConsole",
      "valor": 10
    },
    "ajudas": {
      "pergunta": "O que cada pedaço do código faz com o valor?",
      "dica": "Converta com Number antes de somar; o resultado passa a ser numérico."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "Number(\"9\") + 1"
      }
    ]
  }
];
