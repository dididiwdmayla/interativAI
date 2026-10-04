/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_ESCOPO_FUNCAO_JS: ItemRevisao[] = [
  {
    "id": "escopo-funcao-js-1",
    "conceito": "escopo-funcao-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie taxa = 30 fora; ajuste(n) usa taxa = 4 local e devolve n + taxa.",
      "toque": "Crie taxa = 30 fora; ajuste(n) usa taxa = 4 local e devolve n + taxa."
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
          "nome": "ajuste",
          "casos": [
            {
              "args": [
                0
              ],
              "esperado": 4
            },
            {
              "args": [
                6
              ],
              "esperado": 10
            }
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "taxa",
          "valor": 30
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "Esse nome não foi criado fora da função."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let taxa = 30\nfunction ajuste(n) { let taxa = 4; return n+taxa }\nlet total = ajuste(6)"
      }
    ]
  },
  {
    "id": "escopo-funcao-js-2",
    "conceito": "escopo-funcao-js",
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
      "dica": "Esse nome não foi criado fora da função."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ],
    "previsao": {
      "pergunta": "ferramenta é local de oficina(). Ler fora faz o quê?",
      "opcoes": [
        "Mostra chave",
        "ReferenceError",
        "undefined"
      ],
      "correta": 1,
      "explicacao": "Esse nome não foi criado fora da função."
    }
  }
];
