/* Revisão de portao-nao: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_PORTAO_NAO: ItemRevisao[] = [
  {
    "id": "portao-nao-1",
    "conceito": "portao-nao",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Quarto: pergunte !luzApagada para saber se a luz está acesa.",
      "toque": "Quarto: pergunte !luzApagada para saber se a luz está acesa."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let luzApagada = false"
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
          "sintaxe": "nao-logico"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que o ! faz com false?",
      "dica": "O ! inverte: !false vale true."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "!luzApagada"
      }
    ]
  },
  {
    "id": "portao-nao-2",
    "conceito": "portao-nao",
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
      "pergunta": "O que o Console responde para !true?",
      "opcoes": [
        "true",
        "false"
      ],
      "correta": 1,
      "explicacao": "O ! inverte true para false."
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "respostaDoConsole",
          "valor": false
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "nao-logico"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que o ! faz com true?",
      "dica": "O ! entrega o contrário."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "!true"
      }
    ]
  }
];
