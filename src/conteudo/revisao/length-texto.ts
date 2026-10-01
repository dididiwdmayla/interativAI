/* Revisão de length-texto: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_LENGTH_TEXTO: ItemRevisao[] = [
  {
    "id": "length-texto-1",
    "conceito": "length-texto",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Senha de exemplo: guarde em let tamanho o tamanho de \"ab 12\".",
      "toque": "Senha de exemplo: guarde em let tamanho o tamanho de \"ab 12\"."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "valorVariavel",
      "nome": "tamanho",
      "valor": 5
    },
    "ajudas": {
      "pergunta": "Qual valor essa tarefa precisa produzir?",
      "dica": "O tamanho destes textos inclui os espaços."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let tamanho = \"ab 12\".length"
      }
    ]
  },
  {
    "id": "length-texto-2",
    "conceito": "length-texto",
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
      "pergunta": "O que o Console responde para \"Rio azul\".length?",
      "opcoes": [
        "7",
        "9",
        "8"
      ],
      "correta": 2,
      "explicacao": "O tamanho destes textos inclui os espaços."
    },
    "validador": {
      "tipo": "respostaDoConsole",
      "valor": 8
    },
    "ajudas": {
      "pergunta": "O que cada pedaço do código faz com o valor?",
      "dica": "O tamanho destes textos inclui os espaços."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "\"Rio azul\".length"
      }
    ]
  }
];
