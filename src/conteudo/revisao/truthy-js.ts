/* Revisão de truthy-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_TRUTHY_JS: ItemRevisao[] = [
  {
    "id": "truthy-js-1",
    "conceito": "truthy-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Estoque: com lista vazia, mostre \"Lista existe\" usando if (lista).",
      "toque": "Estoque: com lista vazia, mostre \"Lista existe\" usando if (lista)."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let lista = []"
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "Lista existe"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "if"
        }
      ]
    },
    "ajudas": {
      "pergunta": "A lista vazia conta como falsa?",
      "dica": "Não: lista, mesmo vazia, é verdadeira."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "if (lista) {\n  console.log(\"Lista existe\")\n}"
      }
    ]
  },
  {
    "id": "truthy-js-2",
    "conceito": "truthy-js",
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
      "pergunta": "O que mostra if ('0') { 'Entra' } else { 'Não entra' }?",
      "opcoes": [
        "Não entra",
        "Entra"
      ],
      "correta": 1,
      "explicacao": "O texto '0' tem um caractere e conta como verdadeiro."
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "Entra"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "if"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O texto '0' é igual ao número 0?",
      "dica": "Texto com caractere é verdadeiro."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "if ('0') {\n  console.log('Entra')\n} else {\n  console.log('Não entra')\n}"
      }
    ]
  }
];
