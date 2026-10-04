/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_CHAMADA_FUNCAO: ItemRevisao[] = [
  {
    "id": "chamada-funcao-1",
    "conceito": "chamada-funcao",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie buzinar() mostrando \"Bip\" e chame duas vezes.",
      "toque": "Crie buzinar() mostrando \"Bip\" e chame duas vezes."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "saida",
      "igual": [
        "Bip",
        "Bip"
      ]
    },
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "Sem parênteses se lê a função, sem chamar."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "function buzinar() { console.log(\"Bip\") }\nbuzinar()\nbuzinar()"
      }
    ]
  },
  {
    "id": "chamada-funcao-2",
    "conceito": "chamada-funcao",
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
      "dica": "Sem parênteses se lê a função, sem chamar."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ],
    "previsao": {
      "pergunta": "chamar sem () mostra \"Mesa 4\"?",
      "opcoes": [
        "Não",
        "Sim",
        "Duas vezes"
      ],
      "correta": 0,
      "explicacao": "Sem parênteses se lê a função, sem chamar."
    }
  }
];
