/* Revisão de else-if-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_ELSE_IF_JS: ItemRevisao[] = [
  {
    "id": "else-if-js-1",
    "conceito": "else-if-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Clima: com temperatura 18, mostre \"Frio\" (menos de 15), \"Agradável\" (menos de 25) ou \"Calor\".",
      "toque": "Clima: com temperatura 18, mostre \"Frio\" (menos de 15), \"Agradável\" (menos de 25) ou \"Calor\"."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let temperatura = 18"
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "Agradável"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "else"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual pergunta dá true com 18?",
      "dica": "if (temperatura < 15) { } else if (temperatura < 25) { } else { }."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "if (temperatura < 15) {\n  console.log(\"Frio\")\n} else if (temperatura < 25) {\n  console.log(\"Agradável\")\n} else {\n  console.log(\"Calor\")\n}"
      }
    ]
  },
  {
    "id": "else-if-js-2",
    "conceito": "else-if-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite rodando o código da pergunta.",
      "toque": "Confira seu palpite rodando o código da pergunta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let pontos = 50"
    },
    "previsao": {
      "pergunta": "Com pontos = 50, o que aparece em if (pontos > 10) { 'A' } else if (pontos > 40) { 'B' }?",
      "opcoes": [
        "A",
        "B",
        "A e B"
      ],
      "correta": 0,
      "explicacao": "A primeira condição já é true, e o else if é ignorado."
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "A"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "if"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O else if roda se o if já foi true?",
      "dica": "Não: o programa para na primeira true."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "if (pontos > 10) {\n  console.log('A')\n} else if (pontos > 40) {\n  console.log('B')\n}"
      }
    ]
  }
];
