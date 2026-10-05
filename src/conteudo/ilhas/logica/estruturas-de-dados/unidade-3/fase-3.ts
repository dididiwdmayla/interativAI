/* Estrutura no palco, bordas reais e treino da mesma habilidade em contexto distinto. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_ESTRUTURAS_U3_F3: Fase = {
  "id": "logica-estruturas-de-dados-u3-f3",
  "tipo": "desafio",
  "unidadeId": "logica-estruturas-de-dados-u3",
  "titulo": "Bilhetes na entrada do cinema",
  "conceitos": [],
  "revisa": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "dicionario-map",
    "objeto-ou-map",
    "busca-com-map"
  ],
  "prerequisitos": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "dicionario-map",
    "objeto-ou-map",
    "busca-com-map"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo",
    "contador-passos",
    "grafico-passos"
  ],
  "siteAlvo": {
    "url": "console",
    "titulo": "Palco da memória",
    "head": "",
    "body": ""
  },
  "areas": [
    "snippet",
    "palco"
  ],
  "programa": {
    "snippet": {
      "nome": "desafio.js",
      "codigoInicial": ""
    },
    "desempenho": {
      "funcoes": [
        {
          "nome": "conferir"
        }
      ],
      "tamanhos": [
        10,
        100,
        1000
      ],
      "lista": "crescente"
    }
  },
  "introducao": [
    {
      "texto": "Crie conferir(lista): conte bilhetes repetidos após a primeira ocorrência. Uma lista vazia devolve 0.",
      "expressao": "curioso"
    }
  ],
  "partes": [
    {
      "id": "codigo",
      "descricao": "Crie conferir(lista): conte bilhetes repetidos após a primeira ocorrência. Uma lista vazia devolve 0.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "conferir",
            "casos": [
              {
                "args": [
                  []
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    9
                  ]
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    3,
                    1,
                    3,
                    3
                  ]
                ],
                "esperado": 2
              },
              {
                "args": [
                  [
                    0,
                    0
                  ]
                ],
                "esperado": 1
              },
              {
                "args": [
                  [
                    1,
                    "1"
                  ]
                ],
                "esperado": 0
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "repetidos",
            "valor": 2
          },
          {
            "tipo": "passosNoMaximo",
            "funcao": "conferir",
            "tamanho": 1000,
            "valor": 20000
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:set"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:has"
          }
        ]
      },
      "revisarEm": "logica-estruturas-de-dados-u3-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function conferir(lista) {\n  const vistos = new Map();\n  let repetidos = 0;\n  for (const codigo of lista) {\n    const existe = vistos.has(codigo);\n    if (existe) repetidos++;\n    else vistos.set(codigo, true);\n  }\n  return repetidos;\n}\nconst repetidos = conferir([3,1,3,3]);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "A regra funcionou com vazio, um item e caminhos diferentes. Sua estrutura atende o novo pedido.",
      "expressao": "comemorando"
    }
  ],
  "falaFinal": {
    "texto": "No Console real, compare push/pop e push/shift com os mesmos itens.",
    "expressao": "feliz"
  },
  "missaoDeCampo": "No Console de qualquer site, use uma lista como pilha com push/pop e outra como fila com push/shift. Veja quem sai primeiro."
};
