/* Revisão de tabela-verdade: ação e previsão em situações novas; sem site, Console e palco. */
import type { ItemRevisao } from "../tipos";
export const ITENS_TABELA_VERDADE: ItemRevisao[] = [
  {
    "id": "tabela-verdade-1",
    "conceito": "tabela-verdade",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Responda e confira: tabela verdade com duas chaves.",
      "toque": "Responda e confira: tabela verdade com duas chaves."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "Num circuito com 2 chaves, quantas linhas tem a tabela verdade?",
      "opcoes": [
        "2",
        "4",
        "6"
      ],
      "correta": 1,
      "explicacao": "Cada chave tem 2 estados: 2 vezes 2 dá 4 combinações."
    },
    "ajudas": {
      "pergunta": "Quantas combinações duas chaves ligadas ou desligadas formam?",
      "dica": "Cada chave dobra o número de linhas da tabela."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "tabela-verdade-2",
    "conceito": "tabela-verdade",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Responda e confira: a tabela de um circuito E.",
      "toque": "Responda e confira: a tabela de um circuito E."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "Na tabela de um portão E com 2 chaves, em quantas linhas a saída acende?",
      "opcoes": [
        "Em 1",
        "Em 2",
        "Em 3"
      ],
      "correta": 0,
      "explicacao": "O E só acende quando as duas chaves estão ligadas: uma linha das quatro."
    },
    "ajudas": {
      "pergunta": "Quando o E acende?",
      "dica": "Só no caso das duas chaves ligadas."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  }
];
