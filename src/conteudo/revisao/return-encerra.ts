/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_RETURN_ENCERRA: ItemRevisao[] = [
  {
    "id": "return-encerra-1",
    "conceito": "return-encerra",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie sinal(n): devolva 0 se n < 0; senão devolva 1.",
      "toque": "Crie sinal(n): devolva 0 se n < 0; senão devolva 1."
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
          "nome": "sinal",
          "casos": [
            {
              "args": [
                -2
              ],
              "esperado": 0
            },
            {
              "args": [
                0
              ],
              "esperado": 1
            },
            {
              "args": [
                2
              ],
              "esperado": 1
            }
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "total",
          "valor": 0
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "A chamada termina no return; a linha seguinte não roda."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "function sinal(n) { if(n < 0) { return 0 }; return 1 }\nlet total = sinal(-2)"
      }
    ]
  },
  {
    "id": "return-encerra-2",
    "conceito": "return-encerra",
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
      "dica": "A chamada termina no return; a linha seguinte não roda."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ],
    "previsao": {
      "pergunta": "return 7; console.log(\"depois\"): a mensagem aparece?",
      "opcoes": [
        "Sim",
        "Só uma vez",
        "Não"
      ],
      "correta": 2,
      "explicacao": "A chamada termina no return; a linha seguinte não roda."
    }
  }
];
