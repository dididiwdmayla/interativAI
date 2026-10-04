/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_MOLDURA_FUNCAO: ItemRevisao[] = [
  {
    "id": "moldura-funcao-1",
    "conceito": "moldura-funcao",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie bater() mostrando \"Porta\" e chame duas vezes.",
      "toque": "Crie bater() mostrando \"Porta\" e chame duas vezes."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "saida",
      "igual": [
        "Porta",
        "Porta"
      ]
    },
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "A chamada terminou e voltou para fora."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "function bater() { console.log(\"Porta\") }\nbater()\nbater()"
      }
    ]
  },
  {
    "id": "moldura-funcao-2",
    "conceito": "moldura-funcao",
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
      "dica": "A chamada terminou e voltou para fora."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ],
    "previsao": {
      "pergunta": "Quando acender() termina, sua moldura permanece?",
      "opcoes": [
        "Sim",
        "Não",
        "Só se imprimir"
      ],
      "correta": 1,
      "explicacao": "A chamada terminou e voltou para fora."
    }
  }
];
