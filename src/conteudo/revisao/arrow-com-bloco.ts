/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_ARROW_COM_BLOCO: ItemRevisao[] = [
  {
    "id": "arrow-com-bloco-1",
    "conceito": "arrow-com-bloco",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie const menor = (n) => { return n-3 } e guarde total = menor(9).",
      "toque": "Crie const menor = (n) => { return n-3 } e guarde total = menor(9)."
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
          "nome": "menor",
          "casos": [
            {
              "args": [
                0
              ],
              "esperado": -3
            },
            {
              "args": [
                9
              ],
              "esperado": 6
            }
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "total",
          "valor": 6
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "arrow"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "return"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "Com chaves é preciso return; só calcular não devolve."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const menor = (n) => { return n-3 }\nlet total = menor(9)"
      }
    ]
  },
  {
    "id": "arrow-com-bloco-2",
    "conceito": "arrow-com-bloco",
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
      "dica": "Com chaves é preciso return; só calcular não devolve."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ],
    "previsao": {
      "pergunta": "const perder = (n) => { n-3 }; perder(9) devolve o quê?",
      "opcoes": [
        "undefined",
        "6",
        "9"
      ],
      "correta": 0,
      "explicacao": "Com chaves é preciso return; só calcular não devolve."
    }
  }
];
