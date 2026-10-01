/* Revisão de condicao-composta: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_CONDICAO_COMPOSTA: ItemRevisao[] = [
  {
    "id": "condicao-composta-1",
    "conceito": "condicao-composta",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Loja: mostre \"Desconto\" se temCupom E total >= 50.",
      "toque": "Loja: mostre \"Desconto\" se temCupom E total >= 50."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let temCupom = true\nlet total = 80"
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "Desconto"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "if"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "e-logico"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Quais duas condições precisam ser true?",
      "dica": "if (temCupom && total >= 50) { ... }."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "if (temCupom && total >= 50) {\n  console.log(\"Desconto\")\n}"
      }
    ]
  },
  {
    "id": "condicao-composta-2",
    "conceito": "condicao-composta",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite rodando o código da pergunta.",
      "toque": "Confira seu palpite rodando o código da pergunta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let chovendo = false\nlet frio = true"
    },
    "previsao": {
      "pergunta": "Com chovendo false e frio true, o que aparece em if (chovendo || frio) { 'Casaco' } else { 'Camiseta' }?",
      "opcoes": [
        "Camiseta",
        "Casaco"
      ],
      "correta": 1,
      "explicacao": "Basta uma condição true no ||: frio é true, então Casaco."
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "Casaco"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "ou-logico"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Existe alguma condição true?",
      "dica": "O || aceita qualquer uma."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "if (chovendo || frio) {\n  console.log('Casaco')\n} else {\n  console.log('Camiseta')\n}"
      }
    ]
  }
];
