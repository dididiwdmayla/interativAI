/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_RETURN_JS: ItemRevisao[] = [
  {
    "id": "return-js-1",
    "conceito": "return-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie metade(n) devolvendo n/2 e guarde total = metade(18).",
      "toque": "Crie metade(n) devolvendo n/2 e guarde total = metade(18)."
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
          "nome": "metade",
          "casos": [
            {
              "args": [
                0
              ],
              "esperado": 0
            },
            {
              "args": [
                18
              ],
              "esperado": 9
            },
            {
              "args": [
                -4
              ],
              "esperado": -2
            }
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "total",
          "valor": 9
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "return entrega 10 à variável total."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "function metade(n) { return n/2 }\nlet total = metade(18)"
      }
    ]
  },
  {
    "id": "return-js-2",
    "conceito": "return-js",
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
      "dica": "return entrega 10 à variável total."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ],
    "previsao": {
      "pergunta": "adicionar(6), com return n+4, devolve quanto?",
      "opcoes": [
        "10",
        "6",
        "undefined"
      ],
      "correta": 0,
      "explicacao": "return entrega 10 à variável total."
    }
  }
];
