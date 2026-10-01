/* Revisão de diferente-estrito: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_DIFERENTE_ESTRITO: ItemRevisao[] = [
  {
    "id": "diferente-estrito-1",
    "conceito": "diferente-estrito",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Pedido: pergunte se status é diferente de \"fechado\" com !==.",
      "toque": "Pedido: pergunte se status é diferente de \"fechado\" com !==."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let status = \"aberto\""
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
          "sintaxe": "igualdade-estrita"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O texto aberto é diferente de fechado?",
      "dica": "status !== \"fechado\" responde true quando são diferentes."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "status !== \"fechado\""
      }
    ]
  },
  {
    "id": "diferente-estrito-2",
    "conceito": "diferente-estrito",
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
      "pergunta": "O que o Console responde para 1 !== '1'?",
      "opcoes": [
        "false",
        "1",
        "true"
      ],
      "correta": 2,
      "explicacao": "Número e texto têm tipos diferentes, então são diferentes para o !==."
    },
    "validador": {
      "tipo": "respostaDoConsole",
      "valor": true
    },
    "ajudas": {
      "pergunta": "Número 1 e texto '1' têm o mesmo tipo?",
      "dica": "O !== olha valor e tipo: tipos diferentes dão true."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "1 !== '1'"
      }
    ]
  }
];
