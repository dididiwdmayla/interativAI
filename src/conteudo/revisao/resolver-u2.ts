/* Duas previsões por conceito: ItemRevisao não aceita quadro nem áreas compostas. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_RESOLVER_U2: ItemRevisao[] = [
  {
    "id": "pseudocodigo-1",
    "conceito": "pseudocodigo",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Pense na situação e escolha a resposta.",
      "toque": "Pense na situação e escolha a resposta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "“Olha os livros e conta os atrasados” precisa de chaves?",
      "opcoes": [
        "Não: precisa explicar a ideia",
        "Sim: senão nem é plano",
        "Só com três livros"
      ],
      "correta": 0,
      "explicacao": "Pseudocódigo é para pensar, não executar."
    },
    "ajudas": {
      "pergunta": "Qual regra precisa ser verificada?",
      "dica": "Planejar em palavras claras, sem precisar da sintaxe de uma linguagem."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "pseudocodigo-2",
    "conceito": "pseudocodigo",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Pense na situação e escolha a resposta.",
      "toque": "Pense na situação e escolha a resposta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "O plano de uma receita diz “mistura”; qual linha deve virar código?",
      "opcoes": [
        "Qualquer linha pronta",
        "A operação que faz a mistura dos dados",
        "Um comentário sozinho"
      ],
      "correta": 1,
      "explicacao": "Traduza a ideia para uma operação; comentário não executa o passo."
    },
    "ajudas": {
      "pergunta": "Qual regra precisa ser verificada?",
      "dica": "Planejar em palavras claras, sem precisar da sintaxe de uma linguagem."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  }
];
