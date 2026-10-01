/* Revisão de limite-da-comparacao: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_LIMITE_DA_COMPARACAO: ItemRevisao[] = [
  {
    "id": "limite-da-comparacao-1",
    "conceito": "limite-da-comparacao",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Escola: pergunte se nota >= media (os dois valem 6).",
      "toque": "Escola: pergunte se nota >= media (os dois valem 6)."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let nota = 6\nlet media = 6"
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
      "pergunta": "A nota igual à média passa?",
      "dica": ">= aceita igual: com 6 e 6, a resposta é true."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "nota >= media"
      }
    ]
  },
  {
    "id": "limite-da-comparacao-2",
    "conceito": "limite-da-comparacao",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite executando o código da pergunta.",
      "toque": "Confira seu palpite executando o código da pergunta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let vagas = 0"
    },
    "previsao": {
      "pergunta": "Com vagas = 0, o que o Console responde para vagas <= 0?",
      "opcoes": [
        "false",
        "true",
        "0"
      ],
      "correta": 1,
      "explicacao": "<= aceita igual, e 0 é igual a 0."
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
      "pergunta": "Zero é menor ou igual a zero?",
      "dica": "<= inclui o limite: 0 <= 0 dá true."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "vagas <= 0"
      }
    ]
  }
];
