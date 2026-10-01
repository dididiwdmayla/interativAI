/* Revisão de break-js: duas situações próprias, ação e previsão no Console. */
import type { ItemRevisao } from "../tipos";
export const ITENS_BREAK_JS: ItemRevisao[] = [
  {
    "id": "break-js-1",
    "conceito": "break-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Busca: percorra \"CAJU\" e pare antes de J; mostre só C e A.",
      "toque": "Busca: percorra \"CAJU\" e pare antes de J; mostre só C e A."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "C",
            "A"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "for-of"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "break"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "A primeira letra é mostrada; break sai antes das outras voltas."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "for (let letra of \"CAJU\") { if (letra === \"J\") { break }; console.log(letra) }"
      }
    ]
  },
  {
    "id": "break-js-2",
    "conceito": "break-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja e confira rodando o código da pergunta no Console.",
      "toque": "Preveja e confira rodando o código da pergunta no Console."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "M"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "break"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "A primeira letra é mostrada; break sai antes das outras voltas."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "for (let letra of \"MEL\") { console.log(letra); break }"
      }
    ],
    "previsao": {
      "pergunta": "for (let letra of \"MEL\") { console.log(letra); break }; o que aparece?",
      "opcoes": [
        "M, E e L",
        "Só M",
        "Nada"
      ],
      "correta": 1,
      "explicacao": "A primeira letra é mostrada; break sai antes das outras voltas."
    }
  }
];
