/* Revisão de portao-ou: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_PORTAO_OU: ItemRevisao[] = [
  {
    "id": "portao-ou-1",
    "conceito": "portao-ou",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Pagamento: pergunte temCartao || temDinheiro (só o dinheiro existe).",
      "toque": "Pagamento: pergunte temCartao || temDinheiro (só o dinheiro existe)."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let temCartao = false\nlet temDinheiro = true"
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
          "sintaxe": "ou-logico"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O OU precisa das duas verdadeiras?",
      "dica": "O || dá true se pelo menos uma for true."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "temCartao || temDinheiro"
      }
    ]
  },
  {
    "id": "portao-ou-2",
    "conceito": "portao-ou",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite executando o código da pergunta.",
      "toque": "Confira seu palpite executando o código da pergunta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "O que o Console responde para false || false?",
      "opcoes": [
        "false",
        "true"
      ],
      "correta": 0,
      "explicacao": "Sem nenhuma true, o || responde false."
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
          "sintaxe": "ou-logico"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Existe alguma entrada true?",
      "dica": "O || só dá false quando todas são false."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "false || false"
      }
    ]
  }
];
