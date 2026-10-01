/* Revisão de string-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_STRING_JS: ItemRevisao[] = [
  {
    "id": "string-js-1",
    "conceito": "string-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Agenda da academia: guarde \"Natação\" em let atividade.",
      "toque": "Agenda da academia: guarde \"Natação\" em let atividade."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "valorVariavel",
      "nome": "atividade",
      "valor": "Natação"
    },
    "ajudas": {
      "pergunta": "Qual valor essa tarefa precisa produzir?",
      "dica": "Entre aspas, até algarismos são texto."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let atividade = \"Natação\""
      }
    ]
  },
  {
    "id": "string-js-2",
    "conceito": "string-js",
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
      "pergunta": "O que o Console responde para \"12\", entre aspas?",
      "opcoes": [
        "O número 12",
        "O texto '12'",
        "undefined"
      ],
      "correta": 1,
      "explicacao": "Entre aspas, até algarismos são texto."
    },
    "validador": {
      "tipo": "respostaDoConsole",
      "valor": "12"
    },
    "ajudas": {
      "pergunta": "O que cada pedaço do código faz com o valor?",
      "dica": "Entre aspas, até algarismos são texto."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "\"12\""
      }
    ]
  }
];
