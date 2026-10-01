/* Revisão de concatenacao-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_CONCATENACAO_JS: ItemRevisao[] = [
  {
    "id": "concatenacao-js-1",
    "conceito": "concatenacao-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Biblioteca: junte \"Sala\", um espaço e \"Azul\" em let placa.",
      "toque": "Biblioteca: junte \"Sala\", um espaço e \"Azul\" em let placa."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "valorVariavel",
      "nome": "placa",
      "valor": "Sala Azul"
    },
    "ajudas": {
      "pergunta": "Qual valor essa tarefa precisa produzir?",
      "dica": "O + entre textos junta sem inventar espaços."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let placa = \"Sala\" + \" \" + \"Azul\""
      }
    ]
  },
  {
    "id": "concatenacao-js-2",
    "conceito": "concatenacao-js",
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
      "pergunta": "O que o Console responde para \"bom\" + \"dia\"?",
      "opcoes": [
        "'bom dia'",
        "Erro",
        "'bomdia'"
      ],
      "correta": 2,
      "explicacao": "O + entre textos junta sem inventar espaços."
    },
    "validador": {
      "tipo": "respostaDoConsole",
      "valor": "bomdia"
    },
    "ajudas": {
      "pergunta": "O que cada pedaço do código faz com o valor?",
      "dica": "O + entre textos junta sem inventar espaços."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "\"bom\" + \"dia\""
      }
    ]
  }
];
