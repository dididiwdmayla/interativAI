/* Revisão de portao-e: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_PORTAO_E: ItemRevisao[] = [
  {
    "id": "portao-e-1",
    "conceito": "portao-e",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Motor: pergunte motorLigado && tampaFechada (só uma vale).",
      "toque": "Motor: pergunte motorLigado && tampaFechada (só uma vale)."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let motorLigado = true\nlet tampaFechada = false"
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "respostaDoConsole",
          "valor": false
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "e-logico"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O E precisa das duas verdadeiras?",
      "dica": "O && só dá true quando as duas forem true."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "motorLigado && tampaFechada"
      }
    ]
  },
  {
    "id": "portao-e-2",
    "conceito": "portao-e",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite executando o código da pergunta.",
      "toque": "Confira seu palpite executando o código da pergunta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let chuva = true\nlet vento = true"
    },
    "previsao": {
      "pergunta": "Com chuva e vento true, o que sai de chuva && vento?",
      "opcoes": [
        "false",
        "true"
      ],
      "correta": 1,
      "explicacao": "As duas são true, então o && responde true."
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "respostaDoConsole",
          "valor": true
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "e-logico"
        }
      ]
    },
    "ajudas": {
      "pergunta": "As duas entradas estão ligadas?",
      "dica": "O && responde true quando as duas são true."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "chuva && vento"
      }
    ]
  }
];
