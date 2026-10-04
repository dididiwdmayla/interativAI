/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_MOSTRAR_OU_DEVOLVER: ItemRevisao[] = [
  {
    "id": "mostrar-ou-devolver-1",
    "conceito": "mostrar-ou-devolver",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Conserte cubo(n) para devolver n*n*n, em vez de só imprimir.",
      "toque": "Conserte cubo(n) para devolver n*n*n, em vez de só imprimir."
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
          "nome": "cubo",
          "casos": [
            {
              "args": [
                0
              ],
              "esperado": 0
            },
            {
              "args": [
                2
              ],
              "esperado": 8
            },
            {
              "args": [
                -2
              ],
              "esperado": -8
            }
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "total",
          "valor": 8
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "A mensagem não é o retorno."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "function cubo(n) { return n*n*n }\nlet total = cubo(2)"
      }
    ]
  },
  {
    "id": "mostrar-ou-devolver-2",
    "conceito": "mostrar-ou-devolver",
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
      "dica": "A mensagem não é o retorno."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ],
    "previsao": {
      "pergunta": "let resultado = exibir(9), se exibir só imprime n: qual resultado?",
      "opcoes": [
        "9",
        "undefined",
        "\"9\""
      ],
      "correta": 1,
      "explicacao": "A mensagem não é o retorno."
    }
  }
];
