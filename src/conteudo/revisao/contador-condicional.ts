/* Revisão de contador-condicional: duas situações próprias, ação e previsão no Console. */
import type { ItemRevisao } from "../tipos";
export const ITENS_CONTADOR_CONDICIONAL: ItemRevisao[] = [
  {
    "id": "contador-condicional-1",
    "conceito": "contador-condicional",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Sensor: visite valores 10, 20, 30 e 40; conte em alertas os > 25 com for e if.",
      "toque": "Sensor: visite valores 10, 20, 30 e 40; conte em alertas os > 25 com for e if."
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
          "nome": "alertas",
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
      "dica": "Só n igual a 2 ou 3 passa no if; o contador cresce duas vezes."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let alertas = 0\nfor (let n = 1; n <= 4; n++) { if (n * 10 > 25) { alertas++ } }"
      }
    ]
  },
  {
    "id": "contador-condicional-2",
    "conceito": "contador-condicional",
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
      "nome": "aprovados",
      "valor": 2
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "Só n igual a 2 ou 3 passa no if; o contador cresce duas vezes."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "let aprovados = 0\nfor (let n = 1; n <= 3; n++) { if (n > 1) { aprovados++ } }"
      }
    ],
    "previsao": {
      "pergunta": "let aprovados = 0; for (let n = 1; n <= 3; n++) { if (n > 1) { aprovados++ } }; quanto fica aprovados?",
      "opcoes": [
        "2",
        "3",
        "1"
      ],
      "correta": 0,
      "explicacao": "Só n igual a 2 ou 3 passa no if; o contador cresce duas vezes."
    }
  }
];
