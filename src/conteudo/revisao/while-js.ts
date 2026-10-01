/* Revisão de while-js: duas situações próprias, ação e previsão no Console. */
import type { ItemRevisao } from "../tipos";
export const ITENS_WHILE_JS: ItemRevisao[] = [
  {
    "id": "while-js-1",
    "conceito": "while-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Bomba: use while para baixar litros de 2 até 0 e mostrar 2 e 1.",
      "toque": "Bomba: use while para baixar litros de 2 até 0 e mostrar 2 e 1."
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
          "nome": "litros",
          "valor": 0
        },
        {
          "tipo": "saida",
          "igual": [
            "2",
            "1"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "while"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "Duas voltas levam passos de 0 a 2; só o corpo se repete."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let litros = 2\nwhile (litros > 0) { console.log(litros); litros-- }"
      }
    ]
  },
  {
    "id": "while-js-2",
    "conceito": "while-js",
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
      "tipo": "valorVariavel",
      "nome": "passos",
      "valor": 2
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "Duas voltas levam passos de 0 a 2; só o corpo se repete."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "let passos = 0\nwhile (passos < 2) { passos++ }"
      }
    ],
    "previsao": {
      "pergunta": "let passos = 0; while (passos < 2) { passos++ }; qual o valor final?",
      "opcoes": [
        "1",
        "2",
        "3"
      ],
      "correta": 1,
      "explicacao": "Duas voltas levam passos de 0 a 2; só o corpo se repete."
    }
  }
];
