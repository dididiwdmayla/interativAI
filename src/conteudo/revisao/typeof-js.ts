/* Revisão de typeof-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_TYPEOF_JS: ItemRevisao[] = [
  {
    "id": "typeof-js-1",
    "conceito": "typeof-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Termômetro: guarde em tipoTemperatura a resposta de typeof 26.",
      "toque": "Termômetro: guarde em tipoTemperatura a resposta de typeof 26."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "valorVariavel",
      "nome": "tipoTemperatura",
      "valor": "number"
    },
    "ajudas": {
      "pergunta": "Qual valor essa tarefa precisa produzir?",
      "dica": "typeof devolve um texto com o nome do tipo; aspas fazem do valor um texto."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let tipoTemperatura = typeof 26"
      }
    ]
  },
  {
    "id": "typeof-js-2",
    "conceito": "typeof-js",
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
      "pergunta": "O que o Console responde para typeof \"26\"?",
      "opcoes": [
        "'number'",
        "'string'",
        "26"
      ],
      "correta": 1,
      "explicacao": "typeof devolve um texto com o nome do tipo; aspas fazem do valor um texto."
    },
    "validador": {
      "tipo": "respostaDoConsole",
      "valor": "string"
    },
    "ajudas": {
      "pergunta": "O que cada pedaço do código faz com o valor?",
      "dica": "typeof devolve um texto com o nome do tipo; aspas fazem do valor um texto."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "typeof \"26\""
      }
    ]
  }
];
