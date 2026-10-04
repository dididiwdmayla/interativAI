/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_ARROW_JS: ItemRevisao[] = [
  {
    "id": "arrow-js-1",
    "conceito": "arrow-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Escreva const quadrado = (n) => n*n e guarde total = quadrado(5).",
      "toque": "Escreva const quadrado = (n) => n*n e guarde total = quadrado(5)."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "funcaoPassa",
          "nome": "quadrado",
          "casos": [
            {
              "args": [
                0
              ],
              "esperado": 0
            },
            {
              "args": [
                5
              ],
              "esperado": 25
            },
            {
              "args": [
                -2
              ],
              "esperado": 4
            }
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "total",
          "valor": 25
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "arrow"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "A seta cria uma função com parâmetro e retorno."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const quadrado = (n) => n*n\nlet total = quadrado(5)"
      }
    ]
  },
  {
    "id": "arrow-js-2",
    "conceito": "arrow-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Responda à previsão sobre a função.",
      "toque": "Responda à previsão sobre a função."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "A seta cria uma função com parâmetro e retorno."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ],
    "previsao": {
      "pergunta": "const saudacao = (nome) => \"Oi \" + nome é o quê?",
      "opcoes": [
        "Um texto",
        "Uma função",
        "Um laço"
      ],
      "correta": 1,
      "explicacao": "A seta cria uma função com parâmetro e retorno."
    }
  }
];
