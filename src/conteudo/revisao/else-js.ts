/* Revisão de else-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_ELSE_JS: ItemRevisao[] = [
  {
    "id": "else-js-1",
    "conceito": "else-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Conta: mostre \"Entrar\" se logado e \"Cadastrar\" se não.",
      "toque": "Conta: mostre \"Entrar\" se logado e \"Cadastrar\" se não."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let logado = false"
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "Cadastrar"
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
      "pergunta": "O que roda quando logado é false?",
      "dica": "O else: if (logado) { ... } else { ... }."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "if (logado) {\n  console.log(\"Entrar\")\n} else {\n  console.log(\"Cadastrar\")\n}"
      }
    ]
  },
  {
    "id": "else-js-2",
    "conceito": "else-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite rodando o código da pergunta.",
      "toque": "Confira seu palpite rodando o código da pergunta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let senhaCerta = false"
    },
    "previsao": {
      "pergunta": "Com senhaCerta false, o que aparece em if (senhaCerta) { 'Bem-vindo' } else { 'Tente de novo' }?",
      "opcoes": [
        "Tente de novo",
        "Bem-vindo",
        "Nada"
      ],
      "correta": 0,
      "explicacao": "A condição é false: o else assume."
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "saida",
          "igual": [
            "Tente de novo"
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "else"
        }
      ]
    },
    "ajudas": {
      "pergunta": "A condição é true ou false?",
      "dica": "Com false, roda o else."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "if (senhaCerta) {\n  console.log('Bem-vindo')\n} else {\n  console.log('Tente de novo')\n}"
      }
    ]
  }
];
