/* Duas situações por conceito do chamado 2. A revisão não aceita cenas; as previsões transferem o método a outros programas. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_DEPURACAO_U6: readonly ItemRevisao[] = [
  {
    "id": "teste-de-regressao-1",
    "conceito": "teste-de-regressao",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia a situação e preveja antes de mexer no código.",
      "toque": "Leia a situação e preveja antes de mexer no código."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a evidência mostra antes de qualquer edição?",
      "dica": "Rodar os casos antigos junto com o novo prova que o conserto não quebrou o que funcionava."
    },
    "previsao": {
      "pergunta": "Você consertou o desconto de 3 itens. Antes de entregar, o que rodar de novo?",
      "opcoes": [
        "Só o caso de 3 itens",
        "Os casos antigos junto com o novo",
        "Nada: o conserto era pequeno"
      ],
      "correta": 1,
      "explicacao": "Rodar os casos antigos junto com o novo prova que o conserto não quebrou o que funcionava."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "teste-de-regressao-2",
    "conceito": "teste-de-regressao",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia a situação e preveja antes de mexer no código.",
      "toque": "Leia a situação e preveja antes de mexer no código."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a evidência mostra antes de qualquer edição?",
      "dica": "Um caso antigo que passa a falhar é regressão: o conserto novo quebrou o comportamento antigo."
    },
    "previsao": {
      "pergunta": "Depois de um conserto, um caso antigo ficou vermelho. O que isso indica?",
      "opcoes": [
        "Que o caso antigo estava errado",
        "Que o computador falhou",
        "Que o conserto quebrou algo que funcionava"
      ],
      "correta": 2,
      "explicacao": "Um caso antigo que passa a falhar é regressão: o conserto novo quebrou o comportamento antigo."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  }
];
