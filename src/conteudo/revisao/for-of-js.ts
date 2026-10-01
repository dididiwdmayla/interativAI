/* Revisão de for-of-js: duas situações próprias, ação e previsão no Console. */
import type { ItemRevisao } from "../tipos";
export const ITENS_FOR_OF_JS: ItemRevisao[] = [
  {
    "id": "for-of-js-1",
    "conceito": "for-of-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Placa: percorra \"PAZ\" com for...of e mostre uma letra por linha.",
      "toque": "Placa: percorra \"PAZ\" com for...of e mostre uma letra por linha."
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
            "P",
            "A",
            "Z"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "for-of"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "O texto entrega A, V e E, nessa ordem."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "for (let letra of \"PAZ\") { console.log(letra) }"
      }
    ]
  },
  {
    "id": "for-of-js-2",
    "conceito": "for-of-js",
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
            "A",
            "V",
            "E"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "for-of"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "O texto entrega A, V e E, nessa ordem."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "for (let letra of \"AVE\") { console.log(letra) }"
      }
    ],
    "previsao": {
      "pergunta": "for (let letra of \"AVE\") { console.log(letra) }; qual a segunda linha?",
      "opcoes": [
        "A",
        "E",
        "V"
      ],
      "correta": 2,
      "explicacao": "O texto entrega A, V e E, nessa ordem."
    }
  }
];
