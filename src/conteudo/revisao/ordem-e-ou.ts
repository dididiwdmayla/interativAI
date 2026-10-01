/* Revisão de ordem-e-ou: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_ORDEM_E_OU: ItemRevisao[] = [
  {
    "id": "ordem-e-ou-1",
    "conceito": "ordem-e-ou",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Pergunte true || false && false sem parênteses.",
      "toque": "Pergunte true || false && false sem parênteses."
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
          "valor": true
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "e-logico"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "ou-logico"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual operador é calculado primeiro, && ou ||?",
      "dica": "O && vem antes: false && false é false, e true || false é true."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "true || false && false"
      }
    ]
  },
  {
    "id": "ordem-e-ou-2",
    "conceito": "ordem-e-ou",
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
      "pergunta": "O que o Console responde para (true || false) && false?",
      "opcoes": [
        "true",
        "false"
      ],
      "correta": 1,
      "explicacao": "Os parênteses forçam o OU primeiro (true) e o E depois: true && false é false."
    },
    "validador": {
      "tipo": "respostaDoConsole",
      "valor": false
    },
    "ajudas": {
      "pergunta": "O que está entre parênteses vai primeiro?",
      "dica": "Parênteses mandam: calcule o de dentro antes."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "(true || false) && false"
      }
    ]
  }
];
