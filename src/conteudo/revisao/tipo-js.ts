/* Revisão de tipo-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_TIPO_JS: ItemRevisao[] = [
  {
    "id": "tipo-js-1",
    "conceito": "tipo-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Painel do elevador: guarde false, sem aspas, em let emManutencao.",
      "toque": "Painel do elevador: guarde false, sem aspas, em let emManutencao."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "valorVariavel",
      "nome": "emManutencao",
      "valor": false
    },
    "ajudas": {
      "pergunta": "Qual valor essa tarefa precisa produzir?",
      "dica": "true e false sem aspas são valores booleanos."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let emManutencao = false"
      }
    ]
  },
  {
    "id": "tipo-js-2",
    "conceito": "tipo-js",
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
      "pergunta": "O que o Console responde para typeof false?",
      "opcoes": [
        "'boolean'",
        "'string'",
        "'number'"
      ],
      "correta": 0,
      "explicacao": "true e false sem aspas são valores booleanos."
    },
    "validador": {
      "tipo": "respostaDoConsole",
      "valor": "boolean"
    },
    "ajudas": {
      "pergunta": "O que cada pedaço do código faz com o valor?",
      "dica": "true e false sem aspas são valores booleanos."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "typeof false"
      }
    ]
  }
];
