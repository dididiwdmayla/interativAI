/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_RETORNO_IMPLICITO: ItemRevisao[] = [
  {
    "id": "retorno-implicito-1",
    "conceito": "retorno-implicito",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie const metros = (cm) => cm/100 e guarde total = metros(250).",
      "toque": "Crie const metros = (cm) => cm/100 e guarde total = metros(250)."
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
          "nome": "metros",
          "casos": [
            {
              "args": [
                0
              ],
              "esperado": 0
            },
            {
              "args": [
                250
              ],
              "esperado": 2.5
            }
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "total",
          "valor": 2.5
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "arrow"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "Sem chaves a expressão é o retorno."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const metros = (cm) => cm/100\nlet total = metros(250)"
      }
    ]
  },
  {
    "id": "retorno-implicito-2",
    "conceito": "retorno-implicito",
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
      "dica": "Sem chaves a expressão é o retorno."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ],
    "previsao": {
      "pergunta": "const aumentar = (n) => n+8; aumentar(2) devolve quanto?",
      "opcoes": [
        "undefined",
        "8",
        "10"
      ],
      "correta": 2,
      "explicacao": "Sem chaves a expressão é o retorno."
    }
  }
];
