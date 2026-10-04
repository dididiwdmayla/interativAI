/* Duas previsões por conceito em situações próprias; não exigem ferramentas além do Console. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_ALGORITMOS_U2: readonly ItemRevisao[] = [
  {
    "id": "ordenacao-selecao-1",
    "conceito": "ordenacao-selecao",
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
      "dica": "Procurar o menor do trecho restante e colocá-lo na próxima posição da lista."
    },
    "previsao": {
      "pergunta": "As alturas são [8,6,3]. Depois da primeira seleção e troca, qual ordem aparece?",
      "opcoes": [
        "[3,6,8]",
        "[6,8,3]",
        "[8,3,6]"
      ],
      "correta": 0,
      "explicacao": "O 3, menor, troca com o primeiro, 8."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "ordenacao-selecao-2",
    "conceito": "ordenacao-selecao",
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
      "dica": "Procurar o menor do trecho restante e colocá-lo na próxima posição da lista."
    },
    "previsao": {
      "pergunta": "Ao selecionar em [1,5,2], qual trecho falta ordenar depois de fixar o 1?",
      "opcoes": [
        "Só [1]",
        "Toda a lista",
        "[5,2]"
      ],
      "correta": 2,
      "explicacao": "A próxima busca pelo menor olha apenas as posições restantes."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "ordenacao-bolha-1",
    "conceito": "ordenacao-bolha",
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
      "dica": "Comparar vizinhos e trocar os fora de ordem, levando o maior ao fim em cada passada."
    },
    "previsao": {
      "pergunta": "Uma passada da bolha em [5,1,3] leva qual número ao fim?",
      "opcoes": [
        "1",
        "5",
        "3"
      ],
      "correta": 1,
      "explicacao": "O 5 troca com 1 e depois com 3."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "ordenacao-bolha-2",
    "conceito": "ordenacao-bolha",
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
      "dica": "Comparar vizinhos e trocar os fora de ordem, levando o maior ao fim em cada passada."
    },
    "previsao": {
      "pergunta": "As idades [6,6,2] têm repetidos. Comparar vizinhos com > causa troca entre os dois 6?",
      "opcoes": [
        "Não",
        "Sim",
        "Depende do computador"
      ],
      "correta": 0,
      "explicacao": "Valores iguais já podem ficar juntos; > é falso."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "sort-numerico-1",
    "conceito": "sort-numerico",
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
      "dica": "O sort padrão compara como texto; o comparador (a, b) => a - b coloca números em ordem crescente."
    },
    "previsao": {
      "pergunta": "No Console, [2,11,4].sort() resulta em quê?",
      "opcoes": [
        "[2,4,11]",
        "[4,11,2]",
        "[11,2,4]"
      ],
      "correta": 2,
      "explicacao": "O texto \"11\" vem antes de \"2\"."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "sort-numerico-2",
    "conceito": "sort-numerico",
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
      "dica": "O sort padrão compara como texto; o comparador (a, b) => a - b coloca números em ordem crescente."
    },
    "previsao": {
      "pergunta": "Qual comparador ordena prazos numéricos em ordem crescente?",
      "opcoes": [
        "(a,b) => a-b",
        "(a,b) => b-a",
        "Nenhum"
      ],
      "correta": 0,
      "explicacao": "Negativo coloca a antes de b quando a é menor."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  }
];
