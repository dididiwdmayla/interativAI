/* Revisão de aspas-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_ASPAS_JS: ItemRevisao[] = [
  {
    "id": "aspas-js-1",
    "conceito": "aspas-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Rótulo da mala: guarde \"Recife\" em let destino, usando aspas.",
      "toque": "Rótulo da mala: guarde \"Recife\" em let destino, usando aspas."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "valorVariavel",
      "nome": "destino",
      "valor": "Recife"
    },
    "ajudas": {
      "pergunta": "Qual valor essa tarefa precisa produzir?",
      "dica": "Sem aspas, uma palavra é lida como nome de variável."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let destino = \"Recife\""
      }
    ]
  },
  {
    "id": "aspas-js-2",
    "conceito": "aspas-js",
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
      "pergunta": "O que o Console responde para Bahia sem ter criado uma variável Bahia?",
      "opcoes": [
        "ReferenceError",
        "'Bahia'",
        "undefined"
      ],
      "correta": 0,
      "explicacao": "Sem aspas, uma palavra é lida como nome de variável."
    },
    "validador": {
      "tipo": "erroDoTipo",
      "nome": "ReferenceError"
    },
    "ajudas": {
      "pergunta": "O que cada pedaço do código faz com o valor?",
      "dica": "Sem aspas, uma palavra é lida como nome de variável."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "Bahia"
      }
    ]
  }
];
