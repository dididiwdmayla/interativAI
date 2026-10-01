/* Revisão de operadores-logicos: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_OPERADORES_LOGICOS: ItemRevisao[] = [
  {
    "id": "operadores-logicos-1",
    "conceito": "operadores-logicos",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Guarde em acesso: ativo E NÃO suspenso.",
      "toque": "Guarde em acesso: ativo E NÃO suspenso."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {
      "preparo": "let ativo = true\nlet suspenso = false"
    },
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "valorVariavel",
          "nome": "acesso",
          "valor": true
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "let"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "e-logico"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "nao-logico"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Que operadores fazem o E e o NÃO?",
      "dica": "let acesso = ativo && !suspenso."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let acesso = ativo && !suspenso"
      }
    ]
  },
  {
    "id": "operadores-logicos-2",
    "conceito": "operadores-logicos",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Confira seu palpite escolhendo a opção.",
      "toque": "Confira seu palpite escolhendo a opção."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "Qual operador do código faz o papel do portão OU?",
      "opcoes": [
        "&&",
        "||",
        "!"
      ],
      "correta": 1,
      "explicacao": "|| é o OU; && é o E e ! é o NÃO."
    },
    "ajudas": {
      "pergunta": "Qual operador tem as duas barras?",
      "dica": "|| é o OU, && é o E e ! é o NÃO."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  }
];
