/* Revisão de igualdade-solta: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_IGUALDADE_SOLTA: ItemRevisao[] = [
  {
    "id": "igualdade-solta-1",
    "conceito": "igualdade-solta",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Pergunte '3' == 3 no Console e veja a conversão escondida.",
      "toque": "Pergunte '3' == 3 no Console e veja a conversão escondida."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "respostaDoConsole",
          "valor": true
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "igualdade-solta"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O == converte o texto antes de comparar?",
      "dica": "Dois sinais convertem: '3' == 3 responde true."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "'3' == 3"
      }
    ]
  },
  {
    "id": "igualdade-solta-2",
    "conceito": "igualdade-solta",
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
      "pergunta": "O que o Console responde para 0 == false?",
      "opcoes": [
        "false",
        "true",
        "0"
      ],
      "correta": 1,
      "explicacao": "O == converte false em 0 e acha os dois iguais; o === diria false."
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
          "sintaxe": "igualdade-solta"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O == olha o tipo ou converte antes?",
      "dica": "O == converte: false vira 0, e 0 == 0."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "0 == false"
      }
    ]
  }
];
