/* Revisão de comentario-js: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_COMENTARIO_JS: ItemRevisao[] = [
  {
    "id": "comentario-js-1",
    "conceito": "comentario-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Bateria: crie carga = 50, comente carga = 0 e some 10. Termine com carga em 60.",
      "toque": "Bateria: crie carga = 50, comente carga = 0 e some 10. Termine com carga em 60."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "valorVariavel",
          "nome": "carga",
          "valor": 60
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "comentario"
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor essa tarefa precisa produzir?",
      "dica": "Só o trecho cercado pelo comentário é ignorado; o código ao redor continua rodando."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let carga = 50\n// carga = 0\ncarga = carga + 10"
      }
    ]
  },
  {
    "id": "comentario-js-2",
    "conceito": "comentario-js",
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
      "pergunta": "O que o Console responde para 8 /* explicação */ + 1?",
      "opcoes": [
        "9",
        "8",
        "undefined"
      ],
      "correta": 0,
      "explicacao": "Só o trecho cercado pelo comentário é ignorado; o código ao redor continua rodando."
    },
    "validador": {
      "tipo": "respostaDoConsole",
      "valor": 9
    },
    "ajudas": {
      "pergunta": "O que cada pedaço do código faz com o valor?",
      "dica": "Só o trecho cercado pelo comentário é ignorado; o código ao redor continua rodando."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "8 /* explicação */ + 1"
      }
    ]
  }
];
