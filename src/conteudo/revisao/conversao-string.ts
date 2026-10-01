/* Revisão de conversao-string: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_CONVERSAO_STRING: ItemRevisao[] = [
  {
    "id": "conversao-string-1",
    "conceito": "conversao-string",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Placar: guarde String(42) em let placarTexto.",
      "toque": "Placar: guarde String(42) em let placarTexto."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "valorVariavel",
      "nome": "placarTexto",
      "valor": "42"
    },
    "ajudas": {
      "pergunta": "Qual valor essa tarefa precisa produzir?",
      "dica": "String produz texto; + com texto junta em vez de somar."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let placarTexto = String(42)"
      }
    ]
  },
  {
    "id": "conversao-string-2",
    "conceito": "conversao-string",
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
      "pergunta": "O que o Console responde para String(3) + 1?",
      "opcoes": [
        "4",
        "Erro",
        "'31'"
      ],
      "correta": 2,
      "explicacao": "String produz texto; + com texto junta em vez de somar."
    },
    "validador": {
      "tipo": "respostaDoConsole",
      "valor": "31"
    },
    "ajudas": {
      "pergunta": "O que cada pedaço do código faz com o valor?",
      "dica": "String produz texto; + com texto junta em vez de somar."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "String(3) + 1"
      }
    ]
  }
];
