/* Revisão de contador-js: duas situações próprias, ação e previsão no Console. */
import type { ItemRevisao } from "../tipos";
export const ITENS_CONTADOR_JS: ItemRevisao[] = [
  {
    "id": "contador-js-1",
    "conceito": "contador-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Treino: use while para contar salto de 1 a 2 e mostrar cada valor.",
      "toque": "Treino: use while para contar salto de 1 a 2 e mostrar cada valor."
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
          "nome": "salto",
          "valor": 3
        },
        {
          "tipo": "saida",
          "igual": [
            "1",
            "2"
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
      "dica": "0, 1 e 2 entram; a terceira atualização deixa rodada em 3."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let salto = 1\nwhile (salto <= 2) { console.log(salto); salto++ }"
      }
    ]
  },
  {
    "id": "contador-js-2",
    "conceito": "contador-js",
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
      "nome": "rodada",
      "valor": 3
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "0, 1 e 2 entram; a terceira atualização deixa rodada em 3."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "let rodada = 0\nwhile (rodada <= 2) { rodada++ }"
      }
    ],
    "previsao": {
      "pergunta": "let rodada = 0; while (rodada <= 2) { rodada++ }; qual o valor final?",
      "opcoes": [
        "1",
        "2",
        "3"
      ],
      "correta": 2,
      "explicacao": "0, 1 e 2 entram; a terceira atualização deixa rodada em 3."
    }
  }
];
