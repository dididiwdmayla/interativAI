/* Ação em contexto novo e previsão autossuficiente: duas revisões por conceito. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_LISTAS_U2: ItemRevisao[] = [

  {
    "id": "percorrer-lista-js-1",
    "conceito": "percorrer-lista-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Some as distâncias [2, 6, 3] em total com for...of.",
      "toque": "Some as distâncias [2, 6, 3] em total com for...of."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "valorVariavel",
          "nome": "total",
          "valor": 11
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "for-of"
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "O laço entrega uma posição ou o valor de cada vagão?",
      "dica": "for...of entrega os valores da lista; for com índice lê lista[i] até antes de length."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const distancias = [2, 6, 3]; let total = 0; for (let distancia of distancias) { total += distancia }"
      }
    ]
  },
  {
    "id": "percorrer-lista-js-2",
    "conceito": "percorrer-lista-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o que for...of entrega ao percorrer a lista.",
      "toque": "Preveja o que for...of entrega ao percorrer a lista."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a variável do laço recebe?",
      "dica": "for...of entrega os valores da lista; for com índice lê lista[i] até antes de length."
    },
    "previsao": {
      "pergunta": "for (let n of [7, 9]) { console.log(n) }; quais valores aparecem?",
      "opcoes": [
        "0 e 1",
        "7 e 9",
        "2"
      ],
      "correta": 1,
      "explicacao": "for...of entrega os valores 7 e 9, não os índices 0 e 1."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  }
,
  {
    "id": "map-lista-js-1",
    "conceito": "map-lista-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie const medidas = [0, 2, 5]; const dobradas = medidas.map(n => n * 2).",
      "toque": "Crie const medidas = [0, 2, 5]; const dobradas = medidas.map(n => n * 2)."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "valorVariavel",
          "nome": "medidas",
          "valor": [
            0,
            2,
            5
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "dobradas",
          "valor": [
            0,
            4,
            10
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "metodo:map"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "arrow"
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "map chama a função para cada item e devolve uma lista nova; a original permanece."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const medidas = [0, 2, 5]; const dobradas = medidas.map(n => n * 2)"
      }
    ]
  },
  {
    "id": "map-lista-js-2",
    "conceito": "map-lista-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o resultado do código descrito.",
      "toque": "Preveja o resultado do código descrito."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O código cria, altera ou consulta qual dado?",
      "dica": "map chama a função para cada item e devolve uma lista nova; a original permanece."
    },
    "previsao": {
      "pergunta": "const a = [2, 3]; const b = a.map(n => n + 1); como fica a?",
      "opcoes": [
        "[3, 4]",
        "[2, 3]",
        "[]"
      ],
      "correta": 1,
      "explicacao": "map devolve outra lista em b, sem mudar a."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "filter-lista-js-1",
    "conceito": "filter-lista-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie const tempos = [3, 9, 12]; const curtos = tempos.filter(n => n < 10).",
      "toque": "Crie const tempos = [3, 9, 12]; const curtos = tempos.filter(n => n < 10)."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "valorVariavel",
          "nome": "curtos",
          "valor": [
            3,
            9
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "tempos",
          "valor": [
            3,
            9,
            12
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "metodo:filter"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "arrow"
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "filter devolve uma lista com todos os itens cuja condição deu true, ou [] quando nenhum serve."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const tempos = [3, 9, 12]; const curtos = tempos.filter(n => n < 10)"
      }
    ]
  },
  {
    "id": "filter-lista-js-2",
    "conceito": "filter-lista-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o resultado do código descrito.",
      "toque": "Preveja o resultado do código descrito."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O código cria, altera ou consulta qual dado?",
      "dica": "filter devolve uma lista com todos os itens cuja condição deu true, ou [] quando nenhum serve."
    },
    "previsao": {
      "pergunta": "const n = [1, 2]; n.filter(x => x > 8) devolve o quê?",
      "opcoes": [
        "undefined",
        "0",
        "[]"
      ],
      "correta": 2,
      "explicacao": "filter sempre devolve uma lista."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "find-lista-js-1",
    "conceito": "find-lista-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie const niveis = [4, 8, 10]; const achado = niveis.find(n => n >= 8).",
      "toque": "Crie const niveis = [4, 8, 10]; const achado = niveis.find(n => n >= 8)."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "valorVariavel",
          "nome": "achado",
          "valor": 8
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "metodo:find"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "arrow"
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "find devolve só o primeiro item que serve, ou undefined quando não encontra."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const niveis = [4, 8, 10]; const achado = niveis.find(n => n >= 8)"
      }
    ]
  },
  {
    "id": "find-lista-js-2",
    "conceito": "find-lista-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o resultado do código descrito.",
      "toque": "Preveja o resultado do código descrito."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O código cria, altera ou consulta qual dado?",
      "dica": "find devolve só o primeiro item que serve, ou undefined quando não encontra."
    },
    "previsao": {
      "pergunta": "const n = [3, 5, 7]; n.find(x => x > 4) devolve o quê?",
      "opcoes": [
        "5",
        "[5, 7]",
        "7"
      ],
      "correta": 0,
      "explicacao": "Só o primeiro item aprovado é devolvido."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  }
];
