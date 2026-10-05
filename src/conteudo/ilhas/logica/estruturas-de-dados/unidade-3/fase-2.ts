/* Estrutura no palco, bordas reais e treino da mesma habilidade em contexto distinto. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_ESTRUTURAS_U3_F2: Fase = {
  "id": "logica-estruturas-de-dados-u3-f2",
  "tipo": "pratica",
  "unidadeId": "logica-estruturas-de-dados-u3",
  "titulo": "Procurar mil vezes",
  "conceitos": [
    "busca-com-map"
  ],
  "revisa": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "dicionario-map",
    "custo-em-passos",
    "crescimento-dos-passos"
  ],
  "prerequisitos": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "dicionario-map",
    "custo-em-passos",
    "crescimento-dos-passos"
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
  "programa": {
    "snippet": {
      "nome": "estrutura.js",
      "codigoInicial": ""
    },
    "desempenho": {
      "funcoes": [
        {
          "nome": "naLista",
          "args": [
            "$lista",
            "$lista"
          ]
        },
        {
          "nome": "noMapa",
          "args": [
            "$lista",
            "$lista"
          ]
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
      "texto": "includes procura item a item; uma lista grande custa trabalho escondido. Map.has consulta a chave sem fazer essa busca linear no modelo.",
      "expressao": "apontando"
    },
    {
      "texto": "Monte o Map uma vez, antes do laço de pedidos. O gráfico também conta essa montagem. Uma única consulta pequena pode dispensar um Map.",
      "expressao": "apontando"
    },
    {
      "texto": "Revise Algoritmos: responder certo não basta para medir trabalho. Compare as funções nos mesmos dados crescentes.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "busca-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie naLista e noMapa para contar pedidos presentes no estoque. Execute as chamadas e meça o gráfico.",
        "toque": "Crie naLista e noMapa para contar pedidos presentes no estoque. Execute as chamadas e meça o gráfico."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "noMapa",
            "casos": [
              {
                "args": [
                  [],
                  [
                    1
                  ]
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    7
                  ],
                  [
                    7
                  ]
                ],
                "esperado": 1
              },
              {
                "args": [
                  [
                    4,
                    8,
                    12
                  ],
                  [
                    8,
                    99,
                    4
                  ]
                ],
                "esperado": 2
              },
              {
                "args": [
                  [
                    0
                  ],
                  [
                    0,
                    0
                  ]
                ],
                "esperado": 2
              },
              {
                "args": [
                  [
                    1
                  ],
                  []
                ],
                "esperado": 0
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "achados",
            "valor": 2
          },
          {
            "tipo": "evento",
            "evento": "mediuDesempenho"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "Monte mapa com set; depois conte cada pedido cujo mapa.has(pedido) é true.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Monte mapa com set; depois conte cada pedido cujo mapa.has(pedido) é true."
        },
        "solucao": {
          "fala": "Compare a regra e o resultado no palco.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function naLista(lista, pedidos) {\n  let achados = 0;\n  for (const pedido of pedidos) {\n    if (lista.includes(pedido)) achados++;\n  }\n  return achados;\n}\nfunction noMapa(lista, pedidos) {\n  const mapa = new Map();\n  for (const item of lista) mapa.set(item, true);\n  let achados = 0;\n  for (const pedido of pedidos) {\n    const existe = mapa.has(pedido);\n    if (existe) achados++;\n  }\n  return achados;\n}\nconst achados = noMapa([4,8,12], [8,99,4]);\nconsole.log(naLista([4,8,12], [8,99,4]), achados);"
            },
            {
              "tipo": "executarSnippet"
            },
            {
              "tipo": "medirDesempenho"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "includes soma muitas leituras escondidas; montar o Map custa uma volta.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function naLista(lista, pedidos) {\n  let achados = 0;\n  for (const pedido of pedidos) {\n    if (lista.includes(pedido)) achados++;\n  }\n  return achados;\n}\nfunction noMapa(lista, pedidos) {\n  const mapa = new Map();\n  for (const item of lista) mapa.set(item, true);\n  let achados = 0;\n  for (const pedido of pedidos) {\n    const existe = mapa.has(pedido);\n    if (existe) achados++;\n  }\n  return achados;\n}\nconst achados = noMapa([4,8,12], [8,99,4]);\nconsole.log(naLista([4,8,12], [8,99,4]), achados);"
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "medirDesempenho"
        }
      ]
    },
    {
      "id": "busca-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Consulte [12,12,99] no estoque [4,8,12]. Guarde achados e mantenha noMapa dentro de 20.000 passos.",
        "toque": "Consulte [12,12,99] no estoque [4,8,12]. Guarde achados e mantenha noMapa dentro de 20.000 passos."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "noMapa",
            "casos": [
              {
                "args": [
                  [],
                  [
                    1
                  ]
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    7
                  ],
                  [
                    7
                  ]
                ],
                "esperado": 1
              },
              {
                "args": [
                  [
                    4,
                    8,
                    12
                  ],
                  [
                    8,
                    99,
                    4
                  ]
                ],
                "esperado": 2
              },
              {
                "args": [
                  [
                    0
                  ],
                  [
                    0,
                    0
                  ]
                ],
                "esperado": 2
              },
              {
                "args": [
                  [
                    1
                  ],
                  []
                ],
                "esperado": 0
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "achados",
            "valor": 2
          },
          {
            "tipo": "valorVariavel",
            "nome": "pedidos",
            "valor": [
              12,
              12,
              99
            ]
          },
          {
            "tipo": "passosNoMaximo",
            "funcao": "noMapa",
            "tamanho": 1000,
            "valor": 20000
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "Cada pedido conta, inclusive repetido. O Map deve ser montado fora do laço de consultas."
      },
      "falaAoConcluir": {
        "texto": "has é barato; includes repete a busca para cada pedido.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function naLista(lista, pedidos) {\n  let achados = 0;\n  for (const pedido of pedidos) {\n    if (lista.includes(pedido)) achados++;\n  }\n  return achados;\n}\nfunction noMapa(lista, pedidos) {\n  const mapa = new Map();\n  for (const item of lista) mapa.set(item, true);\n  let achados = 0;\n  for (const pedido of pedidos) {\n    const existe = mapa.has(pedido);\n    if (existe) achados++;\n  }\n  return achados;\n}\nconst pedidos = [12,12,99];\nconst achados = noMapa([4,8,12], pedidos);\nconsole.log(naLista([4,8,12], [8,99,4]), achados);"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Mil consultas em mil códigos: qual faz mais trabalho total, incluindo a montagem?",
        "opcoes": [
          "naLista com includes",
          "noMapa com has",
          "Empatam"
        ],
        "correta": 0,
        "explicacao": "includes percorre códigos em cada busca; o Map foi montado só uma vez."
      }
    }
  ],
  "conclusao": [
    {
      "texto": "Rebobine para ver por onde cada item passou e qual regra decidiu a ordem.",
      "expressao": "comemorando"
    }
  ],
  "falaFinal": {
    "texto": "Troque os dados e teste também a estrutura vazia.",
    "expressao": "curioso"
  },
  "missaoDeCampo": "No Console de qualquer site: let p=[]; p.push(\"A\",\"B\"); p.pop(); let f=[]; f.push(\"A\",\"B\"); f.shift(); Compare quem saiu e o que ficou."
};
