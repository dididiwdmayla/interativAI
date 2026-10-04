/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_ESCOPO_BLOCO_JS: ItemRevisao[] = [
  {
    "id": "escopo-bloco-js-1",
    "conceito": "escopo-bloco-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie categoria(n): resultado fora do if, taxa = 2 dentro; devolva resultado.",
      "toque": "Crie categoria(n): resultado fora do if, taxa = 2 dentro; devolva resultado."
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
          "nome": "categoria",
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
              "esperado": 7
            },
            {
              "args": [
                -1
              ],
              "esperado": -1
            }
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "total",
          "valor": 7
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "let pertence ao bloco, mesmo quando a condição é verdadeira."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "function categoria(n) { let resultado = n; if(n > 0) { let taxa = 2; resultado += taxa }; return resultado }\nlet total = categoria(5)"
      }
    ]
  },
  {
    "id": "escopo-bloco-js-2",
    "conceito": "escopo-bloco-js",
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
      "dica": "let pertence ao bloco, mesmo quando a condição é verdadeira."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ],
    "previsao": {
      "pergunta": "pulseira criada no if existe depois do bloco?",
      "opcoes": [
        "Sim",
        "Só se o if passou",
        "Não"
      ],
      "correta": 2,
      "explicacao": "let pertence ao bloco, mesmo quando a condição é verdadeira."
    }
  }
];
