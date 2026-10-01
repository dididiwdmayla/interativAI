/* Revisão de igualdade-estrita: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_IGUALDADE_ESTRITA: ItemRevisao[] = [
  {
    "id": "igualdade-estrita-1",
    "conceito": "igualdade-estrita",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Armário: compare \"4\" === 4 no Console.",
      "toque": "Armário: compare \"4\" === 4 no Console."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "respostaDoConsole",
          "valor": false
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "igualdade-estrita"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor essa tarefa precisa produzir?",
      "dica": "=== compara valor e tipo; não guarda nem altera valores."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "\"4\" === 4"
      }
    ]
  },
  {
    "id": "igualdade-estrita-2",
    "conceito": "igualdade-estrita",
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
      "pergunta": "O que o Console responde para 9 === 9?",
      "opcoes": [
        "false",
        "9",
        "true"
      ],
      "correta": 2,
      "explicacao": "=== compara valor e tipo; não guarda nem altera valores."
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "respostaDoConsole",
          "valor": true
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "igualdade-estrita"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que cada pedaço do código faz com o valor?",
      "dica": "=== compara valor e tipo; não guarda nem altera valores."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "9 === 9"
      }
    ]
  }
];
