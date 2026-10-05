/* Duas situações novas por conceito; cenas e composição não são aceitas em ItemRevisao. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_ESTRUTURAS_U4: readonly ItemRevisao[] = [
  {
    "id": "arvore-de-dados-1",
    "conceito": "arvore-de-dados",
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
      "dica": "Uma árvore tem uma raiz e nós com filhos; folhas não têm filhos, como os elementos aninhados do DOM."
    },
    "previsao": {
      "pergunta": "Uma pasta raiz contém fotos e textos. fotos contém viagem. Quem é o pai de viagem?",
      "opcoes": [
        "raiz",
        "fotos",
        "textos"
      ],
      "correta": 1,
      "explicacao": "O pai é o nó diretamente acima: fotos."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "arvore-de-dados-2",
    "conceito": "arvore-de-dados",
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
      "dica": "Uma árvore tem uma raiz e nós com filhos; folhas não têm filhos, como os elementos aninhados do DOM."
    },
    "previsao": {
      "pergunta": "No DOM, body contém section, que contém h1. Qual nó é folha nesse trecho?",
      "opcoes": [
        "h1",
        "body",
        "section"
      ],
      "correta": 0,
      "explicacao": "h1 não tem outros filhos-elemento no trecho."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "percorrer-arvore-1",
    "conceito": "percorrer-arvore",
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
      "dica": "Visitar um nó e chamar a mesma função para cada filho permite percorrer ramos de profundidades diferentes."
    },
    "previsao": {
      "pergunta": "Um menu tem categoria, subcategoria e item. Uma função visita apenas os filhos da raiz. O que falta?",
      "opcoes": [
        "Ordenar a raiz",
        "Usar pop",
        "Visitar também os filhos dos filhos"
      ],
      "correta": 2,
      "explicacao": "A recursão continua em cada ramo até a folha."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "percorrer-arvore-2",
    "conceito": "percorrer-arvore",
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
      "dica": "Visitar um nó e chamar a mesma função para cada filho permite percorrer ramos de profundidades diferentes."
    },
    "previsao": {
      "pergunta": "Uma árvore vazia é null; uma folha tem filhos:[]. Onde uma visita recursiva para?",
      "opcoes": [
        "Só no nó mais alto",
        "Em null ou quando não há filhos para chamar",
        "Nunca"
      ],
      "correta": 1,
      "explicacao": "A função trata null e o laço vazio não cria novas chamadas."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  }
];
