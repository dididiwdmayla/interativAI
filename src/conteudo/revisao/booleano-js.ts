/* Revisão de booleano-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_BOOLEANO_JS: ItemRevisao[] = [
  {
    "id": "booleano-js-1",
    "conceito": "booleano-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Armário: guarde em chovendo o booleano que diz que está chovendo (true).",
      "toque": "Armário: guarde em chovendo o booleano que diz que está chovendo (true)."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "valorVariavel",
      "nome": "chovendo",
      "valor": true
    },
    "ajudas": {
      "pergunta": "Qual valor diz sim no mundo dos booleanos?",
      "dica": "true e false não levam aspas: let chovendo = true."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let chovendo = true"
      }
    ]
  },
  {
    "id": "booleano-js-2",
    "conceito": "booleano-js",
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
      "pergunta": "O que o Console responde para typeof (3 > 2)?",
      "opcoes": [
        "boolean",
        "true",
        "number"
      ],
      "correta": 0,
      "explicacao": "A comparação devolve true, e o tipo de true é boolean."
    },
    "validador": {
      "tipo": "respostaDoConsole",
      "valor": "boolean"
    },
    "ajudas": {
      "pergunta": "Que tipo de valor uma comparação devolve?",
      "dica": "Comparações respondem true ou false: um booleano."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "typeof (3 > 2)"
      }
    ]
  }
];
