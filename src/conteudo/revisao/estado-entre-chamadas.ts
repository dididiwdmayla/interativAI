/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_ESTADO_ENTRE_CHAMADAS: ItemRevisao[] = [
  {
    "id": "estado-entre-chamadas-1",
    "conceito": "estado-entre-chamadas",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie leituras = 0 fora e ler() aumentando e devolvendo. Guarde duas respostas.",
      "toque": "Crie leituras = 0 fora e ler() aumentando e devolvendo. Guarde duas respostas."
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
          "nome": "leituras",
          "valor": 2
        },
        {
          "tipo": "valorVariavel",
          "nome": "a",
          "valor": 1
        },
        {
          "tipo": "valorVariavel",
          "nome": "b",
          "valor": 2
        }
      ]
    },
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "Cada chamada cria uma nova variável local em zero."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let leituras = 0\nfunction ler() { leituras++; return leituras }\nlet a = ler()\nlet b = ler()"
      }
    ]
  },
  {
    "id": "estado-entre-chamadas-2",
    "conceito": "estado-entre-chamadas",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Responda à previsão sobre a função.",
      "toque": "Responda à previsão sobre a função."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "Cada chamada cria uma nova variável local em zero."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ],
    "previsao": {
      "pergunta": "tentativas = 0 dentro: a segunda chamada devolve quanto?",
      "opcoes": [
        "1",
        "2",
        "0"
      ],
      "correta": 0,
      "explicacao": "Cada chamada cria uma nova variável local em zero."
    }
  }
];
