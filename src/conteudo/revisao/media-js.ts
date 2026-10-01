/* Revisão de media-js: duas situações próprias, ação e previsão no Console. */
import type { ItemRevisao } from "../tipos";
export const ITENS_MEDIA_JS: ItemRevisao[] = [
  {
    "id": "media-js-1",
    "conceito": "media-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Treino: some tempos 2, 4 e 6 com for, conte quantidade e calcule media.",
      "toque": "Treino: some tempos 2, 4 e 6 com for, conte quantidade e calcule media."
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
          "nome": "media",
          "valor": 4
        },
        {
          "tipo": "valorVariavel",
          "nome": "quantidade",
          "valor": 3
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "for"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "A soma deve ser dividida pela quantidade: 90 / 3 = 30."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let soma = 0\nlet quantidade = 0\nfor (let volta = 1; volta <= 3; volta++) { soma += volta * 2; quantidade++ }\nlet media = soma / quantidade"
      }
    ]
  },
  {
    "id": "media-js-2",
    "conceito": "media-js",
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
      "nome": "media",
      "valor": 30
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "A soma deve ser dividida pela quantidade: 90 / 3 = 30."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "let media = 90 / 3"
      }
    ],
    "previsao": {
      "pergunta": "Soma 90 em três entregas: let media = 90 / 3. Quanto vale media?",
      "opcoes": [
        "90",
        "30",
        "3"
      ],
      "correta": 1,
      "explicacao": "A soma deve ser dividida pela quantidade: 90 / 3 = 30."
    }
  }
];
