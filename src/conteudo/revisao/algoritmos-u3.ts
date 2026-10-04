/* Duas previsões por conceito em situações próprias; não exigem ferramentas além do Console. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_ALGORITMOS_U3: readonly ItemRevisao[] = [
  {
    "id": "recursao-js-1",
    "conceito": "recursao-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia o caso e escolha sua previsão.",
      "toque": "Leia o caso e escolha sua previsão."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que muda com essa entrada?",
      "dica": "Uma função chama ela mesma para resolver uma versão menor do problema; cada chamada ganha uma moldura."
    },
    "previsao": {
      "pergunta": "f(2) chama f(1), que chama f(0). Quantas molduras de f podem ficar abertas juntas?",
      "opcoes": [
        "1",
        "2",
        "3"
      ],
      "correta": 2,
      "explicacao": "Três chamadas esperam seus retornos."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "recursao-js-2",
    "conceito": "recursao-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia o caso e escolha sua previsão.",
      "toque": "Leia o caso e escolha sua previsão."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que muda com essa entrada?",
      "dica": "Uma função chama ela mesma para resolver uma versão menor do problema; cada chamada ganha uma moldura."
    },
    "previsao": {
      "pergunta": "Uma função recursiva de contagem tem base n<=0 e chama com n-1. contar(0) abre outra chamada?",
      "opcoes": [
        "Não",
        "Sim",
        "Duas"
      ],
      "correta": 0,
      "explicacao": "O caso base responde sem nova chamada."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "caso-base-recursao-1",
    "conceito": "caso-base-recursao",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia o caso e escolha sua previsão.",
      "toque": "Leia o caso e escolha sua previsão."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que muda com essa entrada?",
      "dica": "O caso base devolve uma resposta sem nova chamada; sem alcançá-lo, a recursão continua até a proteção cortar."
    },
    "previsao": {
      "pergunta": "A receita usa if(n===0) return 0 e chama com n-1. Partindo de -2, ela chega a 0?",
      "opcoes": [
        "Sim",
        "Não",
        "Depende da máquina"
      ],
      "correta": 1,
      "explicacao": "-2, -3, -4: o caminho se afasta de zero."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "caso-base-recursao-2",
    "conceito": "caso-base-recursao",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia o caso e escolha sua previsão.",
      "toque": "Leia o caso e escolha sua previsão."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que muda com essa entrada?",
      "dica": "O caso base devolve uma resposta sem nova chamada; sem alcançá-lo, a recursão continua até a proteção cortar."
    },
    "previsao": {
      "pergunta": "Na função de pastas, qual caso pode parar sem chamar outra função?",
      "opcoes": [
        "Pasta sem filhos",
        "Qualquer pasta",
        "Pasta com mais filhos"
      ],
      "correta": 0,
      "explicacao": "Uma pasta vazia não tem outro problema a visitar."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "problema-menor-recursao-1",
    "conceito": "problema-menor-recursao",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia o caso e escolha sua previsão.",
      "toque": "Leia o caso e escolha sua previsão."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que muda com essa entrada?",
      "dica": "A cada chamada, diminuir o número ou avançar na lista aproxima a função do caso de parada."
    },
    "previsao": {
      "pergunta": "Uma soma chama soma(lista,indice+1). O que se aproxima da parada?",
      "opcoes": [
        "O tamanho da tela",
        "O preço",
        "O índice chega a length"
      ],
      "correta": 2,
      "explicacao": "A cada chamada falta um vagão a menos para o fim."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "problema-menor-recursao-2",
    "conceito": "problema-menor-recursao",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia o caso e escolha sua previsão.",
      "toque": "Leia o caso e escolha sua previsão."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que muda com essa entrada?",
      "dica": "A cada chamada, diminuir o número ou avançar na lista aproxima a função do caso de parada."
    },
    "previsao": {
      "pergunta": "Uma contagem positiva usa contar(n+1) e para em n===0. O que precisa mudar?",
      "opcoes": [
        "Aproximar n de zero",
        "A cor do palco",
        "Nada"
      ],
      "correta": 0,
      "explicacao": "Com n positivo, aumentar afasta a contagem da parada."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  }
];
