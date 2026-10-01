/* Revisão de falsy-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_FALSY_JS: ItemRevisao[] = [
  {
    "id": "falsy-js-1",
    "conceito": "falsy-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Loja: com cupom vazio, mostre \"Sem cupom\" usando if (cupom) e else.",
      "toque": "Loja: com cupom vazio, mostre \"Sem cupom\" usando if (cupom) e else."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let cupom = \"\""
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "Sem cupom"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "if"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "else"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O texto vazio conta como verdadeiro ou falso?",
      "dica": "Falso: if (cupom) { ... } else { ... } vai para o else."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "if (cupom) {\n  console.log(\"Com cupom\")\n} else {\n  console.log(\"Sem cupom\")\n}"
      }
    ]
  },
  {
    "id": "falsy-js-2",
    "conceito": "falsy-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite rodando o código da pergunta.",
      "toque": "Confira seu palpite rodando o código da pergunta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "O que mostra if (0) { 'A' } else { 'B' }?",
      "opcoes": [
        "B",
        "A",
        "Nada"
      ],
      "correta": 0,
      "explicacao": "O número 0 é falso, então roda o else."
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "B"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "if"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O 0 é verdadeiro ou falso?",
      "dica": "O 0 é falso."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "if (0) {\n  console.log('A')\n} else {\n  console.log('B')\n}"
      }
    ]
  }
];
