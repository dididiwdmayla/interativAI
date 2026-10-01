/* Revisão de condicao-de-parada: duas situações próprias, ação e previsão no Console. */
import type { ItemRevisao } from "../tipos";
export const ITENS_CONDICAO_DE_PARADA: ItemRevisao[] = [
  {
    "id": "condicao-de-parada-1",
    "conceito": "condicao-de-parada",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Elevador: use while para subir andar de 1 até 4, parando em 4.",
      "toque": "Elevador: use while para subir andar de 1 até 4, parando em 4."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "valorVariavel",
          "nome": "andar",
          "valor": 4
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "while"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "A condição é falsa antes da primeira volta; o corpo é pulado."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let andar = 1\nwhile (andar < 4) { andar++ }"
      }
    ]
  },
  {
    "id": "condicao-de-parada-2",
    "conceito": "condicao-de-parada",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja e confira rodando o código da pergunta no Console.",
      "toque": "Preveja e confira rodando o código da pergunta no Console."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "valorVariavel",
          "nome": "nivel",
          "valor": 5
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "while"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "A condição é falsa antes da primeira volta; o corpo é pulado."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "let nivel = 5\nwhile (nivel < 5) { nivel++ }"
      }
    ],
    "previsao": {
      "pergunta": "let nivel = 5; while (nivel < 5) { nivel++ }; quantas voltas?",
      "opcoes": [
        "0",
        "1",
        "5"
      ],
      "correta": 0,
      "explicacao": "A condição é falsa antes da primeira volta; o corpo é pulado."
    }
  }
];
