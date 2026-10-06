/* Duas situações por conceito do chamado 1. A revisão não aceita cenas; as previsões transferem o método a outros programas. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_DEPURACAO_U5: readonly ItemRevisao[] = [
  {
    "id": "reproduzir-o-defeito-1",
    "conceito": "reproduzir-o-defeito",
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
      "dica": "Mudar uma coisa de cada vez entre o caso que falha e o que funciona mostra o que provoca o defeito."
    },
    "previsao": {
      "pergunta": "Um app trava só às vezes. Nos dias ruins havia um item sem preço na lista. Qual é o próximo passo?",
      "opcoes": [
        "Reescrever o app inteiro",
        "Rodar uma lista com item sem preço e outra com todos os preços e comparar",
        "Esperar o app travar de novo"
      ],
      "correta": 1,
      "explicacao": "Mudar uma coisa de cada vez entre o caso que falha e o que funciona mostra o que provoca o defeito."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "reproduzir-o-defeito-2",
    "conceito": "reproduzir-o-defeito",
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
      "dica": "Comparar as entradas que falham com as que funcionam é o primeiro passo para reproduzir."
    },
    "previsao": {
      "pergunta": "O cliente diz: \"o troco sai errado às vezes\". Qual pergunta ajuda a reproduzir o defeito?",
      "opcoes": [
        "Que valores deram troco errado e quais deram certo?",
        "Quem programou isso?",
        "O computador é novo?"
      ],
      "correta": 0,
      "explicacao": "Comparar as entradas que falham com as que funcionam é o primeiro passo para reproduzir."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "causa-raiz-1",
    "conceito": "causa-raiz",
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
      "dica": "O total zerado é o sintoma. A causa raiz é a decisão no código: ler preco em vez de valor."
    },
    "previsao": {
      "pergunta": "O total aparece como R$ 0,00. A conta soma preco, mas o campo se chama valor. Qual é a causa raiz?",
      "opcoes": [
        "O total aparece zerado",
        "A conta lê o nome errado do campo",
        "A tela está pequena"
      ],
      "correta": 1,
      "explicacao": "O total zerado é o sintoma. A causa raiz é a decisão no código: ler preco em vez de valor."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "causa-raiz-2",
    "conceito": "causa-raiz",
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
      "dica": "Consertar o sintoma esconde o defeito: outros casos continuam errados porque a causa raiz ficou."
    },
    "previsao": {
      "pergunta": "Devolver o número certo só para o caso que falhou faz o teste passar. Isso conserta a causa?",
      "opcoes": [
        "Sim, porque o teste passou",
        "Sim, se ninguém perceber",
        "Não: o sintoma sumiu, mas a regra do código continua errada"
      ],
      "correta": 2,
      "explicacao": "Consertar o sintoma esconde o defeito: outros casos continuam errados porque a causa raiz ficou."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  }
];
