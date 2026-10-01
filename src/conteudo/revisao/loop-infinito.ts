/* Revisão de loop-infinito: duas situações próprias, ação e previsão no Console. */
import type { ItemRevisao } from "../tipos";
export const ITENS_LOOP_INFINITO: ItemRevisao[] = [
  {
    "id": "loop-infinito-1",
    "conceito": "loop-infinito",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Porta: corrija while (tentativa < 2) { tentativa = tentativa } atualizando tentativa.",
      "toque": "Porta: corrija while (tentativa < 2) { tentativa = tentativa } atualizando tentativa."
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
          "nome": "tentativa",
          "valor": 2
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "while"
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "A variável não muda: a condição nunca fica falsa. A proteção corta o programa, sem corrigir o bug."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let tentativa = 0\nwhile (tentativa < 2) { tentativa++ }"
      }
    ]
  },
  {
    "id": "loop-infinito-2",
    "conceito": "loop-infinito",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja e confira rodando o código da pergunta no Console.",
      "toque": "Preveja e confira rodando o código da pergunta no Console."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "erroDoTipo",
          "nome": "Parada do jogo"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "while"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que muda em cada volta?",
      "dica": "A variável não muda: a condição nunca fica falsa. A proteção corta o programa, sem corrigir o bug."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      },
      {
        "tipo": "executarNoConsole",
        "codigo": "let bateria = 1\nwhile (bateria > 0) { bateria = bateria }"
      }
    ],
    "previsao": {
      "pergunta": "let bateria = 1; while (bateria > 0) { bateria = bateria }; o que ocorre no jogo?",
      "opcoes": [
        "Termina sozinho",
        "Proteção interrompe",
        "Volta ao início inteiro"
      ],
      "correta": 1,
      "explicacao": "A variável não muda: a condição nunca fica falsa. A proteção corta o programa, sem corrigir o bug."
    }
  }
];
