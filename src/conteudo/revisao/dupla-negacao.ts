/* Revisão de dupla-negacao: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_DUPLA_NEGACAO: ItemRevisao[] = [
  {
    "id": "dupla-negacao-1",
    "conceito": "dupla-negacao",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Conta: guarde em temSaldo o booleano de saldo (0), usando !!.",
      "toque": "Conta: guarde em temSaldo o booleano de saldo (0), usando !!."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let saldo = 0"
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "valorVariavel",
          "nome": "temSaldo",
          "valor": false
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "nao-logico"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Como transformar saldo em true ou false?",
      "dica": "let temSaldo = !!saldo: o 0 é falso."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let temSaldo = !!saldo"
      }
    ]
  },
  {
    "id": "dupla-negacao-2",
    "conceito": "dupla-negacao",
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
      "pergunta": "O que o Console responde para !!'oi'?",
      "opcoes": [
        "true",
        "false",
        "'oi'"
      ],
      "correta": 0,
      "explicacao": "Texto com caractere é verdadeiro, e o !! devolve o booleano true."
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
          "sintaxe": "nao-logico"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O !! devolve o valor ou um booleano?",
      "dica": "Sempre um booleano."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "!!'oi'"
      }
    ]
  }
];
