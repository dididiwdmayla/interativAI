/* Revisão de template-literal: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_TEMPLATE_LITERAL: ItemRevisao[] = [
  {
    "id": "template-literal-1",
    "conceito": "template-literal",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Viagem: com template, guarde \"Portão 7\" em let aviso usando o valor da caixinha portao.",
      "toque": "Viagem: com template, guarde \"Portão 7\" em let aviso usando o valor da caixinha portao."
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
          "nome": "aviso",
          "valor": "Portão 7"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "template"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor essa tarefa precisa produzir?",
      "dica": "Crases e ${...} encaixam o valor da caixinha no texto."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let portao = 7\nlet aviso = `Portão ${portao}`"
      }
    ]
  },
  {
    "id": "template-literal-2",
    "conceito": "template-literal",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite executando o código da pergunta.",
      "toque": "Confira seu palpite executando o código da pergunta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let km = 8"
    },
    "previsao": {
      "pergunta": "Com km = 8, o que o Console responde para `Faltam ${km} km`?",
      "opcoes": [
        "'Faltam 8 km'",
        "'Faltam ${km} km'",
        "8"
      ],
      "correta": 0,
      "explicacao": "Crases e ${...} encaixam o valor da caixinha no texto."
    },
    "validador": {
      "tipo": "respostaDoConsole",
      "valor": "Faltam 8 km"
    },
    "ajudas": {
      "pergunta": "O que cada pedaço do código faz com o valor?",
      "dica": "Crases e ${...} encaixam o valor da caixinha no texto."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "`Faltam ${km} km`"
      }
    ]
  }
];
