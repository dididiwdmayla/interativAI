/* Revisão de comparacao-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_COMPARACAO_JS: ItemRevisao[] = [
  {
    "id": "comparacao-js-1",
    "conceito": "comparacao-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Estufa: pergunte se temperatura é maior que 30.",
      "toque": "Estufa: pergunte se temperatura é maior que 30."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let temperatura = 31"
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "respostaDoConsole",
          "valor": true
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "comparacao"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual sinal pergunta 'é maior que?'",
      "dica": "temperatura > 30 responde true ou false."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "temperatura > 30"
      }
    ]
  },
  {
    "id": "comparacao-js-2",
    "conceito": "comparacao-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite executando o código da pergunta.",
      "toque": "Confira seu palpite executando o código da pergunta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let saldo = 40"
    },
    "previsao": {
      "pergunta": "Com saldo = 40, o que o Console responde para saldo < 50?",
      "opcoes": [
        "false",
        "true",
        "40"
      ],
      "correta": 1,
      "explicacao": "40 é menor que 50, então a resposta é true."
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "respostaDoConsole",
          "valor": true
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "comparacao"
        }
      ]
    },
    "ajudas": {
      "pergunta": "40 é menor que 50?",
      "dica": "O < pergunta 'é menor que?' e responde true ou false."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "saldo < 50"
      }
    ]
  }
];
