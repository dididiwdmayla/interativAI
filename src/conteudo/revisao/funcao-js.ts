/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_FUNCAO_JS: ItemRevisao[] = [
  {
    "id": "funcao-js-1",
    "conceito": "funcao-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie tocar() mostrando \"Alarme\" e chame uma vez.",
      "toque": "Crie tocar() mostrando \"Alarme\" e chame uma vez."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "Alarme"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "funcao"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "A declaração guarda as instruções; falta uma chamada."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "function tocar() { console.log(\"Alarme\") }\ntocar()"
      }
    ]
  },
  {
    "id": "funcao-js-2",
    "conceito": "funcao-js",
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
      "dica": "A declaração guarda as instruções; falta uma chamada."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ],
    "previsao": {
      "pergunta": "Ao apenas declarar acordar(), o corpo executa?",
      "opcoes": [
        "Sim",
        "Não",
        "Duas vezes"
      ],
      "correta": 1,
      "explicacao": "A declaração guarda as instruções; falta uma chamada."
    }
  }
];
