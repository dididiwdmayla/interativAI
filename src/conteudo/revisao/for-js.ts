/* Revisão de for-js: duas situações próprias, ação e previsão no Console. */
import type { ItemRevisao } from "../tipos";
export const ITENS_FOR_JS: ItemRevisao[] = [
  {
    "id": "for-js-1",
    "conceito": "for-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Ingresso: use for para mostrar os números 2, 3 e 4.",
      "toque": "Ingresso: use for para mostrar os números 2, 3 e 4."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "2",
            "3",
            "4"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "for"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "Entram 1, 2 e 3; < deixa o 4 fora."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "for (let numero = 2; numero <= 4; numero++) { console.log(numero) }"
      }
    ]
  },
  {
    "id": "for-js-2",
    "conceito": "for-js",
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
          "tipo": "saida",
          "igual": [
            "1",
            "2",
            "3"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "for"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "Entram 1, 2 e 3; < deixa o 4 fora."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "for (let i = 1; i < 4; i++) { console.log(i) }"
      }
    ],
    "previsao": {
      "pergunta": "for (let i = 1; i < 4; i++) { console.log(i) }; quantas linhas?",
      "opcoes": [
        "3",
        "4",
        "2"
      ],
      "correta": 0,
      "explicacao": "Entram 1, 2 e 3; < deixa o 4 fora."
    }
  }
];
