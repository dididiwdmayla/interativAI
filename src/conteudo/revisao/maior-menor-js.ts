/* Revisão de maior-menor-js: duas situações próprias, ação e previsão no Console. */
import type { ItemRevisao } from "../tipos";
export const ITENS_MAIOR_MENOR_JS: ItemRevisao[] = [
  {
    "id": "maior-menor-js-1",
    "conceito": "maior-menor-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Medidas 2, 4 e 6: comece maior e menor em 2 e encontre os extremos com for e if.",
      "toque": "Medidas 2, 4 e 6: comece maior e menor em 2 e encontre os extremos com for e if."
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
          "nome": "maior",
          "valor": 6
        },
        {
          "tipo": "valorVariavel",
          "nome": "menor",
          "valor": 2
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "for"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "if"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "Entre -2, -4 e -6, o maior é -2. Iniciar em 0 inventaria um valor que não está nas medidas."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let maior = 2\nlet menor = 2\nfor (let n = 1; n <= 3; n++) { let medida = n * 2; if (medida > maior) { maior = medida }; if (medida < menor) { menor = medida } }"
      }
    ]
  },
  {
    "id": "maior-menor-js-2",
    "conceito": "maior-menor-js",
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
      "nome": "maior",
      "valor": -2
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "Entre -2, -4 e -6, o maior é -2. Iniciar em 0 inventaria um valor que não está nas medidas."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "let maior = -2\nfor (let n = 1; n <= 3; n++) { let valor = -n * 2; if (valor > maior) { maior = valor } }"
      }
    ],
    "previsao": {
      "pergunta": "let maior = -2; for (let n = 1; n <= 3; n++) { let valor = -n * 2; if (valor > maior) { maior = valor } }; qual maior?",
      "opcoes": [
        "0",
        "-6",
        "-2"
      ],
      "correta": 2,
      "explicacao": "Entre -2, -4 e -6, o maior é -2. Iniciar em 0 inventaria um valor que não está nas medidas."
    }
  }
];
