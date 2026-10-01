/* Revisão de coercao-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_COERCAO_JS: ItemRevisao[] = [
  {
    "id": "coercao-js-1",
    "conceito": "coercao-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Corrida: rode \"3\" + 7 e confira a junção.",
      "toque": "Corrida: rode \"3\" + 7 e confira a junção."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "respostaDoConsole",
      "valor": "37"
    },
    "ajudas": {
      "pergunta": "Qual valor essa tarefa precisa produzir?",
      "dica": "O + com texto junta; * tenta converter o texto numérico antes da conta."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "\"3\" + 7"
      }
    ]
  },
  {
    "id": "coercao-js-2",
    "conceito": "coercao-js",
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
      "pergunta": "O que o Console responde para \"6\" * 2?",
      "opcoes": [
        "12",
        "'62'",
        "Erro"
      ],
      "correta": 0,
      "explicacao": "O + com texto junta; * tenta converter o texto numérico antes da conta."
    },
    "validador": {
      "tipo": "respostaDoConsole",
      "valor": 12
    },
    "ajudas": {
      "pergunta": "O que cada pedaço do código faz com o valor?",
      "dica": "O + com texto junta; * tenta converter o texto numérico antes da conta."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "\"6\" * 2"
      }
    ]
  }
];
