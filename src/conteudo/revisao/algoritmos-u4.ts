/* Duas previsões por conceito em situações próprias; não exigem ferramentas além do Console. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_ALGORITMOS_U4: readonly ItemRevisao[] = [
  {
    "id": "custo-em-passos-1",
    "conceito": "custo-em-passos",
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
      "dica": "Contar as linhas executadas ajuda a comparar o trabalho dos algoritmos sem depender da velocidade da máquina."
    },
    "previsao": {
      "pergunta": "O notebook roda uma tarefa em 1 ms e o celular em 8 ms. O algoritmo é melhor no notebook?",
      "opcoes": [
        "Sim",
        "Não: a máquina mudou, o jeito pode ser igual",
        "Só com pouca bateria"
      ],
      "correta": 1,
      "explicacao": "Comparar passos da mesma tarefa separa o trabalho do algoritmo da velocidade da máquina."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "custo-em-passos-2",
    "conceito": "custo-em-passos",
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
      "dica": "Contar as linhas executadas ajuda a comparar o trabalho dos algoritmos sem depender da velocidade da máquina."
    },
    "previsao": {
      "pergunta": "Uma função tem dez linhas de texto e uma linha está num laço de mil voltas. O contador marca só dez?",
      "opcoes": [
        "Sim",
        "Só no celular",
        "Não: conta cada execução da linha"
      ],
      "correta": 2,
      "explicacao": "Comprimento do código não é quantidade de trabalho."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "crescimento-dos-passos-1",
    "conceito": "crescimento-dos-passos",
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
      "dica": "Medir a mesma tarefa com listas maiores mostra se o trabalho cresce junto com a entrada ou dispara."
    },
    "previsao": {
      "pergunta": "Um catálogo passou de 10 para 100 itens; os passos foram de 30 para 300. Qual tendência aparece?",
      "opcoes": [
        "Cresce junto com a lista",
        "Não cresce",
        "Cresce muito mais que a lista"
      ],
      "correta": 0,
      "explicacao": "Ambos cresceram dez vezes nesse intervalo."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "crescimento-dos-passos-2",
    "conceito": "crescimento-dos-passos",
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
      "dica": "Medir a mesma tarefa com listas maiores mostra se o trabalho cresce junto com a entrada ou dispara."
    },
    "previsao": {
      "pergunta": "Duas soluções acertam. De 10 para 100 itens, uma sobe 10 vezes e outra 100 vezes. Qual pede atenção ao crescer?",
      "opcoes": [
        "A primeira",
        "Ambas têm a mesma curva",
        "A segunda"
      ],
      "correta": 2,
      "explicacao": "Ela acrescenta muito mais trabalho conforme a lista aumenta."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "evitar-trabalho-repetido-1",
    "conceito": "evitar-trabalho-repetido",
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
      "dica": "Usar a ordem da lista pode evitar comparar cada par; o resultado precisa continuar correto nas bordas."
    },
    "previsao": {
      "pergunta": "Os números [2,4,2] não estão ordenados. Só comparar vizinhos encontra o repetido?",
      "opcoes": [
        "Sim",
        "Não",
        "Só em computador rápido"
      ],
      "correta": 1,
      "explicacao": "Os dois 2 estão separados; faltou a garantia de ordem."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "evitar-trabalho-repetido-2",
    "conceito": "evitar-trabalho-repetido",
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
      "dica": "Usar a ordem da lista pode evitar comparar cada par; o resultado precisa continuar correto nas bordas."
    },
    "previsao": {
      "pergunta": "Em [1,2,2,5], qual comparação já pode encerrar a procura por repetidos?",
      "opcoes": [
        "2 com 2",
        "1 com 5",
        "Nenhuma"
      ],
      "correta": 0,
      "explicacao": "Encontrar vizinhos iguais já prova a duplicação."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  }
];
