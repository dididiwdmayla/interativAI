/* Revisão de acumulador-js: duas situações próprias, ação e previsão no Console. */
import type { ItemRevisao } from "../tipos";
export const ITENS_ACUMULADOR_JS: ItemRevisao[] = [
  {
    "id": "acumulador-js-1",
    "conceito": "acumulador-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Economia: some os depósitos 5, 10 e 15 com for em total, começando em zero.",
      "toque": "Economia: some os depósitos 5, 10 e 15 com for em total, começando em zero."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "valorVariavel",
          "nome": "total",
          "valor": 30
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "for"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "Zerar dentro descarta as voltas anteriores: sobra só o último valor, 3."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let total = 0\nfor (let mes = 1; mes <= 3; mes++) { total += mes * 5 }"
      }
    ]
  },
  {
    "id": "acumulador-js-2",
    "conceito": "acumulador-js",
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
      "tipo": "valorVariavel",
      "nome": "total",
      "valor": 3
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "Zerar dentro descarta as voltas anteriores: sobra só o último valor, 3."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "let total = 0\nfor (let n = 1; n <= 3; n++) { total = 0; total += n }"
      }
    ],
    "previsao": {
      "pergunta": "let total = 0; for (let n = 1; n <= 3; n++) { total = 0; total += n }; quanto fica?",
      "opcoes": [
        "6",
        "0",
        "3"
      ],
      "correta": 2,
      "explicacao": "Zerar dentro descarta as voltas anteriores: sobra só o último valor, 3."
    }
  }
];
