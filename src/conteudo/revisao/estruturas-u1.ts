/* Duas situações novas por conceito; cenas e composição não são aceitas em ItemRevisao. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_ESTRUTURAS_U1: readonly ItemRevisao[] = [
  {
    "id": "pilha-js-1",
    "conceito": "pilha-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o resultado neste novo contexto.",
      "toque": "Preveja o resultado neste novo contexto."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "Qual regra decide a resposta?",
      "dica": "Numa pilha, o último item que entrou é o primeiro a sair; push e pop usam o mesmo lado."
    },
    "previsao": {
      "pergunta": "Um editor guarda [\"a\",\"ab\",\"abc\"]. Qual texto pop retira no desfazer?",
      "opcoes": [
        "a",
        "abc",
        "ab"
      ],
      "correta": 1,
      "explicacao": "Sai abc, o último que entrou."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "pilha-js-2",
    "conceito": "pilha-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o resultado neste novo contexto.",
      "toque": "Preveja o resultado neste novo contexto."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "Qual regra decide a resposta?",
      "dica": "Numa pilha, o último item que entrou é o primeiro a sair; push e pop usam o mesmo lado."
    },
    "previsao": {
      "pergunta": "Uma mochila recebe mapa, água e lanterna com push. Após dois pop, o que fica?",
      "opcoes": [
        "Só mapa",
        "Só lanterna",
        "Água e lanterna"
      ],
      "correta": 0,
      "explicacao": "Lanterna e água saem antes do mapa."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "pilha-vazia-1",
    "conceito": "pilha-vazia",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o resultado neste novo contexto.",
      "toque": "Preveja o resultado neste novo contexto."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "Qual regra decide a resposta?",
      "dica": "Antes de retirar de uma pilha, confira length; pop no vazio devolve undefined."
    },
    "previsao": {
      "pergunta": "const abas=[]; const fechada=abas.pop(); O que vale fechada?",
      "opcoes": [
        "null",
        "0",
        "undefined"
      ],
      "correta": 2,
      "explicacao": "Não existe último item para retirar."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "pilha-vazia-2",
    "conceito": "pilha-vazia",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o resultado neste novo contexto.",
      "toque": "Preveja o resultado neste novo contexto."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "Qual regra decide a resposta?",
      "dica": "Antes de retirar de uma pilha, confira length; pop no vazio devolve undefined."
    },
    "previsao": {
      "pergunta": "Uma função deve devolver null sem histórico. Qual caso precisa de teste?",
      "opcoes": [
        "Só três ações",
        "A lista vazia",
        "Só letras"
      ],
      "correta": 1,
      "explicacao": "Vazio precisa do retorno combinado, não do undefined acidental."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  }
];
