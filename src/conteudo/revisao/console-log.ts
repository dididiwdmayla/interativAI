/* Revisão de console-log: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_CONSOLE_LOG: ItemRevisao[] = [
  {
    "id": "console-log-1",
    "conceito": "console-log",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Museu: mostre \"Entrada gratuita\" com console.log.",
      "toque": "Museu: mostre \"Entrada gratuita\" com console.log."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "saida",
      "igual": [
        "Entrada gratuita"
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor essa tarefa precisa produzir?",
      "dica": "console.log mostra a mensagem e devolve undefined."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "console.log(\"Entrada gratuita\")"
      }
    ]
  },
  {
    "id": "console-log-2",
    "conceito": "console-log",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite executando o código da pergunta.",
      "toque": "Confira seu palpite executando o código da pergunta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "Depois de mostrar \"Treino concluído\", o que console.log(\"Treino concluído\") devolve?",
      "opcoes": [
        "undefined",
        "'Treino concluído'",
        "16"
      ],
      "correta": 0,
      "explicacao": "console.log mostra a mensagem e devolve undefined."
    },
    "validador": {
      "tipo": "saida",
      "igual": [
        "Treino concluído"
      ]
    },
    "ajudas": {
      "pergunta": "O que cada pedaço do código faz com o valor?",
      "dica": "console.log mostra a mensagem e devolve undefined."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "console.log(\"Treino concluído\")"
      }
    ]
  }
];
