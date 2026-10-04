/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_PARAMETRO_ARGUMENTO: ItemRevisao[] = [
  {
    "id": "parametro-argumento-1",
    "conceito": "parametro-argumento",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie juntar(a,b) devolvendo a+b e guarde total = juntar(9,4).",
      "toque": "Crie juntar(a,b) devolvendo a+b e guarde total = juntar(9,4)."
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
          "nome": "juntar",
          "casos": [
            {
              "args": [
                0,
                0
              ],
              "esperado": 0
            },
            {
              "args": [
                9,
                4
              ],
              "esperado": 13
            }
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "total",
          "valor": 13
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "valor é o parâmetro; o argumento entregue é 8."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "function juntar(a,b) { return a+b }\nlet total = juntar(9,4)"
      }
    ]
  },
  {
    "id": "parametro-argumento-2",
    "conceito": "parametro-argumento",
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
      "dica": "valor é o parâmetro; o argumento entregue é 8."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ],
    "previsao": {
      "pergunta": "tirar(valor) recebe estoque = 8. Qual é o argumento?",
      "opcoes": [
        "valor",
        "estoque é sempre o parâmetro",
        "8"
      ],
      "correta": 2,
      "explicacao": "valor é o parâmetro; o argumento entregue é 8."
    }
  }
];
