/* Revisão de bloco-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_BLOCO_JS: ItemRevisao[] = [
  {
    "id": "bloco-js-1",
    "conceito": "bloco-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Máquina: mostre \"Ligado\" e \"Pronto\" dentro do mesmo if.",
      "toque": "Máquina: mostre \"Ligado\" e \"Pronto\" dentro do mesmo if."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let ligado = true"
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "Ligado",
            "Pronto"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "if"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Onde ficam as duas linhas para rodarem juntas?",
      "dica": "Entre as chaves do mesmo if."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "if (ligado) {\n  console.log(\"Ligado\")\n  console.log(\"Pronto\")\n}"
      }
    ]
  },
  {
    "id": "bloco-js-2",
    "conceito": "bloco-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite rodando o código da pergunta.",
      "toque": "Confira seu palpite rodando o código da pergunta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let x = 5"
    },
    "previsao": {
      "pergunta": "Quantas linhas aparecem em if (x > 1) { console.log('a'); console.log('b') }?",
      "opcoes": [
        "1",
        "2",
        "0"
      ],
      "correta": 1,
      "explicacao": "As duas linhas estão no mesmo bloco: com a condição true, rodam juntas."
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "a",
            "b"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "if"
        }
      ]
    },
    "ajudas": {
      "pergunta": "As duas linhas estão dentro das chaves?",
      "dica": "O bloco roda inteiro."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "if (x > 1) { console.log('a'); console.log('b') }"
      }
    ]
  }
];
