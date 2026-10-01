/* Revisão de atribuir-ou-comparar: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_ATRIBUIR_OU_COMPARAR: ItemRevisao[] = [
  {
    "id": "atribuir-ou-comparar-1",
    "conceito": "atribuir-ou-comparar",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Placar: pergunte se pontos é 10 sem mudar a caixinha.",
      "toque": "Placar: pergunte se pontos é 10 sem mudar a caixinha."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let pontos = 10"
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "respostaDoConsole",
          "valor": true
        },
        {
          "tipo": "valorVariavel",
          "nome": "pontos",
          "valor": 10
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "igualdade-estrita"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual sinal pergunta sem guardar?",
      "dica": "pontos === 10 pergunta. Um = guardaria."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "pontos === 10"
      }
    ]
  },
  {
    "id": "atribuir-ou-comparar-2",
    "conceito": "atribuir-ou-comparar",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite executando o código da pergunta.",
      "toque": "Confira seu palpite executando o código da pergunta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let pontos = 10"
    },
    "previsao": {
      "pergunta": "Rodando pontos = 5, o que a caixinha pontos passa a guardar?",
      "opcoes": [
        "5",
        "10",
        "false"
      ],
      "correta": 0,
      "explicacao": "Um = guarda: pontos passa a valer 5."
    },
    "validador": {
      "tipo": "valorVariavel",
      "nome": "pontos",
      "valor": 5
    },
    "ajudas": {
      "pergunta": "Um = pergunta ou guarda?",
      "dica": "O = guarda o valor novo na caixinha."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "pontos = 5"
      }
    ]
  }
];
