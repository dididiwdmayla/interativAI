/* Revisão de if-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_IF_JS: ItemRevisao[] = [
  {
    "id": "if-js-1",
    "conceito": "if-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Estufa: com temperatura 35, mostre \"Calor\" com um if.",
      "toque": "Estufa: com temperatura 35, mostre \"Calor\" com um if."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let temperatura = 35"
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "Calor"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "if"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual condição é true com temperatura 35?",
      "dica": "if (temperatura > 30) { console.log(\"Calor\") }."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "if (temperatura > 30) {\n  console.log(\"Calor\")\n}"
      }
    ]
  },
  {
    "id": "if-js-2",
    "conceito": "if-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite rodando o código da pergunta.",
      "toque": "Confira seu palpite rodando o código da pergunta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let idade = 10"
    },
    "previsao": {
      "pergunta": "Com idade = 10, o que aparece em if (idade >= 18) { console.log('Adulto') }?",
      "opcoes": [
        "Adulto",
        "Nada",
        "Um erro"
      ],
      "correta": 1,
      "explicacao": "10 >= 18 é false: o bloco é pulado e nada aparece."
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "usouSintaxe",
          "sintaxe": "if"
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "A condição é true ou false?",
      "dica": "Condição false: o bloco do if é pulado."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "if (idade >= 18) {\n  console.log('Adulto')\n}"
      }
    ]
  }
];
