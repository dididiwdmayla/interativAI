/* Duas situações novas por conceito; cenas e composição não são aceitas em ItemRevisao. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_ESTRUTURAS_U3: readonly ItemRevisao[] = [
  {
    "id": "dicionario-map-1",
    "conceito": "dicionario-map",
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
      "dica": "Map guarda pares: set escreve ou atualiza, get lê, has confere se a chave existe."
    },
    "previsao": {
      "pergunta": "Uma agenda faz set(\"Lia\",7) e set(\"Lia\",9). Quanto get(\"Lia\") devolve?",
      "opcoes": [
        "7",
        "[7,9]",
        "9"
      ],
      "correta": 2,
      "explicacao": "set na mesma chave atualiza o valor."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "dicionario-map-2",
    "conceito": "dicionario-map",
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
      "dica": "Map guarda pares: set escreve ou atualiza, get lê, has confere se a chave existe."
    },
    "previsao": {
      "pergunta": "Um placar guarda set(\"Nina\",0). Qual consulta prova que Nina está cadastrada?",
      "opcoes": [
        "has(\"Nina\")",
        "get(\"Nina\") > 0",
        "get(\"outra\")"
      ],
      "correta": 0,
      "explicacao": "has distingue valor zero de chave ausente."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "objeto-ou-map-1",
    "conceito": "objeto-ou-map",
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
      "dica": "Objeto descreve campos de uma coisa; Map serve para pares dinâmicos com chaves que também podem ser números ou objetos."
    },
    "previsao": {
      "pergunta": "Uma ficha tem nome, preço e estoque fixos. Qual estrutura descreve essa coisa?",
      "opcoes": [
        "Lista de números",
        "Objeto",
        "Uma fila"
      ],
      "correta": 1,
      "explicacao": "Campos conhecidos descrevem uma ficha com objeto."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "objeto-ou-map-2",
    "conceito": "objeto-ou-map",
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
      "dica": "Objeto descreve campos de uma coisa; Map serve para pares dinâmicos com chaves que também podem ser números ou objetos."
    },
    "previsao": {
      "pergunta": "Map guarda set(1,\"A\") e set(\"1\",\"B\"). O que get(1) devolve?",
      "opcoes": [
        "B",
        "undefined",
        "A"
      ],
      "correta": 2,
      "explicacao": "O número 1 e o texto \"1\" são chaves distintas em Map."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "busca-com-map-1",
    "conceito": "busca-com-map",
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
      "dica": "Montar um Map custa percorrer os dados uma vez; muitas consultas has evitam repetir includes numa lista grande."
    },
    "previsao": {
      "pergunta": "Uma loja faz mil includes numa lista de mil códigos. Qual trabalho se repete?",
      "opcoes": [
        "Examinar os códigos até achar ou acabar",
        "Criar só uma chave",
        "Ordenar sempre"
      ],
      "correta": 0,
      "explicacao": "includes procura na lista em cada consulta."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "busca-com-map-2",
    "conceito": "busca-com-map",
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
      "dica": "Montar um Map custa percorrer os dados uma vez; muitas consultas has evitam repetir includes numa lista grande."
    },
    "previsao": {
      "pergunta": "Um mapa foi montado uma vez. Cada has volta a percorrer todas as chaves no modelo do jogo?",
      "opcoes": [
        "Sim",
        "Não",
        "Só se estiver vazio"
      ],
      "correta": 1,
      "explicacao": "A consulta é barata; a montagem inicial também entra na comparação."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  }
];
