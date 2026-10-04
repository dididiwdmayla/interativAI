/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_ESCOPO_GLOBAL_JS: ItemRevisao[] = [
  {
    "id": "escopo-global-js-1",
    "conceito": "escopo-global-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie pontos = 0 fora e marcar() aumentando. Chame três vezes.",
      "toque": "Crie pontos = 0 fora e marcar() aumentando. Chame três vezes."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "valorVariavel",
      "nome": "pontos",
      "valor": 3
    },
    "ajudas": {
      "pergunta": "O que a chamada entrega e onde as caixinhas existem?",
      "dica": "A função alterou a mesma caixinha global."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "let pontos = 0\nfunction marcar() { pontos++ }\nmarcar()\nmarcar()\nmarcar()"
      }
    ]
  },
  {
    "id": "escopo-global-js-2",
    "conceito": "escopo-global-js",
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
      "dica": "A função alterou a mesma caixinha global."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ],
    "previsao": {
      "pergunta": "saldo global começa em 5; depositar soma 2. Quanto fica fora?",
      "opcoes": [
        "7",
        "5",
        "2"
      ],
      "correta": 0,
      "explicacao": "A função alterou a mesma caixinha global."
    }
  }
];
